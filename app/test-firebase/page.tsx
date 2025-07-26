'use client';

import { useAuth } from '@/contexts/auth-context';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function TestFirebaseConnection() {
  const { user, userProfile } = useAuth();

  const testFirebaseConnection = async () => {
    try {
      console.log("🔍 Estado do usuário:", {
        user: !!user,
        userId: user?.uid,
        userProfile: !!userProfile,
        userName: userProfile?.name
      });

      if (!user) {
        console.error("❌ Usuário não logado");
        return;
      }

      // Test creating a simple document
      const testData = {
        userId: user.uid,
        userDisplayName: userProfile?.name || user.displayName || "Usuário de Teste",
        userAvatar: user.photoURL || "",
        content: "Teste de comentário",
        status: "pending",
        timestamp: serverTimestamp(),
      };

      console.log("🔍 Dados de teste:", testData);

      const commentsRef = collection(db, `tracks/test-track-id/comments`);
      const docRef = await addDoc(commentsRef, testData);
      
      console.log("✅ Documento criado com sucesso! ID:", docRef.id);
      alert("✅ Teste de conexão Firebase bem-sucedido!");
      
    } catch (error) {
      console.error("❌ Erro no teste de conexão:", error);
      alert(`❌ Erro no teste: ${(error as any)?.message || 'Erro desconhecido'}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
        <div className="glass-panel rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-primary-400 mb-4">
            Teste Firebase - Comentários
          </h1>
          <p className="text-text-600">
            Faça login para testar a conexão com o Firebase
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="glass-panel rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-primary-400 mb-4">
            Teste Firebase - Sistema de Comentários
          </h1>
          
          <div className="space-y-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-primary-300 mb-2">Estado da Autenticação:</h2>
              <div className="bg-dark-800 rounded-lg p-4 text-sm">
                <p><strong>Usuário logado:</strong> {user ? '✅ Sim' : '❌ Não'}</p>
                <p><strong>User ID:</strong> {user?.uid || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Nome (Profile):</strong> {userProfile?.name || 'N/A'}</p>
                <p><strong>Nome (Auth):</strong> {user?.displayName || 'N/A'}</p>
                <p><strong>Avatar:</strong> {user?.photoURL || 'N/A'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={testFirebaseConnection}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            🧪 Testar Conexão Firebase
          </button>

          <div className="mt-6 text-sm text-text-500">
            <p><strong>O que este teste faz:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Verifica se o usuário está autenticado</li>
              <li>Tenta criar um documento de comentário de teste</li>
              <li>Verifica se as regras de segurança estão funcionando</li>
              <li>Mostra logs detalhados no console</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
