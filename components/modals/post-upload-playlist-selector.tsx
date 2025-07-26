"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/ui-button";
import { ListMusic, Check, X } from "lucide-react";

interface Playlist {
  id: string;
  title: string;
  visibility: "public" | "private";
  tracks: string[];
}

interface PostUploadPlaylistSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: string;
  trackTitle: string;
}

export function PostUploadPlaylistSelector({
  isOpen,
  onClose,
  trackId,
  trackTitle,
}: PostUploadPlaylistSelectorProps) {
  const { user } = useAuth();
  const { success, error: showError } = useToast();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user || !isOpen) {
      setLoading(false);
      return;
    }

    const playlistsQuery = query(
      collection(db, "playlists"),
      where("createdBy", "==", user.uid)
    );

    const unsubscribe = onSnapshot(playlistsQuery, (snapshot) => {
      const playlistsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Playlist[];

      setPlaylists(playlistsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylist) return;

    const playlist = playlists.find((p) => p.id === selectedPlaylist);
    if (!playlist) return;

    setAdding(true);
    try {
      const playlistRef = doc(db, "playlists", selectedPlaylist);
      await updateDoc(playlistRef, {
        tracks: arrayUnion(trackId),
        updatedAt: new Date(),
      });

      success(`"${trackTitle}" adicionada à playlist "${playlist.title}"`);
      onClose();
    } catch (error) {
      console.error("Error adding track to playlist:", error);
      showError("Erro ao adicionar música à playlist");
    } finally {
      setAdding(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Concluído!">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success-600" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Música enviada com sucesso!
          </h3>
          <p className="text-text-muted">
            Deseja adicionar "{trackTitle}" a uma playlist?
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 animate-pulse"
              >
                <div className="w-10 h-10 bg-glass-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-glass-200 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-glass-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-6">
            <ListMusic className="w-12 h-12 mx-auto mb-4 text-text-muted" />
            <p className="text-text-muted mb-4">
              Você ainda não tem playlists criadas.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-primary mb-3">
              Selecione uma playlist:
            </p>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedPlaylist === playlist.id
                      ? "bg-primary-50 border border-primary-200"
                      : "bg-glass-50 hover:bg-glass-100 border border-transparent"
                  }`}
                >
                  <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ListMusic className="h-5 w-5 text-primary-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text-primary truncate">
                      {playlist.title}
                    </h4>
                    <p className="text-sm text-text-muted">
                      {playlist.tracks.length} música(s) •{" "}
                      {playlist.visibility === "public" ? "Pública" : "Privada"}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlaylist === playlist.id
                        ? "bg-primary-500 border-primary-500"
                        : "border-glass-300"
                    }`}
                  >
                    {selectedPlaylist === playlist.id && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-glass-200">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            Pular
          </Button>

          {playlists.length > 0 && (
            <Button
              onClick={handleAddToPlaylist}
              disabled={!selectedPlaylist || adding}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              {adding ? "Adicionando..." : "Adicionar à Playlist"}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
