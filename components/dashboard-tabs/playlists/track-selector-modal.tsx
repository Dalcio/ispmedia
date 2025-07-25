"use client";

import { useState, useEffect, useMemo } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useTracks } from "@/contexts/tracks-context";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Plus, Search } from "lucide-react";

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
  const { tracks: allTracks, loading } = useTracks();
  const { success, error: showError } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);

  // Reset search and selection when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setSelectedTracks([]);
    }
  }, [isOpen]); // Filter tracks that are not already in the playlist
  const availableTracks = useMemo(() => {
    const filtered = allTracks.filter(
      (track) => !existingTrackIds.includes(track.id)
    );
    // Reduce logging to prevent spam
    if (Math.random() < 0.1) {
      // Only log 10% of the time
      console.log("🎵 TrackSelector: Available tracks:", filtered.length);
      console.log(
        "🎵 TrackSelector: Total tracks from context:",
        allTracks.length
      );
      console.log("🎵 TrackSelector: Existing track IDs:", existingTrackIds);
    }
    return filtered;
  }, [allTracks, existingTrackIds]);

  // Filter tracks based on search term
  const filteredTracks = useMemo(() => {
    if (searchTerm.trim() === "") {
      return availableTracks;
    }

    const filtered = availableTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (track.artist &&
          track.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        track.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(
      `🔍 TrackSelector: Search "${searchTerm}" found ${filtered.length} tracks`
    );
    return filtered;
  }, [availableTracks, searchTerm]);

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

    setAdding(true);
    try {
      const playlistRef = doc(db, "playlists", playlistId);
      await updateDoc(playlistRef, {
        tracks: arrayUnion(...selectedTracks),
        updatedAt: new Date(),
      });

      success(
        `${selectedTracks.length} música(s) adicionada(s) à playlist "${playlistTitle}"`
      );
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
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Buscar por título, artista ou gênero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Lista de músicas */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
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
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-8">
              <Music className="w-12 h-12 mx-auto mb-4 text-text-muted" />{" "}
              <p className="text-text-muted mb-2">
                {searchTerm
                  ? `Nenhuma música encontrada para "${searchTerm}"`
                  : availableTracks.length === 0
                  ? "Você ainda não tem músicas enviadas"
                  : "Todas as suas músicas já estão nesta playlist"}
              </p>
              {availableTracks.length === 0 && allTracks.length === 0 && (
                <p className="text-text-muted text-sm">
                  Envie algumas músicas primeiro para poder adicioná-las às
                  playlists
                </p>
              )}
            </div>
          ) : (
            filteredTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => handleToggleTrack(track.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTracks.includes(track.id)
                    ? "bg-primary-50 border border-primary-200"
                    : "bg-glass-50 hover:bg-glass-100 border border-transparent"
                }`}
              >
                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="h-5 w-5 text-primary-500" />
                </div>

                <div className="flex-1 min-w-0">
                  {" "}
                  <h4 className="font-medium text-text-primary truncate">
                    {track.title}
                  </h4>
                  <p className="text-sm text-text-muted truncate">
                    {track.artist || "Artista"} • {track.genre}
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
            ))
          )}{" "}
        </div>{" "}
        {/* Debug info - only in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded space-y-1">
            <div>
              Debug: Total tracks: {allTracks.length} | Available:{" "}
              {availableTracks.length} | Filtered: {filteredTracks.length} |
              Loading: {loading.toString()}
            </div>
            <div>All track IDs: {allTracks.map((t) => t.id).join(", ")}</div>
            <div>Existing track IDs: {existingTrackIds.join(", ")}</div>
            {allTracks.length > 0 && (
              <div>
                Sample track: {allTracks[0].title} (ID: {allTracks[0].id})
              </div>
            )}
          </div>
        )}
        {/* Ações */}
        <div className="flex items-center justify-between pt-4 border-t border-glass-200">
          <p className="text-sm text-text-muted">
            {selectedTracks.length} música(s) selecionada(s)
          </p>

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
