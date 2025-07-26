import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { 
  Comment, 
  CommentPayload, 
  sendComment, 
  getTrackComments, 
  getPendingComments,
  approveComment, 
  rejectComment,
  useTrackCommentsListener,
  usePendingCommentsListener
} from "@/lib/services/comments-new";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for approved comments with real-time updates
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
    
    // First, get initial comments
    getTrackComments(trackId).then((initialComments) => {
      setComments(initialComments);
      setLoading(false);
    });

    // Then set up real-time listener
    const unsubscribe = useTrackCommentsListener(trackId, (newComments) => {
      setComments(newComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [trackId]);

  return { comments, loading };
}

/**
 * Hook for pending comments (moderation)
 */
export function usePendingComments(trackId: string) {
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackId) {
      setPendingComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // First, get initial pending comments
    getPendingComments(trackId).then((initialComments) => {
      setPendingComments(initialComments);
      setLoading(false);
    });

    // Then set up real-time listener
    const unsubscribe = usePendingCommentsListener(trackId, (newComments) => {
      setPendingComments(newComments);
      setLoading(false);
    });

    return unsubscribe;
  }, [trackId]);

  return { pendingComments, loading };
}

/**
 * Hook for submitting comments
 */
export function useCommentSubmission(trackId: string) {
  const [submitting, setSubmitting] = useState(false);
  const { user, userProfile } = useAuth();
  const toast = useToast();

  const submitComment = async (content: string): Promise<boolean> => {
    if (!user) {
      console.error("❌ User not authenticated");
      toast.error("You need to be logged in to comment");
      return false;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return false;
    }

    setSubmitting(true);

    try {
      console.log("🔍 Submitting comment:", {
        trackId,
        userId: user.uid,
        userName: userProfile?.name || user.displayName || "User",
        contentLength: content.trim().length
      });

      const payload: CommentPayload = {
        userId: user.uid,
        userName: userProfile?.name || user.displayName || "User",
        content: content.trim(),
        trackId: trackId,
      };

      await sendComment(payload);
      
      toast.success("Comment sent! It will be published after approval.");
      return true;
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to send comment. Please try again.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitComment, submitting };
}

/**
 * Hook for comment moderation
 */
export function useCommentModeration() {
  const [moderating, setModerating] = useState<string | null>(null);
  const toast = useToast();

  const moderateComment = async (
    commentId: string, 
    action: "approve" | "reject"
  ): Promise<boolean> => {
    setModerating(commentId);

    try {
      if (action === "approve") {
        await approveComment(commentId);
        toast.success("Comment approved!");
      } else {
        await rejectComment(commentId);
        toast.success("Comment rejected!");
      }
      
      return true;
    } catch (error) {
      console.error(`Error ${action}ing comment:`, error);
      toast.error(`Failed to ${action} comment.`);
      return false;
    } finally {
      setModerating(null);
    }
  };

  return { moderateComment, moderating };
}
