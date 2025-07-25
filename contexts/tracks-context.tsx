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
}

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
        console.log(
          "🎵 TracksContext: Snapshot received, docs:",
          snapshot.docs.length
        );

        const tracksData = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("🎵 TracksContext: Track data:", {
            id: doc.id,
            title: data.title,
            createdBy: data.createdBy,
          });
          return {
            id: doc.id,
            ...data,
          };
        }) as Track[];

        console.log("🎵 TracksContext: Tracks loaded:", tracksData.length);
        setTracks(tracksData);
        setLoading(false);
      },
      (error) => {
        console.error("🎵 TracksContext: Error:", error);
        setLoading(false);
      }
    );

    return () => {
      console.log("🎵 TracksContext: Cleaning up listener");
      unsubscribe();
    };
  }, [user]);

  const refreshTracks = () => {
    console.log("🎵 TracksContext: Manual refresh requested");
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
