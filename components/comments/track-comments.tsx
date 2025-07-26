'use client';

import { useState } from 'react';
import { useComments, type Comment } from '@/hooks/use-comments';
import { useAuth } from '@/contexts/auth-context';
import { Send, MessageCircle, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TrackCommentsProps {
  trackId: string;
  className?: string;
}

export function TrackComments({ trackId, className = '' }: TrackCommentsProps) {
  const { comments, loading, submitting, addComment } = useComments(trackId);
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await addComment({ content: newComment });
    if (success) {
      setNewComment('');
      setFocused(false);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    try {
      let date: Date;
      
      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else {
        return 'Agora';
      }

      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
      return 'Agora';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const isCommentValid = newComment.trim().length > 0 && newComment.length <= 500;
  const characterCount = newComment.length;
  const maxLength = 500;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 text-text-primary">
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          Comentários ({comments.length})
        </span>
      </div>

      {/* Form para novo comentário */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Adicione um comentário..."
              className={`w-full p-3 rounded-xl bg-glass-100 border transition-all duration-200 resize-none ${
                focused 
                  ? 'border-primary-500/50 bg-glass-200' 
                  : 'border-border-light hover:border-border-medium'
              } text-text-primary placeholder-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary-500/30 backdrop-blur-sm`}
              rows={focused ? 3 : 2}
              maxLength={maxLength}
            />
            
            {/* Contador de caracteres */}
            <div className={`absolute bottom-2 right-2 text-xs transition-colors ${
              characterCount > maxLength * 0.8 
                ? characterCount >= maxLength 
                  ? 'text-error-500' 
                  : 'text-warning-500'
                : 'text-text-muted'
            }`}>
              {characterCount}/{maxLength}
            </div>
          </div>

          {/* Botão de envio e validação */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-text-muted">
              {newComment.trim().length === 0 && focused && (
                <span className="text-error-500">O comentário não pode estar vazio</span>
              )}
              {newComment.length > maxLength && (
                <span className="text-error-500">Comentário muito longo</span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!isCommentValid || submitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isCommentValid && !submitting
                  ? 'bg-primary-500 hover:bg-primary-600 text-dark-900 shadow-primary'
                  : 'bg-glass-200 text-text-disabled cursor-not-allowed border border-border-subtle'
              }`}
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de comentários */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center p-8 text-text-muted">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              formatTimestamp={formatTimestamp}
              getInitials={getInitials}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  formatTimestamp: (timestamp: any) => string;
  getInitials: (name: string) => string;
}

function CommentItem({ comment, formatTimestamp, getInitials }: CommentItemProps) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-glass-100 border border-border-subtle hover:bg-glass-200 transition-all duration-200 backdrop-blur-sm">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-dark-900 text-xs font-medium shadow-primary">
          {getInitials(comment.userName)}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text-primary">
            {comment.userName}
          </span>
          <span className="text-xs text-text-muted">
            {formatTimestamp(comment.timestamp)}
          </span>
        </div>
        
        <p className="text-sm text-text-paragraph leading-relaxed break-words">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
