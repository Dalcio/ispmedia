import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { NovaAtividade, TipoAcao } from "../../../lib/types/atividade";

/**
 * POST /api/atividade
 * Registra uma nova atividade do usuário
 *
 * Body esperado:
 * {
 *   "userId": "string",
 *   "midiaId": "string",
 *   "acao": "ouviu" | "pausou" | "pulou" | "curtiu" | "descurtiu",
 *   "timestamp": "ISO string"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body: NovaAtividade = await request.json();
    const { userId, midiaId, acao, timestamp } = body;

    // Validação dos dados obrigatórios
    if (!userId) {
      return NextResponse.json(
        { error: "Campo obrigatório: userId" },
        { status: 400 }
      );
    }

    if (!midiaId) {
      return NextResponse.json(
        { error: "Campo obrigatório: midiaId" },
        { status: 400 }
      );
    }

    if (!acao) {
      return NextResponse.json(
        { error: "Campo obrigatório: acao" },
        { status: 400 }
      );
    }

    if (!timestamp) {
      return NextResponse.json(
        { error: "Campo obrigatório: timestamp" },
        { status: 400 }
      );
    } // Validação do formato da ação
    const acoesValidas: TipoAcao[] = [
      "ouviu",
      "pausou",
      "pulou",
      "curtiu",
      "descurtiu",
      "adicionou_playlist",
    ];
    if (!acoesValidas.includes(acao as TipoAcao)) {
      return NextResponse.json(
        {
          error: "Ação inválida",
          acoesValidas: acoesValidas,
        },
        { status: 400 }
      );
    }

    // Converte o timestamp ISO para Firestore Timestamp
    let timestampFirestore;
    try {
      timestampFirestore = Timestamp.fromDate(new Date(timestamp));
    } catch (error) {
      return NextResponse.json(
        { error: "Timestamp inválido. Use formato ISO 8601" },
        { status: 400 }
      );
    }

    // Preparar dados da atividade
    const atividadeDoc = {
      userId,
      midiaId,
      acao,
      timestamp: timestampFirestore,
      createdAt: Timestamp.now(),
    };

    // Salvar no Firestore na coleção 'atividades'
    // Organizando por userId como subcoleção para melhor performance
    const docRef = await adminDb
      .collection("atividades")
      .doc(userId)
      .collection("historico")
      .add(atividadeDoc);

    console.log(
      `✅ Atividade registrada para usuário ${userId}: ${acao} - ${midiaId}`
    );

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: "Atividade registrada com sucesso",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erro ao registrar atividade:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
