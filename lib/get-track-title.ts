import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

/**
 * Busca o título da música pelo ID
 */
export async function getTrackTitleById(
  trackId: string
): Promise<string | null> {
  try {
    const trackRef = doc(db, "tracks", trackId);
    const trackSnap = await getDoc(trackRef);
    if (trackSnap.exists()) {
      const data = trackSnap.data();
      return data.title || null;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar título da música:", error);
    return null;
  }
}
