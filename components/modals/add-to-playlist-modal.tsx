"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/ui-button";
import { ListMusic, Plus } from "lucide-react";
import { notificarMusicaAdicionadaPlaylist } from "@/lib/notifications";

interface Playlist {
  id: string;
  title: string;
  visibility: "public" | "private";
  tracks: string[];
}

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
}

export function AddToPlaylistModal({
  isOpen,
  onClose,
  trackId,
  trackTitle,
}: AddToPlaylistModalProps) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isOpen) {
      setLoading(false);
      return;
    }

    const playlistsQuery = query(
      collection(db, "playlists"),
      where("createdBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(playlistsQuery, (snapshot) => {
      const playlistsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Playlist[];

      // Filtrar playlists que já contêm esta música
      const availablePlaylists = playlistsData.filter(
        (playlist) => !playlist.tracks.includes(trackId)
      );

      setPlaylists(availablePlaylists);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isOpen, trackId]);
  const handleAddToPlaylist = async (
    playlistId: string,
    playlistTitle: string
  ) => {
    setAdding(playlistId);
    try {
      const playlistRef = doc(db, "playlists", playlistId);
      await updateDoc(playlistRef, {
        tracks: arrayUnion(trackId),
        updatedAt: new Date(),
      });

      // Buscar informações da música para enviar notificação ao autor
      try {
        const trackRef = doc(db, "tracks", trackId);
        const trackSnap = await getDoc(trackRef);

        if (trackSnap.exists() && user) {
          const trackData = trackSnap.data();
          const autorMusicaId = trackData.createdBy;
          const nomeMusica = trackData.title || "Música sem título";

          // Só notificar se a música não for do próprio usuário que está adicionando
          if (autorMusicaId && autorMusicaId !== user.uid) {
            const nomeUsuario = user.displayName || user.email || "Usuário";
            await notificarMusicaAdicionadaPlaylist(
              autorMusicaId,
              nomeMusica,
              playlistTitle,
              nomeUsuario,
              trackId
            );
            console.log(
              `📧 Notificação enviada para o autor da música: ${autorMusicaId}`
            );
          }
        }
      } catch (notificationError) {
        console.error(
          "❌ Erro ao enviar notificação de música adicionada à playlist:",
          notificationError
        );
        // Não falhar a operação por causa da notificação
      }

      success(`"${trackTitle}" adicionada à playlist "${playlistTitle}"`);
      onClose();
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      showError("Erro ao adicionar música à playlist");
    } finally {
      setAdding(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adicionar "${trackTitle}" à playlist`}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 animate-pulse"
              >
                <div className="w-10 h-10 bg-glass-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-glass-200 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-glass-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-8">
            <ListMusic className="w-12 h-12 mx-auto mb-4 text-text-muted" />
            <p className="text-text-muted mb-4">
              Você não tem playlists disponíveis ou esta música já está em todas
              as suas playlists.
            </p>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-primary-500"
            >
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() =>
                    handleAddToPlaylist(playlist.id, playlist.title)
                  }
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer bg-glass-50 hover:bg-glass-100 border border-transparent hover:border-primary-200 transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ListMusic className="h-5 w-5 text-primary-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary truncate">
                      {playlist.title}
                    </h4>
                    <p className="text-sm text-text-muted">
                      {playlist.tracks.length} música(s) •{" "}
                      {playlist.visibility === "public" ? "Pública" : "Privada"}
                    </p>
                  </div>

                  {adding === playlist.id ? (
                    <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5 text-text-muted" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-glass-200">
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
