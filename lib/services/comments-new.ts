"use client";

import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  Timestamp,
  getDocs
} from "firebase/firestore";
import { db } from "@/firebase/config";

// Simplified comment interface
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Timestamp;
  trackId: string;
}

export interface CommentPayload {
  userId: string;
  userName: string;
  content: string;
  trackId: string;
}

/**
 * Send a new comment - simplified version
 */
export const sendComment = async (payload: CommentPayload): Promise<void> => {
  console.log("🚀 Sending comment with payload:", payload);

  if (!payload.trackId || !payload.content.trim()) {
    throw new Error("Track ID and content are required");
  }

  try {
    const commentsRef = collection(db, "comments");
    
    const commentData = {
      userId: payload.userId,
      userName: payload.userName,
      content: payload.content.trim(),
      trackId: payload.trackId,
      status: "pending" as const,
      timestamp: serverTimestamp(),
    };

    console.log("📝 Comment data to save:", commentData);
    
    const docRef = await addDoc(commentsRef, commentData);
    console.log("✅ Comment sent successfully with ID:", docRef.id);
    
  } catch (error) {
    console.error("❌ Failed to send comment:", error);
    throw new Error("Failed to send comment. Please try again.");
  }
};

/**
 * Get approved comments for a track
 */
export const getTrackComments = async (trackId: string): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("trackId", "==", trackId),
      where("status", "==", "approved")
    );
    
    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });

    // Sort by timestamp (newest first)
    return comments.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
      const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
      return timeB - timeA;
    });
    
  } catch (error) {
    console.error("❌ Failed to get comments:", error);
    return [];
  }
};

/**
 * Get pending comments for moderation
 */
export const getPendingComments = async (trackId: string): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("trackId", "==", trackId),
      where("status", "==", "pending")
    );
    
    const querySnapshot = await getDocs(q);
    const comments: Comment[] = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });

    // Sort by timestamp (newest first)
    return comments.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
      const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
      return timeB - timeA;
    });
    
  } catch (error) {
    console.error("❌ Failed to get pending comments:", error);
    return [];
  }
};

/**
 * Approve a comment
 */
export const approveComment = async (commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      status: "approved",
      moderatedAt: serverTimestamp(),
    });
    console.log("✅ Comment approved:", commentId);
  } catch (error) {
    console.error("❌ Failed to approve comment:", error);
    throw new Error("Failed to approve comment");
  }
};

/**
 * Reject a comment
 */
export const rejectComment = async (commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      status: "rejected",
      moderatedAt: serverTimestamp(),
    });
    console.log("✅ Comment rejected:", commentId);
  } catch (error) {
    console.error("❌ Failed to reject comment:", error);
    throw new Error("Failed to reject comment");
  }
};

/**
 * Real-time listener for approved comments
 */
export const useTrackCommentsListener = (
  trackId: string,
  callback: (comments: Comment[]) => void
) => {
  const commentsRef = collection(db, "comments");
  const q = query(
    commentsRef,
    where("trackId", "==", trackId),
    where("status", "==", "approved")
  );

  return onSnapshot(q, (snapshot) => {
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });

    // Sort by timestamp (newest first)
    const sortedComments = comments.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
      const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
      return timeB - timeA;
    });

    callback(sortedComments);
  }, (error) => {
    console.error("❌ Error listening to comments:", error);
    callback([]);
  });
};

/**
 * Real-time listener for pending comments
 */
export const usePendingCommentsListener = (
  trackId: string,
  callback: (comments: Comment[]) => void
) => {
  const commentsRef = collection(db, "comments");
  const q = query(
    commentsRef,
    where("trackId", "==", trackId),
    where("status", "==", "pending")
  );

  return onSnapshot(q, (snapshot) => {
    const comments: Comment[] = [];
    
    snapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
      } as Comment);
    });

    // Sort by timestamp (newest first)
    const sortedComments = comments.sort((a, b) => {
      const timeA = a.timestamp?.toDate?.()?.getTime() || 0;
      const timeB = b.timestamp?.toDate?.()?.getTime() || 0;
      return timeB - timeA;
    });

    callback(sortedComments);
  }, (error) => {
    console.error("❌ Error listening to pending comments:", error);
    callback([]);
  });
};
