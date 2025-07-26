"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";

import { usePlayCount } from "@/hooks/use-play-count";
import { useAtividade } from "@/hooks/use-atividade";
import { useAuth } from "@/contexts/auth-context";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase/config";

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
  isPublic?: boolean;
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

  // Playback modes
  isRepeat: boolean;
  isShuffle: boolean;
  setIsRepeat: (repeat: boolean) => void;
  setIsShuffle: (shuffle: boolean) => void;

  // Controls
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const GlobalAudioContext = createContext<GlobalAudioContextType | undefined>(
  undefined
);

export function GlobalAudioProvider({ children }: { children: ReactNode }) {  // Activity and Auth hooks
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
  >(null);  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Playback modes with localStorage persistence
  const [isRepeat, setIsRepeat] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('audioRepeat') === 'true';
    }
    return false;
  });
  
  const [isShuffle, setIsShuffle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('audioShuffle') === 'true';
    }
    return false;
  });

  // Track play count incremented status
  const hasIncrementedPlayCount = useRef<boolean>(false);

  // Computed playlist values
  const hasNext = currentTrackIndex < currentPlaylist.length - 1;
  const hasPrevious = currentTrackIndex > 0;

  // Persist repeat and shuffle settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioRepeat', isRepeat.toString());
    }
  }, [isRepeat]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audioShuffle', isShuffle.toString());
    }
  }, [isShuffle]);

  // Update audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  // Helper function to increment play count directly in Firestore
  const incrementPlayCountDirectly = async (trackId: string): Promise<number | null> => {
    try {
      console.log(`[GlobalAudio] Incrementing play count for track: ${trackId}`);
      
      const trackRef = doc(db, "tracks", trackId);
      await updateDoc(trackRef, {
        playCount: increment(1),
        lastPlayedAt: new Date(),
      });

      console.log(`✅ [GlobalAudio] Play count incremented for track ${trackId}`);
      return 1; // We don't need the exact count here, just success
    } catch (error) {
      console.error(`[GlobalAudio] Failed to increment play count for track ${trackId}:`, error);
      return null;
    }
  };

  // Helper function to emit play count update events
  const emitPlayCountUpdate = (trackId: string, increment: number = 1) => {
    console.log(
      `[GlobalAudio] Emitting playCountUpdated event for track ${trackId} with increment ${increment}`
    );
    const event = new CustomEvent("playCountUpdated", {
      detail: { trackId, increment, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.log(`[GlobalAudio] Event dispatched successfully`);
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);    const handleEnded = () => {
      setIsPlaying(false);
      
      // Handle repeat mode
      if (isRepeat && currentTrack) {
        // Repeat current track
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }, 100);
        return;
      }
      
      // Handle shuffle mode
      if (isShuffle && currentPlaylist.length > 1) {
        // Get random track index (excluding current)
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * currentPlaylist.length);
        } while (randomIndex === currentTrackIndex && currentPlaylist.length > 1);
        
        const nextTrack = currentPlaylist[randomIndex];
        setCurrentTrackIndex(randomIndex);
        playTrackDirectly(nextTrack);
        return;
      }
      
      // Auto-play next track if available (normal mode)
      if (currentTrackIndex < currentPlaylist.length - 1) {
        const nextTrack = currentPlaylist[currentTrackIndex + 1];
        setCurrentTrackIndex(currentTrackIndex + 1);
        playTrackDirectly(nextTrack);
      }
    };const handlePlay = () => {
      setIsPlaying(true);
      
      // Increment play count when track actually starts playing (not just when called)
      if (currentTrack && !hasIncrementedPlayCount.current) {
        hasIncrementedPlayCount.current = true;
        incrementPlayCountDirectly(currentTrack.id).then((result) => {
          if (result) {
            console.log(`✅ Play count updated for track ${currentTrack.id}`);
            emitPlayCountUpdate(currentTrack.id); // Emit event
          }
        });
      }
    };
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

    setCurrentTrack(audioTrack);    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }

    // Reset play count increment flag for new track
    hasIncrementedPlayCount.current = false;

    // Register activity: play
    if (user) {
      registrarReproducao(user.uid, track.id).catch(() => {});
    }
  };
  const playNext = () => {
    // Handle shuffle mode
    if (isShuffle && currentPlaylist.length > 1) {
      // Get random track index (excluding current)
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * currentPlaylist.length);
      } while (randomIndex === currentTrackIndex && currentPlaylist.length > 1);
      
      const nextTrack = currentPlaylist[randomIndex];
      setCurrentTrackIndex(randomIndex);
      playTrackDirectly(nextTrack);
      // Register activity: skip (pulo)
      if (user && currentTrack) {
        registrarPulo(user.uid, currentTrack.id).catch(() => {});
      }
      return;
    }
    
    // Normal mode: play next track sequentially
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
    // In shuffle mode, still allow going to previous track sequentially
    // (Most music apps work this way for better UX)
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
    };    setCurrentTrack(audioTrack);

    // Reset play count increment flag for new track
    hasIncrementedPlayCount.current = false;

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }

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
    <GlobalAudioContext.Provider      value={{
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
        isRepeat,
        isShuffle,
        setIsRepeat,
        setIsShuffle,
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
