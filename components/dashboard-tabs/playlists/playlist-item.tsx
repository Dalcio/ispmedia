"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { doc, updateDoc, arrayRemove, getDoc, getDocs, query, where, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useTracks, type Track } from "@/contexts/tracks-context";
import { useGlobalAudio } from "@/contexts/global-audio-context";
import { useToast } from "@/hooks/use-toast";
import { TrackSelectorModal } from "./track-selector-modal";
import { Button } from "@/components/ui/ui-button";
import {
  ListMusic,
  Music,
  Lock,
  Globe,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Play,
  Clock,
  Calendar,
  Plus,
  X,
  User,
} from "lucide-react";

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

interface PlaylistItemProps {
  playlist: Playlist;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlaylistItem({
  playlist,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: PlaylistItemProps) {
  const { tracks: allTracks, loading: tracksLoading } = useTracks();
  const { playTrack } = useGlobalAudio();
  const { success, error: showError } = useToast();
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  const [missingTracks, setMissingTracks] = useState<Track[]>([]);
  const [loadingMissingTracks, setLoadingMissingTracks] = useState(false);
  // Load missing tracks that aren't in the user's tracks context
  useEffect(() => {
    if (!playlist.tracks || playlist.tracks.length === 0) {
      setMissingTracks([]);
      return;
    }

    const loadMissingTracks = async () => {
      const availableTrackIds = allTracks.map((t) => t.id);
      const missingTrackIds = playlist.tracks.filter(
        (id) => !availableTrackIds.includes(id)
      );

      if (missingTrackIds.length === 0) {
        setMissingTracks([]);
        return;
      }

      console.log("🔍 Loading missing tracks for playlist:", {
        playlistId: playlist.id,
        missingTrackIds: missingTrackIds.length,
      });

      setLoadingMissingTracks(true);
      try {
        // Load tracks that are missing from user's context (public tracks from others)
        const missingTracksData: Track[] = [];

        // Batch load missing tracks
        for (const trackId of missingTrackIds) {
          try {
            const trackDoc = await getDoc(doc(db, "tracks", trackId));
            if (trackDoc.exists()) {
              const trackData = trackDoc.data();
              missingTracksData.push({
                id: trackDoc.id,
                title: trackData.title || "Título desconhecido",
                artist:
                  trackData.artist || trackData.artistName || "Artista desconhecido",
                createdBy: trackData.createdBy || "",
                genre: trackData.genre || "Gênero desconhecido",
                audioUrl: trackData.audioUrl || "",
                fileName: trackData.fileName || "",
                fileSize: trackData.fileSize || 0,
                duration: trackData.duration,
                createdAt: trackData.createdAt,
                mimeType: trackData.mimeType || "",
                playCount: trackData.playCount || 0,
                isPublic: trackData.isPublic || false,
              });
            }
          } catch (error) {
            console.error(`Failed to load track ${trackId}:`, error);
          }
        }

        console.log("✅ Loaded missing tracks:", missingTracksData.length);
        setMissingTracks(missingTracksData);
      } catch (error) {
        console.error("Error loading missing tracks:", error);
        setMissingTracks([]);
      } finally {
        setLoadingMissingTracks(false);
      }
    };

    loadMissingTracks();
  }, [
    playlist.tracks?.join(','), 
    allTracks.map(t => t.id).sort().join(','), 
    playlist.id
  ]);

  // Create stable reference for tracks data for memoization
  const tracksDataKey = useMemo(
    () => ({
      length: allTracks.length,
      ids: allTracks
        .map((t) => t.id)
        .sort()
        .join(","),
      playlistLength: playlist.tracks?.length || 0,
      playlistIds: playlist.tracks?.join(",") || "",
      playlistId: playlist.id,
    }),
    [
      allTracks.length,
      allTracks
        .map((t) => t.id)
        .sort()
        .join(","),
      playlist.tracks?.length,
      playlist.tracks?.join(","),
      playlist.id,
    ]
  );  // Get tracks that belong to this playlist using the context + missing tracks
  const playlistTracks = useMemo(() => {
    if (!playlist.tracks || playlist.tracks.length === 0) {
      return [];
    }

    // Combine user tracks from context with missing tracks loaded from Firestore
    const allAvailableTracks = [...allTracks, ...missingTracks];
    
    const tracks = allAvailableTracks.filter((track) =>
      playlist.tracks.includes(track.id)
    );

    // Sort tracks by the order they appear in the playlist.tracks array
    const sortedTracks = playlist.tracks
      .map(trackId => tracks.find(track => track.id === trackId))
      .filter(Boolean) as Track[];

    console.log("🎵 Playlist tracks resolved:", {
      playlistId: playlist.id,
      totalInPlaylist: playlist.tracks.length,
      userTracks: allTracks.length,
      missingTracks: missingTracks.length,
      resolvedTracks: sortedTracks.length,
      loadingMissing: loadingMissingTracks
    });

    return sortedTracks;
  }, [
    playlist.tracks,
    allTracks,
    missingTracks,
    playlist.id,
    loadingMissingTracks
  ]);

  // Separate tracks into user's own tracks and public tracks from others
  const { userOwnTracks, publicTracks } = useMemo(() => {
    const userOwnTracks: Track[] = [];
    const publicTracks: Track[] = [];

    playlistTracks.forEach((track) => {
      // Check if track is from allTracks (user's own tracks) or missingTracks (public tracks from others)
      const isUserTrack = allTracks.some(userTrack => userTrack.id === track.id);
      
      if (isUserTrack) {
        userOwnTracks.push(track);
      } else {
        publicTracks.push(track);
      }
    });

    return { userOwnTracks, publicTracks };
  }, [playlistTracks, allTracks]);
  const formatDate = useCallback((timestamp: any) => {
    if (!timestamp) return "Data desconhecida";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Data inválida";
    }
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getTotalDuration = useMemo(() => {
    return playlistTracks.reduce(
      (total, track) => total + (track.duration || 0),
      0
    );
  }, [playlistTracks]);
  const handlePlayTrack = useCallback(
    (track: Track) => {
      playTrack(track, playlistTracks, playlist.title);
    },
    [playTrack, playlistTracks, playlist.title]
  );

  const handleRemoveTrack = useCallback(
    async (trackId: string, trackTitle: string) => {
      try {
        const playlistRef = doc(db, "playlists", playlist.id);
        await updateDoc(playlistRef, {
          tracks: arrayRemove(trackId),
          updatedAt: new Date(),
        });

        success(`"${trackTitle}" removida da playlist`);
      } catch (error) {
        console.error("Error removing track from playlist:", error);
        showError("Erro ao remover música da playlist");
      }
    },
    [playlist.id, success, showError]
  );
  const handleAddTracks = useCallback(() => {
    setShowTrackSelector(true);
  }, []);

  const handlePlayPlaylist = useCallback(() => {
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks, playlist.title);
    }
  }, [playTrack, playlistTracks, playlist.title]);

  return (
    <div className="group bg-glass-100 hover:bg-glass-200 rounded-xl transition-all duration-200 overflow-hidden">
      {/* Header da playlist */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Ícone da playlist */}
          <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <ListMusic className="h-6 w-6 text-primary-500" />
          </div>
          {/* Informações da playlist */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-text-primary truncate">
                {playlist.title}
              </h4>
              <div className="flex items-center gap-1">
                {playlist.visibility === "public" ? (
                  <div title="Pública">
                    <Globe className="h-3 w-3 text-success-500" />
                  </div>
                ) : (
                  <div title="Privada">
                    <Lock className="h-3 w-3 text-text-muted" />
                  </div>
                )}
              </div>
            </div>

            {playlist.description && (
              <p className="text-sm text-text-muted mb-2 line-clamp-2">
                {playlist.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <Music className="h-3 w-3" />
                <span>{playlist.tracks.length} músicas</span>
              </div>
              {isExpanded && playlistTracks.length > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(getTotalDuration)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(playlist.createdAt)}</span>
              </div>
            </div>
          </div>
          {/* Ações */}
          <div className="flex items-center gap-2">
            {/* Botão Play Playlist */}
            {playlistTracks.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handlePlayPlaylist}
                className="text-text-muted hover:text-primary-500 hover:bg-primary-500/10 flex items-center gap-1"
                title="Reproduzir playlist"
              >
                <Play className="h-4 w-4" fill="currentColor" />
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleExpand}
              className="text-text-muted hover:text-text-primary hover:bg-glass-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="text-text-muted hover:text-info-500 hover:bg-info-500/10"
              >
                <Edit className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="text-text-muted hover:text-error-500 hover:bg-error-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Lista de faixas expandida */}
      {isExpanded && (
        <div className="border-t border-glass-200 bg-glass-50">          {tracksLoading || loadingMissingTracks ? (
            <div className="p-4 space-y-3">
              <div className="text-xs text-text-muted mb-2">
                {loadingMissingTracks ? "Carregando músicas da playlist..." : "Carregando suas músicas..."}
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-glass-200 rounded" />
                  <div className="flex-1">
                    <div className="h-3 bg-glass-200 rounded w-2/3 mb-1" />
                    <div className="h-2 bg-glass-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : playlist.tracks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-glass-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-text-muted" />
              </div>
              <p className="text-text-muted text-sm mb-4">
                Esta playlist está vazia
              </p>
              <Button
                onClick={handleAddTracks}
                className="inline-flex items-center gap-2 py-3 px-6 bg-glass-100 hover:bg-glass-200 backdrop-blur-sm border border-glass-200 rounded-xl text-text-primary font-semibold transition-all duration-200 hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Adicionar a primeira música
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Botões de ação */}
              <div className="p-4 border-b border-glass-200 space-y-2">
                {/* Botão reproduzir playlist */}
                <Button
                  onClick={handlePlayPlaylist}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  Reproduzir Playlist
                </Button>

                {/* Botão adicionar mais músicas */}
                <Button
                  onClick={handleAddTracks}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-glass-100 hover:bg-glass-200 backdrop-blur-sm border border-glass-200 rounded-lg text-text-primary text-sm font-medium transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar música
                </Button>
              </div>              {/* Lista de músicas */}
              <div className="p-4 space-y-4">
                {/* Seção: Suas músicas */}
                {userOwnTracks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-glass-100">
                      <User className="h-4 w-4 text-primary-500" />
                      <h6 className="text-sm font-medium text-text-primary">
                        Suas músicas ({userOwnTracks.length})
                      </h6>
                    </div>
                    <div className="space-y-2">
                      {userOwnTracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="group/track flex items-center gap-3 p-3 hover:bg-glass-100 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-primary-500/10 rounded flex items-center justify-center text-xs text-primary-600 font-medium">
                            {playlistTracks.findIndex(t => t.id === track.id) + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-text-primary truncate">
                              {track.title}
                            </h5>
                            <p className="text-xs text-text-muted truncate">
                              {track.artist || track.genre}
                            </p>
                          </div>

                          {track.duration && (
                            <span className="text-xs text-text-muted">
                              {formatDuration(track.duration)}
                            </span>
                          )}

                          <div className="opacity-0 group-hover/track:opacity-100 transition-opacity flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePlayTrack(track)}
                              className="text-text-muted hover:text-primary-500 hover:bg-primary-500/10"
                            >
                              <Play className="h-3 w-3" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTrack(track.id, track.title)}
                              className="text-text-muted hover:text-error-500 hover:bg-error-500/10"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção: Músicas públicas de outros usuários */}
                {publicTracks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-glass-100">
                      <Globe className="h-4 w-4 text-success-500" />
                      <h6 className="text-sm font-medium text-text-primary">
                        Músicas públicas ({publicTracks.length})
                      </h6>
                    </div>
                    <div className="space-y-2">
                      {publicTracks.map((track, index) => (
                        <div
                          key={track.id}
                          className="group/track flex items-center gap-3 p-3 hover:bg-glass-100 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-success-500/10 rounded flex items-center justify-center text-xs text-success-600 font-medium">
                            {playlistTracks.findIndex(t => t.id === track.id) + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-text-primary truncate">
                              {track.title}
                            </h5>                            <p className="text-xs text-text-muted truncate">
                              {track.artist || track.genre}
                            </p>
                          </div>

                          {track.duration && (
                            <span className="text-xs text-text-muted">
                              {formatDuration(track.duration)}
                            </span>
                          )}

                          <div className="opacity-0 group-hover/track:opacity-100 transition-opacity flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handlePlayTrack(track)}
                              className="text-text-muted hover:text-primary-500 hover:bg-primary-500/10"
                            >
                              <Play className="h-3 w-3" />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTrack(track.id, track.title)}
                              className="text-text-muted hover:text-error-500 hover:bg-error-500/10"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensagem quando nenhuma música foi carregada */}
                {userOwnTracks.length === 0 && publicTracks.length === 0 && playlist.tracks.length > 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-text-muted">
                      {loadingMissingTracks 
                        ? "Carregando músicas da playlist..." 
                        : "Não foi possível carregar as músicas desta playlist"}
                    </p>
                  </div>
                )}

                {/* Indicador de músicas não carregadas */}
                {playlist.tracks.length > playlistTracks.length && (
                  <div className="text-center pt-2 border-t border-glass-100">
                    <p className="text-xs text-text-muted">
                      e mais {playlist.tracks.length - playlistTracks.length}
                      músicas não carregadas...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Modal de seleção de músicas */}
      <TrackSelectorModal
        isOpen={showTrackSelector}
        onClose={() => setShowTrackSelector(false)}
        playlistId={playlist.id}
        playlistTitle={playlist.title}
        existingTrackIds={playlist.tracks}
      />
    </div>
  );
}
