/**
 * Exemplo de integração do sistema de atividades com o player de áudio
 * Este arquivo demonstra como adicionar o rastreamento de atividades
 * ao player existente do projeto
 */

"use client";

import { useEffect, useRef } from "react";
import { useAtividade } from "../../hooks/use-atividade";
// import { useAuth } from '@/contexts/auth-context'; // Descomente quando disponível

interface PlayerAtividadeIntegrationProps {
  currentTrack: any;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTrackEnd?: () => void;
  onTrackSkip?: () => void;
  onLike?: () => void;
  onUnlike?: () => void;
}

/**
 * Hook que integra o sistema de atividades ao player de áudio
 * Este hook deve ser usado dentro do componente do player global
 */
export function usePlayerAtividade({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onTrackEnd,
  onTrackSkip,
  onLike,
  onUnlike,
}: PlayerAtividadeIntegrationProps) {
  const {
    registrarReproducao,
    registrarPausa,
    registrarPulo,
    registrarCurtida,
    registrarDescurtida,
    loading: atividadeLoading,
    error: atividadeError,
  } = useAtividade();

  // const { user } = useAuth(); // Descomente quando disponível
  const user = { id: "usuario-exemplo" }; // Remover quando auth estiver disponível

  // Refs para controlar quando registrar atividades
  const hasRegisteredPlay = useRef(false);
  const lastTrackId = useRef<string | null>(null);
  const pauseTimeRef = useRef<number>(0);

  // Resetar flags quando a música mudar
  useEffect(() => {
    if (currentTrack?.id !== lastTrackId.current) {
      hasRegisteredPlay.current = false;
      lastTrackId.current = currentTrack?.id || null;
      pauseTimeRef.current = 0;
    }
  }, [currentTrack?.id]);

  // Registrar reprodução quando a música começar a tocar
  useEffect(() => {
    const registrarPlay = async () => {
      if (
        currentTrack?.id &&
        isPlaying &&
        !hasRegisteredPlay.current &&
        user?.id &&
        currentTime > 3 // Aguardar 3 segundos para confirmar que o usuário está realmente ouvindo
      ) {
        try {
          await registrarReproducao(user.id, currentTrack.id);
          hasRegisteredPlay.current = true;
          console.log(`✅ Reprodução registrada: ${currentTrack.title}`);
        } catch (error) {
          console.error("Erro ao registrar reprodução:", error);
        }
      }
    };

    registrarPlay();
  }, [currentTrack?.id, isPlaying, currentTime, user?.id, registrarReproducao]);

  // Registrar pausa quando o usuário pausar
  useEffect(() => {
    const registrarPausaFunc = async () => {
      if (
        currentTrack?.id &&
        !isPlaying &&
        hasRegisteredPlay.current &&
        user?.id &&
        currentTime > pauseTimeRef.current + 1 // Evitar registros duplicados
      ) {
        try {
          await registrarPausa(user.id, currentTrack.id);
          pauseTimeRef.current = currentTime;
          console.log(`⏸️ Pausa registrada: ${currentTrack.title}`);
        } catch (error) {
          console.error("Erro ao registrar pausa:", error);
        }
      }
    };

    if (!isPlaying && hasRegisteredPlay.current) {
      registrarPausaFunc();
    }
  }, [isPlaying, currentTrack?.id, currentTime, user?.id, registrarPausa]);

  // Função para registrar pulo de música
  const handleTrackSkip = async () => {
    if (currentTrack?.id && user?.id && hasRegisteredPlay.current) {
      try {
        await registrarPulo(user.id, currentTrack.id);
        console.log(`⏭️ Pulo registrado: ${currentTrack.title}`);
      } catch (error) {
        console.error("Erro ao registrar pulo:", error);
      }
    }
    onTrackSkip?.();
  };

  // Função para registrar curtida
  const handleLike = async () => {
    if (currentTrack?.id && user?.id) {
      try {
        await registrarCurtida(user.id, currentTrack.id);
        console.log(`❤️ Curtida registrada: ${currentTrack.title}`);
      } catch (error) {
        console.error("Erro ao registrar curtida:", error);
      }
    }
    onLike?.();
  };

  // Função para registrar descurtida
  const handleUnlike = async () => {
    if (currentTrack?.id && user?.id) {
      try {
        await registrarDescurtida(user.id, currentTrack.id);
        console.log(`💔 Descurtida registrada: ${currentTrack.title}`);
      } catch (error) {
        console.error("Erro ao registrar descurtida:", error);
      }
    }
    onUnlike?.();
  };

  // Registrar quando a música terminar naturalmente
  useEffect(() => {
    if (
      currentTrack?.id &&
      duration > 0 &&
      currentTime >= duration - 1 && // 1 segundo antes do fim
      hasRegisteredPlay.current &&
      user?.id
    ) {
      // A música foi ouvida completamente
      console.log(`🎵 Música ouvida completamente: ${currentTrack.title}`);
      onTrackEnd?.();
    }
  }, [currentTime, duration, currentTrack?.id, user?.id, onTrackEnd]);

  return {
    handleTrackSkip,
    handleLike,
    handleUnlike,
    atividadeLoading,
    atividadeError,
    isTrackingEnabled: !!user?.id,
  };
}

/**
 * Componente de exemplo que mostra como usar o hook de atividades
 */
export function ExemploPlayerComAtividades() {
  // Estados mockados do player (substitua pelos reais)
  const currentTrack = {
    id: "track-123",
    title: "Música Exemplo",
    artist: "Artista Exemplo",
  };
  const isPlaying = false;
  const currentTime = 0;
  const duration = 180;

  const {
    handleTrackSkip,
    handleLike,
    handleUnlike,
    atividadeLoading,
    atividadeError,
    isTrackingEnabled,
  } = usePlayerAtividade({
    currentTrack,
    isPlaying,
    currentTime,
    duration,
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">
        Player com Rastreamento de Atividades
      </h3>

      {/* Informações da música */}
      <div className="mb-4">
        <h4 className="font-medium">{currentTrack.title}</h4>
        <p className="text-gray-600 text-sm">{currentTrack.artist}</p>
      </div>

      {/* Status do rastreamento */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm">
          <strong>Rastreamento:</strong>{" "}
          {isTrackingEnabled ? "✅ Ativo" : "❌ Inativo"}
        </p>
        {atividadeLoading && (
          <p className="text-sm text-blue-600">⏳ Registrando atividade...</p>
        )}
        {atividadeError && (
          <p className="text-sm text-red-600">❌ Erro: {atividadeError}</p>
        )}
      </div>

      {/* Controles com rastreamento */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleTrackSkip}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={atividadeLoading}
        >
          ⏭️ Pular
        </button>
        <button
          onClick={handleLike}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={atividadeLoading}
        >
          ❤️ Curtir
        </button>
        <button
          onClick={handleUnlike}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={atividadeLoading}
        >
          💔 Descurtir
        </button>
      </div>

      {/* Instruções */}
      <div className="mt-6 p-3 bg-blue-50 rounded text-sm">
        <h5 className="font-medium text-blue-900 mb-2">
          Como integrar ao player real:
        </h5>
        <ol className="list-decimal list-inside text-blue-800 space-y-1">
          <li>
            Importe o hook <code>usePlayerAtividade</code>
          </li>
          <li>Passe os props do player atual</li>
          <li>Use as funções retornadas nos eventos correspondentes</li>
          <li>Configure o contexto de autenticação</li>
        </ol>
      </div>
    </div>
  );
}
