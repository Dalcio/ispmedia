import { storage, db } from "@/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface UploadTrackParams {
  title: string;
  genre: string;
  audioFile: File;
  userId: string;
  onProgress?: (percentage: number, message: string) => void;
}

export interface TrackDocument {
  id?: string; // ID do documento
  title: string;
  genre: string;
  createdBy: string;
  createdAt: any; // Firebase Timestamp
  audioUrl: string;
  fileName: string;
  fileSize: number;
  duration?: number; // Em segundos
  mimeType: string;
}

/**
 * Faz upload de uma faixa de música para o Firebase Storage e cria documento no Firestore
 */
export async function uploadTrack({
  title,
  genre,
  audioFile,
  userId,
  onProgress,
}: UploadTrackParams): Promise<TrackDocument> {
  // Validações básicas
  if (!title.trim()) {
    throw new Error("Título da música é obrigatório");
  }

  if (!genre) {
    throw new Error("Gênero musical é obrigatório");
  }

  if (!audioFile) {
    throw new Error("Arquivo de áudio é obrigatório");
  }

  if (!userId) {
    throw new Error("Usuário deve estar autenticado");
  }

  // Validar tipo de arquivo
  const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
  if (
    !allowedTypes.includes(audioFile.type) &&
    !audioFile.name.toLowerCase().endsWith(".mp3")
  ) {
    throw new Error("Apenas arquivos MP3 e WAV são permitidos");
  }

  // Validar tamanho do arquivo (50MB máximo)
  const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
  if (audioFile.size > maxSizeInBytes) {
    throw new Error("Arquivo deve ter no máximo 50MB");
  }

  try {
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const sanitizedTitle = title
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_");
    const fileExtension =
      audioFile.name.split(".").pop()?.toLowerCase() || "mp3";
    const fileName = `${timestamp}_${sanitizedTitle}.${fileExtension}`;

    onProgress?.(5, "Preparando upload...");
    console.log("🎵 Iniciando upload:", { title, genre, fileName, userId });

    // Criar referência no Firebase Storage com estrutura de pastas por usuário
    const storageRef = ref(storage, `tracks/${userId}/${fileName}`);

    onProgress?.(10, "Iniciando upload do arquivo...");

    // Criar metadados customizados para o arquivo
    const metadata = {
      contentType: audioFile.type || "audio/mpeg",
      customMetadata: {
        uploadedBy: userId,
        originalName: audioFile.name,
        title: title,
        genre: genre,
        uploadedAt: new Date().toISOString(),
      },
    };

    // Iniciar upload com progresso
    const uploadTask = uploadBytesResumable(storageRef, audioFile, metadata);

    // Promessa para aguardar o upload
    const uploadPromise = new Promise<string>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calcular progresso (10% a 80% do processo total)
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 70 + 10;
          const message = `Enviando arquivo... ${Math.round(
            progress - 10
          )}% do arquivo`;
          onProgress?.(Math.round(progress), message);
          console.log("📤 Upload progress:", Math.round(progress));
        },
        (error) => {
          console.error("❌ Erro durante upload do Storage:", error);

          // Mapear erros específicos do Firebase
          let errorMessage = "Erro durante o upload do arquivo";

          switch (error.code) {
            case "storage/unauthorized":
              errorMessage =
                "Sem permissão para fazer upload. Verifique se você está logado.";
              break;
            case "storage/canceled":
              errorMessage = "Upload cancelado";
              break;
            case "storage/unknown":
              errorMessage =
                "Erro desconhecido durante upload. Tente novamente.";
              break;
            case "storage/invalid-format":
              errorMessage = "Formato de arquivo inválido";
              break;
            case "storage/invalid-argument":
              errorMessage = "Argumento inválido no upload";
              break;
            case "storage/invalid-checksum":
              errorMessage = "Arquivo corrompido durante upload";
              break;
            case "storage/retry-limit-exceeded":
              errorMessage =
                "Limite de tentativas excedido. Verifique sua conexão.";
              break;
            case "storage/quota-exceeded":
              errorMessage = "Cota de armazenamento excedida";
              break;
            case "storage/unauthenticated":
              errorMessage = "Usuário não autenticado. Faça login novamente.";
              break;
            default:
              // Para erros de rede ou configuração
              if (error.message.includes("CORS")) {
                errorMessage =
                  "Erro de configuração. Entre em contato com o suporte.";
              } else if (error.message.includes("network")) {
                errorMessage =
                  "Erro de rede. Verifique sua conexão com a internet.";
              } else {
                errorMessage = error.message || errorMessage;
              }
          }

          reject(new Error(errorMessage));
        },
        async () => {
          try {
            onProgress?.(80, "Upload concluído, obtendo URL...");
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("✅ URL do arquivo obtida:", downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error("❌ Erro ao obter URL do arquivo:", error);
            reject(new Error("Erro ao obter URL do arquivo. Tente novamente."));
          }
        }
      );
    });

    // Aguardar conclusão do upload
    const audioUrl = await uploadPromise;

    onProgress?.(85, "Salvando informações da música...");

    // Preparar documento para o Firestore
    const trackData: Omit<TrackDocument, "duration"> = {
      title: title.trim(),
      genre,
      createdBy: userId,
      createdAt: serverTimestamp(),
      audioUrl,
      fileName: audioFile.name,
      fileSize: audioFile.size,
      mimeType: audioFile.type || "audio/mpeg",
    };

    console.log("💾 Criando documento no Firestore:", trackData);
    onProgress?.(90, "Criando entrada no banco de dados...");    // Salvar documento no Firestore
    let documentId: string;
    try {
      const docRef = await addDoc(collection(db, "tracks"), trackData);
      documentId = docRef.id;
      console.log("✅ Documento criado com ID:", documentId);
    } catch (firestoreError) {
      console.error("❌ Erro ao criar documento no Firestore:", firestoreError);

      // Mapear erros específicos do Firestore
      let firestoreErrorMessage = "Erro ao salvar informações da música";

      if (firestoreError instanceof Error) {
        if (firestoreError.message.includes("permission-denied")) {
          firestoreErrorMessage =
            "Sem permissão para salvar música. Verifique se você está logado.";
        } else if (firestoreError.message.includes("unavailable")) {
          firestoreErrorMessage =
            "Serviço temporariamente indisponível. Tente novamente.";
        } else if (firestoreError.message.includes("invalid-argument")) {
          firestoreErrorMessage =
            "Dados inválidos. Verifique se todos os campos estão preenchidos.";
        } else {
          firestoreErrorMessage = `Erro no banco de dados: ${firestoreError.message}`;
        }
      }

      throw new Error(firestoreErrorMessage);
    }

    onProgress?.(95, "Finalizando...");

    // Tentar obter duração do áudio (opcional)
    let duration: number | undefined;
    try {
      duration = await getAudioDuration(audioFile);
      console.log("🎵 Duração do áudio obtida:", duration);
    } catch (error) {
      console.warn("⚠️ Não foi possível obter duração do áudio:", error);
    }

    // Se conseguiu obter a duração, atualizar o documento
    if (duration) {
      try {
        const { updateDoc, doc } = await import("firebase/firestore");
        await updateDoc(doc(db, "tracks", "document-id"), { duration });
        console.log("✅ Duração atualizada no documento");
      } catch (error) {
        console.warn("⚠️ Não foi possível atualizar duração:", error);
      }
    }

    onProgress?.(100, "Música adicionada com sucesso!");
    console.log("🎉 Upload completado com sucesso!");    // Retornar documento criado
    const finalTrackData: TrackDocument = {
      ...trackData,
      id: documentId,
      duration,
      createdAt: new Date(), // Para retorno imediato, será substituído pelo timestamp do servidor
    };

    return finalTrackData;
  } catch (error) {
    console.error("💥 Erro durante processo de upload:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Erro inesperado durante o upload");
  }
}

/**
 * Obtém a duração de um arquivo de áudio em segundos
 */
function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration);
    });

    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível carregar metadados do áudio"));
    });

    audio.src = url;
  });
}

/**
 * Valida se um arquivo é um arquivo de áudio válido
 */
export function validateAudioFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
  const allowedExtensions = [".mp3", ".wav"];

  // Verificar tipo MIME
  const hasValidMimeType = allowedTypes.includes(file.type);

  // Verificar extensão do arquivo
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidMimeType && !hasValidExtension) {
    return {
      isValid: false,
      error: "Apenas arquivos MP3 e WAV são permitidos",
    };
  }

  // Verificar tamanho do arquivo
  const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: "Arquivo deve ter no máximo 50MB",
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: "Arquivo está vazio",
    };
  }

  return { isValid: true };
}

/**
 * Formata o tamanho do arquivo em bytes para uma string legível
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Formata a duração em segundos para MM:SS
 */
export function formatDuration(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
