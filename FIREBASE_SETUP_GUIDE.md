# 🔥 GUIA DE CONFIGURAÇÃO DO FIREBASE - ISPmedia

## ❌ ERRO ATUAL:

```
FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

**Causa**: As variáveis de ambiente do Firebase estão com valores placeholder ao invés das credenciais reais.

## 🛠️ SOLUÇÃO PASSO A PASSO:

### 1. Acessar o Firebase Console

1. Vá para: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique em "Criar um projeto" ou selecione um projeto existente

### 2. Criar/Configurar Projeto Firebase

#### Se criando um novo projeto:

1. Nome do projeto: `ispmedia` (ou nome de sua escolha)
2. Desabilite Google Analytics (opcional para este projeto)
3. Clique em "Criar projeto"

#### Configurar Authentication:

1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", ative:
   - **Email/Password** (Enable)
   - Desabilite "Email link" se não quiser usar

#### Configurar Firestore:

1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione "Começar no modo de teste" (ou modo de produção se preferir)
4. Escolha uma localização próxima (ex: southamerica-east1)

### 3. Obter Credenciais do Cliente (Frontend)

1. No Firebase Console, clique no ícone de **engrenagem** ⚙️ > "Configurações do projeto"
2. Role até "Seus aplicativos"
3. Clique no ícone **</> Web**
4. Nome do app: `ISPmedia Web`
5. **NÃO** marque "Configure também o Firebase Hosting"
6. Clique em "Registrar app"
7. **COPIE** a configuração mostrada:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // ← COPIE ESTE VALOR
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",  measurementId: "G-XXXXXXXXXX", // ← Opcional
};
```

### 4. Atualizar .env.local

Edite o arquivo `c:\Users\dalci\Videos\dalcito\ispmedia\.env.local`:

```env
# === CREDENCIAIS DO CLIENTE (Frontend) ===
# Substitua pelos valores obtidos no passo 3
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyABC123...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Configuração do ambiente
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 5. Configurar Regras do Firestore

1. No Firebase Console, vá em "Firestore Database"
2. Clique na aba "Regras"
3. **Para desenvolvimento**, use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura/escrita para usuários autenticados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Outras coleções podem ser adicionadas aqui
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Clique em "Publicar"

### 7. Reiniciar o Servidor

Após atualizar o `.env.local`:

```bash
# Pare o servidor (Ctrl+C)
# Limpe o cache
npm run build
# Inicie novamente
npm run dev
```

## 🔍 VERIFICAÇÃO:

### Teste 1: Verificar variáveis

1. Acesse: http://localhost:3000/test
2. Deve mostrar status de conexão do Firebase

### Teste 2: Testar autenticação

1. Acesse a página principal
2. Clique em "Entrar"
3. Tente criar uma conta
4. Não deve mais aparecer erro de API key

## ⚠️ SEGURANÇA:

1. **NUNCA** faça commit do arquivo `.env.local`
2. **NUNCA** exponha suas chaves privadas
3. **SEMPRE** use regras de segurança no Firestore
4. Para produção, configure domínios autorizados no Firebase Console

## 🆘 TROUBLESHOOTING:

### Erro "auth/api-key-not-valid"

- ✅ Verifique se copiou a `apiKey` corretamente
- ✅ Verifique se não há espaços extras nas variáveis
- ✅ Reinicie o servidor após alterar `.env.local`

### Erro "auth/project-not-found"

- ✅ Verifique o `projectId`
- ✅ Certifique-se que o projeto existe no Firebase Console

### Erro "auth/unauthorized-domain"

- ✅ No Firebase Console > Authentication > Settings > Authorized domains
- ✅ Adicione `localhost` para desenvolvimento

---

**🎯 Após seguir estes passos, o sistema de autenticação deve funcionar perfeitamente!**
