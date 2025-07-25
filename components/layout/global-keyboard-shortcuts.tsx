"use client";

import { useState, useEffect } from "react";
import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { useUploadModal } from "@/hooks/use-upload-modal";
import { useCommandPalette } from "@/hooks/use-command-palette";
import {
  useDashboardShortcuts,
  useUploadShortcuts,
  useSearchShortcuts,
} from "@/hooks/use-keyboard-shortcuts";
import { useAuth } from "@/contexts/auth-context";
import { UploadMusicModal } from "@/components/modals/upload-music-modal";
import { PostUploadPlaylistSelector } from "@/components/modals/post-upload-playlist-selector";
import { SearchModal } from "@/components/modals/search-modal";
import { PlaylistModal } from "@/components/modals/playlist-modal";
import { CommandPalette } from "@/components/modals/command-palette";

export function GlobalKeyboardShortcuts() {
  console.log("🎵 GlobalKeyboardShortcuts renderizado");

  const { user } = useAuth();
  const { openDrawer } = useDashboardDrawer();
  const { isOpen, openModal, closeModal } = useUploadModal();
  const {
    isOpen: isCommandPaletteOpen,
    openPalette,
    closePalette,
  } = useCommandPalette();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

  console.log("🎵 Upload modal state:", { isOpen });

  const [showPostUploadSelector, setShowPostUploadSelector] = useState(false);
  const [uploadedTrackData, setUploadedTrackData] = useState<{
    trackId: string;
    trackTitle: string;
  } | null>(null);

  // Configurar atalhos apenas se usuário estiver logado
  const enabled = !!user; // Atalhos de teclado
  useDashboardShortcuts(() => {
    if (enabled) openDrawer();
  }, enabled);

  useUploadShortcuts(() => {
    if (enabled) openModal();
  }, enabled);

  useSearchShortcuts(() => {
    if (enabled) setIsSearchOpen(true);
  }, enabled);
  // Escutar evento de upload concluído
  useEffect(() => {
    const handlePostUpload = (event: CustomEvent) => {
      setUploadedTrackData({
        trackId: event.detail.trackId,
        trackTitle: event.detail.trackTitle,
      });
      setShowPostUploadSelector(true);
    };

    const handleOpenUpload = () => {
      console.log("🎵 Evento openUploadModal recebido");
      openModal();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Atalho para o painel de comandos (Ctrl+K ou Cmd+K)
      if (event.key === "k" && (event.ctrlKey || event.metaKey) && enabled) {
        event.preventDefault();
        console.log("🎵 Atalho Ctrl/Cmd+K pressionado");
        openPalette();
        return;
      }

      if ((event.key === "u" || event.key === "U") && enabled) {
        event.preventDefault();
        console.log("🎵 Atalho U pressionado");
        openModal();
      }
    };

    window.addEventListener(
      "openPostUploadSelector",
      handlePostUpload as EventListener
    );
    window.addEventListener("openUploadModal", handleOpenUpload);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "openPostUploadSelector",
        handlePostUpload as EventListener
      );
      window.removeEventListener("openUploadModal", handleOpenUpload);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openModal, enabled, openPalette]);

  // Funções para o painel de comandos
  const handleOpenUploadModal = () => {
    openModal();
  };

  const handleOpenPlaylistModal = () => {
    setIsPlaylistModalOpen(true);
  };

  const handleOpenDashboard = () => {
    openDrawer();
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseAllModals = () => {
    closeModal();
    setIsSearchOpen(false);
    setIsPlaylistModalOpen(false);
    closePalette();
  };

  const handleOpenProfile = () => {
    // Aqui você pode implementar a navegação para o perfil
    // Por exemplo, usando router.push('/profile') se estiver usando Next.js router
    console.log("Navegar para perfil");
  };

  return (
    <>
      {/* Modal de Upload integrado com o hook */}
      <UploadMusicModal isOpen={isOpen} onClose={closeModal} />{" "}
      {/* Modal de Busca */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      {/* Modal de Playlist */}
      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        mode="create"
      />
      {/* Painel de Comandos */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={closePalette}
        onOpenUploadModal={handleOpenUploadModal}
        onOpenPlaylistModal={handleOpenPlaylistModal}
        onOpenDashboard={handleOpenDashboard}
        onOpenSearch={handleOpenSearch}
        onCloseAllModals={handleCloseAllModals}
        onOpenProfile={handleOpenProfile}
      />
      {/* Modal de seleção de playlist pós-upload */}
      {showPostUploadSelector && uploadedTrackData && (
        <PostUploadPlaylistSelector
          isOpen={showPostUploadSelector}
          onClose={() => {
            setShowPostUploadSelector(false);
            setUploadedTrackData(null);
          }}
          trackId={uploadedTrackData.trackId}
          trackTitle={uploadedTrackData.trackTitle}
        />
      )}
    </>
  );
}
