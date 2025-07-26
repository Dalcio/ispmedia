import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import toast from 'react-hot-toast';

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
  content: string;
}

export function useComments(trackId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, userProfile } = useAuth();

  // Carregar comentários
  const loadComments = async () => {
    if (!trackId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/comments?trackId=${trackId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Erro ao carregar comentários');
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  };
  // Adicionar novo comentário
  const addComment = async (input: CommentInput) => {
    if (!user || !userProfile) {
      toast.error('Você precisa estar logado para comentar');
      return false;
    }

    if (!input.content.trim()) {
      toast.error('O comentário não pode estar vazio');
      return false;
    }

    if (input.content.length > 500) {
      toast.error('O comentário não pode ter mais de 500 caracteres');
      return false;
    }

    if (input.content.trim().length < 3) {
      toast.error('O comentário deve ter pelo menos 3 caracteres');
      return false;
    }

    setSubmitting(true);
    try {
      const commentData = {
        userId: user.uid,
        userName: userProfile.name || user.displayName || 'Usuário',
        userEmail: user.email || '',
        trackId,
        content: input.content.trim(),
      };

      console.log('Enviando comentário:', commentData);

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const newComment = await response.json();
        console.log('Comentário criado:', newComment);
        setComments(prev => [newComment, ...prev]);
        toast.success('Comentário adicionado com sucesso!');
        return true;
      } else {
        const error = await response.json();
        console.error('Erro na resposta:', error);
        toast.error(error.error || 'Erro ao adicionar comentário');
        return false;
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Carregar comentários quando o trackId mudar
  useEffect(() => {
    loadComments();
  }, [trackId]);

  return {
    comments,
    loading,
    submitting,
    addComment,
    refreshComments: loadComments,
  };
}
