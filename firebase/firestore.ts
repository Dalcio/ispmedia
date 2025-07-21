// Serviços do Firestore para ISPmedia
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';

// Tipos principais
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

// Serviços de Tracks
export const getTracks = async (limitCount = 20): Promise<Track[]> => {
  try {
    const q = query(
      collection(db, 'tracks'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Track));
  } catch (error) {
    console.error('Erro ao obter tracks:', error);
    return [];
  }
};

export const getTrackById = async (trackId: string): Promise<Track | null> => {
  try {
    const trackDoc = await getDoc(doc(db, 'tracks', trackId));
    if (trackDoc.exists()) {
      return { id: trackDoc.id, ...trackDoc.data() } as Track;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter track:', error);
    return null;
  }
};

export const searchTracks = async (searchTerm: string): Promise<Track[]> => {
  try {
    // Busca por título (Firebase não tem busca full-text nativa)
    const q = query(
      collection(db, 'tracks'),
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Track));
  } catch (error) {
    console.error('Erro ao buscar tracks:', error);
    return [];
  }
};

// Serviços de Albums
export const getAlbums = async (limitCount = 20): Promise<Album[]> => {
  try {
    const q = query(
      collection(db, 'albums'),
      orderBy('releaseDate', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album));
  } catch (error) {
    console.error('Erro ao obter albums:', error);
    return [];
  }
};

export const getAlbumById = async (albumId: string): Promise<Album | null> => {
  try {
    const albumDoc = await getDoc(doc(db, 'albums', albumId));
    if (albumDoc.exists()) {
      return { id: albumDoc.id, ...albumDoc.data() } as Album;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter album:', error);
    return null;
  }
};

// Serviços de Artists
export const getArtists = async (limitCount = 20): Promise<Artist[]> => {
  try {
    const q = query(
      collection(db, 'artists'),
      orderBy('monthlyListeners', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artist));
  } catch (error) {
    console.error('Erro ao obter artistas:', error);
    return [];
  }
};

export const getArtistById = async (artistId: string): Promise<Artist | null> => {
  try {
    const artistDoc = await getDoc(doc(db, 'artists', artistId));
    if (artistDoc.exists()) {
      return { id: artistDoc.id, ...artistDoc.data() } as Artist;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter artista:', error);
    return null;
  }
};

// Serviços de Playlists
export const getUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  try {
    const q = query(
      collection(db, 'users', userId, 'playlists'),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Playlist));
  } catch (error) {
    console.error('Erro ao obter playlists:', error);
    return [];
  }
};

export const createPlaylist = async (
  userId: string,
  playlistData: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, 'users', userId, 'playlists'), {
      ...playlistData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar playlist:', error);
    throw error;
  }
};

export const updatePlaylist = async (
  userId: string,
  playlistId: string,
  updates: Partial<Playlist>
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId, 'playlists', playlistId), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Erro ao atualizar playlist:', error);
    throw error;
  }
};

export const deletePlaylist = async (userId: string, playlistId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'playlists', playlistId));
  } catch (error) {
    console.error('Erro ao deletar playlist:', error);
    throw error;
  }
};

// Incrementar play count
export const incrementPlayCount = async (trackId: string): Promise<void> => {
  try {
    const trackRef = doc(db, 'tracks', trackId);
    const trackDoc = await getDoc(trackRef);
    
    if (trackDoc.exists()) {
      const currentCount = trackDoc.data().playCount || 0;
      await updateDoc(trackRef, {
        playCount: currentCount + 1
      });
    }
  } catch (error) {
    console.error('Erro ao incrementar play count:', error);
  }
};
