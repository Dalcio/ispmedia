import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, getDocs, limit, query } from "firebase/firestore";

export async function GET() {
  try {
    console.log("[TEST] Testing Firebase connection...");

    // Try to fetch a few tracks to test connection
    const tracksQuery = query(collection(db, "tracks"), limit(1));
    const snapshot = await getDocs(tracksQuery);

    console.log("[TEST] Firebase connection successful");
    console.log("[TEST] Found tracks:", snapshot.size);

    const tracks = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    return NextResponse.json({
      success: true,
      message: "Firebase connection working",
      tracksFound: snapshot.size,
      sampleTrack: tracks[0] || null,
    });
  } catch (error) {
    console.error("[TEST] Firebase connection failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 }
    );
  }
}
