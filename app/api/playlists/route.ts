import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/admin';
import { verifyAuthToken } from '@/app/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const isPublic = searchParams.get('public') === 'true';

    let query = adminFirestore.collection('playlists');

    if (userId) {
      query = query.where('ownerId', '==', userId);
    }

    if (isPublic) {
      query = query.where('isPublic', '==', true);
    }

    const snapshot = await query.orderBy('updatedAt', 'desc').get();

    const playlists = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: playlists
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuthToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const uid = authResult.user?.uid;
    const playlistData = await request.json();

    // Validate required fields
    if (!playlistData.name) {
      return NextResponse.json(
        { error: 'Playlist name is required' },
        { status: 400 }
      );
    }

    // Create playlist document
    const newPlaylist = {
      name: playlistData.name,
      description: playlistData.description || '',
      ownerId: uid,
      songs: [],
      isPublic: playlistData.isPublic || false,
      coverImage: playlistData.coverImage || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await adminFirestore.collection('playlists').add(newPlaylist);

    return NextResponse.json({
      success: true,
      message: 'Playlist created successfully',
      playlistId: docRef.id
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
