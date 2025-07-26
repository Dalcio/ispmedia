"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { TrackComments } from "@/components/comments";
import {
  X,
  Play,
  Edit,
  Calendar,
  Tag,
  FileAudio,
  Clock,
  User,
  MessageCircle,
} from "lucide-react";
import { formatFileSize, formatDuration } from "@/lib/upload";

interface Track {
  id: string;
  title: string;
  artist?: string;
  genre: string;
  audioUrl: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  createdAt: any;
  mimeType: string;
  playCount?: number;
}

interface TrackDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  onPlay?: (track: Track) => void;
  onEdit?: (track: Track) => void;
}

export function TrackDetailsModal({
  isOpen,
  onClose,
  track,
  onPlay,
  onEdit,
}: TrackDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");

  if (!track) return null;

  const formatDate = (timestamp: any) => {
    try {
      let date: Date;

      if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else {
        return "Data não disponível";
      }

      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Data não disponível";
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="relative max-h-[80vh] overflow-hidden flex flex-col bg-glass-100 backdrop-blur-xl border border-border-light text-text-primary">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-text-primary truncate">
              {track.title}
            </h2>
            {track.artist && (
              <p className="text-sm text-text-muted mt-1">{track.artist}</p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {onPlay && (
              <button
                onClick={() => onPlay(track)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-dark-900 text-sm font-medium transition-all duration-200 shadow-primary"
              >
                <Play className="w-4 h-4" />
                Tocar
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(track)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border-medium text-text-primary hover:bg-glass-200 text-sm transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-xl text-text-muted hover:text-text-primary hover:bg-glass-200 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-light">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "details"
                ? "text-primary-500 border-b-2 border-primary-500 bg-glass-200"
                : "text-text-muted hover:text-text-primary hover:bg-glass-100"
            }`}
          >
            <FileAudio className="w-4 h-4" />
            Detalhes
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "comments"
                ? "text-primary-500 border-b-2 border-primary-500 bg-glass-200"
                : "text-text-muted hover:text-text-primary hover:bg-glass-100"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Comentários
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={<Tag className="w-4 h-4" />}
                  label="Gênero"
                  value={track.genre || "Não especificado"}
                />

                <InfoItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Data de upload"
                  value={formatDate(track.createdAt)}
                />

                <InfoItem
                  icon={<FileAudio className="w-4 h-4" />}
                  label="Tamanho do arquivo"
                  value={formatFileSize(track.fileSize)}
                />

                {track.duration && (
                  <InfoItem
                    icon={<Clock className="w-4 h-4" />}
                    label="Duração"
                    value={formatDuration(track.duration)}
                  />
                )}

                <InfoItem
                  icon={<FileAudio className="w-4 h-4" />}
                  label="Formato"
                  value={track.mimeType}
                />

                <InfoItem
                  icon={<FileAudio className="w-4 h-4" />}
                  label="Nome do arquivo"
                  value={track.fileName}
                />
              </div>

              {/* Estatísticas */}
              {track.playCount !== undefined && (
                <div className="mt-6 p-4 rounded-xl bg-glass-200 border border-border-subtle">
                  <h3 className="text-lg font-medium mb-3 text-text-primary">
                    Estatísticas
                  </h3>
                  <InfoItem
                    icon={<Play className="w-4 h-4" />}
                    label="Reproduções"
                    value={track.playCount.toString()}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && <TrackComments trackId={track.id} />}
        </div>
      </div>
    </Modal>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-glass-100 border border-border-subtle">
      <div className="text-primary-500 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-muted mb-1">{label}</p>
        <p className="text-sm text-text-primary font-medium break-words">
          {value}
        </p>
      </div>
    </div>
  );
}
