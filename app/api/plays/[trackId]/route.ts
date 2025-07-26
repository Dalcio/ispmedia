import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

interface PlayCountResponse {
  trackId: string;
  playCount: number;
  success: boolean;
}

// POST /api/plays/[trackId] - Incrementar contador de plays
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;
    console.log(`[API] POST /api/plays/${trackId} - Starting increment`);

    if (!trackId) {
      console.error("[API] trackId is missing");
      return NextResponse.json(
        { error: "trackId é obrigatório" },
        { status: 400 }
      );
    } // Incrementar o contador de plays
    const trackRef = doc(db, "tracks", trackId);
    console.log(`[API] Updating document: tracks/${trackId}`);

    // Primeiro, verificar se o documento existe
    const trackDoc = await getDoc(trackRef);
    console.log(`[API] Document exists before update: ${trackDoc.exists()}`);

    if (!trackDoc.exists()) {
      console.error(`[API] Track document not found: ${trackId}`);
      return NextResponse.json(
        { error: "Música não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar o contador de plays
    await updateDoc(trackRef, {
      playCount: increment(1),
      lastPlayedAt: new Date(),
    });

    console.log(`[API] Document updated successfully`);

    // Buscar o novo valor do contador
    const updatedTrackDoc = await getDoc(trackRef);
    console.log(
      `[API] Document exists after update: ${updatedTrackDoc.exists()}`
    );

    const currentPlayCount = updatedTrackDoc.exists()
      ? updatedTrackDoc.data()?.playCount || 1
      : 1;
    console.log(`[API] Current play count: ${currentPlayCount}`);

    const response: PlayCountResponse = {
      trackId,
      playCount: currentPlayCount,
      success: true,
    };

    console.log(`[API] Returning response:`, response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] Erro ao incrementar play count:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("[API] Error name:", error.name);
      console.error("[API] Error message:", error.message);
      console.error("[API] Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

// GET /api/plays/[trackId] - Buscar contador de plays atual
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;
    console.log(`[API] GET /api/plays/${trackId} - Getting current count`);

    if (!trackId) {
      console.error("[API] trackId is missing");
      return NextResponse.json(
        { error: "trackId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar o documento da track
    const trackRef = doc(db, "tracks", trackId);
    const trackDoc = await getDoc(trackRef);

    console.log(`[API] Document exists: ${trackDoc.exists()}`);

    if (!trackDoc.exists()) {
      console.error(`[API] Track not found: ${trackId}`);
      return NextResponse.json(
        { error: "Música não encontrada" },
        { status: 404 }
      );
    }

    const trackData = trackDoc.data();
    const playCount = trackData.playCount || 0;
    console.log(`[API] Current play count: ${playCount}`);

    const response: PlayCountResponse = {
      trackId,
      playCount,
      success: true,
    };

    console.log(`[API] Returning response:`, response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("[API] Erro ao buscar play count:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("[API] Error name:", error.name);
      console.error("[API] Error message:", error.message);
      console.error("[API] Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
