import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Inicializa o Firebase Admin SDK
 * Usado para operações server-side com privilégios administrativos
 */
let app;

if (getApps().length === 0) {
  // Verifica se as variáveis de ambiente estão configuradas
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.error(
      "❌ Firebase Admin SDK: Variáveis de ambiente obrigatórias não encontradas"
    );
    console.error("Configure: FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL");
    throw new Error("Firebase Admin SDK configuration is incomplete");
  }

  app = initializeApp({
    credential: cert({
      projectId,
      privateKey,
      clientEmail,
    }),
    projectId,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("✅ Firebase Admin SDK initialized successfully");
  }
} else {
  app = getApps()[0];
}

// Exporta a instância do Firestore Admin
export const adminDb = getFirestore(app);

export default app;
