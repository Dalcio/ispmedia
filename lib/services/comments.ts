"use client";

import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Unsubscribe 
} from "firebase/firestore";
import { db } from "@/firebase/config";

export interface Comment {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatar: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  timestamp: any;
}

export interface CommentPayload {
  userId: string;
  userDisplayName: string;
  userAvatar: string;
  content: string;
}

/**
 * Envia um novo comentário para moderação
 */
export const sendComment = async (trackId: string, comment: CommentPayload): Promise<void> => {
  if (!trackId || !comment.content.trim()) {
    throw new Error("TrackId e conteúdo são obrigatórios");
  }

  try {
    const commentsRef = collection(db, `tracks/${trackId}/comments`);
    
    const commentData = {
      ...comment,
      content: comment.content.trim(),
      status: "pending",
      timestamp: serverTimestamp(),
    };

    console.log("🔍 Dados do comentário a serem enviados:", {
      trackId,
      userId: comment.userId,
      userDisplayName: comment.userDisplayName,
      userAvatar: comment.userAvatar,
      content: comment.content,
      status: "pending",
      collectionPath: `tracks/${trackId}/comments`
    });
    
    await addDoc(commentsRef, commentData);

    console.log(`✅ Comentário enviado para moderação na track: ${trackId}`);  } catch (error) {
    console.error("❌ Erro ao enviar comentário:", error);
    console.error("❌ Detalhes do erro:", {
      name: (error as any)?.name,
      message: (error as any)?.message,
      code: (error as any)?.code,
      details: error
    });
    throw new Error("Falha ao enviar comentário. Tente novamente.");
  }
};

/**
 * Aprova um comentário (somente criador da faixa)
 */
export const approveComment = async (trackId: string, commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, `tracks/${trackId}/comments/${commentId}`);
    
    await updateDoc(commentRef, {
      status: "approved",
      moderatedAt: serverTimestamp(),
    });

    console.log(`✅ Comentário aprovado: ${commentId}`);
  } catch (error) {
    console.error("❌ Erro ao aprovar comentário:", error);
    throw new Error("Falha ao aprovar comentário.");
  }
};

/**
 * Rejeita um comentário (somente criador da faixa)
 */
export const rejectComment = async (trackId: string, commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, `tracks/${trackId}/comments/${commentId}`);
    
    await updateDoc(commentRef, {
      status: "rejected",
      moderatedAt: serverTimestamp(),
    });

    console.log(`✅ Comentário rejeitado: ${commentId}`);
  } catch (error) {
    console.error("❌ Erro ao rejeitar comentário:", error);
    throw new Error("Falha ao rejeitar comentário.");
  }
};

/**
 * Hook para escutar comentários aprovados em tempo real
 */
export const useTrackComments = (
  trackId: string,
  callback: (comments: Comment[]) => void
): Unsubscribe => {
  const commentsRef = collection(db, `tracks/${trackId}/comments`);
  // Remove orderBy to avoid composite index requirement
  const commentsQuery = query(
    commentsRef,
    where("status", "==", "approved")
  );

  return onSnapshot(commentsQuery, (snapshot) => {
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });

    // Sort manually in JavaScript instead of using Firestore orderBy
    const sortedComments = comments.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
      const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
      return timeB - timeA; // Descending order (newest first)
    });

    callback(sortedComments);
  }, (error) => {
    console.error("❌ Erro ao escutar comentários:", error);
    callback([]);
  });
};

/**
 * Hook para escutar comentários pendentes (somente para moderação)
 */
export const useTrackPendingComments = (
  trackId: string,
  callback: (comments: Comment[]) => void
): Unsubscribe => {
  const commentsRef = collection(db, `tracks/${trackId}/comments`);
  // Remove orderBy to avoid composite index requirement
  const pendingQuery = query(
    commentsRef,
    where("status", "==", "pending")
  );

  return onSnapshot(pendingQuery, (snapshot) => {
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });

    // Sort manually in JavaScript instead of using Firestore orderBy
    const sortedComments = comments.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
      const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
      return timeB - timeA; // Descending order (newest first)
    });

    callback(sortedComments);
  }, (error) => {
    console.error("❌ Erro ao escutar comentários pendentes:", error);
    callback([]);
  });
};
