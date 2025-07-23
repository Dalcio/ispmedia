# 🔥 Firebase Setup - ISPmedia

Este guia ajuda você a configurar o Firebase corretamente para resolver problemas de upload.

## 🚨 Problema Atual: Upload não funciona

Os erros de CORS e "net::ERR_FAILED" geralmente indicam problemas de configuração no Firebase Storage.

## 🔧 Solução Rápida

### 1. Verificar Configuração

```bash
npm run check-firebase-setup
```

### 2. Implantar Regras de Segurança

```bash
# Certifique-se de estar logado no Firebase CLI
firebase login

# Implante as regras
npm run deploy-firebase-rules
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ispmedia-70af7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ispmedia-70af7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ispmedia-70af7.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

## 🔒 Regras de Segurança

### Firebase Storage (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /tracks/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 50 * 1024 * 1024
                   && request.resource.contentType.matches('audio/.*');
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Firestore (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /tracks/{trackId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == resource.data.createdBy;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }
  }
}
```

## 🎯 Estrutura de Arquivos no Storage

```
storage/
└── tracks/
    └── {userId}/
        └── {timestamp}_{title}.{ext}
```

Exemplo: `tracks/ABC123/1642089600000_minha_musica.mp3`

## 🔍 Verificar no Firebase Console

1. **Autenticação**: https://console.firebase.google.com/project/ispmedia-70af7/authentication
2. **Firestore**: https://console.firebase.google.com/project/ispmedia-70af7/firestore
3. **Storage**: https://console.firebase.google.com/project/ispmedia-70af7/storage
4. **Regras Storage**: https://console.firebase.google.com/project/ispmedia-70af7/storage/rules
5. **Regras Firestore**: https://console.firebase.google.com/project/ispmedia-70af7/firestore/rules

## ⚡ Comandos Úteis

```bash
# Verificar configuração
npm run check-firebase-setup

# Implantar apenas regras do Storage
firebase deploy --only storage:rules

# Implantar apenas regras do Firestore
firebase deploy --only firestore:rules

# Implantar todas as regras
npm run deploy-firebase-rules

# Verificar status do projeto
firebase projects:list

# Ver logs em tempo real
firebase functions:log
```

## 🐛 Troubleshooting

### Erro: "CORS policy"

- **Causa**: Regras de Storage não configuradas
- **Solução**: Execute `npm run deploy-firebase-rules`

### Erro: "storage/unauthorized"

- **Causa**: Usuário não autenticado
- **Solução**: Faça login novamente na aplicação

### Erro: "storage/unknown"

- **Causa**: Configuração geral do Firebase
- **Solução**: Verifique variáveis de ambiente

### Erro: "net::ERR_FAILED"

- **Causa**: Problema de rede ou configuração
- **Solução**: Verifique conexão e regras do Firebase

## 📞 Suporte

Se os problemas persistirem:

1. Verifique os logs no Firebase Console
2. Execute `npm run check-firebase-setup`
3. Compare com as configurações deste guia
4. Contate o administrador do projeto

## 🎉 Teste Final

Após seguir todos os passos:

1. Faça login na aplicação
2. Tente fazer upload de um arquivo MP3
3. Verifique se aparece no Firebase Storage
4. Confirme se o documento foi criado no Firestore

Se funcionar, sua configuração está correta! 🎵
