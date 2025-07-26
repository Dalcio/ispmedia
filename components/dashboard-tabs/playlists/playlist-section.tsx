"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { PlaylistList } from "./playlist-list";
import { PlaylistModal } from "@/components/modals/playlist-modal";
import { Button } from "@/components/ui/button";
import { Plus, ListMusic } from "lucide-react";

interface PlaylistSectionProps {
  className?: string;
}

export function PlaylistSection({ className = "" }: PlaylistSectionProps) {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [hasPlaylists, setHasPlaylists] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar se usuário tem playlists para mostrar/esconder header
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const playlistsQuery = query(
      collection(db, "playlists"),
      where("createdBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(playlistsQuery, (snapshot) => {
      setHasPlaylists(snapshot.docs.length > 0);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Escutar evento customizado para abrir modal
  useEffect(() => {
    const handleOpenModal = () => {
      setShowCreateModal(true);
    };

    window.addEventListener("openPlaylistModal", handleOpenModal);
    return () =>
      window.removeEventListener("openPlaylistModal", handleOpenModal);
  }, []);

  const handleCreatePlaylist = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-glass-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-glass-200 rounded w-1/4" />
        </div>
      </div>
    );
  }
  return (
    <div className={`h-full flex flex-col space-y-6 ${className}`}>
      {/* Header condicional - só mostra se tem playlists */}
      {hasPlaylists && (
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
              <ListMusic className="h-5 w-5 text-primary-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Minhas Playlists
              </h2>
              <p className="text-sm text-text-muted">
                Organize suas músicas favoritas
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreatePlaylist}
            className="inline-flex items-center gap-2 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm md:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Nova Playlist
          </Button>
        </div>
      )}

      {/* Lista de playlists */}
      <div className="flex-1 overflow-y-auto">
        <PlaylistList />
      </div>

      {/* Modal de criação */}
      <PlaylistModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        mode="create"
      />
    </div>
  );
}
