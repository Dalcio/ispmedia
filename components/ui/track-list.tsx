"use client";

import { Music, User, Globe, Plus, Check } from "lucide-react";
import { TrackResult } from "@/hooks/use-track-search";
import { Button } from "@/components/ui/ui-button";

interface TrackListProps {
  tracks: TrackResult[];
  isLoading?: boolean;
  emptyMessage?: string;
  searchTerm?: string;
  onTrackSelect?: (trackId: string) => void;
  selectedTrackIds?: string[];
  showPublicBadges?: boolean;
  loadingMessage?: string;
  onClearSearch?: () => void;
  className?: string;
}

export function TrackList({
  tracks,
  isLoading = false,
  emptyMessage = "Nenhuma música encontrada",
  searchTerm = "",
  onTrackSelect,
  selectedTrackIds = [],
  showPublicBadges = false,
  loadingMessage = "Carregando músicas...",
  onClearSearch,
  className = "",
}: TrackListProps) {
  const formatDuration = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="text-center py-4">
          <p className="text-sm text-text-muted">{loadingMessage}</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto mt-2"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
            <div className="w-10 h-10 bg-glass-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-glass-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-glass-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Music className="w-12 h-12 mx-auto mb-4 text-text-muted" />
        <p className="text-text-muted mb-2">
          {searchTerm
            ? `Nenhuma música encontrada para "${searchTerm}"`
            : emptyMessage}
        </p>
        {searchTerm && onClearSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSearch}
            className="mt-2"
          >
            Limpar busca
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {tracks.map((track) => {
        const isSelected = selectedTrackIds.includes(track.id);
        const isUserTrack = !showPublicBadges; // If not showing public badges, assume user tracks
        
        return (
          <div
            key={track.id}
            onClick={() => onTrackSelect?.(track.id)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
              onTrackSelect ? "cursor-pointer" : ""
            } ${
              isSelected
                ? "bg-primary-50 border border-primary-200"
                : "bg-glass-50 hover:bg-glass-100 border border-transparent"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isUserTrack
                  ? "bg-primary-500/10"
                  : "bg-blue-500/10"
              }`}
            >
              <Music
                className={`h-5 w-5 ${
                  isUserTrack ? "text-primary-500" : "text-blue-500"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-text-primary truncate">
                  {track.title}
                </h4>
                {isUserTrack ? (
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
              </div>
              <p className="text-sm text-text-muted truncate">
                {track.artist || track.artistName || "Artista"} • {track.genre || "Gênero"}
              </p>
            </div>

            {track.duration && (
              <span className="text-xs text-text-muted">
                {formatDuration(track.duration)}
              </span>
            )}

            {onTrackSelect && (
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected
                    ? "bg-primary-500 border-primary-500"
                    : "border-glass-300"
                }`}
              >
                {isSelected && (
                  <Check className="h-3 w-3 text-white" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
