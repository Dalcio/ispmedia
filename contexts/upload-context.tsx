"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UploadMusicModal } from "@/components/modals/upload-music-modal";
import { GlobalDropZone } from "@/components/modals/global-drop-zone";

interface UploadContextType {
  openUploadModal: (file?: File) => void;
  closeUploadModal: () => void;
  isUploadModalOpen: boolean;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function useUploadModal() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error("useUploadModal must be used within an UploadProvider");
  }
  return context;
}

interface UploadProviderProps {
  children: ReactNode;
}

export function UploadProvider({ children }: UploadProviderProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [preSelectedFile, setPreSelectedFile] = useState<File | null>(null);

  const openUploadModal = (file?: File) => {
    setPreSelectedFile(file || null);
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setPreSelectedFile(null);
  };

  const handleFileDropped = (file: File) => {
    openUploadModal(file);
  };

  return (
    <UploadContext.Provider
      value={{
        openUploadModal,
        closeUploadModal,
        isUploadModalOpen,
      }}
    >
      {children}

      {/* Global components */}
      <GlobalDropZone onFileDropped={handleFileDropped} />
      <UploadMusicModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        preSelectedFile={preSelectedFile}
      />
    </UploadContext.Provider>
  );
}
