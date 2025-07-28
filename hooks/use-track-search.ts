"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useTracks } from "@/contexts/tracks-context";
import { useAuth } from "@/contexts/auth-context";

// Exact interface from search-modal
export interface TrackResult {
  id: string;
  title: string;
  genre: string;
  audioUrl: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  createdAt: any;
  mimeType: string;
  artistName?: string;
  artist?: string;
  userUid?: string;
  createdBy?: string;
  isPublic?: boolean;
}

interface UseTrackSearchProps {
  searchTerm: string;
  includeUserTracks?: boolean;
  includePublicTracks?: boolean;
  excludeTrackIds?: string[];
  autoLoadPublic?: boolean;
}

export function useTrackSearch({
  searchTerm,
  includeUserTracks = true,
  includePublicTracks = true,
  excludeTrackIds = [],
  autoLoadPublic = true,
}: UseTrackSearchProps) {
  const { tracks: userTracks, loading: userTracksLoading } = useTracks();
  const { user } = useAuth();

  // State for public tracks
  const [publicTracks, setPublicTracks] = useState<TrackResult[]>([]);
  const [publicTracksLoading, setPublicTracksLoading] = useState(false);
  const [publicTracksError, setPublicTracksError] = useState<string | null>(
    null
  );
  // Load public tracks (exact search-modal logic)
  useEffect(() => {
    console.log("🔍 useTrackSearch: Effect triggered", {
      includePublicTracks,
      autoLoadPublic,
      user: !!user,
      userId: user?.uid,
    });

    if (!includePublicTracks || !autoLoadPublic) {
      console.log("⏭️ Skipping public tracks load", {
        includePublicTracks,
        autoLoadPublic,
      });
      return;
    }

    const loadPublicTracks = async () => {
      setPublicTracksLoading(true);
      setPublicTracksError(null);

      try {
        console.log("🎵 useTrackSearch: Loading public tracks...");

        // EXACT search-modal logic: Query for public tracks only with limit
        const tracksRef = collection(db, "tracks");
        const publicTracksQuery = query(
          tracksRef,
          where("isPublic", "==", true),
          limit(50) // Same limit as search-modal
        );

        const allSnapshot = await getDocs(publicTracksQuery);
        console.log("🎵 Total public tracks found:", allSnapshot.size);

        if (allSnapshot.size === 0) {
          console.log("⚠️ No public tracks found");
          setPublicTracks([]);
          return;
        }

        // Map all public tracks with EXACT same structure as search-modal
        const allPublicTracks: TrackResult[] = allSnapshot.docs.map((doc) => {
          const data = doc.data();
          const track = {
            id: doc.id,
            title: data.title || "",
            genre: data.genre || "",
            audioUrl: data.audioUrl || "",
            fileName: data.fileName || "",
            fileSize: data.fileSize || 0,
            duration: data.duration,
            createdAt: data.createdAt,
            mimeType: data.mimeType || "",
            artistName: data.artistName, // Use artistName like search-modal
            artist: data.artist || data.artistName || "", // Keep compatibility
            userUid: data.createdBy, // Use userUid like search-modal
            createdBy: data.createdBy, // Keep compatibility
            isPublic: data.isPublic,
          };
          console.log("📀 Track data:", {
            id: doc.id,
            title: track.title,
            createdBy: track.createdBy,
            userUid: track.userUid,
          });
          return track;
        });

        // Filter out user's own tracks if user is authenticated (same logic as search-modal)
        const tracksFromOthers = user
          ? allPublicTracks.filter((track) => {
              const isOwnTrack = track.userUid === user.uid;
              console.log(
                `🔍 Track "${track.title}": createdBy=${track.userUid}, currentUser=${user.uid}, isOwn=${isOwnTrack}`
              );
              return !isOwnTrack;
            })
          : allPublicTracks;

        console.log("✅ Public tracks from others:", tracksFromOthers.length);
        console.log("🎵 Sample public tracks:", tracksFromOthers.slice(0, 3));

        setPublicTracks(tracksFromOthers);
      } catch (error) {
        console.error("❌ Error loading public tracks:", error);
        setPublicTracksError("Erro ao carregar músicas públicas");
        setPublicTracks([]);
      } finally {
        setPublicTracksLoading(false);
      }
    };

    loadPublicTracks();
  }, [includePublicTracks, autoLoadPublic, user]);

  // Filter user tracks (remove excluded IDs)
  const availableUserTracks = useMemo(() => {
    if (!includeUserTracks) return [];
    return userTracks
      .filter((track) => !excludeTrackIds.includes(track.id))
      .map(
        (track): TrackResult => ({
          id: track.id,
          title: track.title,
          genre: track.genre,
          audioUrl: track.audioUrl,
          fileName: track.fileName,
          fileSize: track.fileSize,
          duration: track.duration,
          createdAt: track.createdAt,
          mimeType: track.mimeType,
          artist: track.artist,
          artistName: track.artist,
          userUid: track.createdBy,
          createdBy: track.createdBy,
          isPublic: track.isPublic,
        })
      );
  }, [userTracks, excludeTrackIds, includeUserTracks]);
  // Filter public tracks (remove excluded IDs)
  const availablePublicTracks = useMemo(() => {
    if (!includePublicTracks) {
      console.log("⏭️ Not including public tracks");
      return [];
    }

    const filtered = publicTracks.filter(
      (track) => !excludeTrackIds.includes(track.id)
    );
    console.log("🔍 Available public tracks after filtering:", {
      total: publicTracks.length,
      excluded: excludeTrackIds.length,
      available: filtered.length,
      excludedIds: excludeTrackIds,
      availableTracks: filtered.map((t) => ({ id: t.id, title: t.title })),
    });

    return filtered;
  }, [publicTracks, excludeTrackIds, includePublicTracks]);

  // Search in user tracks (exact search-modal logic)
  const filteredUserTracks = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableUserTracks;
    }

    console.log("🎵 useTrackSearch: Searching user tracks for:", searchTerm);
    const searchLower = searchTerm.toLowerCase();

    const filtered = availableUserTracks.filter((track) => {
      const title = (track.title || "").toLowerCase();
      const genre = (track.genre || "").toLowerCase();
      const artist = (track.artist || "").toLowerCase();

      // EXACT search-modal logic: search in title, genre, and artist
      return (
        title.includes(searchLower) ||
        genre.includes(searchLower) ||
        artist.includes(searchLower)
      );
    });

    console.log("🎵 Filtered user tracks:", filtered.length);
    return filtered;
  }, [availableUserTracks, searchTerm]);

  // Search in public tracks (exact search-modal logic)
  const filteredPublicTracks = useMemo(() => {
    if (!searchTerm.trim()) {
      return availablePublicTracks;
    }

    console.log("🎵 useTrackSearch: Searching public tracks for:", searchTerm);
    const searchLower = searchTerm.toLowerCase();

    const filtered = availablePublicTracks.filter((track) => {
      const title = (track.title || "").toLowerCase();
      const genre = (track.genre || "").toLowerCase();
      const artist = (track.artist || track.artistName || "").toLowerCase();

      // EXACT search-modal logic: search in title, genre, and artist
      const matches =
        title.includes(searchLower) ||
        genre.includes(searchLower) ||
        artist.includes(searchLower);

      if (matches) {
        console.log("🔍 Found match:", {
          title: track.title,
          artist: track.artist,
          genre: track.genre,
        });
      }

      return matches;
    });

    console.log("🔍 Filtered public tracks:", filtered.length);
    return filtered;
  }, [availablePublicTracks, searchTerm]);

  // Combine all tracks for convenience
  const allTracks = useMemo(
    () => [...filteredUserTracks, ...filteredPublicTracks],
    [filteredUserTracks, filteredPublicTracks]
  );

  return {
    // User tracks
    userTracks: filteredUserTracks,
    userTracksLoading,

    // Public tracks
    publicTracks: filteredPublicTracks,
    publicTracksLoading,
    publicTracksError,

    // Combined
    allTracks,
    isLoading: userTracksLoading || publicTracksLoading,

    // Raw data for advanced usage
    availableUserTracks,
    availablePublicTracks,
  };
}
