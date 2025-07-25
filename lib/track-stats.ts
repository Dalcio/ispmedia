import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase/config";

/**
 * Incrementa o contador de reprodução de uma track
 */
export async function incrementPlayCount(trackId: string): Promise<void> {
  try {
    const trackRef = doc(db, "tracks", trackId);
    await updateDoc(trackRef, {
      playCount: increment(1),
    });
    console.log(`✅ Play count incremented for track: ${trackId}`);
  } catch (error) {
    console.warn(
      `⚠️ Failed to increment play count for track ${trackId}:`,
      error
    );
    // Não falhar se não conseguir incrementar o contador
  }
}

/**
 * Obtém as estatísticas de reprodução de uma track
 */
export async function getTrackStats(
  trackId: string
): Promise<{ playCount: number } | null> {
  try {
    const { getDoc, doc } = await import("firebase/firestore");
    const trackRef = doc(db, "tracks", trackId);
    const trackDoc = await getDoc(trackRef);

    if (trackDoc.exists()) {
      const data = trackDoc.data();
      return {
        playCount: data.playCount || 0,
      };
    }

    return null;
  } catch (error) {
    console.warn(`⚠️ Failed to get track stats for ${trackId}:`, error);
    return null;
  }
}
