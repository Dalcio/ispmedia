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
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Pause,
  Edit2,
  Trash2,
  Music,
  Plus,
  Clock,
  ListMusic,
} from "lucide-react";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  trackCount?: number;
  duration?: number;
  coverImage?: string;
}

interface UserPlaylistListProps {
  className?: string;
}

export function UserPlaylistList({ className = "" }: UserPlaylistListProps) {
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

  // Estados do formulário de edição
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isPublic: false,
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const playlistsQuery = query(
      collection(db, "playlists"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      playlistsQuery,
      (snapshot) => {
        const playlistsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Playlist[];

        setPlaylists(playlistsData);
        setLoading(false);
      },      (err) => {
        console.error("Error loading playlists:", err);
        
        // Only show error toast for actual errors, not for empty results
        if (err.code === "failed-precondition") {
          showError("Database indexing in progress. Please wait a few minutes and refresh.");
        } else if (err.code !== 'permission-denied' && err.message && !err.message.includes('No such document')) {
          showError("Failed to load your playlists");
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, showError]);

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setEditForm({
      name: playlist.name,
      description: playlist.description || "",
      isPublic: playlist.isPublic,
    });
    setShowEditModal(true);
  };
  const handleSaveEdit = async () => {
    if (!editingPlaylist || !editForm.name.trim()) {
      showError("Nome da playlist é obrigatório");
      return;
    }

    try {
      const playlistRef = doc(db, "playlists", editingPlaylist.id);
      await updateDoc(playlistRef, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        isPublic: editForm.isPublic,
        updatedAt: new Date(),
      });

      success("Playlist atualizada com sucesso!");
      setShowEditModal(false);
      setEditingPlaylist(null);
    } catch (error) {
      console.error("Erro ao atualizar playlist:", error);
      showError("Erro ao atualizar playlist");
    }
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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <ListMusic className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
        <p className="text-neutral-500">Faça login para ver suas playlists</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded-lg h-24"
          />
        ))}
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <ListMusic className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
        <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Nenhuma playlist encontrada
        </h3>
        <p className="text-neutral-500 mb-4">
          Você ainda não criou nenhuma playlist.
        </p>
        <Button className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Criar Primeira Playlist
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          Minhas Playlists ({playlists.length})
        </h3>
        <Button size="sm" className="inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Playlist
        </Button>
      </div>

      {/* Lista de Playlists */}
      <div className="space-y-3">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="group bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-white/90 dark:hover:bg-neutral-800/90 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ListMusic className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {playlist.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {playlist.trackCount || 0} músicas
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(playlist.duration)}
                      </span>
                    </div>
                  </div>
                </div>

                {playlist.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
                    {playlist.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-neutral-500">
                  <span>Criada em {formatDate(playlist.createdAt)}</span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      playlist.isPublic
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                    }`}
                  >
                    {playlist.isPublic ? "Pública" : "Privada"}
                  </span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditPlaylist(playlist)}
                  className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeletePlaylist(playlist)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingPlaylist && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingPlaylist(null);
          }}
          title="Editar Playlist"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Nome da Playlist
              </label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                placeholder="Digite o nome da playlist"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                placeholder="Descreva sua playlist..."
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 resize-none h-20"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.isPublic}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isPublic: e.target.checked })
                  }
                  className="rounded border-neutral-300 dark:border-neutral-600"
                />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Tornar playlist pública
                </span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPlaylist(null);
                }}
                variant="ghost"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} className="flex-1">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Confirmação de Exclusão */}
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
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              Excluir Playlist
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Tem certeza que deseja excluir a playlist "{playlistToDelete.name}
              "? Esta ação não pode ser desfeita.
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
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Excluir
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
