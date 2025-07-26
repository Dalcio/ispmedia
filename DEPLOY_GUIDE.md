# 🚀 Guia de Implantação das Regras Firebase

## ⚠️ ERRO COMUM: "Could not find rules for storage targets"

Se você receber este erro, use os comandos abaixo na ordem exata:

### ✅ SOLUÇÃO RÁPIDA

```bash
# 1. Verificar se está logado
firebase login

# 2. Definir projeto
firebase use ispmedia-70af7

# 3. Implantar Firestore primeiro
firebase deploy --only firestore:rules

# 4. Implantar Storage (use apenas 'storage', não 'storage:rules')
firebase deploy --only storage

# OU use o script automatizado
npm run deploy-firebase-rules
```

## Passos para corrigir o problema de upload

### 1. Verificar Firebase CLI

```bash
firebase --version
```

Se não estiver instalado:

```bash
npm install -g firebase-tools
```

### 2. Fazer login no Firebase

```bash
firebase login
```

### 3. Verificar projeto atual

```bash
firebase projects:list
```

### 4. Definir projeto

```bash
firebase use ispmedia-70af7
```

### 5. Implantar regras de segurança (COMANDOS CORRETOS)

```bash
# CORRETO - Implantar regras do Firestore
firebase deploy --only firestore:rules

# CORRETO - Implantar regras do Storage (sem :rules)
firebase deploy --only storage

# ALTERNATIVA - Script automatizado
npm run deploy-firebase-rules
```

### 6. Verificar implantação

Acesse o Firebase Console:

- Storage: https://console.firebase.google.com/project/ispmedia-70af7/storage/rules
- Firestore: https://console.firebase.google.com/project/ispmedia-70af7/firestore/rules

## 🔧 Comandos de Diagnóstico

### Verificar configuração local

```bash
npm run check-firebase-setup
```

### Ver logs do Firebase

```bash
firebase functions:log
```

### Testar regras localmente (opcional)

```bash
firebase emulators:start --only storage,firestore
```

## 🎯 Teste Final

1. Execute todos os comandos acima
2. Faça login na aplicação
3. Tente fazer upload de um arquivo MP3
4. Verifique se não há mais erros de CORS

## ⚠️ Problema Comum

Se ainda houver erro de CORS, pode ser necessário configurar CORS no bucket do Storage:

1. Acesse o Google Cloud Console
2. Vá para Cloud Storage
3. Encontre o bucket `ispmedia-70af7.firebasestorage.app`
4. Configure CORS se necessário

```json
[
  {
    "origin": ["http://localhost:3000", "https://seu-dominio.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## 🆘 Se nada funcionar

Execute este comando para resetar e reconfigurar:

```bash
firebase logout
firebase login
firebase use ispmedia-70af7
firebase deploy --only storage:rules,firestore:rules
```
