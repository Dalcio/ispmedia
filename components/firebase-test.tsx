// Test Firebase connection
'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signInAnonymously, signOut } from 'firebase/auth';

export default function FirebaseTest() {  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [authStatus, setAuthStatus] = useState<'signed-out' | 'signed-in' | 'error'>('signed-out');
  const [firestoreStatus, setFirestoreStatus] = useState<'untested' | 'working' | 'error'>('untested');
  const [apiStatus, setApiStatus] = useState<'untested' | 'working' | 'error'>('untested');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Test Firebase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        addLog('Testando conexão com Firebase...');
        
        // Test if Firebase is initialized
        if (auth && db) {
          setConnectionStatus('connected');
          addLog('✅ Firebase inicializado com sucesso');
        } else {
          throw new Error('Firebase não foi inicializado');
        }
      } catch (error) {
        setConnectionStatus('error');
        addLog(`❌ Erro na conexão: ${error}`);
      }
    };

    testConnection();
  }, []);

  // Test Authentication
  const testAuth = async () => {
    try {
      addLog('Testando Firebase Authentication...');
      const userCredential = await signInAnonymously(auth);
      setAuthStatus('signed-in');
      addLog(`✅ Login anônimo realizado: ${userCredential.user.uid}`);
    } catch (error) {
      setAuthStatus('error');
      addLog(`❌ Erro na autenticação: ${error}`);
    }
  };

  // Test Firestore
  const testFirestore = async () => {
    try {
      addLog('Testando Firestore...');
      
      // Try to add a test document
      const testCollection = collection(db, 'connection-test');
      const docRef = await addDoc(testCollection, {
        message: 'Teste de conexão',
        timestamp: new Date(),
        source: 'frontend'
      });
      addLog(`✅ Documento criado: ${docRef.id}`);
      
      // Try to read documents
      const querySnapshot = await getDocs(testCollection);
      addLog(`✅ Leitura realizada: ${querySnapshot.size} documentos encontrados`);
      
      // Clean up - delete the test document
      await deleteDoc(doc(db, 'connection-test', docRef.id));
      addLog(`✅ Documento removido: ${docRef.id}`);
      
      setFirestoreStatus('working');
      addLog('✅ Firestore funcionando corretamente');
    } catch (error) {
      setFirestoreStatus('error');
      addLog(`❌ Erro no Firestore: ${error}`);
    }
  };  // Test API Routes (Server-side Firebase)
  const testApiRoutes = async () => {
    try {
      addLog('Testando API Routes (Server-side)...');
      
      // Test GET endpoint
      const getResponse = await fetch('/api/test-firebase');
      const getData = await getResponse.json();
      
      if (getData.success) {
        addLog(`✅ GET /api/test-firebase: ${getData.message}`);
        addLog(`📊 Serviços: ${JSON.stringify(getData.services)}`);
      } else {
        throw new Error(getData.message);
      }
      
      // Test POST endpoint - write
      const postWriteResponse = await fetch('/api/test-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-write' })
      });
      const writeData = await postWriteResponse.json();
      
      if (writeData.success) {
        addLog(`✅ POST write test: ${writeData.message}`);
        addLog(`📝 Document ID: ${writeData.documentId}`);
      } else {
        throw new Error(writeData.message);
      }
      
      // Test POST endpoint - read
      const postReadResponse = await fetch('/api/test-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test-read' })
      });
      const readData = await postReadResponse.json();
      
      if (readData.success) {
        addLog(`✅ POST read test: ${readData.message}`);
        addLog(`📚 Documents found: ${readData.count}`);
      } else {
        throw new Error(readData.message);
      }
      
      setApiStatus('working');
      addLog('✅ API Routes funcionando corretamente');
    } catch (error) {
      setApiStatus('error');
      addLog(`❌ Erro nas API Routes: ${error}`);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthStatus('signed-out');
      addLog('✅ Logout realizado');
    } catch (error) {
      addLog(`❌ Erro no logout: ${error}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'signed-in':
      case 'working':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'testing':
      case 'untested':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🔥 Teste de Conexão Firebase
        </h2>        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Conexão</h3>
            <p className={`text-sm ${getStatusColor(connectionStatus)}`}>
              {connectionStatus === 'testing' && '⏳ Testando...'}
              {connectionStatus === 'connected' && '✅ Conectado'}
              {connectionStatus === 'error' && '❌ Erro'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Authentication</h3>
            <p className={`text-sm ${getStatusColor(authStatus)}`}>
              {authStatus === 'signed-out' && '🔓 Não autenticado'}
              {authStatus === 'signed-in' && '🔐 Autenticado'}
              {authStatus === 'error' && '❌ Erro'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Firestore</h3>
            <p className={`text-sm ${getStatusColor(firestoreStatus)}`}>
              {firestoreStatus === 'untested' && '⚪ Não testado'}
              {firestoreStatus === 'working' && '✅ Funcionando'}
              {firestoreStatus === 'error' && '❌ Erro'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">API Routes</h3>
            <p className={`text-sm ${getStatusColor(apiStatus)}`}>
              {apiStatus === 'untested' && '⚪ Não testado'}
              {apiStatus === 'working' && '✅ Funcionando'}
              {apiStatus === 'error' && '❌ Erro'}
            </p>
          </div>
        </div>        {/* Test Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={testAuth}
            disabled={connectionStatus !== 'connected' || authStatus === 'signed-in'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Testar Authentication
          </button>

          <button
            onClick={testFirestore}
            disabled={connectionStatus !== 'connected'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Testar Firestore
          </button>

          <button
            onClick={testApiRoutes}
            disabled={connectionStatus !== 'connected'}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Testar API Routes
          </button>

          <button
            onClick={handleSignOut}
            disabled={authStatus !== 'signed-in'}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Out
          </button>

          <button
            onClick={() => setLogs([])}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Limpar Logs
          </button>
        </div>

        {/* Logs */}
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-60 overflow-y-auto">
          <h3 className="text-white mb-2">📋 Logs de Teste:</h3>
          {logs.length === 0 ? (
            <p className="text-gray-500">Nenhum log ainda...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📋 Instruções para configurar Firebase:
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
            <li>Acesse o <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
            <li>Vá em Project Settings → General → Your apps</li>
            <li>Copie as configurações e cole no arquivo <code>.env</code></li>
            <li>Para o Admin SDK: Project Settings → Service accounts → Generate new private key</li>
            <li>Configure as variáveis FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, etc.</li>
            <li>Ative Authentication e Firestore no console</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
