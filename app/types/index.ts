// User Types
export type UserType = 'comum' | 'artista' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  userType: UserType;
  profileImage?: string;
  bio?: string;
  isVerified: boolean;
  followedArtists: string[];
  createdAt: Date;
  lastLogin: Date;
}

// Artist Types
export interface Artist {
  uid: string;
  stageName: string;
  genres: string[];
  verified: boolean;
  monthlyListeners: number;
  socialLinks: {
    website?: string;
    instagram?: string;
    twitter?: string;
  };
  albums: string[];
}

// Song Types
export interface Song {
  id: string;
  title: string;
  artistId: string;
  albumId?: string;
  duration: number; // in seconds
  genre: string;
  releaseDate: Date;
  audioUrl: string;
  coverImage?: string;
  playCount: number;
  averageRating: number;
  isPublic: boolean;
}

// Album Types
export interface Album {
  id: string;
  title: string;
  artistId: string;
  coverImage: string;
  releaseDate: Date;
  songs: string[];
  totalDuration: number;
  genre: string;
}

// Playlist Types
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  songs: string[];
  isPublic: boolean;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  songId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  likes: number;
  isReported: boolean;
}

// Listening History Types
export interface ListeningHistory {
  songId: string;
  playedAt: Date;
  duration: number; // time listened in seconds
  completed: boolean; // if listened to the end
}

// Player State Types
export interface PlayerState {
  currentSong?: Song;
  isPlaying: boolean;
  volume: number;
  position: number; // current position in seconds
  queue: Song[];
  shuffle: boolean;
  repeat: 'none' | 'song' | 'queue';
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string, userType: UserType) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Music Player Context Types
export interface PlayerContextType {
  state: PlayerState;
  playSong: (song: Song) => void;
  pauseSong: () => void;
  resumeSong: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  seek: (position: number) => void;
  addToQueue: (song: Song) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

// Search Types
export interface SearchFilters {
  query: string;
  type: 'all' | 'songs' | 'artists' | 'albums' | 'playlists';
  genre?: string;
  sortBy: 'relevance' | 'date' | 'popularity' | 'alphabetical';
}

export interface SearchResults {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

// UI Component Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  userType: UserType;
}

export interface PlaylistForm {
  name: string;
  description?: string;
  isPublic: boolean;
}
