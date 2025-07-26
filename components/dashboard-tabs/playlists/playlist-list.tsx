"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { PlaylistItem } from "./playlist-item";
import { PlaylistModal } from "@/components/modals/playlist-modal";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ListMusic, Trash2, Plus } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  description?: string;
  visibility: "public" | "private";
  tracks: string[];
  createdBy: string;
  createdAt: any;
  updatedAt?: any;
}

interface PlaylistListProps {
  className?: string;
}

export function PlaylistList({ className = "" }: PlaylistListProps) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(
    null
  );
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const playlistsQuery = query(
      collection(db, "playlists"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      playlistsQuery,
      (snapshot) => {
        const playlistsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Playlist[];

        setPlaylists(playlistsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading playlists:", err);

        if (err.code === "failed-precondition") {
          showError(
            "Database indexing in progress. Please wait a few minutes and refresh."
          );
        } else if (
          err.code !== "permission-denied" &&
          err.message &&
          !err.message.includes("No such document")
        ) {
          showError("Failed to load your playlists");
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, showError]);

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setShowEditModal(true);
  };

  const handleDeletePlaylist = (playlist: Playlist) => {
    setPlaylistToDelete(playlist);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!playlistToDelete) return;

    try {
      await deleteDoc(doc(db, "playlists", playlistToDelete.id));
      success("Playlist removida com sucesso!");
      setShowDeleteConfirm(false);
      setPlaylistToDelete(null);
    } catch (error) {
      console.error("Erro ao remover playlist:", error);
      showError("Erro ao remover playlist");
    }
  };

  const handleToggleExpand = (playlistId: string) => {
    setExpandedPlaylistId((prev) => (prev === playlistId ? null : playlistId));
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingPlaylist(null);
  };

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <ListMusic className="w-12 h-12 mx-auto mb-4 text-text-muted" />
        <p className="text-text-muted">Faça login para ver suas playlists</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-glass-100 rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-glass-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-glass-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-glass-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (playlists.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-20 h-20 bg-glass-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ListMusic className="h-10 w-10 text-text-muted" />
        </div>
        <h3 className="text-xl font-medium text-text-primary mb-3">
          Nenhuma playlist criada ainda.
        </h3>{" "}
        <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
          Organize suas músicas favoritas criando playlists personalizadas
        </p>{" "}
        <div className="space-y-3">
          <Button
            onClick={() => {
              console.log("🎵 Botão criar playlist clicado");
              // Vamos disparar um evento para abrir o modal de criação
              const event = new CustomEvent("openPlaylistModal");
              window.dispatchEvent(event);
            }}
            className="inline-flex items-center gap-2 py-3 px-6 bg-glass-100 hover:bg-glass-200 backdrop-blur-sm border border-glass-200 rounded-xl text-text-primary font-semibold transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Criar nova playlist
          </Button>

          <Button
            onClick={() => {
              console.log("🎵 Botão teste upload clicado");
              const event = new CustomEvent("openUploadModal");
              window.dispatchEvent(event);
            }}
            className="inline-flex items-center gap-2 py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            TESTE: Abrir Upload
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className={`h-full ${className}`}>
      <div className="h-full overflow-y-auto">
        <div className="space-y-3">
          {/* Lista de playlists */}
          {playlists.map((playlist) => (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              isExpanded={expandedPlaylistId === playlist.id}
              onToggleExpand={() => handleToggleExpand(playlist.id)}
              onEdit={() => handleEditPlaylist(playlist)}
              onDelete={() => handleDeletePlaylist(playlist)}
            />
          ))}

          {/* Total de playlists */}
          {playlists.length > 0 && (
            <div className="text-center pt-2">
              <p className="text-xs text-text-muted">
                {playlists.length}
                {playlists.length === 1 ? "playlist" : "playlists"}
              </p>
            </div>
          )}

          {/* Modal de edição */}
          <PlaylistModal
            isOpen={showEditModal}
            onClose={handleCloseEditModal}
            mode="edit"
            playlist={editingPlaylist}
          />

          {/* Modal de confirmação de exclusão */}
          {showDeleteConfirm && playlistToDelete && (
            <Modal
              isOpen={showDeleteConfirm}
              onClose={() => {
                setShowDeleteConfirm(false);
                setPlaylistToDelete(null);
              }}
              title="Confirmar Exclusão"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-error-500/10 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-error-500" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Excluir Playlist
                </h3>
                <p className="text-text-muted mb-6">
                  Tem certeza que deseja excluir a playlist "
                  {playlistToDelete.title}"? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setPlaylistToDelete(null);
                    }}
                    variant="ghost"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    className="flex-1 bg-error-500 hover:bg-error-600 text-white"
                  >
                    Excluir
                  </Button>
                </div>{" "}
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
