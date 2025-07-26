"use client";

import React, { useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
} from "lucide-react";
import { useAudioPlayer, type AudioTrack } from "@/hooks/use-audio-player";

// Props do componente
interface AudioPlayerProps {
  track?: AudioTrack;
  playlist?: AudioTrack[];
  autoPlay?: boolean;
  showPlaylist?: boolean;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  track,
  playlist,
  autoPlay = false,
  showPlaylist = false,
  className = "",
}) => {
  // Hook do player de áudio
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isRepeat,
    isShuffle,
    isLoading,
    error,
    currentTrack,
    audioRef,
    play,
    pause,
    stop,
    seek,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    loadPlaylist,
    loadTrack,
    formatTime,
    getProgressPercentage,
  } = useAudioPlayer(playlist);

  const progressRef = useRef<HTMLDivElement>(null);

  // Carregar track específico se fornecido
  useEffect(() => {
    if (track) {
      loadTrack(track);
    }
  }, [track, loadTrack]);

  // Auto play effect
  useEffect(() => {
    if (autoPlay && currentTrack) {
      play();
    }
  }, [autoPlay, currentTrack, play]);

  // Função para clique na barra de progresso
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    seek(newTime);
  };

  // Função para mudança de volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!currentTrack) {
    return null;
  }

  const progressPercentage = getProgressPercentage();

  return (
    <div className={`audio-player ${className}`}>
      {/* Audio element - hidden */}
      <audio ref={audioRef} preload="metadata" />

      {/* Player Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1 lg:max-w-xs">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex-shrink-0 shadow-lg">
                {currentTrack.coverArt ? (
                  <img
                    src={currentTrack.coverArt}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Pulse animation when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-primary-500/20 animate-pulse" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
              {/* Control Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isShuffle
                      ? "text-primary-500 bg-primary-100 dark:bg-primary-900/30 scale-110"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  title="Modo aleatório"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={previousTrack}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  title="Música anterior"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlayPause}
                  disabled={isLoading}
                  className="p-3 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  title={isPlaying ? "Pausar" : "Reproduzir"}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={stop}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  title="Parar"
                >
                  <Square className="w-5 h-5" />
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  title="Próxima música"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isRepeat
                      ? "text-primary-500 bg-primary-100 dark:bg-primary-900/30 scale-110"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  title="Repetir"
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] font-mono">
                  {formatTime(currentTime)}
                </span>

                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group relative"
                >
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full relative transition-all duration-150 group-hover:h-1.5"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </div>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px] font-mono">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-end max-w-xs">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                title={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <div className="relative group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer slider"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-bottom duration-300">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fdc500;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(253, 197, 0, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fdc500;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 768px) {
          .audio-player .lg\\:max-w-xs {
            max-width: none;
          }

          .audio-player .lg\\:flex {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;
