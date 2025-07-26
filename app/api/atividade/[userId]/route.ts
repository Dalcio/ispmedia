import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebase-admin";
import {
  TipoAcao,
  RespostaAtividades,
  Atividade,
} from "../../../../lib/types/atividade";

/**
 * GET /api/atividade/[userId]
 * Lista todas as atividades de um usuário específico
 *
 * Query parameters opcionais:
 * - limit: número máximo de resultados (padrão: 50)
 * - acao: filtrar por tipo de ação específica
 * - startAfter: ID do documento para paginação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);

    // Parâmetros de query opcionais
    const limit = parseInt(searchParams.get("limit") || "50");
    const acaoFiltro = searchParams.get("acao");
    const startAfter = searchParams.get("startAfter");

    // Validação do userId
    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    // Validação do limit
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit deve estar entre 1 e 100" },
        { status: 400 }
      );
    }

    // Construir query do Firestore
    let query = adminDb
      .collection("atividades")
      .doc(userId)
      .collection("historico")
      .orderBy("timestamp", "desc")
      .limit(limit); // Aplicar filtro por ação se especificado
    if (acaoFiltro) {
      const acoesValidas: TipoAcao[] = [
        "ouviu",
        "pausou",
        "pulou",
        "curtiu",
        "descurtiu",
        "adicionou_playlist",
      ];
      if (!acoesValidas.includes(acaoFiltro as TipoAcao)) {
        return NextResponse.json(
          {
            error: "Ação de filtro inválida",
            acoesValidas: acoesValidas,
          },
          { status: 400 }
        );
      }
      query = query.where("acao", "==", acaoFiltro);
    }

    // Aplicar paginação se especificado
    if (startAfter) {
      try {
        const startAfterDoc = await adminDb
          .collection("atividades")
          .doc(userId)
          .collection("historico")
          .doc(startAfter)
          .get();

        if (startAfterDoc.exists) {
          query = query.startAfter(startAfterDoc);
        }
      } catch (error) {
        console.error("Erro ao aplicar paginação:", error);
        return NextResponse.json(
          { error: "ID de paginação inválido" },
          { status: 400 }
        );
      }
    }

    // Executar query
    const snapshot = await query.get(); // Processar resultados
    const atividades: Atividade[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        midiaId: data.midiaId,
        acao: data.acao,
        timestamp: data.timestamp.toDate().toISOString(),
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });

    // Preparar metadados da resposta
    const responseData: RespostaAtividades = {
      atividades,
      total: atividades.length,
      hasMore: atividades.length === limit,
      lastDocumentId:
        atividades.length > 0 ? atividades[atividades.length - 1].id : null,
      filtros: {
        limit,
        acao: acaoFiltro as TipoAcao | undefined,
        startAfter: startAfter || undefined,
      },
    };

    console.log(
      `📊 Listadas ${atividades.length} atividades para usuário ${userId}`
    );

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao listar atividades:", error);

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
