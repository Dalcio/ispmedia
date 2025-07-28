"use client";

import { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/ui-button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { uploadTrack } from "@/lib/upload";
import { Music, Upload, X, FileAudio } from "lucide-react";

interface UploadMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedFile?: File | null;
}

interface FormData {
  title: string;
  genre: string;
  audioFile: File | null;
  isPublic: boolean;
}

interface UploadProgress {
  percentage: number;
  status: "idle" | "uploading" | "processing" | "success" | "error";
  message: string;
}

const MUSIC_GENRES = [
  "Rock",
  "Pop",
  "Hip Hop",
  "R&B",
  "Jazz",
  "Classical",
  "Electronic",
  "Country",
  "Reggae",
  "Blues",
  "Folk",
  "Punk",
  "Metal",
  "Alternative",
  "Funk",
  "Soul",
  "Disco",
  "House",
  "Techno",
  "Trance",
  "Dubstep",
  "Trap",
  "Lo-fi",
  "Ambient",
  "World Music",
  "Latin",
  "Brazilian",
  "Bossa Nova",
  "MPB",
  "Sertanejo",
  "Forró",
  "Outro",
];

export function UploadMusicModal({
  isOpen,
  onClose,
  preSelectedFile,
}: UploadMusicModalProps) {
  console.log("🎵 UploadMusicModal renderizado, isOpen:", isOpen);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    genre: "",
    audioFile: null,
    isPublic: true, // Default to public
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    percentage: 0,
    status: "idle",
    message: "",
  });
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const toast = useToast();

  // Handle pre-selected file
  useEffect(() => {
    if (preSelectedFile && isOpen) {
      console.log("🎵 Pre-selected file:", preSelectedFile.name);
      setFormData((prev) => ({ ...prev, audioFile: preSelectedFile }));
      setErrors((prev) => ({ ...prev, audioFile: "" }));
    }
  }, [preSelectedFile, isOpen]);
  const resetForm = () => {
    setFormData({
      title: "",
      genre: "",
      audioFile: null,
      isPublic: true, // Default to public
    });
    setErrors({});
    setUploadProgress({
      percentage: 0,
      status: "idle",
      message: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (
      uploadProgress.status === "uploading" ||
      uploadProgress.status === "processing"
    ) {
      toast.error("Não é possível fechar durante o upload");
      return;
    }
    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Nome da música é obrigatório";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Nome deve ter pelo menos 2 caracteres";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Nome deve ter no máximo 100 caracteres";
    }

    if (!formData.genre) {
      newErrors.genre = "Gênero é obrigatório";
    }

    if (!formData.audioFile) {
      newErrors.audioFile = "Arquivo de áudio é obrigatório";
    } else {
      const fileSize = formData.audioFile.size;
      const maxSize = 50 * 1024 * 1024; // 50MB

      if (fileSize > maxSize) {
        newErrors.audioFile = "Arquivo deve ter no máximo 50MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
    const fileType = file.type;

    if (
      !allowedTypes.includes(fileType) &&
      !file.name.toLowerCase().endsWith(".mp3")
    ) {
      setErrors((prev) => ({
        ...prev,
        audioFile: "Apenas arquivos MP3 e WAV são permitidos",
      }));
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        audioFile: "Arquivo deve ter no máximo 50MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, audioFile: file }));
    setErrors((prev) => ({ ...prev, audioFile: "" }));
  };
  // Drag and drop handlers with improved event handling
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUploading) {
      dragCounter.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragOver(true);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isUploading) {
      dragCounter.current--;
      if (dragCounter.current === 0) {
        setIsDragOver(false);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current = 0;
    setIsDragOver(false);

    if (isUploading) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      toast.error("Você precisa estar logado para fazer upload");
      return;
    }

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      setUploadProgress({
        percentage: 0,
        status: "uploading",
        message: "Iniciando upload...",
      });

      console.log("🚀 Iniciando upload:", {
        title: formData.title.trim(),
        genre: formData.genre,
        userId: user.uid,
        fileName: formData.audioFile?.name,
        fileSize: formData.audioFile?.size,
        fileType: formData.audioFile?.type,
      });

      const result = await uploadTrack({
        title: formData.title.trim(),
        genre: formData.genre,
        audioFile: formData.audioFile!,
        userId: user.uid,
        onProgress: (percentage: number, message: string) => {
          console.log(`📊 Progress: ${percentage}% - ${message}`);
          setUploadProgress((prev) => ({
            ...prev,
            percentage,
            message,
            status: percentage === 100 ? "processing" : "uploading",
          }));
        },
      });
      setUploadProgress({
        percentage: 100,
        status: "success",
        message: "Upload concluído com sucesso!",
      });
      console.log("✅ Upload finalizado com sucesso!");
      toast.success(`"${formData.title}" foi adicionado à sua biblioteca!`);

      // Disparar evento para abrir o PostUploadPlaylistSelector
      const event = new CustomEvent("openPostUploadSelector", {
        detail: {
          trackId: result.id,
          trackTitle: formData.title.trim(),
        },
      });
      window.dispatchEvent(event);

      // Aguarda um pouco e depois fecha o modal
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error("💥 Erro no modal de upload:", error);

      let errorMessage = "Erro inesperado durante o upload";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("📝 Detalhes do erro:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });

        // Adicionar dicas específicas para problemas comuns
        if (
          errorMessage.includes("permission-denied") ||
          errorMessage.includes("unauthorized")
        ) {
          errorMessage +=
            "\n\n💡 Dica: Verifique se você está logado e tente novamente.";
        } else if (
          errorMessage.includes("network") ||
          errorMessage.includes("CORS")
        ) {
          errorMessage =
            "Problema de conectividade. Verifique sua internet e tente novamente.";
        } else if (errorMessage.includes("quota")) {
          errorMessage +=
            "\n\n💡 Contate o administrador para aumentar a cota de armazenamento.";
        } else if (errorMessage.includes("invalid-argument")) {
          errorMessage =
            "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";
        }
      }

      setUploadProgress({
        percentage: 0,
        status: "error",
        message: errorMessage,
      });

      toast.error(errorMessage);
    }
  };
  const isUploading =
    uploadProgress.status === "uploading" ||
    uploadProgress.status === "processing";
  const isSuccess = uploadProgress.status === "success";

  // Reset drag counter when component unmounts or when uploading starts
  useEffect(() => {
    if (isUploading) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, [isUploading]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Adicionar Nova Música"
      size="lg"
    >
      <div className="max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título da Música */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-text-subtitle"
            >
              Nome da Música *
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Digite o nome da música..."
              disabled={isUploading}
              className={`w-full bg-glass-200 border-border-input text-text-primary placeholder:text-text-placeholder focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl px-4 py-3 ${
                errors.title
                  ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                  : ""
              }`}
            />
            {errors.title && (
              <p className="text-sm text-error-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Gênero Musical */}
          <div className="space-y-2">
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-text-subtitle"
            >
              Gênero Musical *
            </label>
            <select
              id="genre"
              value={formData.genre}
              onChange={(e) => handleInputChange("genre", e.target.value)}
              disabled={isUploading}
              className={`w-full bg-glass-200 border-border-input text-text-primary focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-xl px-4 py-3 cursor-pointer ${
                errors.genre
                  ? "border-error-500 focus:border-error-500 focus:ring-error-500/20"
                  : ""
              }`}
            >
              <option
                value=""
                disabled
                className="bg-background-800 text-text-muted"
              >
                Selecione um gênero...
              </option>
              {MUSIC_GENRES.map((genre) => (
                <option
                  key={genre}
                  value={genre}
                  className="bg-background-800 text-text-primary"
                >
                  {genre}
                </option>
              ))}
            </select>
            {errors.genre && (
              <p className="text-sm text-error-500 mt-1">{errors.genre}</p>
            )}
          </div>

          {/* Visibilidade */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-subtitle">
              Visibilidade da Música
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="visibility"
                  checked={formData.isPublic}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, isPublic: true }))
                  }
                  disabled={isUploading}
                  className="mt-1 w-4 h-4 text-primary-500 border-border-input focus:ring-primary-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="text-text-primary font-medium">Pública</div>
                  <div className="text-sm text-text-muted">
                    Qualquer pessoa pode encontrar e ouvir esta música
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="visibility"
                  checked={!formData.isPublic}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, isPublic: false }))
                  }
                  disabled={isUploading}
                  className="mt-1 w-4 h-4 text-primary-500 border-border-input focus:ring-primary-500 focus:ring-2"
                />
                <div className="flex-1">
                  <div className="text-text-primary font-medium">Privada</div>
                  <div className="text-sm text-text-muted">
                    Apenas você pode ver e ouvir esta música
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Upload de Arquivo */}
          <div className="space-y-2">
            <label
              htmlFor="audioFile"
              className="block text-sm font-medium text-text-subtitle"
            >
              Arquivo de Áudio *
            </label>

            <div className="relative">
              <input
                ref={fileInputRef}
                id="audioFile"
                type="file"
                accept=".mp3,.wav,audio/mpeg,audio/wav"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />{" "}
              <div
                ref={dropZoneRef}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                w-full border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer relative
                ${
                  formData.audioFile
                    ? "border-primary-500 bg-primary-500/5"
                    : isDragOver
                    ? "border-primary-400 bg-primary-400/10 scale-[1.02]"
                    : "border-border-medium hover:border-primary-500/50 bg-glass-100"
                }
                ${errors.audioFile ? "border-error-500 bg-error-500/5" : ""}
                ${
                  isUploading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-glass-200"
                }
              `}
              >
                {/* Invisible drag overlay that covers the entire area */}
                <div
                  className="absolute inset-0 z-10"
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  style={{
                    pointerEvents:
                      isDragOver || !formData.audioFile ? "all" : "none",
                  }}
                />

                {/* Drag overlay visual feedback */}
                {isDragOver && !formData.audioFile && (
                  <div className="absolute inset-2 border-2 border-dashed border-primary-400/50 rounded-lg animate-pulse pointer-events-none z-20" />
                )}

                {formData.audioFile ? (
                  <div className="space-y-3 relative z-0">
                    <div className="flex items-center justify-center">
                      <FileAudio className="h-12 w-12 text-primary-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-text-primary font-medium">
                        {formData.audioFile.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        {formatFileSize(formData.audioFile.size)}
                      </p>
                    </div>
                    {!isUploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({ ...prev, audioFile: null }));
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-text-muted hover:text-error-500 hover:bg-error-500/10 relative z-30"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 relative z-0">
                    <div className="flex items-center justify-center">
                      <Upload
                        className={`h-12 w-12 transition-colors duration-200 ${
                          isDragOver ? "text-primary-400" : "text-text-muted"
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`font-medium transition-colors duration-200 ${
                          isDragOver ? "text-primary-400" : "text-text-primary"
                        }`}
                      >
                        {isDragOver
                          ? "Solte o arquivo aqui"
                          : "Clique para selecionar ou arraste um arquivo"}
                      </p>
                      <p className="text-sm text-text-muted">
                        MP3 ou WAV • Máximo 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {errors.audioFile && (
              <p className="text-sm text-error-500 mt-1">{errors.audioFile}</p>
            )}
          </div>

          {/* Barra de Progresso */}
          {(isUploading || isSuccess) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-subtitle">
                  {uploadProgress.message}
                </span>
                <span className="text-sm text-text-muted">
                  {uploadProgress.percentage}%
                </span>
              </div>

              <div className="w-full bg-glass-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    uploadProgress.status === "success"
                      ? "bg-success-500"
                      : uploadProgress.status === "error"
                      ? "bg-error-500"
                      : "bg-primary-500"
                  }`}
                  style={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1"
            >
              {isUploading ? "Aguarde..." : "Cancelar"}
            </Button>

            <Button
              type="submit"
              disabled={
                isUploading ||
                !formData.title ||
                !formData.genre ||
                !formData.audioFile
              }
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-black font-medium"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  {uploadProgress.status === "processing"
                    ? "Processando..."
                    : "Enviando..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  Adicionar Música
                </div>
              )}{" "}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
