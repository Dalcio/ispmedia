import { useState, useCallback } from "react";

interface UseUploadModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  openModalViaEvent: () => void;
}

/**
 * Hook para gerenciar o estado do modal de upload de música
 */
export function useUploadModal(): UseUploadModalReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openModalViaEvent = () => {
    const event = new CustomEvent("openUploadModal");
    window.dispatchEvent(event);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    openModalViaEvent,
  };
}
