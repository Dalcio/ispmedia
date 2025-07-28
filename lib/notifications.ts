/**
 * Serviço para gerenciar notificações no Firestore
 */

import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  startAfter as firestoreStartAfter,
  Timestamp,
  WriteBatch,
  writeBatch,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type {
  Notificacao,
  NovaNotificacao,
  FiltrosNotificacao,
  TipoNotificacao,
  AcaoNotificacao,
} from "@/lib/types/notificacao";

/**
 * Cria uma nova notificação para um usuário
 */
export async function criarNotificacao(
  notificacao: NovaNotificacao
): Promise<string | null> {
  try {
    const now = new Date();
    const notificacaoData = {
      ...notificacao,
      timestamp: now.toISOString(),
      createdAt: now.toISOString(),
      lida: false,
    };

    const docRef = await addDoc(
      collection(db, "users", notificacao.userId, "notificacoes"),
      notificacaoData
    );

    console.log("✅ Notificação criada:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Erro ao criar notificação:", error);
    return null;
  }
}

/**
 * Busca notificações de um usuário
 */
export async function buscarNotificacoes(
  userId: string,
  filtros: FiltrosNotificacao = {}
): Promise<Notificacao[]> {
  try {
    const {
      limit: queryLimit = 20,
      apenasNaoLidas = false,
      tipo,
      acao,
      startAfter,
    } = filtros;

    let notificacoesQuery = query(
      collection(db, "users", userId, "notificacoes"),
      orderBy("timestamp", "desc")
    );

    // Filtrar apenas não lidas
    if (apenasNaoLidas) {
      notificacoesQuery = query(notificacoesQuery, where("lida", "==", false));
    }

    // Filtrar por tipo
    if (tipo) {
      notificacoesQuery = query(notificacoesQuery, where("tipo", "==", tipo));
    }

    // Filtrar por ação
    if (acao) {
      notificacoesQuery = query(notificacoesQuery, where("acao", "==", acao));
    }

    // Paginação
    if (startAfter) {
      // Implementar paginação se necessário
    }

    // Aplicar limite
    notificacoesQuery = query(notificacoesQuery, limit(queryLimit));

    const snapshot = await getDocs(notificacoesQuery);
    const notificacoes: Notificacao[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      notificacoes.push({
        id: doc.id,
        ...data,
      } as Notificacao);
    });

    return notificacoes;
  } catch (error) {
    console.error("❌ Erro ao buscar notificações:", error);
    return [];
  }
}

/**
 * Marca uma notificação como lida
 */
export async function marcarComoLida(
  userId: string,
  notificacaoId: string
): Promise<boolean> {
  try {
    const notificacaoRef = doc(
      db,
      "users",
      userId,
      "notificacoes",
      notificacaoId
    );

    await updateDoc(notificacaoRef, {
      lida: true,
    });

    console.log("✅ Notificação marcada como lida:", notificacaoId);
    return true;
  } catch (error) {
    console.error("❌ Erro ao marcar notificação como lida:", error);
    return false;
  }
}

/**
 * Marca todas as notificações como lidas
 */
export async function marcarTodasComoLidas(userId: string): Promise<boolean> {
  try {
    const notificacoesQuery = query(
      collection(db, "users", userId, "notificacoes"),
      where("lida", "==", false)
    );

    const snapshot = await getDocs(notificacoesQuery);
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { lida: true });
    });

    await batch.commit();

    console.log(`✅ ${snapshot.size} notificações marcadas como lidas`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao marcar todas as notificações como lidas:", error);
    return false;
  }
}

/**
 * Conta notificações não lidas de um usuário
 */
export async function contarNotificacaoesNaoLidas(
  userId: string
): Promise<number> {
  try {
    const notificacoesQuery = query(
      collection(db, "users", userId, "notificacoes"),
      where("lida", "==", false)
    );

    const snapshot = await getDocs(notificacoesQuery);
    return snapshot.size;
  } catch (error) {
    console.error("❌ Erro ao contar notificações não lidas:", error);
    return 0;
  }
}

/**
 * Listener em tempo real para notificações de um usuário
 */
export function escutarNotificacoes(
  userId: string,
  callback: (notificacoes: Notificacao[]) => void,
  filtros: FiltrosNotificacao = {}
) {
  const { limit: queryLimit = 20, apenasNaoLidas = false } = filtros;

  let notificacoesQuery = query(
    collection(db, "users", userId, "notificacoes"),
    orderBy("timestamp", "desc"),
    limit(queryLimit)
  );

  if (apenasNaoLidas) {
    notificacoesQuery = query(notificacoesQuery, where("lida", "==", false));
  }

  return onSnapshot(
    notificacoesQuery,
    (snapshot) => {
      const notificacoes: Notificacao[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        notificacoes.push({
          id: doc.id,
          ...data,
        } as Notificacao);
      });

      callback(notificacoes);
    },
    (error) => {
      console.error("❌ Erro no listener de notificações:", error);
      callback([]);
    }
  );
}

