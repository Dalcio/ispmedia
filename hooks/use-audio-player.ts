'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// Interface para o track de áudio
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverArt?: string;
}

// Interface para o estado do player
interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isRepeat: boolean;
  isShuffle: boolean;
  isLoading: boolean;
  error: string | null;
  currentTrack: AudioTrack | null;
  playlist: AudioTrack[];
  currentTrackIndex: number;
}

// Hook customizado para o player de áudio
export const useAudioPlayer = (initialPlaylist: AudioTrack[] = []) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isRepeat: false,
    isShuffle: false,
    isLoading: false,
    error: null,
    currentTrack: initialPlaylist[0] || null,
    playlist: initialPlaylist,
    currentTrackIndex: 0
  });

  // Atualizar estado de forma segura
  const updateState = useCallback((updates: Partial<PlayerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Função para tocar áudio
  const play = useCallback(async () => {
    if (!audioRef.current || !state.currentTrack) return;
    
    try {
      updateState({ isLoading: true, error: null });
      await audioRef.current.play();
      updateState({ isPlaying: true, isLoading: false });
    } catch (err) {
      updateState({ 
        error: 'Erro ao reproduzir áudio', 
        isLoading: false 
      });
      console.error('Erro ao reproduzir:', err);
    }
  }, [state.currentTrack, updateState]);

  // Função para pausar áudio
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    updateState({ isPlaying: false });
  }, [updateState]);

  // Função para parar áudio
  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    updateState({ isPlaying: false, currentTime: 0 });
  }, [updateState]);

  // Função para buscar posição específica
  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    updateState({ currentTime: time });
  }, [updateState]);

  // Função para alternar play/pause
  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  // Função para próxima música
  const nextTrack = useCallback(() => {
    if (state.playlist.length === 0) return;

    let nextIndex;
    if (state.isShuffle) {
      nextIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
    }

    const nextTrack = state.playlist[nextIndex];
    updateState({
      currentTrack: nextTrack,
      currentTrackIndex: nextIndex,
      currentTime: 0
    });
  }, [state.playlist, state.currentTrackIndex, state.isShuffle, updateState]);

  // Função para música anterior
  const previousTrack = useCallback(() => {
    if (state.playlist.length === 0) return;

    let prevIndex;
    if (state.isShuffle) {
      prevIndex = Math.floor(Math.random() * state.playlist.length);
    } else {
      prevIndex = state.currentTrackIndex === 0 
        ? state.playlist.length - 1 
        : state.currentTrackIndex - 1;
    }

    const prevTrack = state.playlist[prevIndex];
    updateState({
      currentTrack: prevTrack,
      currentTrackIndex: prevIndex,
      currentTime: 0
    });
  }, [state.playlist, state.currentTrackIndex, state.isShuffle, updateState]);

  // Função para alterar volume
  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    updateState({ 
      volume: clampedVolume, 
      isMuted: clampedVolume === 0 
    });
  }, [updateState]);

  // Função para alternar mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    if (state.isMuted) {
      audioRef.current.volume = state.volume;
      updateState({ isMuted: false });
    } else {
      audioRef.current.volume = 0;
      updateState({ isMuted: true });
    }
  }, [state.isMuted, state.volume, updateState]);

  // Função para alternar repeat
  const toggleRepeat = useCallback(() => {
    updateState({ isRepeat: !state.isRepeat });
  }, [state.isRepeat, updateState]);

  // Função para alternar shuffle
  const toggleShuffle = useCallback(() => {
    updateState({ isShuffle: !state.isShuffle });
  }, [state.isShuffle, updateState]);

  // Função para carregar nova playlist
  const loadPlaylist = useCallback((playlist: AudioTrack[], startIndex = 0) => {
    const track = playlist[startIndex] || null;
    updateState({
      playlist,
      currentTrack: track,
      currentTrackIndex: startIndex,
      currentTime: 0,
      isPlaying: false
    });
  }, [updateState]);

  // Função para carregar track específico
  const loadTrack = useCallback((track: AudioTrack) => {
    const trackIndex = state.playlist.findIndex(t => t.id === track.id);
    updateState({
      currentTrack: track,
      currentTrackIndex: trackIndex >= 0 ? trackIndex : 0,
      currentTime: 0,
      isPlaying: false
    });
  }, [state.playlist, updateState]);

  // Event listeners do elemento audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      updateState({ duration: audio.duration });
    };

    const handleTimeUpdate = () => {
      updateState({ currentTime: audio.currentTime });
    };

    const handleEnded = () => {
      updateState({ isPlaying: false });
      
      // Auto next track logic
      setTimeout(() => {
        if (state.isRepeat) {
          if (audio) {
            audio.currentTime = 0;
            play();
          }
        } else if (state.playlist.length > 1) {
          nextTrack();
        }
      }, 100);
    };

    const handleError = () => {
      updateState({ 
        error: 'Erro ao carregar áudio', 
        isLoading: false 
      });
    };

    const handleLoadStart = () => {
      updateState({ isLoading: true, error: null });
    };

    const handleCanPlay = () => {
      updateState({ isLoading: false });
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [state.isRepeat, state.playlist.length, updateState, play, nextTrack]);

  // Atualizar src do audio quando track muda
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      audioRef.current.src = state.currentTrack.url;
      audioRef.current.load();
    }
  }, [state.currentTrack]);

  // Funções utilitárias
  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  const getProgressPercentage = useCallback((): number => {
    return state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
  }, [state.currentTime, state.duration]);

  return {
    // Estado
    ...state,
    
    // Ref do audio
    audioRef,
    
    // Funções de controle
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
    
    // Funções utilitárias
    formatTime,
    getProgressPercentage
  };
};
