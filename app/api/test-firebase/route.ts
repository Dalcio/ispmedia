import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore, adminAuth } from '@/firebase/admin';

export async function GET() {
  try {
    // Test Firestore connection
    const testDoc = await adminFirestore.collection('connection-test').add({
      message: 'Server-side test',
      timestamp: new Date(),
      source: 'api-route'
    });

    // Clean up - delete the test document
    await adminFirestore.collection('connection-test').doc(testDoc.id).delete();

    // Test Auth service
    const listUsers = await adminAuth.listUsers(1);

    return NextResponse.json({
      success: true,
      message: 'Firebase Admin SDK is working correctly',
      services: {
        firestore: 'Connected',
        auth: 'Connected',
        userCount: listUsers.users.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Firebase Admin test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Firebase Admin SDK test failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'test-write') {
      // Test write operation
      const docRef = await adminFirestore.collection('api-tests').add({
        message: 'Test from API route',
        timestamp: new Date(),
        userAgent: request.headers.get('user-agent') || 'unknown'
      });

      return NextResponse.json({
        success: true,
        message: 'Write test successful',
        documentId: docRef.id
      });
    }

    if (action === 'test-read') {
      // Test read operation
      const snapshot = await adminFirestore.collection('api-tests').limit(5).get();
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      }));

      return NextResponse.json({
        success: true,
        message: 'Read test successful',
        documents: docs,
        count: docs.length
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Unknown action'
    }, { status: 400 });

  } catch (error: any) {
    console.error('Firebase Admin POST test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Firebase Admin SDK POST test failed',
      error: error.message
    }, { status: 500 });
  }
}
