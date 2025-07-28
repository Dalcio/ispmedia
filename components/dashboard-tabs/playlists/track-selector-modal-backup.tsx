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
  const { tracks: userTracks, loading: userTracksLoading } = useTracks();
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  // State
  const [activeTab, setActiveTab] = useState<"minhas" | "publicas">("minhas");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [publicTracks, setPublicTracks] = useState<any[]>([]);
  const [publicTracksLoading, setPublicTracksLoading] = useState(false);  // Load public tracks when switching to public tab (exact search-modal logic)
  useEffect(() => {
    if (!isOpen || !user || activeTab !== "publicas") {
      return;
    }

    const loadPublicTracks = async () => {
      setPublicTracksLoading(true);
      try {
        console.log("🎵 TrackSelector: Loading public tracks...");
        
        // EXACT search-modal logic: Query for public tracks only with limit
        const tracksRef = collection(db, "tracks");
        const publicTracksQuery = query(
          tracksRef,
          where("isPublic", "==", true),
          limit(50)  // Same limit as search-modal
        );
        
        const allSnapshot = await getDocs(publicTracksQuery);
        console.log("🎵 Total public tracks found:", allSnapshot.size);

        if (allSnapshot.size === 0) {
          console.log("⚠️ No public tracks found");
          setPublicTracks([]);
          return;
        }

        // Map all public tracks with EXACT same structure as search-modal
        const allPublicTracks = allSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            genre: data.genre || "",
            audioUrl: data.audioUrl || "",
            fileName: data.fileName || "",
            fileSize: data.fileSize || 0,
            duration: data.duration,
            createdAt: data.createdAt,
            mimeType: data.mimeType || "",
            artistName: data.artistName,  // Use artistName like search-modal
            artist: data.artist || data.artistName || "",  // Keep compatibility
            userUid: data.createdBy,  // Use userUid like search-modal
            createdBy: data.createdBy,  // Keep compatibility
            isPublic: data.isPublic,
          };
        });

        // Filter out user's own tracks (same logic as search-modal)
        const tracksFromOthers = allPublicTracks.filter((track) => track.userUid !== user.uid);
        
        console.log("✅ Public tracks from others:", tracksFromOthers.length);
        console.log("🎵 Sample public tracks:", tracksFromOthers.slice(0, 3));

        setPublicTracks(tracksFromOthers);
      } catch (error) {
        console.error("❌ Error loading public tracks:", error);
        showError("Erro ao carregar músicas públicas");
        setPublicTracks([]);
      } finally {
        setPublicTracksLoading(false);
      }
    };

    loadPublicTracks();
  }, [isOpen, user, activeTab, showError]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedTracks([]);
      setActiveTab("minhas");
    }
  }, [isOpen]);

  // Filter user tracks (all tracks - public and private)
  const availableUserTracks = useMemo(() => {
    return userTracks.filter((track) => !existingTrackIds.includes(track.id));
  }, [userTracks, existingTrackIds]);

  // Filter public tracks (exclude existing)
  const availablePublicTracks = useMemo(() => {
    return publicTracks.filter((track) => !existingTrackIds.includes(track.id));
  }, [publicTracks, existingTrackIds]);  // Search in user tracks (exact search-modal logic)
  const filteredUserTracks = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableUserTracks;
    }

    console.log("🎵 TrackSelector: Searching user tracks for:", searchTerm);
    const searchLower = searchTerm.toLowerCase();
    
    const filtered = availableUserTracks.filter((track) => {
      const title = (track.title || "").toLowerCase();
      const genre = (track.genre || "").toLowerCase();
      const artist = (track.artist || "").toLowerCase();

      // EXACT search-modal logic: search in title, genre, and artist
      return (
        title.includes(searchLower) ||
        genre.includes(searchLower) ||
        artist.includes(searchLower)
      );
    });

    console.log("🎵 Filtered user tracks:", filtered.length);
    return filtered;
  }, [availableUserTracks, searchTerm]);

  // Search in public tracks (exact search-modal logic)
  const filteredPublicTracks = useMemo(() => {
    if (!searchTerm.trim()) {
      return availablePublicTracks;
    }

    console.log("🎵 TrackSelector: Searching public tracks for:", searchTerm);
    const searchLower = searchTerm.toLowerCase();
    
    const filtered = availablePublicTracks.filter((track) => {
      const title = (track.title || "").toLowerCase();
      const genre = (track.genre || "").toLowerCase();
      const artist = (track.artist || track.artistName || "").toLowerCase();

      // EXACT search-modal logic: search in title, genre, and artist
      const matches = title.includes(searchLower) ||
                     genre.includes(searchLower) ||
                     artist.includes(searchLower);

      if (matches) {
        console.log("🔍 Found match:", { title: track.title, artist: track.artist, genre: track.genre });
      }

      return matches;
    });

    console.log("🔍 Filtered public tracks:", filtered.length);
    return filtered;
  }, [availablePublicTracks, searchTerm]);
  // Get current tracks based on active tab
  const currentTracks = activeTab === "minhas" ? filteredUserTracks : filteredPublicTracks;
  const currentLoading = activeTab === "minhas" ? userTracksLoading : publicTracksLoading;

  // Debug logging (enhanced from search-modal approach)
  useEffect(() => {
    if (!currentLoading) {
      console.log("🎵 TrackSelector: Data summary:");
      console.log("  - Active tab:", activeTab);
      console.log("  - Search term:", searchTerm);
      console.log("  - User tracks:", userTracks.length);
      console.log("  - Available user tracks:", availableUserTracks.length);
      console.log("  - Public tracks loaded:", publicTracks.length);
      console.log("  - Available public tracks:", availablePublicTracks.length);
      console.log("  - Filtered user tracks:", filteredUserTracks.length);
      console.log("  - Filtered public tracks:", filteredPublicTracks.length);
      console.log("  - Current tracks displayed:", currentTracks.length);
      
      if (activeTab === "publicas" && publicTracks.length > 0) {
        console.log("  - Sample public tracks:", publicTracks.slice(0, 2));
      }
    }
  }, [
    currentLoading, 
    activeTab, 
    searchTerm, 
    userTracks.length, 
    availableUserTracks.length, 
    publicTracks.length, 
    availablePublicTracks.length,
    filteredUserTracks.length,
    filteredPublicTracks.length,
    currentTracks.length,
    publicTracks
  ]);

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
      });      // Send notifications for public tracks from other users (exact search-modal compatibility)
      const allTracks = [...availableUserTracks, ...availablePublicTracks];
      const notificationPromises = selectedTracks.map(async (trackId) => {
        const track = allTracks.find((t: any) => t.id === trackId);
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
        const track = allTracks.find((t: any) => t.id === trackId);
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

  const formatDuration = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
        <div className="max-h-96 overflow-y-auto space-y-2">
          {currentLoading ? (
            <div className="space-y-3">
              <div className="text-center py-4">
                <p className="text-sm text-text-muted">
                  {activeTab === "minhas"
                    ? "Carregando suas músicas..."
                    : "Carregando músicas públicas..."}
                </p>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto mt-2"></div>
              </div>
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
          ) : currentTracks.length === 0 ? (
            <div className="text-center py-8">
              <Music className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted mb-2">
                {searchTerm
                  ? `Nenhuma música encontrada para "${searchTerm}"`
                  : activeTab === "minhas"
                  ? "Você não tem músicas disponíveis para adicionar"
                  : "Nenhuma música pública disponível"}
              </p>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Limpar busca
                </Button>
              )}
              {!searchTerm && activeTab === "minhas" && userTracks.length === 0 && (
                <p className="text-text-muted text-sm">
                  Envie algumas músicas primeiro
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {currentTracks.map((track: any) => (
                <div
                  key={track.id}
                  onClick={() => handleToggleTrack(track.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTracks.includes(track.id)
                      ? "bg-primary-50 border border-primary-200"
                      : "bg-glass-50 hover:bg-glass-100 border border-transparent"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activeTab === "minhas"
                        ? "bg-primary-500/10"
                        : "bg-blue-500/10"
                    }`}
                  >
                    <Music
                      className={`h-5 w-5 ${
                        activeTab === "minhas" ? "text-primary-500" : "text-blue-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-text-primary truncate">
                        {track.title}
                      </h4>
                      {activeTab === "minhas" ? (
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                            track.isPublic
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          <User className="h-3 w-3" />
                          {track.isPublic ? "Pública" : "Privada"}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                          <Globe className="h-3 w-3" />
                          Pública
                        </div>
                      )}
                    </div>                    <p className="text-sm text-text-muted truncate">
                      {track.artist || track.artistName || "Artista"} • {track.genre || "Gênero"}
                    </p>
                  </div>

                  {track.duration && (
                    <span className="text-xs text-text-muted">
                      {formatDuration(track.duration)}
                    </span>
                  )}

                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedTracks.includes(track.id)
                        ? "bg-primary-500 border-primary-500"
                        : "border-glass-300"
                    }`}
                  >
                    {selectedTracks.includes(track.id) && (
                      <Plus className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
