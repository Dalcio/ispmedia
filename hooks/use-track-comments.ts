import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { 
  Comment, 
  CommentPayload, 
  sendComment, 
  approveComment, 
  rejectComment,
  useTrackComments as useTrackCommentsService,
  useTrackPendingComments as useTrackPendingCommentsService
} from "@/lib/services/comments";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook para comentários aprovados de uma faixa
 */
export function useTrackComments(trackId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = useTrackCommentsService(trackId, (newComments) => {
      setComments(newComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [trackId]);

  return { comments, loading };
}

/**
 * Hook para comentários pendentes (moderação)
 */
export function useTrackPendingComments(trackId: string) {
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackId) {
      setPendingComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = useTrackPendingCommentsService(trackId, (newComments) => {
      setPendingComments(newComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [trackId]);

  return { pendingComments, loading };
}

/**
 * Hook para envio de comentários
 */
export function useCommentSubmission(trackId: string) {
  const [submitting, setSubmitting] = useState(false);
  const { user, userProfile } = useAuth();
  const toast = useToast();
  const submitComment = async (content: string): Promise<boolean> => {
    if (!user || !userProfile) {
      console.error("❌ Usuário não autenticado:", { user: !!user, userProfile: !!userProfile });
      toast.error("Você precisa estar logado para comentar");
      return false;
    }

    if (!content.trim()) {
      toast.error("O comentário não pode estar vazio");
      return false;
    }

    setSubmitting(true);

    try {
      console.log("🔍 Enviando comentário:", {
        trackId,
        userId: user.uid,
        userDisplayName: userProfile?.name || user.displayName || "Usuário",
        contentLength: content.trim().length
      });

      const commentPayload: CommentPayload = {
        userId: user.uid,
        userDisplayName: userProfile?.name || user.displayName || "Usuário",
        userAvatar: user.photoURL || "",
        content: content.trim(),
      };

      await sendComment(trackId, commentPayload);
      
      toast.success("Comentário enviado! Será publicado após aprovação do autor.");
      return true;
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      toast.error("Falha ao enviar comentário. Tente novamente.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitComment, submitting };
}

/**
 * Hook para moderação de comentários
 */
export function useCommentModeration(trackId: string) {
  const [moderating, setModerating] = useState<string | null>(null);
  const toast = useToast();

  const moderateComment = async (
    commentId: string, 
    action: "approve" | "reject"
  ): Promise<boolean> => {
    setModerating(commentId);

    try {
      if (action === "approve") {
        await approveComment(trackId, commentId);
        toast.success("Comentário aprovado!");
      } else {
        await rejectComment(trackId, commentId);
        toast.success("Comentário rejeitado!");
      }
      
      return true;
    } catch (error) {
      console.error(`Erro ao ${action === "approve" ? "aprovar" : "rejeitar"} comentário:`, error);
      toast.error(`Falha ao ${action === "approve" ? "aprovar" : "rejeitar"} comentário.`);
      return false;
    } finally {
      setModerating(null);
    }
  };

  return { moderateComment, moderating };
}
