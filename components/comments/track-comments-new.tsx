"use client";

import { useState } from "react";
import { useTrackComments, useCommentSubmission } from "@/hooks/use-track-comments-new";
import { useAuth } from "@/contexts/auth-context";
import { Send, MessageCircle, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/lib/services/comments-new";

interface TrackCommentsProps {
  trackId: string;
  className?: string;
}

export function TrackComments({ trackId, className = "" }: TrackCommentsProps) {
  const { comments, loading } = useTrackComments(trackId);
  const { submitComment, submitting } = useCommentSubmission(trackId);
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    const success = await submitComment(newComment);
    if (success) {
      setNewComment("");
    }
  };

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
        return "Now";
      }

      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Now";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!trackId) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-text-500">No track selected</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[100px] bg-dark-700/50 border-glass-200 text-text-100 placeholder:text-text-500 resize-none pr-24"
              maxLength={500}
              disabled={submitting}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <span className="text-xs text-text-500">
                {newComment.length}/500
              </span>
              <Button
                type="submit"
                size="sm"
                disabled={!newComment.trim() || submitting}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {!user && (
        <div className="glass-panel rounded-lg p-4 text-center">
          <p className="text-text-600">You need to be logged in to comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-text-300">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-medium">
            Comments ({loading ? "..." : comments.length})
          </h3>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-text-500 mt-2">Loading comments...</p>
          </div>
        )}

        {!loading && comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-text-600 mx-auto mb-3" />
            <p className="text-text-600">No comments yet</p>
            <p className="text-text-700 text-sm">Be the first to comment!</p>
          </div>
        )}

        {!loading && comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="glass-panel rounded-lg p-4 transition-all duration-200 hover:bg-glass-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {getInitials(comment.userName)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-text-200 truncate">
                        {comment.userName}
                      </span>
                      <div className="flex items-center gap-1 text-text-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(comment.timestamp)}</span>
                      </div>
                    </div>
                    
                    <p className="text-text-300 text-sm leading-relaxed break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
