"use client";

import { usePendingComments, useCommentModeration } from "@/hooks/use-track-comments-new";
import { Check, X, User, Clock, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface TrackModerationProps {
  trackId: string;
  className?: string;
}

export function TrackModeration({ trackId, className = "" }: TrackModerationProps) {
  const { pendingComments, loading } = usePendingComments(trackId);
  const { moderateComment, moderating } = useCommentModeration();

  const formatTimestamp = (timestamp: any) => {
    try {
      let date: Date;

      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        return "Now";
      }

      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
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

  const handleModerate = async (commentId: string, action: "approve" | "reject") => {
    await moderateComment(commentId, action);
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
      <div className="flex items-center gap-2 text-text-300">
        <MessageSquare className="w-5 h-5" />
        <h3 className="font-medium">
          Pending Comments ({loading ? "..." : pendingComments.length})
        </h3>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-500 mt-2">Loading pending comments...</p>
        </div>
      )}

      {!loading && pendingComments.length === 0 && (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-text-600 mx-auto mb-3" />
          <p className="text-text-600">No pending comments</p>
          <p className="text-text-700 text-sm">All comments have been reviewed</p>
        </div>
      )}

      {!loading && pendingComments.length > 0 && (
        <div className="space-y-4">
          {pendingComments.map((comment) => (
            <div
              key={comment.id}
              className="glass-panel rounded-lg p-4 border-l-4 border-yellow-500"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {getInitials(comment.userName)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-text-200">
                      {comment.userName}
                    </span>
                    <div className="flex items-center gap-1 text-text-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(comment.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-text-300 text-sm leading-relaxed mb-4 break-words">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleModerate(comment.id, "approve")}
                      disabled={moderating === comment.id}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {moderating === comment.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                      <Button
                      onClick={() => handleModerate(comment.id, "reject")}
                      disabled={moderating === comment.id}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {moderating === comment.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
