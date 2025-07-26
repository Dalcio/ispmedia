#!/usr/bin/env node

/**
 * Script para implantar regras de segurança do Firebase
 * Execute com: node scripts/deploy-firebase-rules.js
 */

const { exec } = require("child_process");
const path = require("path");

console.log("🚀 Implantando regras de segurança do Firebase...\n");

// Verificar se Firebase CLI está instalado
exec("firebase --version", (error) => {
  if (error) {
    console.error("❌ Firebase CLI não está instalado.");
    console.log("📦 Instale com: npm install -g firebase-tools");
    console.log("🔑 Depois faça login: firebase login");
    process.exit(1);
  }

  // Verificar se está logado e com projeto correto
  checkProject();
});

function checkProject() {
  console.log("🔍 Verificando projeto atual...");

  exec("firebase projects:list", (error, stdout, stderr) => {
    if (error) {
      console.error(
        "❌ Erro ao verificar projetos. Faça login primeiro:",
        error.message
      );
      console.log("🔑 Execute: firebase login");
      return;
    }

    console.log("✅ Projetos Firebase disponíveis:");
    console.log(stdout);

    // Definir projeto
    setProject();
  });
}

function setProject() {
  console.log("🎯 Definindo projeto ispmedia-70af7...");

  exec("firebase use ispmedia-70af7", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao definir projeto:", error.message);
      console.log("🔧 Certifique-se de ter acesso ao projeto ispmedia-70af7");
      return;
    }

    console.log("✅ Projeto definido com sucesso!");
    console.log(stdout);

    // Implantar regras
    deployRules();
  });
}

function deployRules() {
  console.log("\n📝 Implantando regras do Firestore...");

  exec("firebase deploy --only firestore:rules", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Erro ao implantar regras do Firestore:", error.message);
      console.error("Detalhes:", stderr);
      return;
    }

    console.log("✅ Regras do Firestore implantadas com sucesso!");
    console.log(stdout);

    // Implantar regras do Storage
    console.log("\n📁 Implantando regras do Storage...");

    exec("firebase deploy --only storage", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Erro ao implantar regras do Storage:", error.message);
        console.error("Detalhes:", stderr);

        // Tentar comando alternativo
        console.log("\n🔄 Tentando comando alternativo...");
        exec(
          "firebase deploy --only storage:rules",
          (error2, stdout2, stderr2) => {
            if (error2) {
              console.error(
                "❌ Comando alternativo também falhou:",
                error2.message
              );
              console.log("\n🛠️ Tente manualmente:");
              console.log("1. firebase login");
              console.log("2. firebase use ispmedia-70af7");
              console.log("3. firebase deploy --only firestore:rules");
              console.log("4. firebase deploy --only storage");
              return;
            }

            console.log(
              "✅ Regras do Storage implantadas com sucesso (comando alternativo)!"
            );
            console.log(stdout2);
            finishDeploy();
          }
        );
        return;
      }

      console.log("✅ Regras do Storage implantadas com sucesso!");
      console.log(stdout);
      finishDeploy();
    });
  });
}

function finishDeploy() {
  console.log("\n🎉 Todas as regras foram implantadas com sucesso!");
  console.log("\n📋 Próximos passos:");
  console.log("1. Teste o upload de música na aplicação");
  console.log("2. Verifique se não há erros no console do navegador");
  console.log("3. Monitore os logs do Firebase Console");
  console.log("\n🔗 Links úteis:");
  console.log(
    "- Firestore Rules: https://console.firebase.google.com/project/ispmedia-70af7/firestore/rules"
  );
  console.log(
    "- Storage Rules: https://console.firebase.google.com/project/ispmedia-70af7/storage/rules"
  );
}
