"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, FileAudio, X, AlertCircle } from "lucide-react";

interface GlobalDropZoneProps {
  onFileDropped: (file: File) => void;
}

export function GlobalDropZone({ onFileDropped }: GlobalDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dragCounter = useRef(0);

  const isValidAudioFile = (file: File): boolean => {
    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp3"];
    const allowedExtensions = [".mp3", ".wav"];

    return (
      allowedTypes.includes(file.type) ||
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
  };
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current++;

    // Mostrar overlay sempre que qualquer arquivo for arrastado
    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsVisible(true);

      // Verificar se tem arquivo de áudio válido para mostrar feedback diferente
      const hasAudioFile = Array.from(e.dataTransfer.items).some((item) => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          return file && isValidAudioFile(file);
        }
        return false;
      });

      setIsDragOver(hasAudioFile);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragOver(false);
      setIsVisible(false);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current = 0;
    setIsDragOver(false);
    setIsVisible(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidAudioFile(file)) {
        onFileDropped(file);
      }
    }
  };

  const handleClose = () => {
    dragCounter.current = 0;
    setIsDragOver(false);
    setIsVisible(false);
  };
  useEffect(() => {
    const handleWindowDragEnter = (e: DragEvent) => handleDragEnter(e);
    const handleWindowDragLeave = (e: DragEvent) => handleDragLeave(e);
    const handleWindowDragOver = (e: DragEvent) => handleDragOver(e);
    const handleWindowDrop = (e: DragEvent) => handleDrop(e);

    window.addEventListener("dragenter", handleWindowDragEnter);
    window.addEventListener("dragleave", handleWindowDragLeave);
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter);
      window.removeEventListener("dragleave", handleWindowDragLeave);
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, [onFileDropped]);

  if (!isVisible) return null;
  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${
          isDragOver
            ? "bg-black/85 backdrop-blur-md"
            : "bg-black/70 backdrop-blur-sm"
        }
      `}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200 z-10 border border-white/20"
      >
        <X className="h-6 w-6" />
      </button>{" "}
      {/* Drop zone */}
      <div
        className={`
          relative w-[90%] max-w-2xl h-[70%] max-h-96 
          border-2 border-dashed rounded-2xl 
          flex flex-col items-center justify-center
          transition-all duration-300 ease-in-out
          ${
            isDragOver
              ? "border-primary-400 bg-primary-500/15 scale-105 shadow-2xl shadow-primary-500/20"
              : "border-orange-400 bg-orange-500/10 scale-100 shadow-xl shadow-orange-500/10"
          }
        `}
      >
        {" "}
        {/* Icon */}
        <div
          className={`
          mb-6 p-6 rounded-full transition-all duration-300
          ${
            isDragOver
              ? "bg-primary-500/25 text-primary-300 scale-110 shadow-lg shadow-primary-500/30"
              : "bg-orange-500/20 text-orange-400 scale-100"
          }
        `}
        >
          {isDragOver ? (
            <FileAudio className="h-16 w-16 animate-bounce" />
          ) : (
            <AlertCircle className="h-16 w-16 animate-pulse" />
          )}
        </div>
        {/* Text */}
        <div className="text-center space-y-3">
          <h2
            className={`
            text-3xl font-bold transition-all duration-300
            ${
              isDragOver ? "text-primary-300 scale-105" : "text-white scale-100"
            }
          `}
          >
            {isDragOver ? "🎵 Solte o arquivo aqui!" : "📁 Arquivo detectado"}
          </h2>
          <p
            className={`text-lg transition-all duration-300 ${
              isDragOver ? "text-primary-200" : "text-orange-300"
            }`}
          >
            {isDragOver
              ? "✨ Solte para abrir o modal de upload"
              : "⚠️ Apenas arquivos MP3 ou WAV são aceitos"}
          </p>
        </div>
        {/* Enhanced visual feedback */}
        {isDragOver && (
          <>
            <div className="absolute inset-4 border-2 border-dashed border-primary-400/60 rounded-xl animate-pulse" />
            <div className="absolute inset-8 border border-dashed border-primary-300/40 rounded-lg animate-ping" />
          </>
        )}
        {/* Floating particles effect when dragging */}
        {isDragOver && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary-300 rounded-full animate-pulse opacity-70 animate-delay-100"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce opacity-50 animate-delay-200"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-primary-400 rounded-full animate-ping opacity-60 animate-delay-300"></div>
          </div>
        )}
      </div>{" "}
      {/* Background instruction */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p
          className={`text-sm transition-all duration-300 ${
            isDragOver ? "text-primary-200" : "text-orange-200"
          }`}
        >
          {isDragOver
            ? "🎯 Arquivo de áudio válido detectado!"
            : "⚠️ Solte apenas arquivos MP3 ou WAV para fazer upload"}
        </p>
      </div>
    </div>
  );
}
