"use client";

import FirebaseTest from "@/components/firebase-test";
import AudioPlayerDemo from "@/components/player/audio-player-demo";
import { TrackDebug } from "@/components/debug/track-debug";
import { Button } from "@/components/ui/button";
import { useUploadModal } from "@/contexts/upload-context";
import { Upload } from "lucide-react";

export default function TestPage() {
  const { openUploadModal } = useUploadModal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 to-background-200 dark:from-background-900 dark:to-background-800 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Drag and Drop Test */}
        <section className="bg-white dark:bg-background-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            🎵 Teste de Drag & Drop
          </h2>
          <p className="text-text-subtitle mb-4">
            Teste a funcionalidade de arrastar e soltar arquivos:
          </p>
          <div className="space-y-4">
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-600 mb-2">
                1. Arraste um arquivo de áudio para qualquer lugar da tela
              </p>
              <p className="text-gray-600 mb-4">
                2. Ou clique no botão abaixo para abrir o modal de upload
              </p>
              <Button
                onClick={() => openUploadModal()}
                className="inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Abrir Modal de Upload
              </Button>
            </div>{" "}
            <div className="text-sm text-gray-500">
              <strong>Funcionalidades implementadas:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  🎯 <strong>Overlay sempre visível</strong> - Aparece para
                  qualquer arquivo arrastado
                </li>
                <li>📁 Drag & drop global (arrastar arquivo para a tela)</li>
                <li>📤 Drag & drop no modal (área de upload)</li>
                <li>✅ Validação de tipo de arquivo (MP3, WAV)</li>
                <li>📏 Validação de tamanho (máx 50MB)</li>
                <li>✨ Feedback visual diferenciado (válido vs inválido)</li>
                <li>
                  🔄 Preenchimento automático quando arquivo válido é arrastado
                </li>
                <li>📊 Registro automático de atividade de upload</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 font-medium">
                  🎯 Teste Visual:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-blue-700 dark:text-blue-400">
                  <li>
                    <strong>Arraste QUALQUER arquivo</strong> → Overlay laranja
                    aparece (arquivo detectado)
                  </li>
                  <li>
                    <strong>Arraste arquivo MP3/WAV</strong> → Overlay
                    azul/verde (arquivo válido)
                  </li>
                  <li>
                    <strong>Solte arquivo válido</strong> → Modal de upload abre
                    automaticamente
                  </li>
                  <li>
                    <strong>Complete o upload</strong> → Atividade registrada no
                    Dashboard
                  </li>
                </ol>
              </div>
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  ✨ Estados visuais:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-green-700 dark:text-green-400 text-sm">
                  <li>
                    <span className="text-orange-600">🟠 Laranja</span> -
                    Arquivo detectado (tipo não suportado)
                  </li>
                  <li>
                    <span className="text-blue-600">🔵 Azul/Verde</span> -
                    Arquivo de áudio válido!
                  </li>
                  <li>
                    <span className="text-gray-600">⚡</span> Animações: bounce,
                    pulse, ping, scale
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Track Debug */}
        <section>
          <TrackDebug />
        </section>

        {/* Audio Player Demo */}
        <section>
          <AudioPlayerDemo />
        </section>

        {/* Firebase Test */}
        <section>
          <FirebaseTest />
        </section>
      </div>
    </div>
  );
}
