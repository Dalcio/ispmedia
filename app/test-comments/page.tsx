'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { TrackComments, TrackModeration } from '@/components/comments';

// Página de teste para o sistema de comentários
export default function TestCommentsPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'comments' | 'moderation'>('comments');
  
  // Track de exemplo para teste
  const testTrack = {
    id: 'test-track-1',
    title: 'Track de Teste',
    createdBy: user?.uid || 'test-user',
    genre: 'Electronic',
    audioUrl: 'https://example.com/test.mp3'
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="glass-panel rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-primary-400 mb-4">
            Sistema de Comentários - Teste
          </h1>
          <p className="text-text-600">
            Faça login para testar o sistema de comentários
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-panel rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-primary-400 mb-2">
            Teste - Sistema de Comentários
          </h1>
          <p className="text-text-600">
            Página para testar a funcionalidade completa do sistema de comentários com moderação
          </p>
          <div className="mt-4 text-sm text-text-500">
            <p><strong>Track de Teste:</strong> {testTrack.title}</p>
            <p><strong>Criado por:</strong> {testTrack.createdBy}</p>
            <p><strong>Usuário atual:</strong> {user.uid}</p>
            <p><strong>É o criador?</strong> {testTrack.createdBy === user.uid ? 'Sim' : 'Não'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-panel rounded-xl p-6">
          <div className="flex gap-4 mb-6 border-b border-glass-200">
            <button
              onClick={() => setSelectedTab('comments')}
              className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                selectedTab === 'comments'
                  ? 'text-primary-400 border-primary-400'
                  : 'text-text-600 border-transparent hover:text-primary-300'
              }`}
            >
              Comentários
            </button>
            {testTrack.createdBy === user.uid && (
              <button
                onClick={() => setSelectedTab('moderation')}
                className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                  selectedTab === 'moderation'
                    ? 'text-primary-400 border-primary-400'
                    : 'text-text-600 border-transparent hover:text-primary-300'
                }`}
              >
                Moderação
              </button>
            )}
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {selectedTab === 'comments' && (
              <TrackComments trackId={testTrack.id} />
            )}
            {selectedTab === 'moderation' && testTrack.createdBy === user.uid && (
              <TrackModeration trackId={testTrack.id} />
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="glass-panel rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold text-primary-400 mb-4">
            Como Testar
          </h2>
          <div className="space-y-3 text-text-600">
            <div>
              <h3 className="font-medium text-text-400">1. Comentários:</h3>
              <p>• Digite um comentário na aba "Comentários"</p>
              <p>• O comentário ficará pendente de aprovação</p>
              <p>• Apenas comentários aprovados aparecem publicamente</p>
            </div>
            
            {testTrack.createdBy === user.uid && (
              <div>
                <h3 className="font-medium text-text-400">2. Moderação:</h3>
                <p>• Acesse a aba "Moderação" (visível apenas para você)</p>
                <p>• Aprove ou rejeite comentários pendentes</p>
                <p>• Comentários aprovados aparecerão na aba pública</p>
              </div>
            )}
            
            <div>
              <h3 className="font-medium text-text-400">3. Tempo Real:</h3>
              <p>• Abra em múltiplas abas/usuários para ver atualizações em tempo real</p>
              <p>• Mudanças de status são refletidas automaticamente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
