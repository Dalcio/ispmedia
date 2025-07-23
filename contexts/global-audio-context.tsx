'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  createdAt: any;
  mimeType: string;
}

interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  coverArt?: string;
}

interface GlobalAudioContextType {
  // Audio player methods
  playTrack: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  
  // Player state
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Controls
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | undefined>(undefined);

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  // Update audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);
  
  const playTrack = (track: Track) => {
    const audioTrack: AudioTrack = {
      id: track.id,
      title: track.title,
      artist: track.genre || 'Unknown Artist',
      album: 'User Upload',
      duration: track.duration || 0,
      url: track.audioUrl,
      coverArt: undefined
    };
    
    setCurrentTrack(audioTrack);
    
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  return (
    <GlobalAudioContext.Provider
      value={{
        playTrack,
        pause,
        resume,
        stop,
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        volume,
        togglePlayPause,
        seek,
        setVolume,
      }}
    >
      {children}
      
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
    </GlobalAudioContext.Provider>
  );
}

export function useGlobalAudio() {
  const context = useContext(GlobalAudioContext);
  if (context === undefined) {
    throw new Error('useGlobalAudio must be used within a GlobalAudioProvider');
  }
  return context;
}
