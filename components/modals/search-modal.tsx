"use client";

import { useState, useEffect } from "react";
import { Search, Upload, Music, Play, Volume2 } from "lucide-react";
import {
  collection,
  query as firestoreQuery,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/utils";
import { db } from "@/firebase/config";
import { useGlobalAudio } from "@/contexts/global-audio-context";
import { useTracks } from "@/contexts/tracks-context";

// Interfaces para os resultados da busca
interface TrackResult {
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
  userUid?: string;
}

interface UserResult {
  uid: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: any;
  tracksCount?: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    tracks: TrackResult[];
    artists: UserResult[];
  }>({
    tracks: [],
    artists: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const audioPlayer = useGlobalAudio();
  const { tracks: userTracks } = useTracks(); // Get tracks from context

  // Resetar seleção quando resultados mudarem
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Resetar estado quando modal abre
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults({ tracks: [], artists: [] });
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handlers de teclado para navegação
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalResults = results.tracks.length + results.artists.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % totalResults);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalResults) % totalResults);
    } else if (e.key === "Enter" && totalResults > 0) {
      e.preventDefault();
      // Tocar o item selecionado se for uma track
      if (selectedIndex < results.tracks.length) {
        handlePlayTrack(results.tracks[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }; // Função para buscar tracks no Firestore
  const searchTracks = async (searchQuery: string): Promise<TrackResult[]> => {
    try {
      console.log("🎵 SearchModal: Buscando tracks para:", searchQuery);

      // First, try to use user tracks from context for faster search
      if (userTracks.length > 0) {
        console.log(
          "🎵 SearchModal: Using tracks from context:",
          userTracks.length
        );
        const filteredUserTracks = userTracks
          .filter(
            (track) =>
              track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              track.genre.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((track) => ({
            id: track.id,
            title: track.title,
            genre: track.genre,
            audioUrl: track.audioUrl,
            fileName: track.fileName,
            fileSize: track.fileSize,
            duration: track.duration,
            createdAt: track.createdAt,
            mimeType: track.mimeType,
            artistName: track.artist,
            userUid: track.createdBy,
          }));

        if (filteredUserTracks.length > 0) {
          console.log(
            "🎵 SearchModal: Found tracks in context:",
            filteredUserTracks.length
          );
          return filteredUserTracks.slice(0, 10);
        }
      }

      // Fallback to Firestore search for global tracks
      console.log("🎵 SearchModal: Fallback to Firestore search");
      const tracksRef = collection(db, "tracks");

      // Tentar buscar todos os tracks primeiro para debug
      const allTracksQuery = firestoreQuery(tracksRef, limit(50));
      const allSnapshot = await getDocs(allTracksQuery);

      console.log("🎵 Total de tracks na coleção:", allSnapshot.size);

      if (allSnapshot.size === 0) {
        console.log("⚠️ Nenhum track encontrado na coleção");
        return [];
      }

      // Buscar por título que contém a query (mais flexível)
      const tracks: TrackResult[] = [];

      allSnapshot.forEach((doc) => {
        const data = doc.data();
        const title = (data.title || "").toLowerCase();

        // Busca mais flexível - se o título contém a query
        if (title.includes(searchQuery.toLowerCase())) {
          tracks.push({
            id: doc.id,
            title: data.title || "",
            genre: data.genre || "",
            audioUrl: data.audioUrl || "",
            fileName: data.fileName || "",
            fileSize: data.fileSize || 0,
            duration: data.duration,
            createdAt: data.createdAt,
            mimeType: data.mimeType || "",
            artistName: data.artistName,
            userUid: data.userUid,
          });
        }
      });

      console.log("🎵 Tracks encontradas:", tracks.length, tracks);
      return tracks.slice(0, 10); // Limitar a 10 resultados
    } catch (error) {
      console.error("❌ Erro ao buscar tracks:", error);
      return [];
    }
  };
  // Função para buscar artistas (users) no Firestore
  const searchArtists = async (searchQuery: string): Promise<UserResult[]> => {
    try {
      console.log("👤 Buscando artistas para:", searchQuery);
      const usersRef = collection(db, "users");

      // Tentar buscar todos os users primeiro para debug
      const allUsersQuery = firestoreQuery(usersRef, limit(50));
      const allSnapshot = await getDocs(allUsersQuery);

      console.log("👤 Total de users na coleção:", allSnapshot.size);

      if (allSnapshot.size === 0) {
        console.log("⚠️ Nenhum user encontrado na coleção");
        return [];
      }

      // Buscar por nome que contém a query (mais flexível)
      const artists: UserResult[] = [];

      allSnapshot.forEach((doc) => {
        const data = doc.data();
        const name = (data.name || "").toLowerCase();

        // Busca mais flexível - se o nome contém a query
        if (name.includes(searchQuery.toLowerCase())) {
          artists.push({
            uid: doc.id,
            name: data.name || "",
            email: data.email || "",
            profilePicture: data.profilePicture,
            createdAt: data.createdAt,
            tracksCount: data.tracksCount,
          });
        }
      });

      console.log("👤 Artistas encontrados:", artists.length, artists);
      return artists.slice(0, 10); // Limitar a 10 resultados
    } catch (error) {
      console.error("❌ Erro ao buscar artistas:", error);
      return [];
    }
  };
  const handleSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ tracks: [], artists: [] });
      return;
    }

    console.log("🔍 Iniciando busca para:", searchQuery);
    setIsLoading(true);
    try {
      // Fazer a busca em paralelo otimizada
      const searchLower = searchQuery.toLowerCase().trim();

      console.log("🔍 Buscando tracks e artistas...");
      // Buscar simultaneamente tracks e artistas
      const [tracks, artists] = await Promise.all([
        searchTracks(searchLower),
        searchArtists(searchQuery.trim()), // Manter case original para nomes
      ]);

      console.log("🔍 Resultados encontrados:", {
        tracks: tracks.length,
        artists: artists.length,
        tracksData: tracks,
        artistsData: artists,
      });

      // Se não há dados reais, mostrar dados de exemplo para teste
      if (
        tracks.length === 0 &&
        artists.length === 0 &&
        searchQuery.length > 0
      ) {
        console.log("📝 Adicionando dados de exemplo para teste");
        const exampleTracks: TrackResult[] = [
          {
            id: "example-1",
            title: `Música exemplo com "${searchQuery}"`,
            genre: "Exemplo",
            audioUrl: "#",
            fileName: "exemplo.mp3",
            fileSize: 1024,
            mimeType: "audio/mpeg",
            createdAt: new Date(),
            artistName: "Artista Exemplo",
          },
        ];

        const exampleArtists: UserResult[] = [
          {
            uid: "example-artist-1",
            name: `Artista ${searchQuery}`,
            email: "exemplo@exemplo.com",
            createdAt: new Date(),
            tracksCount: 5,
          },
        ];

        setResults({ tracks: exampleTracks, artists: exampleArtists });
        return;
      }

      setResults({ tracks, artists });
    } catch (error) {
      console.error("❌ Erro na busca:", error);
      setResults({ tracks: [], artists: [] });
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const onQueryChange = (value: string) => {
    setQuery(value);
    handleSearch(value);
  };

  const handlePlayTrack = (track: TrackResult) => {
    // Converter TrackResult para o formato esperado pelo audio player
    const audioTrack = {
      id: track.id,
      title: track.title,
      genre: track.genre,
      audioUrl: track.audioUrl,
      fileName: track.fileName,
      fileSize: track.fileSize,
      duration: track.duration,
      createdAt: track.createdAt,
      mimeType: track.mimeType,
    };
    audioPlayer.playTrack(audioTrack);
    // Fechar modal após iniciar reprodução
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buscar" size="lg">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Busque por músicas ou artistas…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
            autoFocus
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/60 mt-2">Buscando...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && query && (
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Tracks */}
            {results.tracks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Músicas
                </h3>
                <div className="space-y-2">
                  {results.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                        selectedIndex === index
                          ? "bg-primary/20 ring-2 ring-primary/50"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => handlePlayTrack(track)}
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Play className="h-5 w-5 text-white group-hover:text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{track.title}</p>
                        <p className="text-white/60 text-sm">
                          {track.genre || "Gênero não especificado"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrack(track);
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                        Ouvir
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artists */}
            {results.artists.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Artistas
                </h3>
                <div className="space-y-2">
                  {results.artists.map((artist, index) => {
                    const globalIndex = results.tracks.length + index;
                    return (
                      <div
                        key={artist.uid}
                        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedIndex === globalIndex
                            ? "bg-primary/20 ring-2 ring-primary/50"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                          {artist.profilePicture ? (
                            <img
                              src={artist.profilePicture}
                              alt={artist.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-lg font-semibold">
                              {artist.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {artist.name}
                          </p>
                          <p className="text-white/60 text-sm">
                            {artist.tracksCount
                              ? `${artist.tracksCount} músicas`
                              : "Artista"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.tracks.length === 0 && results.artists.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Music className="h-10 w-10 text-white/60" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
                  Não encontramos músicas ou artistas com "{query}". Que tal
                  fazer upload de uma nova música?
                </p>
                <Button
                  onClick={() => {
                    console.log("🎵 Botão upload clicado no search");
                    // Disparar evento para abrir modal de upload
                    const event = new CustomEvent("openUploadModal");
                    window.dispatchEvent(event);
                    onClose(); // Fechar modal de search
                  }}
                  className="inline-flex items-center gap-2 py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <Upload className="h-5 w-5" />
                  Fazer upload de música
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-8">
            <Search className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">Digite algo para começar a buscar</p>
            <p className="text-white/40 text-sm mt-2">
              Use "/" ou "Ctrl + S" para abrir rapidamente
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
