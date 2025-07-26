import { useState, useCallback, useEffect } from "react";
import { doc, onSnapshot, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

export interface PlayCount {
  trackId: string;
  playCount: number;
  success: boolean;
}

export function usePlayCount(trackId?: string) {
  const [playCount, setPlayCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Real-time listener for play count changes
  useEffect(() => {
    if (!trackId) return;

    setIsListening(true);
    console.log(`[usePlayCount] Setting up real-time listener for track: ${trackId}`);

    const trackRef = doc(db, "tracks", trackId);
    
    const unsubscribe = onSnapshot(
      trackRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const currentCount = data.playCount || 0;
          console.log(`[usePlayCount] Real-time update - track ${trackId} play count: ${currentCount}`);
          setPlayCount(currentCount);
          
          // Emit global event for cross-component synchronization
          window.dispatchEvent(
            new CustomEvent("playCountUpdated", {
              detail: {
                trackId,
                playCount: currentCount,
              },
            })
          );
        } else {
          console.log(`[usePlayCount] Track document ${trackId} does not exist`);
          setPlayCount(0);
        }
        setIsListening(false);
      },
      (error) => {
        console.error(`[usePlayCount] Error listening to track ${trackId}:`, error);
        setIsListening(false);
      }
    );

    return () => {
      console.log(`[usePlayCount] Cleaning up listener for track: ${trackId}`);
      unsubscribe();
    };
  }, [trackId]);

  // Increment play count directly in Firestore
  const incrementPlayCount = useCallback(
    async (targetTrackId?: string): Promise<PlayCount | null> => {
      const trackIdToUse = targetTrackId || trackId;
      if (!trackIdToUse) return null;

      try {
        setLoading(true);
        console.log(`[usePlayCount] Incrementing play count for track: ${trackIdToUse}`);

        const trackRef = doc(db, "tracks", trackIdToUse);

        // Optimistic update for UI responsiveness
        const currentCount = playCount;
        const optimisticCount = currentCount + 1;
        
        // Only update local state if this is for the current track
        if (trackIdToUse === trackId) {
          setPlayCount(optimisticCount);
        }

        // Emit optimistic update event
        window.dispatchEvent(
          new CustomEvent("playCountUpdated", {
            detail: {
              trackId: trackIdToUse,
              playCount: optimisticCount,
              optimistic: true,
            },
          })
        );

        // Atomic increment in Firestore
        await updateDoc(trackRef, {
          playCount: increment(1),
          lastPlayedAt: new Date(),
        });

        console.log(`✅ [usePlayCount] Play count incremented for track ${trackIdToUse}`);
        
        // Get the actual updated value
        const updatedDoc = await getDoc(trackRef);
        const actualCount = updatedDoc.exists() ? (updatedDoc.data().playCount || 0) : 1;

        return {
          trackId: trackIdToUse,
          playCount: actualCount,
          success: true,
        };
      } catch (error) {
        console.error(`[usePlayCount] Failed to increment play count for track ${trackIdToUse}:`, error);
        
        // Revert optimistic update on error
        if (trackIdToUse === trackId) {
          setPlayCount(playCount);
        }
        
        // Emit revert event
        window.dispatchEvent(
          new CustomEvent("playCountUpdated", {
            detail: {
              trackId: trackIdToUse,
              playCount: playCount,
              error: true,
            },
          })
        );

        return null;
      } finally {
        setLoading(false);
      }
    },
    [trackId, playCount]
  );

  // Get current play count from Firestore
  const getPlayCount = useCallback(async (targetTrackId?: string): Promise<number> => {
    const trackIdToUse = targetTrackId || trackId;
    if (!trackIdToUse) return 0;

    try {
      console.log(`[usePlayCount] Getting play count for track: ${trackIdToUse}`);
      const trackRef = doc(db, "tracks", trackIdToUse);
      const trackDoc = await getDoc(trackRef);

      if (trackDoc.exists()) {
        const count = trackDoc.data().playCount || 0;
        console.log(`[usePlayCount] Got play count for track ${trackIdToUse}: ${count}`);
        return count;
      } else {
        console.log(`[usePlayCount] Track ${trackIdToUse} not found, returning 0`);
        return 0;
      }
    } catch (error) {
      console.error(`[usePlayCount] Failed to get play count for track ${trackIdToUse}:`, error);
      return 0;
    }
  }, [trackId]);

  return {
    playCount,
    incrementPlayCount,
    getPlayCount,
    loading,
    isListening,
  };
}
