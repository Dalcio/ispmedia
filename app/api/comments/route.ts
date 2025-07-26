import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  trackId: string;
  content: string;
  timestamp: any;
}

export interface CommentInput {
  userId: string;
  userName: string;
  userEmail: string;
  trackId: string;
  content: string;
}

// POST /api/comments - Criar novo comentário
export async function POST(request: NextRequest) {
  try {
    const body: CommentInput = await request.json();
    const { userId, userName, userEmail, trackId, content } = body;

    console.log('📝 Tentativa de criar comentário:', {
      userId,
      userName,
      trackId,
      contentLength: content?.length
    });

    // Validação dos campos obrigatórios
    if (!userId || !trackId || !content || !userName) {
      console.log('❌ Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'userId, trackId, userName e content são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação do conteúdo
    if (content.trim().length === 0) {
      console.log('❌ Conteúdo vazio');
      return NextResponse.json(
        { error: 'O conteúdo do comentário não pode estar vazio' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      console.log('❌ Conteúdo muito longo');
      return NextResponse.json(
        { error: 'O comentário não pode ter mais de 500 caracteres' },
        { status: 400 }
      );
    }    // Criar o comentário no Firestore usando Admin SDK
    const commentsRef = adminDb.collection('tracks').doc(trackId).collection('comments');
    const commentData = {
      userId,
      userName,
      userEmail,
      trackId,
      content: content.trim(),
      timestamp: FieldValue.serverTimestamp()
    };

    console.log('🔥 Tentando criar no Firestore:', {
      path: `tracks/${trackId}/comments`,
      data: { ...commentData, timestamp: '[ServerTimestamp]' }
    });

    const docRef = await commentsRef.add(commentData);

    console.log('✅ Comentário criado com sucesso:', docRef.id);

    // Retornar o comentário criado
    const newComment: Comment = {
      id: docRef.id,
      ...commentData,
      timestamp: new Date()
    };

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error('💥 Erro ao criar comentário:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('📋 Detalhes do erro:', {
        message: error.message,
        name: error.name,
        code: (error as any).code,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET /api/comments?trackId=xxx - Buscar comentários de uma música
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('trackId');

    if (!trackId) {
      return NextResponse.json(
        { error: 'trackId é obrigatório' },
        { status: 400 }
      );
    }    // Buscar comentários ordenados por timestamp (mais recentes primeiro) usando Admin SDK
    const commentsRef = adminDb.collection('tracks').doc(trackId).collection('comments');
    const querySnapshot = await commentsRef.orderBy('timestamp', 'desc').get();

    const comments: Comment[] = [];
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      } as Comment);
    });

    return NextResponse.json(comments);

  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
