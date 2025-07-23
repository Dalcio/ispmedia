"use client";

import { useDashboardDrawer } from "@/hooks/use-dashboard-drawer";
import { useUploadModal } from "@/hooks/use-upload-modal";
import {
  useDashboardShortcuts,
  useUploadShortcuts,
} from "@/hooks/use-keyboard-shortcuts";
import { useAuth } from "@/contexts/auth-context";
import { UploadMusicModal } from "@/components/modals/upload-music-modal";

export function GlobalKeyboardShortcuts() {
  const { user } = useAuth();
  const { openDrawer } = useDashboardDrawer();
  const { isOpen, openModal, closeModal } = useUploadModal();

  // Configurar atalhos apenas se usuário estiver logado
  const enabled = !!user;

  // Atalhos de teclado
  useDashboardShortcuts(() => {
    if (enabled) openDrawer();
  }, enabled);

  useUploadShortcuts(() => {
    if (enabled) openModal();
  }, enabled);

  return (
    <>
      {/* Modal de Upload integrado com o hook */}
      <UploadMusicModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
