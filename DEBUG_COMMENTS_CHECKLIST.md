# 🔍 DEBUG: Sistema de Comentários - Checklist de Problemas

## ⚠️ Possíveis Causas do Erro

### 1. **Regras de Segurança Firestore**
- ✅ **CORRIGIDO**: Removido `timestamp` da validação obrigatória
- ✅ **CORRIGIDO**: Regras atualizadas para campos corretos

### 2. **Problemas de Autenticação**
- ❓ **A VERIFICAR**: Se `user.uid` está disponível
- ❓ **A VERIFICAR**: Se `userProfile` está carregado corretamente

### 3. **Problemas de Dados**
- ❓ **A VERIFICAR**: Se `trackId` é válido
- ❓ **A VERIFICAR**: Se os campos estão sendo enviados corretamente

### 4. **Problemas de Conexão Firebase**
- ❓ **A VERIFICAR**: Se as variáveis de ambiente estão configuradas
- ❓ **A VERIFICAR**: Se o projeto Firebase está configurado corretamente

## 🧪 **TESTES PARA EXECUTAR**

### Teste 1: Verificar Autenticação
```
URL: http://localhost:3000/test-firebase
```
- ✅ Verifica se o usuário está logado
- ✅ Mostra dados do usuário
- ✅ Testa criação de documento

### Teste 2: Verificar Logs Detalhados
```
1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Tente enviar um comentário
4. Observe os logs detalhados que adicionei
```

### Teste 3: Verificar Regras Firestore
```
1. Acesse Firebase Console
2. Vá para Firestore Database > Rules
3. Verifique se as regras foram atualizadas
```

## 🚀 **DEPLOY DAS REGRAS** (IMPORTANTE!)

As regras de segurança foram atualizadas no código, mas precisam ser deploiadas:

### Opção 1: Firebase Console
```
1. Acesse: https://console.firebase.google.com/project/ispmedia-70af7/firestore/rules
2. Cole as regras atualizadas do arquivo firestore.rules
3. Clique em "Publicar"
```

### Opção 2: Via Script (se Firebase CLI estiver configurado)
```bash
node scripts/deploy-firebase-rules.js
```

### Opção 3: Via CLI (se disponível)
```bash
firebase deploy --only firestore:rules
```

## 📋 **CHECKLIST STEP-BY-STEP**

### Passo 1: Teste a Conexão Firebase
- [ ] Acesse `http://localhost:3000/test-firebase`
- [ ] Verifique se os dados do usuário estão corretos
- [ ] Clique em "Testar Conexão Firebase"
- [ ] Verifique os logs no console

### Passo 2: Deploy das Regras Firestore
- [ ] Deploy das regras via Firebase Console (Opção 1 recomendada)
- [ ] Aguarde alguns segundos para propagação

### Passo 3: Teste o Sistema de Comentários
- [ ] Acesse `http://localhost:3000/test-comments` OU use qualquer track
- [ ] Abra DevTools > Console
- [ ] Tente enviar um comentário
- [ ] Observe os logs detalhados

### Passo 4: Se ainda houver erro, verificar:
- [ ] Variáveis de ambiente (.env.local)
- [ ] Configuração do Firebase project
- [ ] Permissões do usuário no Firebase Console

## 🎯 **LOGS ADICIONADOS PARA DEBUG**

Agora você verá logs detalhados no console:
- `🔍 Enviando comentário:` - Estado do usuário e dados
- `🔍 Dados do comentário a serem enviados:` - Payload completo
- `❌ Detalhes do erro:` - Informações completas do erro

## 📞 **PRÓXIMOS PASSOS**

1. **Execute o Teste 1** primeiro
2. **Deploy das regras** (CRÍTICO!)
3. **Execute o Teste 2** com logs
4. **Reporte os resultados** dos logs

---

**IMPORTANTE**: O problema mais provável é que as regras Firestore não foram deploiadas ainda. Execute o deploy das regras primeiro!
