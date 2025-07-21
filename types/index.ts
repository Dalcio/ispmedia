// Tipos principais do ISPmedia

// Tipos de usuário
export type UserType = 'user' | 'artist' | 'admin';

// Interface do usuário
export interface User {
  uid: string;
  email: string;
  displayName: string;
  userType: UserType;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  lastLogin: Date;
  isVerified?: boolean;
  followersCount?: number;
}

// Interface do artista
export interface Artist {
  id: string;
  userId: string;
  name: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  genre: string[];
  totalPlays: number;
  monthlyListeners: number;
  isVerified: boolean;
  createdAt: Date;
}

// Interface da música
export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumName: string;
  duration: number;
  trackNumber: number;
  audioUrl: string;
  genre: string;
  playCount: number;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  isExplicit: boolean;
}

// Interface do álbum
export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverImage: string;
  releaseDate: Date;
  genre: string;
  totalTracks: number;
  duration: number;
  averageRating: number;
  totalRatings: number;
}

// Interface da playlist
export interface Playlist {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  coverImage?: string;
  trackIds: string[];
  totalTracks: number;
  totalDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

// Estados do player de áudio
export interface AudioState {
  currentTrack?: Track;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  queue: Track[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
}

// Estados de autenticação
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Legacy interfaces (manter compatibilidade)
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  userType?: UserType;
}

export interface ApiError {
  message: string;
  code?: string;
}
