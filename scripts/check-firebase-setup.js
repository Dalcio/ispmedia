#!/usr/bin/env node

/**
 * Script para verificar a configuração do Firebase
 * Execute com: node scripts/check-firebase-setup.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando configuração do Firebase...\n");

// Verificar se arquivo .env.local existe
const envLocalPath = path.join(process.cwd(), ".env.local");
const envPath = path.join(process.cwd(), ".env");

let envFile = null;
if (fs.existsSync(envLocalPath)) {
  envFile = envLocalPath;
  console.log("📁 Arquivo encontrado: .env.local");
} else if (fs.existsSync(envPath)) {
  envFile = envPath;
  console.log("📁 Arquivo encontrado: .env");
} else {
  console.log("❌ Nenhum arquivo de ambiente encontrado (.env.local ou .env)");
}

// Carregar variáveis de ambiente se arquivo existir
if (envFile) {
  const envContent = fs.readFileSync(envFile, "utf8");
  const envLines = envContent.split("\n");

  envLines.forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
}

// Verificar variáveis de ambiente
const requiredEnvVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

let hasAllEnvVars = true;

console.log("\n📋 Verificando variáveis de ambiente:");
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Configurada`);
  } else {
    console.log(`❌ ${varName}: Não encontrada`);
    hasAllEnvVars = false;
  }
});

if (!hasAllEnvVars) {
  console.log("\n❌ Algumas variáveis de ambiente estão faltando.");
  console.log("📝 Crie um arquivo .env.local na raiz do projeto com:");
  console.log(`
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
`);
  process.exit(1);
}

console.log("\n✅ Todas as variáveis de ambiente estão configuradas!");

// Verificar configuração do projeto
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

console.log(`\n🔥 Projeto Firebase: ${projectId}`);
console.log(`📁 Storage Bucket: ${storageBucket}`);

// Verificar se arquivos de regras existem
const rulesFiles = [
  { file: "storage.rules", name: "Storage Rules" },
  { file: "firestore.rules", name: "Firestore Rules" },
  { file: "firebase.json", name: "Firebase Config" },
];

console.log("\n📝 Verificando arquivos de configuração:");
rulesFiles.forEach(({ file, name }) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${name}: ${file} encontrado`);
  } else {
    console.log(`❌ ${name}: ${file} não encontrado`);
  }
});

console.log("\n📝 Instruções para corrigir problemas de upload:");
console.log("1. Certifique-se de que está autenticado no Firebase CLI:");
console.log("   firebase login");
console.log("\n2. Implante as regras de segurança:");
console.log("   firebase deploy --only storage:rules,firestore:rules");
console.log("\n3. Verifique as regras no Firebase Console:");
console.log(
  `   https://console.firebase.google.com/project/${projectId}/storage/rules`
);
console.log(
  "\n4. Se ainda houver problemas de CORS, configure no Firebase Console:"
);
console.log(
  `   https://console.firebase.google.com/project/${projectId}/storage`
);

console.log("\n🎯 Verificação concluída!");
