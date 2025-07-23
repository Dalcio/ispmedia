"use client";

import React from "react";
import AudioPlayer from "./audio-player";

// Mock tracks para demonstração
const demoTracks = [
  {
    id: "demo-1",
    title: "Summer Vibes",
    artist: "ISPmedia Artist",
    album: "Demo Collection",
    duration: 215,
    url: "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3",
    coverArt: "/placeholder-cover.jpg",
  },
  {
    id: "demo-2",
    title: "Electronic Dreams",
    artist: "Digital Creator",
    album: "Future Sounds",
    duration: 180,
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverArt: "/placeholder-cover.jpg",
  },
  {
    id: "demo-3",
    title: "Acoustic Sunrise",
    artist: "Morning Band",
    album: "Natural Rhythms",
    duration: 240,
    url: "https://www.soundjay.com/misc/sounds/magic-chime-02.mp3",
    coverArt: "/placeholder-cover.jpg",
  },
];

interface AudioPlayerDemoProps {
  autoPlay?: boolean;
  className?: string;
}

const AudioPlayerDemo: React.FC<AudioPlayerDemoProps> = ({
  autoPlay = false,
  className = "",
}) => {
  return (
    <div className={`audio-player-demo max-w-4xl mx-auto ${className}`}>
      {/* Informações da Demo */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🎵 ISPmedia Audio Player Demo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="text-2xl mb-2">▶️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Play/Pause
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Controle de reprodução suave
            </p>
          </div>

          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Seek & Progress
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Navegação precisa na música
            </p>
          </div>

          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="text-2xl mb-2">🎛️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Volume Control
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Controle de volume responsivo
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            🔧 Funcionalidades Implementadas:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>
              • <strong>Play/Pause/Stop:</strong> Controles básicos de
              reprodução
            </li>
            <li>
              • <strong>Seek:</strong> Navegação por clique na barra de
              progresso
            </li>
            <li>
              • <strong>Volume:</strong> Controle de volume com slider
              interativo
            </li>
            <li>
              • <strong>Repeat/Shuffle:</strong> Modos de reprodução avançados
            </li>
            <li>
              • <strong>Next/Previous:</strong> Navegação entre faixas da
              playlist
            </li>
            <li>
              • <strong>Responsive:</strong> Interface adaptativa para mobile e
              desktop
            </li>
            <li>
              • <strong>Glassmorphism:</strong> Efeito visual moderno com
              backdrop-blur
            </li>
            <li>
              • <strong>Animações:</strong> Transições suaves e feedback visual
            </li>
          </ul>
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
            🚀 Preparado para Firebase:
          </h4>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            O player está estruturado para integração futura com Firebase
            Storage. Substitua as URLs mockadas por URLs do Firebase quando
            estiver pronto.
          </p>
        </div>
      </div>

      {/* Player de Áudio */}
      <AudioPlayer
        playlist={demoTracks}
        autoPlay={autoPlay}
        className="demo-player"
      />

      {/* Playlist Visual (opcional) */}
      <div className="mt-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📋 Playlist Demo
        </h3>

        <div className="space-y-3">
          {demoTracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {track.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {track.artist} • {track.album}
                </p>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {Math.floor(track.duration / 60)}:
                {(track.duration % 60).toString().padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerDemo;
