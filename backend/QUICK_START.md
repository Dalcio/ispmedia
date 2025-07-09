# Como Iniciar o Backend ISPMedia

## 🚀 Início Rápido

### Opção 1: Usando VS Code Tasks (Recomendado)

1. Pressionar `Ctrl+Shift+P`
2. Digitar "Tasks: Run Task"
3. Selecionar "ISPMedia - Start Backend Server"

### Opção 2: Terminal

```bash
cd backend
node server.js
```

### Opção 3: Modo Desenvolvimento (com auto-restart)

```bash
cd backend
npm run dev
```

## ✅ Verificar se está funcionando

1. **Health Check**: http://localhost:3000/api/health
2. **Resposta esperada**: `{"status":"OK","message":"ISPMedia API is running"}`

## 🧪 Testar a API

### Utilizadores Padrão

- **Admin**: `admin` / `password123`
- **Editor**: `editor1` / `password123`
- **Visitante**: `visitante1` / `password123`

### Endpoints Principais

- **Health**: GET http://localhost:3000/api/health
- **Login**: POST http://localhost:3000/api/auth/login
- **Músicas**: GET http://localhost:3000/api/musics
- **Artistas**: GET http://localhost:3000/api/artists
- **Álbuns**: GET http://localhost:3000/api/albums

### Teste Rápido com curl

```bash
# Health check
curl http://localhost:3000/api/health

# Login admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"password123\"}"

# Obter músicas
curl http://localhost:3000/api/musics
```

## 📚 Documentação Completa

- **README**: `/backend/README.md`
- **Exemplos**: `/backend/API_EXAMPLES.md`
- **Código**: `/backend/` (controladores, rotas, dados mock)

## 🐛 Problemas Comuns

### Porta 3000 ocupada

```bash
# Verificar processos na porta
netstat -ano | findstr :3000

# Mudar porta no .env
PORT=3001
```

### Dependências não instaladas

```bash
cd backend
npm install
```

### Token expirado

- Fazer login novamente para obter novo token
- Tokens expiram em 24h (configurável no .env)

## 🔧 Configuração Avançada

Editar `/backend/.env`:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=24h
UPLOAD_DIR=uploads
MAX_FILE_SIZE=50MB
```
