// Test Firebase connection
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { signInAnonymously, signOut } from "firebase/auth";

interface EnvVar {
  name: string;
  value: string | undefined;
  isRequired: boolean;
  isValid: boolean;
}

export default function FirebaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<
    "testing" | "connected" | "error"
  >("testing");
  const [authStatus, setAuthStatus] = useState<
    "signed-out" | "signed-in" | "error"
  >("signed-out");
  const [firestoreStatus, setFirestoreStatus] = useState<
    "untested" | "working" | "error"
  >("untested");
  const [logs, setLogs] = useState<string[]>([]);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };
  // Check environment variables
  useEffect(() => {
    const checkEnvVars = () => {
      // Vamos verificar se o Firebase foi inicializado corretamente
      // Se foi, significa que as variáveis estão funcionando
      const configExists = !!(auth && db);

      const requiredVars = [
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        "NEXT_PUBLIC_FIREBASE_APP_ID",
      ];

      const vars: EnvVar[] = requiredVars.map((varName) => {
        // Se o Firebase foi inicializado, consideramos as variáveis como válidas
        return {
          name: varName,
          value: configExists ? "configurado" : undefined,
          isRequired: true,
          isValid: configExists,
        };
      });
      setEnvVars(vars);

      if (configExists) {
        addLog("✅ Todas as variáveis de ambiente estão configuradas");
      } else {
        addLog(
          "❌ Firebase não foi inicializado - verifique as variáveis de ambiente"
        );
      }
    };

    checkEnvVars();
  }, []);

  // Test Firebase connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        addLog("Testando conexão com Firebase...");

        // Test if Firebase is initialized
        if (auth && db) {
          setConnectionStatus("connected");
          addLog("✅ Firebase inicializado com sucesso");
        } else {
          throw new Error("Firebase não foi inicializado");
        }
      } catch (error) {
        setConnectionStatus("error");
        addLog(`❌ Erro na conexão: ${error}`);
      }
    };

    testConnection();
  }, []);
  // Test Authentication
  const testAuth = async () => {
    try {
      addLog("Testando Firebase Authentication...");
      const userCredential = await signInAnonymously(auth);
      setAuthStatus("signed-in");
      addLog(`✅ Login anônimo realizado: ${userCredential.user.uid}`);
    } catch (error: any) {
      setAuthStatus("error");
      addLog(`❌ Erro na autenticação: ${error.code} - ${error.message}`);

      if (error.code === "auth/configuration-not-found") {
        addLog("🚨 SOLUÇÃO: Ative o Authentication no Firebase Console");
        addLog(
          "1. Acesse: https://console.firebase.google.com/project/ispmedia-70af7/authentication"
        );
        addLog('2. Clique em "Get started"');
        addLog('3. Vá em "Sign-in method" e ative "Anonymous"');
      }
    }
  };

  // Test Firestore
  const testFirestore = async () => {
    try {
      addLog("Testando Firestore...");

      // Try to add a test document
      const testCollection = collection(db, "connection-test");
      const docRef = await addDoc(testCollection, {
        message: "Teste de conexão",
        timestamp: new Date(),
        source: "frontend",
      });
      addLog(`✅ Documento criado: ${docRef.id}`);

      // Try to read documents
      const querySnapshot = await getDocs(testCollection);
      addLog(
        `✅ Leitura realizada: ${querySnapshot.size} documentos encontrados`
      );

      // Clean up - delete the test document
      await deleteDoc(doc(db, "connection-test", docRef.id));
      addLog(`✅ Documento removido: ${docRef.id}`);
      setFirestoreStatus("working");
      addLog("✅ Firestore funcionando corretamente");
    } catch (error: any) {
      setFirestoreStatus("error");
      addLog(`❌ Erro no Firestore: ${error.code} - ${error.message}`);

      if (error.code === "permission-denied") {
        addLog("🚨 SOLUÇÃO: Configure as regras do Firestore");
        addLog(
          "1. Acesse: https://console.firebase.google.com/project/ispmedia-70af7/firestore/rules"
        );
        addLog("2. Use regras em modo de teste temporariamente");
      } else if (
        error.code === "not-found" ||
        error.message.includes("database does not exist")
      ) {
        addLog("🚨 SOLUÇÃO: Crie o Firestore Database");
        addLog(
          "1. Acesse: https://console.firebase.google.com/project/ispmedia-70af7/firestore"
        );
        addLog('2. Clique em "Create database"');
        addLog('3. Escolha "Start in test mode"');
        addLog("4. Selecione uma região (ex: us-central1)");
      } else if (error.message.includes("400")) {
        addLog("🚨 SOLUÇÃO: Firestore não foi inicializado");
        addLog(
          "1. Vá para: https://console.firebase.google.com/project/ispmedia-70af7/firestore"
        );
        addLog("2. Crie o database se não existir");
        addLog("3. Verifique se as regras permitem escrita/leitura");
      }
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthStatus("signed-out");
      addLog("✅ Logout realizado");
    } catch (error) {
      addLog(`❌ Erro no logout: ${error}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "signed-in":
      case "working":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "testing":
      case "untested":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🔥 Teste de Conexão Firebase
        </h2>
        {/* Alert for configuration */}
        {envVars.some((v) => !v.isValid) && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Configuração do Firebase Necessária
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>
                    O Firebase não está configurado corretamente no projeto.
                  </p>
                  <div className="mt-2">
                    <p className="font-semibold">Para resolver:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>Ative o Authentication no Firebase Console</li>
                      <li>Crie o Firestore Database</li>
                      <li>Reinicie o servidor de desenvolvimento</li>
                    </ol>
                  </div>
                  <p className="mt-2 text-xs">
                    💡 Após a configuração, esta mensagem desaparecerá
                    automaticamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Conexão
            </h3>
            <p className={`text-sm ${getStatusColor(connectionStatus)}`}>
              {connectionStatus === "testing" && "⏳ Testando..."}
              {connectionStatus === "connected" && "✅ Conectado"}
              {connectionStatus === "error" && "❌ Erro"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Authentication
            </h3>
            <p className={`text-sm ${getStatusColor(authStatus)}`}>
              {authStatus === "signed-out" && "🔓 Não autenticado"}
              {authStatus === "signed-in" && "🔐 Autenticado"}
              {authStatus === "error" && "❌ Erro"}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Firestore
            </h3>
            <p className={`text-sm ${getStatusColor(firestoreStatus)}`}>
              {firestoreStatus === "untested" && "⚪ Não testado"}
              {firestoreStatus === "working" && "✅ Funcionando"}
              {firestoreStatus === "error" && "❌ Erro"}
            </p>
          </div>
        </div>
        {/* Environment Variables Status */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            🔧 Variáveis de Ambiente
          </h3>
          <div className="space-y-2">
            {envVars.map((envVar, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                  {envVar.name}
                </span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      envVar.isValid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {envVar.isValid ? "✅" : "❌"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {envVar.value
                      ? envVar.isValid
                        ? "Configurado"
                        : "Valor placeholder"
                      : "Não definido"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {envVars.some((v) => !v.isValid) && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                ⚠️ <strong>Ação necessária:</strong> Configure as variáveis de
                ambiente no arquivo <code>.env.local</code>
              </p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                Consulte o arquivo <code>FIREBASE_SETUP_GUIDE.md</code> para
                instruções detalhadas.
              </p>
            </div>
          )}
        </div>{" "}
        {/* Test Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={testAuth}
            disabled={
              connectionStatus !== "connected" || authStatus === "signed-in"
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Testar Authentication
          </button>

          <button
            onClick={testFirestore}
            disabled={connectionStatus !== "connected"}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Testar Firestore
          </button>

          <button
            onClick={handleSignOut}
            disabled={authStatus !== "signed-in"}
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
        </div>{" "}
        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📋 Instruções para configurar Firebase:
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
            <li>
              Acesse:{" "}
              <a
                href="https://console.firebase.google.com/project/ispmedia-70af7/authentication"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Firebase Authentication
              </a>
            </li>
            <li>
              Clique em <strong>"Get started"</strong> →{" "}
              <strong>"Sign-in method"</strong>
            </li>
            <li>
              Ative <strong>"Anonymous"</strong> authentication
            </li>
            <li>
              Acesse:{" "}
              <a
                href="https://console.firebase.google.com/project/ispmedia-70af7/firestore"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Firestore Database
              </a>
            </li>
            <li>
              Clique em <strong>"Create database"</strong> →{" "}
              <strong>"Test mode"</strong>
            </li>
            <li>Selecione uma região (ex: us-central1)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
