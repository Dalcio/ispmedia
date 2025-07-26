// ...existing code...
import { useState, useCallback } from "react";
import { atividadeService } from "../lib/atividade-service";
import { Atividade, TipoAcao, FiltrosAtividade } from "../lib/types/atividade";

/**
 * Hook personalizado para gerenciar atividades do usuário
 * Facilita o registro e consulta de atividades nos componentes React
 */
export function useAtividade() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Registra uma atividade do usuário
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param acao Tipo de ação realizada
   * @param timestamp Momento da ação (opcional)
   */
  const registrarAtividade = useCallback(
    async (
      userId: string,
      midiaId: string,
      acao: TipoAcao,
      timestamp?: Date
    ) => {
      try {
        setLoading(true);
        setError(null);

        const resultado = await atividadeService.registrarAtividade({
          userId,
          midiaId,
          acao,
          timestamp: (timestamp || new Date()).toISOString(),
        });

        return resultado;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao registrar atividade";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Busca atividades de um usuário
   * @param userId ID do usuário
   * @param filtros Filtros para a consulta
   */
  const buscarAtividades = useCallback(
    async (userId: string, filtros?: FiltrosAtividade) => {
      try {
        setLoading(true);
        setError(null);

        const resultado = await atividadeService.listarAtividades(
          userId,
          filtros
        );
        return resultado;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao buscar atividades";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Registra reprodução de uma mídia
   */
  const registrarReproducao = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "ouviu");
    },
    [registrarAtividade]
  );

  /**
   * Registra pausa de uma mídia
   */
  const registrarPausa = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "pausou");
    },
    [registrarAtividade]
  );

  /**
   * Registra que uma mídia foi pulada
   */
  const registrarPulo = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "pulou");
    },
    [registrarAtividade]
  );

  /**
   * Registra curtida de uma mídia
   */
  const registrarCurtida = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "curtiu");
    },
    [registrarAtividade]
  );

  /**
   * Registra descurtida de uma mídia
   */
  const registrarDescurtida = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "descurtiu");
    },
    [registrarAtividade]
  );

  /**
   * Registra adição a playlist
   */
  const registrarAdicaoPlaylist = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "adicionou_playlist");
    },
    [registrarAtividade]
  );

  /**
   * Registra upload de uma mídia
   */
  const registrarUpload = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "upload");
    },
    [registrarAtividade]
  );

  /**
   * Registra edição de uma mídia
   */
  const registrarEdicao = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "editou");
    },
    [registrarAtividade]
  );

  /**
   * Registra deleção de uma mídia
   */
  const registrarDelecao = useCallback(
    async (userId: string, midiaId: string) => {
      return registrarAtividade(userId, midiaId, "deletou");
    },
    [registrarAtividade]
  );

  return {
    loading,
    error,
    registrarAtividade,
    buscarAtividades,
    registrarReproducao,
    registrarPausa,
    registrarPulo,
    registrarCurtida,
    registrarDescurtida,
    registrarAdicaoPlaylist,
    registrarUpload,
    registrarEdicao,
    registrarDelecao,
  };
}
