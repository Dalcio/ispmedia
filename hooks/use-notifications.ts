/**
 * Hook para gerenciar notificações usando Zustand
 */

import { create } from "zustand";
import type { Notificacao, FiltrosNotificacao } from "@/lib/types/notificacao";
import {
  buscarNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
  contarNotificacaoesNaoLidas,
  escutarNotificacoes,
} from "@/lib/notifications";

interface NotificacoesStore {
  // Estado
  notificacoes: Notificacao[];
  countNaoLidas: number;
  loading: boolean;
  error: string | null;

  // Listener
  unsubscribe: (() => void) | null;

  // Ações
  iniciarListener: (userId: string) => void;
  pararListener: () => void;
  buscarNotificacoes: (
    userId: string,
    filtros?: FiltrosNotificacao
  ) => Promise<void>;
  marcarComoLida: (userId: string, notificacaoId: string) => Promise<void>;
  marcarTodasComoLidas: (userId: string) => Promise<void>;
  atualizarContadorNaoLidas: (userId: string) => Promise<void>;
  limparNotificacoes: () => void;
}

export const useNotificacoes = create<NotificacoesStore>((set, get) => ({
  // Estado inicial
  notificacoes: [],
  countNaoLidas: 0,
  loading: false,
  error: null,
  unsubscribe: null,

  // Iniciar listener em tempo real
  iniciarListener: (userId: string) => {
    const { pararListener } = get();

    // Para listener anterior se existir
    pararListener();

    set({ loading: true, error: null });

    const unsubscribeFn = escutarNotificacoes(
      userId,
      (notificacoes) => {
        const countNaoLidas = notificacoes.filter((n) => !n.lida).length;

        set({
          notificacoes,
          countNaoLidas,
          loading: false,
          error: null,
        });
      },
      { limit: 50 } // Buscar até 50 notificações mais recentes
    );

    set({ unsubscribe: unsubscribeFn });
  },

  // Parar listener
  pararListener: () => {
    const { unsubscribe } = get();
    if (unsubscribe) {
      unsubscribe();
      set({ unsubscribe: null });
    }
  },

  // Buscar notificações manualmente
  buscarNotificacoes: async (userId: string, filtros = {}) => {
    set({ loading: true, error: null });

    try {
      const notificacoes = await buscarNotificacoes(userId, filtros);
      const countNaoLidas = notificacoes.filter((n) => !n.lida).length;

      set({
        notificacoes,
        countNaoLidas,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  },

  // Marcar notificação como lida
  marcarComoLida: async (userId: string, notificacaoId: string) => {
    const { notificacoes } = get();

    // Atualizar estado local imediatamente (otimistic update)
    const notificacoesAtualizadas = notificacoes.map((n) =>
      n.id === notificacaoId ? { ...n, lida: true } : n
    );

    const countNaoLidas = notificacoesAtualizadas.filter((n) => !n.lida).length;

    set({
      notificacoes: notificacoesAtualizadas,
      countNaoLidas,
    });

    // Atualizar no Firestore
    try {
      await marcarComoLida(userId, notificacaoId);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);

      // Reverter mudança local em caso de erro
      set({
        notificacoes,
        countNaoLidas: notificacoes.filter((n) => !n.lida).length,
      });
    }
  },

  // Marcar todas como lidas
  marcarTodasComoLidas: async (userId: string) => {
    const { notificacoes } = get();

    // Atualizar estado local imediatamente
    const notificacoesAtualizadas = notificacoes.map((n) => ({
      ...n,
      lida: true,
    }));

    set({
      notificacoes: notificacoesAtualizadas,
      countNaoLidas: 0,
    });

    // Atualizar no Firestore
    try {
      await marcarTodasComoLidas(userId);
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);

      // Reverter mudança local em caso de erro
      set({
        notificacoes,
        countNaoLidas: notificacoes.filter((n) => !n.lida).length,
      });
    }
  },

  // Atualizar contador de não lidas
  atualizarContadorNaoLidas: async (userId: string) => {
    try {
      const count = await contarNotificacaoesNaoLidas(userId);
      set({ countNaoLidas: count });
    } catch (error) {
      console.error("Erro ao atualizar contador de não lidas:", error);
    }
  },

  // Limpar todas as notificações (usado no logout)
  limparNotificacoes: () => {
    const { pararListener } = get();
    pararListener();

    set({
      notificacoes: [],
      countNaoLidas: 0,
      loading: false,
      error: null,
      unsubscribe: null,
    });
  },
}));

/**
 * Hook simplificado para facilitar o uso
 */
export function useNotificacoesSimple() {
  const {
    notificacoes,
    countNaoLidas,
    loading,
    error,
    iniciarListener,
    pararListener,
    marcarComoLida,
    marcarTodasComoLidas,
    limparNotificacoes,
  } = useNotificacoes();

  return {
    notificacoes,
    countNaoLidas,
    loading,
    error,
    iniciarListener,
    pararListener,
    marcarComoLida,
    marcarTodasComoLidas,
    limparNotificacoes,
  };
}
