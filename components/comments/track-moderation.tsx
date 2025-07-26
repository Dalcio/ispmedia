"use client";

import { useTrackPendingComments, useCommentModeration } from "@/hooks/use-track-comments";
import { Check, X, Clock, User, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/lib/services/comments";

interface TrackModerationProps {
  trackId: string;
  className?: string;
}

export function TrackModeration({ trackId, className = "" }: TrackModerationProps) {
  const { pendingComments, loading } = useTrackPendingComments(trackId);
  const { moderateComment, moderating } = useCommentModeration(trackId);

  const formatTimestamp = (timestamp: any) => {
    try {
      let date: Date;

      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else {
        return "Agora";
      }

      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: ptBR,
      });
    } catch (error) {
      return "Agora";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleApprove = (commentId: string) => {
    moderateComment(commentId, "approve");
  };

  const handleReject = (commentId: string) => {
    moderateComment(commentId, "reject");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 text-text-primary">
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          Comentários Pendentes ({pendingComments.length})
        </span>
      </div>

      {/* Lista de comentários pendentes */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
          </div>
        ) : pendingComments.length === 0 ? (
          <div className="text-center p-8 text-text-muted">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum comentário pendente!</p>
            <p className="text-xs mt-1">
              Novos comentários aparecerão aqui para moderação.
            </p>
          </div>
        ) : (
          pendingComments.map((comment) => (
            <PendingCommentItem
              key={comment.id}
              comment={comment}
              formatTimestamp={formatTimestamp}
              getInitials={getInitials}
              onApprove={() => handleApprove(comment.id)}
              onReject={() => handleReject(comment.id)}
              isProcessing={moderating === comment.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface PendingCommentItemProps {
  comment: Comment;
  formatTimestamp: (timestamp: any) => string;
  getInitials: (name: string) => string;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

function PendingCommentItem({
  comment,
  formatTimestamp,
  getInitials,
  onApprove,
  onReject,
  isProcessing,
}: PendingCommentItemProps) {
  return (
    <div className="p-4 rounded-xl bg-yellow-50/50 border border-yellow-200/50 hover:bg-yellow-50 transition-all duration-200 backdrop-blur-sm">
      {/* Header com informações do usuário */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.userAvatar ? (
            <img
              src={comment.userAvatar}
              alt={comment.userDisplayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-dark-900 text-sm font-medium shadow-primary">
              {getInitials(comment.userDisplayName)}
            </div>
          )}
        </div>

        {/* Info do usuário */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              {comment.userDisplayName}
            </span>
            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
              Pendente
            </span>
          </div>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimestamp(comment.timestamp)}
          </span>
        </div>
      </div>

      {/* Conteúdo do comentário */}
      <div className="mb-4 p-3 rounded-lg bg-white/50 border border-yellow-200/30">
        <p className="text-sm text-text-paragraph leading-relaxed break-words">
          {comment.content}
        </p>
      </div>

      {/* Botões de ação */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onApprove}
          disabled={isProcessing}
          size="sm"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Aprovar
        </Button>

        <Button
          onClick={onReject}
          disabled={isProcessing}
          size="sm"
          variant="outline"
          className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <X className="w-4 h-4" />
          )}
          Rejeitar
        </Button>

        <div className="ml-auto text-xs text-text-muted">
          ID: {comment.id.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
}
