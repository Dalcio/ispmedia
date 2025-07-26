import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

// Utility to create test public tracks
export async function createTestPublicTracks() {
  const testTracks = [
    {
      title: "Public Test Song 1",
      genre: "Rock",
      createdBy: "test-user-1",
      audioUrl: "https://example.com/test1.mp3",
      fileName: "test1.mp3",
      fileSize: 1024000,
      mimeType: "audio/mpeg",
      isPublic: true,
      createdAt: serverTimestamp(),
    },
    {
      title: "Public Test Song 2",
      genre: "Pop",
      createdBy: "test-user-2",
      audioUrl: "https://example.com/test2.mp3",
      fileName: "test2.mp3",
      fileSize: 2048000,
      mimeType: "audio/mpeg",
      isPublic: true,
      createdAt: serverTimestamp(),
    },
    {
      title: "Private Test Song",
      genre: "Jazz",
      createdBy: "test-user-3",
      audioUrl: "https://example.com/test3.mp3",
      fileName: "test3.mp3",
      fileSize: 1500000,
      mimeType: "audio/mpeg",
      isPublic: false,
      createdAt: serverTimestamp(),
    },
  ];

  try {
    const tracksRef = collection(db, "tracks");
    
    for (const track of testTracks) {
      await addDoc(tracksRef, track);
      console.log(`✅ Created test track: ${track.title} (Public: ${track.isPublic})`);
    }
    
    console.log("🎵 All test tracks created successfully!");
  } catch (error) {
    console.error("❌ Error creating test tracks:", error);
  }
}

// Test function to verify unauthenticated access
export async function testUnauthenticatedAccess() {
  try {
    const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
    
    console.log("🔍 Testing unauthenticated access to public tracks...");
    
    const tracksRef = collection(db, "tracks");
    const publicTracksQuery = query(
      tracksRef,
      where("isPublic", "==", true),
      limit(10)
    );
    
    const snapshot = await getDocs(publicTracksQuery);
    
    console.log(`✅ Successfully retrieved ${snapshot.size} public tracks without authentication`);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${data.title} (${data.genre}) - Public: ${data.isPublic}`);
    });
    
    return snapshot.size;
  } catch (error) {
    console.error("❌ Error testing unauthenticated access:", error);
    throw error;
  }
}
