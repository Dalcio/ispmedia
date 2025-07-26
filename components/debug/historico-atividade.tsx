"use client";

import { useState, useEffect } from "react";
import { useAtividade } from "../../hooks/use-atividade";
import { Atividade } from "../../lib/types/atividade";

interface HistoricoAtividadeProps {
  userId: string;
}

/**
 * Componente de exemplo que mostra o histórico de atividades do usuário
 * Demonstra como usar o hook useAtividade e a API de atividades
 */
export function HistoricoAtividade({ userId }: HistoricoAtividadeProps) {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [filtroAcao, setFiltroAcao] = useState<string>("todas");

  const {
    loading,
    error,
    buscarAtividades,
    registrarReproducao,
    registrarCurtida,
    registrarPausa,
  } = useAtividade();

  // Carregar atividades quando o componente montar
  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        const filtros =
          filtroAcao !== "todas" ? { acao: filtroAcao as any } : {};
        const resultado = await buscarAtividades(userId, {
          limit: 20,
          ...filtros,
        });
        setAtividades(resultado.atividades);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    };

    if (userId) {
      carregarAtividades();
    }
  }, [userId, filtroAcao, buscarAtividades]);

  // Exemplo de como registrar uma reprodução
  const handlePlayExample = async () => {
    try {
      await registrarReproducao(userId, "exemplo-music-123");
      // Recarregar atividades após registrar
      const resultado = await buscarAtividades(userId, { limit: 20 });
      setAtividades(resultado.atividades);
    } catch (error) {
      console.error("Erro ao registrar reprodução:", error);
    }
  };

  // Exemplo de como registrar uma curtida
  const handleLikeExample = async () => {
    try {
      await registrarCurtida(userId, "exemplo-music-456");
      const resultado = await buscarAtividades(userId, { limit: 20 });
      setAtividades(resultado.atividades);
    } catch (error) {
      console.error("Erro ao registrar curtida:", error);
    }
  };

  // Formatar a ação para exibição
  const formatarAcao = (acao: string) => {
    const acoes: Record<string, string> = {
      ouviu: "🎵 Ouviu",
      pausou: "⏸️ Pausou",
      pulou: "⏭️ Pulou",
      curtiu: "❤️ Curtiu",
      descurtiu: "💔 Descurtiu",
      adicionou_playlist: "➕ Adicionou à playlist",
    };
    return acoes[acao] || acao;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando atividades...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Histórico de Atividades
        </h2>

        {/* Exemplos de ações */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={handlePlayExample}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            Simular Reprodução
          </button>
          <button
            onClick={handleLikeExample}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={loading}
          >
            Simular Curtida
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-4">
          <label
            htmlFor="filtro-acao"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Filtrar por ação:
          </label>
          <select
            id="filtro-acao"
            value={filtroAcao}
            onChange={(e) => setFiltroAcao(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todas">Todas as ações</option>
            <option value="ouviu">Reproduções</option>
            <option value="pausou">Pausas</option>
            <option value="pulou">Pulos</option>
            <option value="curtiu">Curtidas</option>
            <option value="descurtiu">Descurtidas</option>
            <option value="adicionou_playlist">Adições à playlist</option>
          </select>
        </div>
      </div>

      {/* Exibição de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Lista de atividades */}
      <div className="space-y-4">
        {atividades.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma atividade encontrada.</p>
            <p className="text-sm mt-2">
              Use os botões acima para simular algumas atividades.
            </p>
          </div>
        ) : (
          atividades.map((atividade) => (
            <div
              key={atividade.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {formatarAcao(atividade.acao)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Mídia: {atividade.midiaId}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(atividade.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">ID: {atividade.id}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Informações técnicas */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Informações Técnicas</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Total de atividades exibidas: {atividades.length}</li>
          <li>• Filtro atual: {filtroAcao}</li>
          <li>
            • Estado de carregamento: {loading ? "Carregando" : "Concluído"}
          </li>
          <li>
            • API endpoint: POST /api/atividade e GET /api/atividade/{userId}
          </li>
        </ul>
      </div>
    </div>
  );
}
