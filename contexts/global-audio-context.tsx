"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

import { incrementPlayCount } from "@/lib/track-stats";
import { useAtividade } from "@/hooks/use-atividade";
import { useAuth } from "@/contexts/auth-context";

interface Track {
  id: string;
  title: string;
  artist?: string;
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
  playTrack: (track: Track, playlist?: Track[], playlistTitle?: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;

  // Player state
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  volume: number;

  // Playlist state
  currentPlaylist: Track[];
  currentPlaylistTitle: string | null;
  currentTrackIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;

  // Controls
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | undefined>(
  undefined
);

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
  // Activity and Auth hooks
  const { user } = useAuth();
  const { registrarReproducao, registrarPausa, registrarPulo } = useAtividade();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  // Playlist states
  const [currentPlaylist, setCurrentPlaylist] = useState<Track[]>([]);
  const [currentPlaylistTitle, setCurrentPlaylistTitle] = useState<
    string | null
  >(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Computed playlist values
  const hasNext = currentTrackIndex < currentPlaylist.length - 1;
  const hasPrevious = currentTrackIndex > 0;

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
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-play next track if available
      if (currentTrackIndex < currentPlaylist.length - 1) {
        const nextTrack = currentPlaylist[currentTrackIndex + 1];
        setCurrentTrackIndex(currentTrackIndex + 1);
        playTrackDirectly(nextTrack);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [currentTrackIndex, currentPlaylist]);
  const playTrack = (
    track: Track,
    playlist?: Track[],
    playlistTitle?: string
  ) => {
    const audioTrack: AudioTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist || track.genre || "Unknown Artist",
      album: playlistTitle || "User Upload",
      duration: track.duration || 0,
      url: track.audioUrl,
      coverArt: undefined,
    };

    // Update playlist if provided
    if (playlist && playlist.length > 0) {
      setCurrentPlaylist(playlist);
      setCurrentPlaylistTitle(playlistTitle || null);
      const trackIndex = playlist.findIndex((t) => t.id === track.id);
      setCurrentTrackIndex(trackIndex >= 0 ? trackIndex : 0);
    } else {
      // Single track mode
      setCurrentPlaylist([track]);
      setCurrentPlaylistTitle(null);
      setCurrentTrackIndex(0);
    }

    setCurrentTrack(audioTrack);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }

    // Increment play count when track starts playing
    incrementPlayCount(track.id);
    // Register activity: play
    if (user) {
      registrarReproducao(user.uid, track.id).catch(() => {});
    }
  };

  const playNext = () => {
    if (currentTrackIndex < currentPlaylist.length - 1) {
      const nextTrack = currentPlaylist[currentTrackIndex + 1];
      setCurrentTrackIndex(currentTrackIndex + 1);
      playTrackDirectly(nextTrack);
      // Register activity: skip (pulo)
      if (user && currentTrack) {
        registrarPulo(user.uid, currentTrack.id).catch(() => {});
      }
    }
  };

  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      const prevTrack = currentPlaylist[currentTrackIndex - 1];
      setCurrentTrackIndex(currentTrackIndex - 1);
      playTrackDirectly(prevTrack);
      // Register activity: skip (pulo)
      if (user && currentTrack) {
        registrarPulo(user.uid, currentTrack.id).catch(() => {});
      }
    }
  };
  const playTrackDirectly = (track: Track) => {
    const audioTrack: AudioTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist || track.genre || "Unknown Artist",
      album: currentPlaylistTitle || "User Upload",
      duration: track.duration || 0,
      url: track.audioUrl,
      coverArt: undefined,
    };
    setCurrentTrack(audioTrack);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }

    // Increment play count when track starts playing
    incrementPlayCount(track.id);
    // Register activity: play
    if (user) {
      registrarReproducao(user.uid, track.id).catch(() => {});
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      // Register activity: pause
      if (user && currentTrack) {
        registrarPausa(user.uid, currentTrack.id).catch(() => {});
      }
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
        playNext,
        playPrevious,
        pause,
        resume,
        stop,
        isPlaying,
        currentTrack,
        currentTime,
        duration,
        volume,
        currentPlaylist,
        currentPlaylistTitle,
        currentTrackIndex,
        hasNext,
        hasPrevious,
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
    throw new Error("useGlobalAudio must be used within a GlobalAudioProvider");
  }
  return context;
}
