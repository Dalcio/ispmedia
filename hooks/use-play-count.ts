import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export interface PlayCount {
  trackId: string;
  playCount: number;
  success: boolean;
}

export function usePlayCount() {
  const [loading, setLoading] = useState(false);
  // Incrementar contador de plays
  const incrementPlayCount = useCallback(
    async (trackId: string): Promise<PlayCount | null> => {
      if (!trackId) return null;

      try {
        setLoading(true);
        console.log(
          `[usePlayCount] Incrementing play count for track: ${trackId}`
        );

        const response = await fetch(`/api/plays/${trackId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`[usePlayCount] API response status: ${response.status}`);
        if (response.ok) {
          const data: PlayCount = await response.json();
          console.log(
            `✅ [usePlayCount] Play count incremented for track ${trackId}:`,
            data
          );
          return data;
        } else {
          const error = await response.json();
          console.warn(
            `⚠️ [usePlayCount] Failed to increment play count for track ${trackId}:`,
            error
          );
          console.warn(`⚠️ [usePlayCount] Response status: ${response.status}`);
          if (error.details) {
            console.warn(`⚠️ [usePlayCount] Error details: ${error.details}`);
          }
          return null;
        }
      } catch (error) {
        console.warn(
          `⚠️ [usePlayCount] Failed to increment play count for track ${trackId}:`,
          error
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  // Buscar contador de plays atual
  const getPlayCount = useCallback(async (trackId: string): Promise<number> => {
    if (!trackId) return 0;

    try {
      console.log(`[usePlayCount] Getting play count for track: ${trackId}`);
      const response = await fetch(`/api/plays/${trackId}`);

      console.log(`[usePlayCount] GET API response status: ${response.status}`);

      if (response.ok) {
        const data: PlayCount = await response.json();
        console.log(
          `[usePlayCount] Got play count for track ${trackId}:`,
          data.playCount
        );
        return data.playCount;
      } else {
        console.warn(`⚠️ Failed to get play count for track ${trackId}`);
        return 0;
      }
    } catch (error) {
      console.warn(`⚠️ Failed to get play count for track ${trackId}:`, error);
      return 0;
    }
  }, []);

  return {
    incrementPlayCount,
    getPlayCount,
    loading,
  };
}
