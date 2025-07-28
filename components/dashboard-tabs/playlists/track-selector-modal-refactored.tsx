"use client";

import { useState, useEffect } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useTrackSearch } from "@/hooks/use-track-search";
import { notificarMusicaAdicionadaPlaylist } from "@/lib/notifications";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/ui-button";
import { Input } from "@/components/ui/input";
import { TrackList } from "@/components/ui/track-list";
import { Search, User, Globe } from "lucide-react";

interface TrackSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  playlistTitle: string;
  existingTrackIds: string[];
}

export function TrackSelectorModal({
  isOpen,
  onClose,
  playlistId,
  playlistTitle,
  existingTrackIds,
}: TrackSelectorModalProps) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<"minhas" | "publicas">("minhas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);

  // Use the track search hook with exact search-modal logic
  const {
    userTracks,
    publicTracks,
    isLoading,
    publicTracksError,
    availableUserTracks,
    availablePublicTracks,
  } = useTrackSearch({
    searchTerm,
    includeUserTracks: activeTab === "minhas",
    includePublicTracks: activeTab === "publicas",
    excludeTrackIds: existingTrackIds,
    autoLoadPublic: activeTab === "publicas" && isOpen && !!user,
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedTracks([]);
      setActiveTab("minhas");
    }
  }, [isOpen]);

  // Show error if public tracks failed to load
  useEffect(() => {
    if (publicTracksError) {
      showError(publicTracksError);
    }
  }, [publicTracksError, showError]);

  // Get current tracks and loading state based on active tab
  const currentTracks = activeTab === "minhas" ? userTracks : publicTracks;
  const currentLoading = isLoading && (activeTab === "publicas" ? true : false);

  const handleToggleTrack = (trackId: string) => {
    setSelectedTracks((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleAddTracks = async () => {
    if (selectedTracks.length === 0) {
      showError("Selecione pelo menos uma música");
      return;
    }

    if (!user) {
      showError("Você precisa estar logado");
      return;
    }

    setAdding(true);
    try {
      // Add tracks to playlist
      const playlistRef = doc(db, "playlists", playlistId);
      await updateDoc(playlistRef, {
        tracks: arrayUnion(...selectedTracks),
        updatedAt: new Date(),
      });

      // Send notifications for public tracks from other users (exact search-modal compatibility)
      const allTracks = [...availableUserTracks, ...availablePublicTracks];
      const notificationPromises = selectedTracks.map(async (trackId) => {
        const track = allTracks.find((t) => t.id === trackId);
        // Use both userUid (search-modal style) and createdBy (compatibility) for checking
        const trackOwner = track?.userUid || track?.createdBy;
        if (track && trackOwner && trackOwner !== user.uid) {
          try {
            await notificarMusicaAdicionadaPlaylist(
              trackOwner,
              track.title,
              playlistTitle,
              user.displayName || user.email || "Um usuário",
              trackId
            );
          } catch (error) {
            console.error("Error sending notification:", error);
          }
        }
      });

      await Promise.allSettled(notificationPromises);

      const notificationCount = selectedTracks.filter((trackId) => {
        const track = allTracks.find((t) => t.id === trackId);
        const trackOwner = track?.userUid || track?.createdBy;
        return track && trackOwner && trackOwner !== user.uid;
      }).length;

      let message = `${selectedTracks.length} música(s) adicionada(s) à playlist "${playlistTitle}"`;
      if (notificationCount > 0) {
        message += ` (${notificationCount} autor(es) notificado(s))`;
      }

      success(message);
      onClose();
    } catch (error) {
      console.error("Error adding tracks to playlist:", error);
      showError("Erro ao adicionar músicas à playlist");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adicionar músicas à "${playlistTitle}"`}
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-glass-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setActiveTab("minhas");
              setSearchTerm("");
              setSelectedTracks([]);
            }}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "minhas"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="h-4 w-4" />
              Minhas Músicas
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab("publicas");
              setSearchTerm("");
              setSelectedTracks([]);
            }}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "publicas"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-4 w-4" />
              Músicas Públicas
            </div>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder={
              activeTab === "minhas"
                ? "Buscar nas suas músicas..."
                : "Buscar em músicas públicas..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Track List */}
        <div className="max-h-96 overflow-y-auto">
          <TrackList
            tracks={currentTracks}
            isLoading={currentLoading}
            searchTerm={searchTerm}
            onTrackSelect={handleToggleTrack}
            selectedTrackIds={selectedTracks}
            showPublicBadges={activeTab === "publicas"}
            emptyMessage={
              activeTab === "minhas"
                ? "Você não tem músicas disponíveis para adicionar"
                : "Nenhuma música pública disponível"
            }
            loadingMessage={
              activeTab === "minhas"
                ? "Carregando suas músicas..."
                : "Carregando músicas públicas..."
            }
            onClearSearch={() => setSearchTerm("")}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-glass-200">
          <div className="text-sm text-text-muted">
            <p>{selectedTracks.length} música(s) selecionada(s)</p>
            {activeTab === "publicas" && selectedTracks.length > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Autores serão notificados
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddTracks}
              disabled={selectedTracks.length === 0 || adding}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {adding
                ? "Adicionando..."
                : `Adicionar ${
                    selectedTracks.length > 0
                      ? `(${selectedTracks.length})`
                      : ""
                  }`}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
