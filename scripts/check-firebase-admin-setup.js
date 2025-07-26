#!/usr/bin/env node

/**
 * Script para verificar a configuração do Firebase Admin SDK
 * Execute com: node scripts/check-firebase-admin-setup.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando configuração do Firebase Admin SDK...\n");

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
  process.exit(1);
}

// Carregar variáveis de ambiente
const envContent = fs.readFileSync(envFile, "utf8");
const envVars = {};

envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

console.log("✅ Arquivo de ambiente carregado\n");

// Verificar variáveis obrigatórias do Firebase Admin
const requiredAdminVars = [
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
];

const requiredClientVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

console.log("🔑 Verificando variáveis do Firebase Admin SDK:");
let adminConfigComplete = true;

requiredAdminVars.forEach((varName) => {
  if (envVars[varName]) {
    if (varName === "FIREBASE_PRIVATE_KEY") {
      console.log(
        `✅ ${varName}: [Configurado - ${envVars[varName].length} caracteres]`
      );
    } else {
      console.log(`✅ ${varName}: ${envVars[varName]}`);
    }
  } else {
    console.log(`❌ ${varName}: [NÃO CONFIGURADO]`);
    adminConfigComplete = false;
  }
});

console.log("\n🌐 Verificando variáveis do Firebase Client SDK:");
let clientConfigComplete = true;

requiredClientVars.forEach((varName) => {
  if (envVars[varName]) {
    console.log(`✅ ${varName}: ${envVars[varName]}`);
  } else {
    console.log(`❌ ${varName}: [NÃO CONFIGURADO]`);
    clientConfigComplete = false;
  }
});

// Verificar se firebase-admin está instalado
console.log("\n📦 Verificando dependências:");
const packageJsonPath = path.join(process.cwd(), "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (dependencies["firebase-admin"]) {
    console.log(`✅ firebase-admin: ${dependencies["firebase-admin"]}`);
  } else {
    console.log("❌ firebase-admin: [NÃO INSTALADO]");
    console.log("   Execute: pnpm add firebase-admin");
    adminConfigComplete = false;
  }

  if (dependencies["firebase"]) {
    console.log(`✅ firebase: ${dependencies["firebase"]}`);
  } else {
    console.log("❌ firebase: [NÃO INSTALADO]");
    console.log("   Execute: pnpm add firebase");
    clientConfigComplete = false;
  }
} else {
  console.log("❌ package.json não encontrado");
  process.exit(1);
}

// Verificar arquivos de configuração
console.log("\n📄 Verificando arquivos de configuração:");

const configFiles = [
  "lib/firebase-admin.ts",
  "firebase/config.ts",
  "app/api/atividade/route.ts",
  "app/api/atividade/[userId]/route.ts",
];

configFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}: [NÃO ENCONTRADO]`);
  }
});

// Resumo final
console.log("\n" + "=".repeat(50));
console.log("📋 RESUMO DA CONFIGURAÇÃO");
console.log("=".repeat(50));

if (adminConfigComplete && clientConfigComplete) {
  console.log("🎉 CONFIGURAÇÃO COMPLETA!");
  console.log("✅ Firebase Admin SDK: Configurado");
  console.log("✅ Firebase Client SDK: Configurado");
  console.log("✅ APIs de Atividade: Implementadas");
  console.log("\n🚀 Você pode agora:");
  console.log("   • Testar as APIs em /test-atividade");
  console.log("   • Registrar atividades dos usuários");
  console.log("   • Consultar histórico de atividades");
} else {
  console.log("⚠️  CONFIGURAÇÃO INCOMPLETA");

  if (!adminConfigComplete) {
    console.log("❌ Firebase Admin SDK: Incompleto");
    console.log("\n📝 Para configurar o Firebase Admin:");
    console.log("1. Acesse: https://console.firebase.google.com/");
    console.log("2. Vá em Configurações > Contas de serviço");
    console.log("3. Clique em 'Gerar nova chave privada'");
    console.log("4. Baixe o arquivo JSON");
    console.log("5. Adicione as variáveis ao .env.local:");
    console.log(
      '   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
    );
    console.log(
      '   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com"'
    );
  }

  if (!clientConfigComplete) {
    console.log("❌ Firebase Client SDK: Incompleto");
    console.log(
      "   Configure as variáveis NEXT_PUBLIC_FIREBASE_* no .env.local"
    );
  }
}

console.log("\n📚 Para mais informações, consulte:");
console.log("   • ATIVIDADE_USUARIO_README.md");
console.log("   • FIREBASE_SETUP_GUIDE.md");
