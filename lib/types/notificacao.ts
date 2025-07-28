/**
 * Tipos relacionados ao sistema de notificações do usuário
 */

/**
 * Tipos de notificação possíveis
 */
export type TipoNotificacao = "info" | "erro" | "sucesso" | "alerta";

/**
 * Ações que podem gerar notificações
 */
export type AcaoNotificacao =
  | "playlist"
  | "comentario"
  | "edicao"
  | "moderacao";

/**
 * Estrutura de dados para uma notificação
 */
export interface Notificacao {
  id: string;
  mensagem: string;
  tipo: TipoNotificacao;
  acao: AcaoNotificacao;
  timestamp: string; // ISO string
  lida: boolean;
  origemId: string; // ID da música, playlist, comentário, etc.
  userId: string; // ID do usuário que recebe a notificação
  createdAt: string; // ISO string
}

/**
 * Dados necessários para criar uma nova notificação
 */
export interface NovaNotificacao {
  mensagem: string;
  tipo: TipoNotificacao;
  acao: AcaoNotificacao;
  origemId: string;
  userId: string;
}

/**
 * Parâmetros para busca de notificações
 */
export interface FiltrosNotificacao {
  limit?: number;
  apenasNaoLidas?: boolean;
  tipo?: TipoNotificacao;
  acao?: AcaoNotificacao;
  startAfter?: string;
}

/**
 * Dados de uma notificação expandida com informações adicionais
 */
export interface NotificacaoExpandida extends Notificacao {
  // Dados adicionais que podem ser carregados conforme necessário
  trackTitle?: string;
  playlistName?: string;
  userName?: string;
}