/**
 * Busca usuários que têm uma música específica em suas playlists
 */
export async function buscarUsuariosComMusicaEmPlaylists(
  trackId: string
): Promise<string[]> {
  try {
    // Buscar todas as playlists que contêm esta música
    const playlistsQuery = query(
      collection(db, "playlists"),
      where("tracks", "array-contains", trackId)
    );

    const snapshot = await getDocs(playlistsQuery);
    const userIds = new Set<string>();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdBy) {
        userIds.add(data.createdBy);
      }
    });

    console.log(
      `📋 Encontrados ${userIds.size} usuários com a música ${trackId} em playlists`
    );
    return Array.from(userIds);
  } catch (error) {
    console.error("❌ Erro ao buscar usuários com música em playlists:", error);
    return [];
  }
}

// Funções específicas para cada tipo de notificação

/**
 * Notifica que uma música foi adicionada a uma playlist
 */
export async function notificarMusicaAdicionadaPlaylist(
  autorMusicaId: string,
  nomeMusica: string,
  nomePlaylist: string,
  nomeUsuario: string,
  musicaId: string
): Promise<string | null> {
  if (!autorMusicaId) return null;

  return criarNotificacao({
    userId: autorMusicaId,
    mensagem: `Sua música "${nomeMusica}" foi adicionada à playlist "${nomePlaylist}" por ${nomeUsuario}`,
    tipo: "info",
    acao: "playlist",
    origemId: musicaId,
  });
}

/**
 * Notifica que uma música foi atualizada
 */
export async function notificarMusicaAtualizada(
  usuariosAfetados: string[],
  nomeMusica: string,
  musicaId: string
): Promise<boolean> {
  try {
    const promises = usuariosAfetados.map((userId) =>
      criarNotificacao({
        userId,
        mensagem: `A música "${nomeMusica}" foi atualizada pelo autor.`,
        tipo: "alerta",
        acao: "edicao",
        origemId: musicaId,
      })
    );

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("❌ Erro ao notificar música atualizada:", error);
    return false;
  }
}

/**
 * Notifica que uma música foi removida
 */
export async function notificarMusicaRemovida(
  usuariosAfetados: string[],
  nomeMusica: string,
  musicaId: string
): Promise<boolean> {
  try {
    const promises = usuariosAfetados.map((userId) =>
      criarNotificacao({
        userId,
        mensagem: `A música "${nomeMusica}" foi removida pelo autor e retirada da sua playlist.`,
        tipo: "erro",
        acao: "edicao",
        origemId: musicaId,
      })
    );

    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("❌ Erro ao notificar música removida:", error);
    return false;
  }
}

/**
 * Notifica novo comentário na música
 */
export async function notificarNovoComentario(
  autorMusicaId: string,
  nomeMusica: string,
  autorComentario: string,
  musicaId: string
): Promise<string | null> {
  if (!autorMusicaId) return null;

  return criarNotificacao({
    userId: autorMusicaId,
    mensagem: `Novo comentário em "${nomeMusica}": ${autorComentario}`,
    tipo: "info",
    acao: "comentario",
    origemId: musicaId,
  });
}

/**
 * Notifica aprovação de comentário
 */
export async function notificarComentarioAprovado(
  autorComentarioId: string,
  nomeMusica: string,
  comentarioId: string
): Promise<string | null> {
  if (!autorComentarioId) return null;

  return criarNotificacao({
    userId: autorComentarioId,
    mensagem: `Seu comentário na faixa "${nomeMusica}" foi aprovado.`,
    tipo: "sucesso",
    acao: "moderacao",
    origemId: comentarioId,
  });
}

/**
 * Notifica rejeição de comentário
 */
export async function notificarComentarioRejeitado(
  autorComentarioId: string,
  nomeMusica: string,
  comentarioId: string
): Promise<string | null> {
  if (!autorComentarioId) return null;

  return criarNotificacao({
    userId: autorComentarioId,
    mensagem: `Seu comentário na faixa "${nomeMusica}" foi rejeitado.`,
    tipo: "erro",
    acao: "moderacao",
    origemId: comentarioId,
  });
}

/**
 * Remove uma música de todas as playlists quando ela é deletada
 */
export async function removerMusicaDePlaylists(
  trackId: string
): Promise<boolean> {
  try {
    // Buscar todas as playlists que contêm esta música
    const playlistsQuery = query(
      collection(db, "playlists"),
      where("tracks", "array-contains", trackId)
    );

    const snapshot = await getDocs(playlistsQuery);
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      const playlistRef = doc.ref;
      batch.update(playlistRef, {
        tracks: arrayRemove(trackId),
        updatedAt: new Date(),
      });
    });

    await batch.commit();

    console.log(`✅ Música ${trackId} removida de ${snapshot.size} playlists`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao remover música das playlists:", error);
    return false;
  }
}
