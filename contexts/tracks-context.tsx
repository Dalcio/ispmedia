"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";

interface Track {
  id: string;
  title: string;
  artist?: string;
  createdBy: string;
  genre: string;
  audioUrl: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  createdAt: any;
  mimeType: string;
  playCount?: number;
  isPublic?: boolean;
}

export type { Track };

interface TracksContextType {
  tracks: Track[];
  loading: boolean;
  refreshTracks: () => void;
}

const TracksContext = createContext<TracksContextType | undefined>(undefined);

export function TracksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("🎵 TracksContext: No user, clearing tracks");
      setTracks([]);
      setLoading(false);
      return;
    }

    console.log("🎵 TracksContext: Setting up listener for user:", user.uid);
    setLoading(true);

    const tracksQuery = query(
      collection(db, "tracks"),
      where("createdBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      tracksQuery,
      (snapshot) => {
        // Avoid updates from local writes
        if (snapshot.metadata.hasPendingWrites) {
          return;
        }

        const tracksData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          };
        }) as Track[]; // Only update if data actually changed
        setTracks((prevTracks) => {
          // Quick length check first
          if (prevTracks.length !== tracksData.length) {
            return tracksData;
          }

          // If same length, check if IDs are the same
          const prevIds = prevTracks.map((t) => t.id).sort();
          const newIds = tracksData.map((t) => t.id).sort();

          // Compare arrays element by element
          for (let i = 0; i < prevIds.length; i++) {
            if (prevIds[i] !== newIds[i]) {
              return tracksData;
            }
          }

          // If IDs are the same, check if any track content changed
          for (let i = 0; i < prevTracks.length; i++) {
            const prevTrack = prevTracks[i];
            const newTrack = tracksData.find((t) => t.id === prevTrack.id);

            if (
              !newTrack ||
              prevTrack.title !== newTrack.title ||
              prevTrack.artist !== newTrack.artist ||
              prevTrack.audioUrl !== newTrack.audioUrl
            ) {
              return tracksData;
            }
          }

          // Data is identical, keep same reference
          return prevTracks;
        });

        setLoading(false);
      },
      (error) => {
        console.error("🎵 TracksContext: Error:", error);
        setLoading(false);
      }
    );
    return () => {
      console.log(
        "🎵 TracksContext: Cleaning up listener for user:",
        user?.uid
      );
      unsubscribe();
    };
  }, [user?.uid]); // Use stable dependency

  const refreshTracks = () => {
    setLoading(true);
    // O useEffect já vai recriar o listener automaticamente
  };

  return (
    <TracksContext.Provider value={{ tracks, loading, refreshTracks }}>
      {children}
    </TracksContext.Provider>
  );
}

export function useTracks() {
  const context = useContext(TracksContext);
  if (context === undefined) {
    throw new Error("useTracks must be used within a TracksProvider");
  }
  return context;
}
