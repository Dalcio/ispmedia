/**
 * Cliente para interagir com a API de atividades
 * Facilita o registro e consulta de atividades do usuário
 */

import {
  NovaAtividade,
  RespostaAtividades,
  RespostaCriacaoAtividade,
  TipoAcao,
  FiltrosAtividade,
} from "./types/atividade";

/**
 * Classe para gerenciar atividades do usuário
 */
export class AtividadeService {
  private baseUrl = "/api/atividade";

  /**
   * Registra uma nova atividade do usuário
   * @param atividade Dados da atividade a ser registrada
   * @returns Resposta da API com status da criação
   */
  async registrarAtividade(
    atividade: NovaAtividade
  ): Promise<RespostaCriacaoAtividade> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(atividade),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registrar atividade");
      }

      return data;
    } catch (error) {
      console.error("Erro ao registrar atividade:", error);
      throw error;
    }
  }

  /**
   * Lista as atividades de um usuário
   * @param userId ID do usuário
   * @param filtros Filtros opcionais para a consulta
   * @returns Lista de atividades do usuário
   */
  async listarAtividades(
    userId: string,
    filtros: FiltrosAtividade = {}
  ): Promise<RespostaAtividades> {
    try {
      const params = new URLSearchParams();

      if (filtros.limit) params.append("limit", filtros.limit.toString());
      if (filtros.acao) params.append("acao", filtros.acao);
      if (filtros.startAfter) params.append("startAfter", filtros.startAfter);

      const url = `${this.baseUrl}/${userId}?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar atividades");
      }

      return data;
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
      throw error;
    }
  }

  /**
   * Registra que o usuário ouviu uma música
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param timestamp Momento da ação (opcional, padrão: agora)
   */
  async registrarReproducao(
    userId: string,
    midiaId: string,
    timestamp?: Date
  ): Promise<RespostaCriacaoAtividade> {
    return this.registrarAtividade({
      userId,
      midiaId,
      acao: "ouviu",
      timestamp: (timestamp || new Date()).toISOString(),
    });
  }

  /**
   * Registra que o usuário pausou uma música
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param timestamp Momento da ação (opcional, padrão: agora)
   */
  async registrarPausa(
    userId: string,
    midiaId: string,
    timestamp?: Date
  ): Promise<RespostaCriacaoAtividade> {
    return this.registrarAtividade({
      userId,
      midiaId,
      acao: "pausou",
      timestamp: (timestamp || new Date()).toISOString(),
    });
  }

  /**
   * Registra que o usuário pulou uma música
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param timestamp Momento da ação (opcional, padrão: agora)
   */
  async registrarPulo(
    userId: string,
    midiaId: string,
    timestamp?: Date
  ): Promise<RespostaCriacaoAtividade> {
    return this.registrarAtividade({
      userId,
      midiaId,
      acao: "pulou",
      timestamp: (timestamp || new Date()).toISOString(),
    });
  }

  /**
   * Registra que o usuário curtiu uma música
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param timestamp Momento da ação (opcional, padrão: agora)
   */
  async registrarCurtida(
    userId: string,
    midiaId: string,
    timestamp?: Date
  ): Promise<RespostaCriacaoAtividade> {
    return this.registrarAtividade({
      userId,
      midiaId,
      acao: "curtiu",
      timestamp: (timestamp || new Date()).toISOString(),
    });
  }

  /**
   * Registra que o usuário descurtiu uma música
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param timestamp Momento da ação (opcional, padrão: agora)
   */
  async registrarDescurtida(
    userId: string,
    midiaId: string,
    timestamp?: Date
  ): Promise<RespostaCriacaoAtividade> {
    return this.registrarAtividade({
      userId,
      midiaId,
      acao: "descurtiu",
      timestamp: (timestamp || new Date()).toISOString(),
    });
  }
  /**
   * Registra que o usuário adicionou uma música a uma playlist
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param timestamp Momento da ação (opcional, padrão: agora)
   */
  async registrarAdicaoPlaylist(
    userId: string,
    midiaId: string,
    timestamp?: Date
  ): Promise<RespostaCriacaoAtividade> {
    return this.registrarAtividade({
      userId,
      midiaId,
      acao: "adicionou_playlist",
      timestamp: (timestamp || new Date()).toISOString(),
    });
  }

  /**
   * Registra que o usuário fez upload de uma música
   * @param userId ID do usuário
   * @param midiaId ID da mídia
   * @param timestamp Momento da ação (opcional, padrão: agora)
   */
  async registrarUpload(
    userId: string,
    midiaId: string,
    timestamp?: Date
  ): Promise<RespostaCriacaoAtividade> {
    return this.registrarAtividade({
      userId,
      midiaId,
      acao: "upload",
      timestamp: (timestamp || new Date()).toISOString(),
    });
  }
}

// Instância singleton para uso global
export const atividadeService = new AtividadeService();
