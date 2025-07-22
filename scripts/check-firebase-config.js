#!/usr/bin/env node

/**
 * Script de verificação das configurações do Firebase
 * Execute: node scripts/check-firebase-config.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔥 VERIFICANDO CONFIGURAÇÃO DO FIREBASE...\n");

// Verificar se o arquivo .env existe
const envPath = path.join(process.cwd(), ".env");
const envLocalPath = path.join(process.cwd(), ".env.local");

let envFilePath = null;
let envFileName = "";

if (fs.existsSync(envPath)) {
  envFilePath = envPath;
  envFileName = ".env";
} else if (fs.existsSync(envLocalPath)) {
  envFilePath = envLocalPath;
  envFileName = ".env.local";
}

if (!envFilePath) {
  console.log("❌ Nenhum arquivo de ambiente encontrado (.env ou .env.local)");
  console.log("✅ Solução: Crie o arquivo .env.local na raiz do projeto");
  console.log("📖 Consulte: FIREBASE_SETUP_GUIDE.md\n");
  process.exit(1);
}

console.log(`📄 Usando arquivo: ${envFileName}\n`);

// Ler o arquivo de ambiente
const envContent = fs.readFileSync(envFilePath, "utf8");
const envLines = envContent.split("\n");

// Variáveis necessárias
const requiredVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const foundVars = {};
const issues = [];

// Analisar cada linha do .env.local
envLines.forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, value] = line.split("=");
    if (key && value) {
      foundVars[key.trim()] = value.trim().replace(/['"]/g, "");
    }
  }
});

console.log("📋 STATUS DAS VARIÁVEIS:\n");

// Verificar cada variável necessária
requiredVars.forEach((varName) => {
  const value = foundVars[varName];

  if (!value) {
    console.log(`❌ ${varName}: NÃO DEFINIDA`);
    issues.push(`${varName} não está definida`);
  } else if (
    value.includes("your_") ||
    value === "your_api_key_here" ||
    value === "your_project_id_here"
  ) {
    console.log(`⚠️  ${varName}: VALOR PLACEHOLDER`);
    issues.push(`${varName} contém valor placeholder`);
  } else {
    console.log(`✅ ${varName}: CONFIGURADA`);
  }
});

console.log("\n" + "=".repeat(50));

if (issues.length === 0) {
  console.log("🎉 TODAS AS VARIÁVEIS ESTÃO CONFIGURADAS CORRETAMENTE!");
  console.log("✅ Você pode executar: npm run dev");
} else {
  console.log("🚨 PROBLEMAS ENCONTRADOS:");
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
  console.log("\n📖 PRÓXIMOS PASSOS:");
  console.log("1. Abra o arquivo FIREBASE_SETUP_GUIDE.md");
  console.log("2. Siga o guia passo a passo");
  console.log("3. Configure um projeto no Firebase Console");
  console.log(`4. Atualize as variáveis no ${envFileName}`);
  console.log("5. Execute este script novamente para verificar");
}

console.log("\n🔗 LINKS ÚTEIS:");
console.log("- Firebase Console: https://console.firebase.google.com/");
console.log("- Documentação: https://firebase.google.com/docs/web/setup");
console.log("- Guia do projeto: ./FIREBASE_SETUP_GUIDE.md");

console.log("\n" + "=".repeat(50));
