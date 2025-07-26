"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/auth-context";
import { useTracks } from "@/contexts/tracks-context";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Calendar,
  Music,
  ListMusic,
  HardDrive,
  LogOut,
  TrendingUp,
} from "lucide-react";

interface UserStats {
  totalTracks: number;
  totalPlaylists: number;
  storageUsed: number;
  mostPlayedTrack: {
    id: string;
    title: string;
    playCount: number;
  } | null;
}

interface ProfileSectionProps {
  className?: string;
}

export function ProfileSection({ className = "" }: ProfileSectionProps) {
  const { user, userProfile, signOut } = useAuth();
  const { tracks } = useTracks();
  const [stats, setStats] = useState<UserStats>({
    totalTracks: 0,
    totalPlaylists: 0,
    storageUsed: 0,
    mostPlayedTrack: null,
  });
  const [loading, setLoading] = useState(true);

  // Calculate storage usage from user's tracks
  const storageUsed = useMemo(() => {
    return tracks.reduce((total, track) => total + (track.fileSize || 0), 0);
  }, [tracks]);

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get playlists count
        const playlistsQuery = query(
          collection(db, "playlists"),
          where("createdBy", "==", user.uid)
        );
        const playlistsSnapshot = await getDocs(playlistsQuery);

        // Find most played track (if playCount field exists)
        let mostPlayedTrack = null;
        if (tracks.length > 0) {
          const tracksWithPlayCount = tracks.filter(
            (track) => track.playCount && track.playCount > 0
          );

          if (tracksWithPlayCount.length > 0) {
            const sortedTracks = tracksWithPlayCount.sort(
              (a, b) => (b.playCount || 0) - (a.playCount || 0)
            );
            const topTrack = sortedTracks[0];
            mostPlayedTrack = {
              id: topTrack.id,
              title: topTrack.title,
              playCount: topTrack.playCount || 0,
            };
          }
        }

        setStats({
          totalTracks: tracks.length,
          totalPlaylists: playlistsSnapshot.size,
          storageUsed,
          mostPlayedTrack,
        });
      } catch (error) {
        console.error("Error loading user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [user, tracks, storageUsed]);

  const formatStorageSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Data não disponível";

    try {
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }

      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Data inválida";
    }
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja sair da sua conta?"
    );
    if (confirmed) {
      await signOut();
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
        <p className="text-neutral-500">
          Você precisa estar logado para ver seu perfil.
        </p>
      </div>
    );
  }
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Header do Perfil */}
          <div className="text-center pb-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.displayName?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase() ||
                "U"
              )}
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              {user.displayName || userProfile?.name || "Usuário"}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Membro desde{" "}
              {formatDate(userProfile?.createdAt || user.metadata.creationTime)}
            </p>
          </div>
          {/* Informações do Usuário */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Informações da Conta
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <Mail className="w-5 h-5 text-neutral-500" />
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <Calendar className="w-5 h-5 text-neutral-500" />
                <div>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Conta criada em
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDate(
                      userProfile?.createdAt || user.metadata.creationTime
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Estatísticas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Estatísticas
            </h3>

            {loading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg animate-pulse"
                  >
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Music className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Músicas
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                    {stats.totalTracks}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ListMusic className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Playlists
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                    {stats.totalPlaylists}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Armazenamento
                    </p>
                  </div>
                  <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {formatStorageSize(stats.storageUsed)}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary-500" />
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Mais Ouvida
                    </p>
                  </div>
                  {stats.mostPlayedTrack ? (
                    <div>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {stats.mostPlayedTrack.title}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {stats.mostPlayedTrack.playCount} reproduções
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Nenhuma música ouvida ainda
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>{" "}
          {/* Botão de Sair */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-2 px-4"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
