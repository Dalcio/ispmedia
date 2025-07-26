#!/usr/bin/env node

/**
 * Script para fazer deploy dos índices do Firestore
 * Este script deve ser executado para criar os índices necessários no Firebase
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("🔥 Deploy dos Índices do Firestore - ISPmedia");
console.log("================================================");

try {
  // Verificar se o Firebase CLI está instalado
  try {
    execSync("firebase --version", { stdio: "ignore" });
    console.log("✅ Firebase CLI encontrado");
  } catch (error) {
    console.error(
      "❌ Firebase CLI não encontrado. Instale com: npm install -g firebase-tools"
    );
    process.exit(1);
  }

  // Verificar se está logado no Firebase
  try {
    execSync("firebase projects:list", { stdio: "ignore" });
    console.log("✅ Autenticado no Firebase");
  } catch (error) {
    console.error("❌ Não autenticado. Execute: firebase login");
    process.exit(1);
  }

  // Fazer deploy dos índices
  console.log("🚀 Fazendo deploy dos índices...");

  const result = execSync("firebase deploy --only firestore:indexes", {
    encoding: "utf8",
    cwd: path.resolve(__dirname, ".."),
  });

  console.log(result);
  console.log("✅ Índices do Firestore deployados com sucesso!");
  console.log("");
  console.log("📋 Índices criados:");
  console.log("   • tracks: createdBy + createdAt (DESC)");
  console.log("   • tracks: genre + createdAt (DESC)");
  console.log("   • playlists: createdBy + createdAt (DESC)");
  console.log("");
  console.log(
    "🎉 Agora você pode usar as consultas ordenadas no UserTrackList!"
  );
} catch (error) {
  console.error("❌ Erro ao fazer deploy dos índices:", error.message);
  console.log("");
  console.log("💡 Soluções alternativas:");
  console.log(
    "   1. Execute manualmente: firebase deploy --only firestore:indexes"
  );
  console.log(
    "   2. Acesse o console do Firebase e crie os índices manualmente"
  );
  console.log("   3. Use o link fornecido no erro para criar automaticamente");
  process.exit(1);
}
