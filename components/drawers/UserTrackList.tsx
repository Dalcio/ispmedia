"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useGlobalAudio } from "@/contexts/global-audio-context";
import { Button } from "@/components/ui/button";
import { EditTrackModal } from "@/components/modals/edit-track-modal";
import { TrackDetailsModal } from "@/components/modals/track-details-modal";
import { PlayCountDisplay } from "@/components/ui/play-count-display";
import { TrackStats } from "@/components/ui/track-stats";
import { PlayCountDebug } from "@/components/debug/play-count-debug";
import {
  Play,
  Edit,
  Trash2,
  Music,
  Calendar,
  Tag,
  FileAudio,
  Info,
} from "lucide-react";
import { formatFileSize, formatDuration } from "@/lib/upload";

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
  playCount?: number;
}

interface UserTrackListProps {
  onEditTrack?: (track: Track) => void;
  onPlayTrack?: (track: Track) => void;
}

export function UserTrackList({
  onEditTrack,
  onPlayTrack,
}: UserTrackListProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingTrackId, setDeletingTrackId] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [detailsTrack, setDetailsTrack] = useState<Track | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { user } = useAuth();
  const toast = useToast();
  const { playTrack } = useGlobalAudio();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Use simple query without orderBy to avoid index errors
    // We'll sort on client side until indexes are ready
    const tracksQuery = query(
      collection(db, "tracks"),
      where("createdBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      tracksQuery,
      (snapshot) => {
        const userTracks: Track[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Track loaded:", {
            id: doc.id,
            title: data.title,
            playCount: data.playCount,
            createdBy: data.createdBy,
            userUID: user.uid,
          });

          userTracks.push({
            id: doc.id,
            ...data,
            playCount: data.playCount || 0, // Ensure playCount is included
          } as Track);
        });

        // Sort manually on client side
        userTracks.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });

        console.log(`Loaded ${userTracks.length} tracks for user ${user.uid}`);
        setTracks(userTracks);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading tracks:", error); // Only show error toast for actual errors, not for empty results
        if (error.code === "failed-precondition") {
          toast.error(
            "Database indexing in progress. Please wait a few minutes and refresh."
          );
        } else if (
          error.code !== "permission-denied" &&
          error.message &&
          !error.message.includes("No such document")
        ) {
          toast.error("Failed to load your music tracks");
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDeleteTrack = async (track: Track) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir "${track.title}"? Esta ação não pode ser desfeita.`
    );

    if (!confirmDelete) return;

    try {
      setDeletingTrackId(track.id);

      // Deletar arquivo do Storage
      const storageRef = ref(storage, `tracks/${user.uid}/${track.fileName}`);
      await deleteObject(storageRef);

      // Deletar documento do Firestore
      await deleteDoc(doc(db, "tracks", track.id)); // Update local list
      setTracks((prev) => prev.filter((t) => t.id !== track.id));

      toast.success(`"${track.title}" was successfully removed`);
    } catch (error) {
      console.error("Error deleting track:", error);
      toast.error("Failed to delete track. Please try again.");
    } finally {
      setDeletingTrackId(null);
    }
  };
  const handlePlayTrack = (track: Track) => {
    playTrack(track, tracks, "Minhas Músicas");
    onPlayTrack?.(track);
  };

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setShowEditModal(true);
    onEditTrack?.(track);
  };
  const handleTrackUpdated = (updatedTrack: Track) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === updatedTrack.id ? updatedTrack : t))
    );
  };

  const handleShowDetails = (track: Track) => {
    setDetailsTrack(track);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsTrack(null);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Data desconhecida";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Data inválida";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-glass-100 rounded-xl animate-pulse">
          <div className="w-12 h-12 bg-glass-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-glass-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-glass-200 rounded w-1/2" />
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-glass-100 rounded-xl animate-pulse">
          <div className="w-12 h-12 bg-glass-200 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-glass-200 rounded w-2/3 mb-2" />
            <div className="h-3 bg-glass-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-glass-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Music className="h-8 w-8 text-text-muted" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No tracks uploaded
        </h3>
        <p className="text-text-muted text-sm mb-4">
          Your music tracks will appear here after upload
        </p>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="group bg-glass-100 hover:bg-glass-200 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                {/* Ícone do arquivo */}
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileAudio className="h-6 w-6 text-primary-500" />
                </div>

                {/* Informações da música */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary truncate mb-1">
                    {track.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-text-muted mb-2">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>{track.genre}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(track.createdAt)}</span>
                    </div>
                  </div>{" "}
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>{formatFileSize(track.fileSize)}</span>
                    {track.duration && (
                      <span>{formatDuration(track.duration)}</span>
                    )}
                    <TrackStats
                      trackId={track.id}
                      initialPlayCount={track.playCount || 0}
                      showTrend={true}
                      size="sm"
                      className="text-text-muted"
                    />{" "}
                    <span className="truncate">{track.fileName}</span>
                  </div>
                  {/* Debug Component - Temporary */}
                  <div className="mt-2">
                    <PlayCountDebug trackId={track.id} />
                  </div>
                </div>
              </div>
              {/* Ações */}
              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handlePlayTrack(track)}
                  className="flex items-center gap-1 text-text-muted hover:text-primary-500 hover:bg-primary-500/10"
                >
                  <Play className="h-4 w-4" />
                  <span className="text-xs">Play</span>{" "}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShowDetails(track)}
                  className="flex items-center gap-1 text-text-muted hover:text-blue-500 hover:bg-blue-500/10"
                >
                  <Info className="h-4 w-4" />
                  <span className="text-xs">Detalhes</span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditTrack(track)}
                  className="flex items-center gap-1 text-text-muted hover:text-info-500 hover:bg-info-500/10"
                >
                  <Edit className="h-4 w-4" />
                  <span className="text-xs">Edit</span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteTrack(track)}
                  disabled={deletingTrackId === track.id}
                  className="flex items-center gap-1 text-text-muted hover:text-error-500 hover:bg-error-500/10"
                >
                  {deletingTrackId === track.id ? (
                    <div className="w-4 h-4 border border-error-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="text-xs">
                    {deletingTrackId === track.id ? "Deleting..." : "Delete"}
                  </span>
                </Button>
              </div>
            </div>
          ))}
          {tracks.length > 0 && (
            <div className="text-center pt-2">
              <p className="text-xs text-text-muted">
                {tracks.length} {tracks.length === 1 ? "track" : "tracks"}{" "}
                uploaded
              </p>
            </div>
          )}{" "}
          {/* Edit Track Modal */}
          <EditTrackModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingTrack(null);
            }}
            track={editingTrack}
            onTrackUpdated={handleTrackUpdated}
          />
          {/* Track Details Modal */}
          <TrackDetailsModal
            isOpen={showDetailsModal}
            onClose={handleCloseDetailsModal}
            track={detailsTrack}
            onPlay={handlePlayTrack}
            onEdit={handleEditTrack}
          />
        </div>
      </div>
    </div>
  );
}
