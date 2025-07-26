/**
 * Tipos relacionados ao sistema de atividades do usuário
 */

/**
 * Ações possíveis que um usuário pode executar com uma mídia
 */
export type TipoAcao =
  | "ouviu" // Usuário reproduziu a música completamente
  | "pausou" // Usuário pausou a reprodução
  | "pulou" // Usuário pulou para próxima música
  | "curtiu" // Usuário curtiu a música
  | "descurtiu" // Usuário descurtiu a música
  | "adicionou_playlist" // Usuário adicionou música a uma playlist
  | "upload" // Usuário fez upload de uma música
  | "editou" // Usuário editou uma música
  | "deletou"; // Usuário deletou uma música

/**
 * Estrutura de dados para registro de atividade
 */
export interface Atividade {
  id: string;
  userId: string;
  midiaId: string;
  acao: TipoAcao;
  timestamp: string; // ISO string
  createdAt: string; // ISO string
}

/**
 * Dados necessários para criar uma nova atividade
 */
export interface NovaAtividade {
  userId: string;
  midiaId: string;
  acao: TipoAcao;
  timestamp: string; // ISO string
}

/**
 * Parâmetros para busca de atividades
 */
export interface FiltrosAtividade {
  limit?: number;
  acao?: TipoAcao;
  startAfter?: string;
}

/**
 * Resposta da API para listagem de atividades
 */
export interface RespostaAtividades {
  atividades: Atividade[];
  total: number;
  hasMore: boolean;
  lastDocumentId: string | null;
  filtros: FiltrosAtividade;
}

/**
 * Resposta da API para criação de atividade
 */
export interface RespostaCriacaoAtividade {
  success: boolean;
  id: string;
  message: string;
}
