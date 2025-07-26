"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGlobalAudio } from "@/contexts/global-audio-context";
import { Button } from "@/components/ui/ui-button";
import { AddToPlaylistModal } from "@/components/modals/add-to-playlist-modal";
import { AudioVisualizer } from "./audio-visualizer";
import AudioWaves from "./audio-waves";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  ListPlus,
} from "lucide-react";

export function GlobalAudioPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [showPlayerMenu, setShowPlayerMenu] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    seek,
    setVolume,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isRepeat,
    isShuffle,
    setIsRepeat,
    setIsShuffle,
    currentPlaylistTitle,
  } = useGlobalAudio();
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPlayerMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowLeft":
          if (e.shiftKey) {
            // Shift + Left = Previous track
            e.preventDefault();
            playPrevious();
          } else {
            // Left = Seek backward 10s
            e.preventDefault();
            seek(Math.max(0, currentTime - 10));
          }
          break;
        case "ArrowRight":
          if (e.shiftKey) {
            // Shift + Right = Next track
            e.preventDefault();
            playNext();
          } else {
            // Right = Seek forward 10s
            e.preventDefault();
            seek(Math.min(duration, currentTime + 10));
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [togglePlayPause, currentTime, duration, seek, playNext, playPrevious]);

  if (!mounted || !currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    setVolume(Math.max(0, Math.min(1, percentage)));
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const playerContent = (
    <div className="fixed bottom-0 left-0 right-0 z-50 audio-player-mobile">
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 audio-player-backdrop bg-white/85 dark:bg-neutral-900/85 border-t border-neutral-200/50 dark:border-neutral-700/50" />

      {/* Glassmorphism container */}
      <div className="relative bg-gradient-to-r from-white/90 via-white/95 to-white/90 dark:from-neutral-900/90 dark:via-neutral-900/95 dark:to-neutral-900/90">
        {/* Mini Player (Collapsed) */}
        {!isExpanded && (
          <div className="px-4 py-3 sm:px-6 sm:py-4">
            {/* Progress bar at top */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-neutral-200/50 dark:bg-neutral-700/50 cursor-pointer group progress-bar"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-150 ease-out group-hover:from-primary-500 group-hover:to-primary-600"
                style={{ width: `${progressPercentage}%` }}
              />
              {/* Progress thumb */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ left: `${progressPercentage}%`, marginLeft: "-6px" }}
              />
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Album Art */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-400/20 via-primary-500/30 to-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-primary-200/30 dark:border-primary-400/20 relative overflow-hidden">
                  {currentTrack.coverArt ? (
                    <img
                      src={currentTrack.coverArt}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Music className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600 dark:text-primary-400" />{" "}
                      {/* Audio visualizer overlay */}
                      <div className="absolute bottom-1 left-1 right-1">
                        <AudioVisualizer
                          isPlaying={isPlaying}
                          className="h-4"
                          size="medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* Playing animation */}
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-xl">
                      <div className="absolute inset-0 rounded-xl bg-primary-500/20 animate-pulse" />
                    </div>
                  )}
                </div>
                {/* Track Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-neutral-900 dark:text-white truncate text-sm sm:text-base leading-tight">
                    {currentTrack.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                    {currentTrack.artist}
                  </p>
                  {currentPlaylistTitle && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 truncate">
                      📋 {currentPlaylistTitle}
                    </p>
                  )}

                  {/* Time display */}
                  <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>•</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
              {/* Main Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Previous/Skip */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={playPrevious}
                  disabled={!hasPrevious}
                  className="flex w-12 h-12 sm:w-13 sm:h-13 rounded-xl text-neutral-800 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipBack
                    className="h-6 w-6 sm:h-7 sm:w-7"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </Button>
                {/* Play/Pause */}
                <Button
                  size="sm"
                  onClick={togglePlayPause}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    isPlaying ? "play-button-glow" : ""
                  }`}
                >
                  {isPlaying ? (
                    <Pause
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      fill="currentColor"
                    />
                  ) : (
                    <Play
                      className="h-7 w-7 sm:h-8 sm:w-8 ml-0.5"
                      fill="currentColor"
                    />
                  )}
                </Button>
                {/* Next/Skip */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={playNext}
                  disabled={!hasNext}
                  className="flex w-12 h-12 sm:w-13 sm:h-13 rounded-xl text-neutral-800 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SkipForward
                    className="h-6 w-6 sm:h-7 sm:w-7"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </Button>
                {/* Volume Control */}
                <div className="hidden md:flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setVolume(volume > 0 ? 0 : 1)}
                    className="w-12 h-12 rounded-xl text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50"
                  >
                    {volume > 0 ? (
                      <Volume2 className="h-6 w-6" fill="currentColor" />
                    ) : (
                      <VolumeX className="h-6 w-6" fill="currentColor" />
                    )}
                  </Button>

                  <div
                    ref={volumeRef}
                    className="w-28 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer group relative shadow-inner"
                    onClick={handleVolumeClick}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-150"
                      style={{ width: `${volume * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 border border-white dark:border-neutral-900"
                      style={{ left: `${volume * 100}%`, marginLeft: "-8px" }}
                    />
                  </div>
                </div>
                {/* Expand Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(true)}
                  className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-neutral-100/50 hover:bg-neutral-200/80 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/80 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50"
                >
                  <Maximize2 className="h-6 w-6" strokeWidth={2} />
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Expanded Player */}
        {isExpanded && (
          <div className="px-4 py-6 sm:px-6 sm:py-8 max-h-[85vh] overflow-y-auto">
            {/* Header with Volume in Top Right */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Now Playing
                </h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Volume Control in Top Right */}
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setVolume(volume > 0 ? 0 : 1)}
                    className="w-11 h-11 rounded-xl text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50"
                  >
                    {volume > 0 ? (
                      <Volume2 className="h-6 w-6" fill="currentColor" />
                    ) : (
                      <VolumeX className="h-6 w-6" fill="currentColor" />
                    )}
                  </Button>

                  <div
                    ref={volumeRef}
                    className="w-28 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer group relative shadow-inner"
                    onClick={handleVolumeClick}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-150 group-hover:from-primary-500 group-hover:to-primary-600"
                      style={{ width: `${volume * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 border-2 border-white dark:border-neutral-900"
                      style={{ left: `${volume * 100}%`, marginLeft: "-8px" }}
                    />
                  </div>

                  <span className="text-sm text-neutral-700 dark:text-neutral-300 w-12 text-right font-mono font-medium">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative" ref={menuRef}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPlayerMenu(!showPlayerMenu)}
                      className="w-10 h-10 rounded-xl text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>

                    {/* Menu dropdown */}
                    {showPlayerMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg z-50 py-2">
                        <button
                          onClick={() => {
                            setShowAddToPlaylist(true);
                            setShowPlayerMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <ListPlus className="h-4 w-4" />
                          Adicionar à Playlist
                        </button>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsExpanded(false)}
                    className="w-12 h-12 rounded-xl bg-neutral-100/50 hover:bg-neutral-200/80 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/80 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50"
                  >
                    <Minimize2 className="h-6 w-6" strokeWidth={2} />
                  </Button>
                </div>
              </div>
            </div>
            {/* Album Art & Track Info */}
            <div className="text-center mb-8">
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-primary-400/20 via-primary-500/30 to-primary-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-primary-200/30 dark:border-primary-400/20 relative overflow-hidden">
                {currentTrack.coverArt ? (
                  <img
                    src={currentTrack.coverArt}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="h-20 w-20 text-primary-600 dark:text-primary-400" />
                )}

                {/* Animated overlay when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent animate-pulse" />
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2 leading-tight">
                {currentTrack.title}
              </h3>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                {currentTrack.artist}
              </p>

              {/* Like Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                  isLiked
                    ? "text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                    : "text-neutral-500 hover:text-red-500 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>
            {/* Progress Bar */}
            <div className="mb-8">
              <div
                ref={progressRef}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full cursor-pointer mb-4 group relative overflow-hidden"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-150 ease-out group-hover:from-primary-500 group-hover:to-primary-600"
                  style={{ width: `${progressPercentage}%` }}
                />
                {/* Progress thumb */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 border-2 border-white dark:border-neutral-900"
                  style={{ left: `${progressPercentage}%`, marginLeft: "-8px" }}
                />
              </div>
              <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>{" "}
            </div>

            {/* Audio Waves - Prominent display */}
            <div className="mb-8 flex justify-center">
              <AudioWaves isPlaying={isPlaying} className="px-4" />
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 mb-6">
              {/* Shuffle */}
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`w-14 h-14 rounded-xl transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 ${
                  isShuffle
                    ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                }`}
              >
                <Shuffle className="h-6 w-6" />
              </Button>{" "}
              {/* Previous */}
              <Button
                size="lg"
                variant="ghost"
                onClick={playPrevious}
                disabled={!hasPrevious}
                className="w-16 h-16 rounded-xl text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipBack className="h-7 w-7" fill="currentColor" />
              </Button>
              {/* Play/Pause */}
              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    className="h-9 w-9 sm:h-10 sm:w-10 ml-1"
                    fill="currentColor"
                  />
                )}
              </Button>{" "}
              {/* Next */}
              <Button
                size="lg"
                variant="ghost"
                onClick={playNext}
                disabled={!hasNext}
                className="w-16 h-16 rounded-xl text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SkipForward className="h-7 w-7" fill="currentColor" />
              </Button>
              {/* Repeat */}
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`w-14 h-14 rounded-xl transition-all duration-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 ${
                  isRepeat
                    ? "text-primary-600 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80"
                }`}
              >
                <Repeat className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {createPortal(playerContent, document.body)}

      {/* Modal para adicionar à playlist */}
      {showAddToPlaylist && currentTrack && (
        <AddToPlaylistModal
          isOpen={showAddToPlaylist}
          onClose={() => setShowAddToPlaylist(false)}
          trackId={currentTrack.id || ""}
          trackTitle={currentTrack.title}
        />
      )}
    </>
  );
}
