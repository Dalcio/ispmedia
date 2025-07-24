"use client";

import { useState, useEffect } from "react";
import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { useUploadModal } from "@/hooks/use-upload-modal";
import {
  useDashboardShortcuts,
  useUploadShortcuts,
  useSearchShortcuts,
} from "@/hooks/use-keyboard-shortcuts";
import { useAuth } from "@/contexts/auth-context";
import { UploadMusicModal } from "@/components/modals/upload-music-modal";
import { PostUploadPlaylistSelector } from "@/components/modals/post-upload-playlist-selector";
import { SearchModal } from "@/components/modals/search-modal";

export function GlobalKeyboardShortcuts() {
  console.log("🎵 GlobalKeyboardShortcuts renderizado");

  const { user } = useAuth();
  const { openDrawer } = useDashboardDrawer();
  const { isOpen, openModal, closeModal } = useUploadModal();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
  }, [openModal, enabled]);

  return (
    <>
      {/* Modal de Upload integrado com o hook */}
      <UploadMusicModal isOpen={isOpen} onClose={closeModal} />

      {/* Modal de Busca */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
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
