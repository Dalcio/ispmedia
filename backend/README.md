# ISPMedia Backend API

Backend RESTful para a plataforma ISPMedia desenvolvido com Node.js e Express. Esta API simula a persistência de dados em memória usando arrays e objetos JavaScript, sem base de dados MySQL nesta fase.

## 🚀 Funcionalidades

- **Autenticação JWT** com registo, login e verificação de tokens
- **Gestão de Utilizadores** com diferentes níveis de privilégios (visitante, editor, admin)
- **Gestão de Artistas** com informações completas
- **Gestão de Álbuns** associados a artistas
- **Gestão de Músicas** com metadados e contadores de reprodução
- **Sistema de Playlists** personalizáveis por utilizador
- **Sistema de Críticas** para músicas, álbuns e artistas
- **Upload de Ficheiros** com suporte para áudio e imagens
- **API RESTful** com documentação completa

## 📁 Estrutura do Projeto

```
backend/
├── controllers/           # Controladores da lógica de negócio
│   ├── authController.js     # Autenticação e autorização
│   ├── userController.js     # Gestão de utilizadores
│   ├── artistController.js   # Gestão de artistas
│   ├── albumController.js    # Gestão de álbuns
│   ├── musicController.js    # Gestão de músicas
│   ├── playlistController.js # Gestão de playlists
│   ├── reviewController.js   # Gestão de críticas
│   └── uploadController.js   # Upload de ficheiros
├── data/                  # Dados mock em memória
│   └── mockData.js           # Simulação da base de dados
├── middlewares/           # Middlewares personalizados
│   └── auth.js               # Middleware de autenticação
├── routes/                # Definição das rotas
│   ├── auth.js               # Rotas de autenticação
│   ├── users.js              # Rotas de utilizadores
│   ├── artists.js            # Rotas de artistas
│   ├── albums.js             # Rotas de álbuns
│   ├── musics.js             # Rotas de músicas
│   ├── playlists.js          # Rotas de playlists
│   ├── reviews.js            # Rotas de críticas
│   └── upload.js             # Rotas de upload
├── uploads/               # Diretório para ficheiros carregados
├── .env                   # Variáveis de ambiente
├── server.js              # Ponto de entrada da aplicação
├── package.json           # Dependências e scripts
├── API_EXAMPLES.md        # Exemplos de uso da API
└── README.md              # Este ficheiro
```

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos de Instalação

1. **Clonar ou navegar para o diretório backend**

   ```bash
   cd backend
   ```

2. **Instalar dependências**

   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**

   - O ficheiro `.env` já está criado com configurações padrão
   - Pode modificar as configurações conforme necessário:

   ```env
   NODE_ENV=development
   PORT=3000
   JWT_SECRET=ispmedia_super_secret_key_2025
   JWT_EXPIRES_IN=24h
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=50MB
   ```

4. **Iniciar o servidor**

   ```bash
   # Modo desenvolvimento (com nodemon)
   npm run dev

   # Modo produção
   npm start
   ```

5. **Verificar se está a funcionar**
   - Abrir browser em `http://localhost:3000/api/health`
   - Deve retornar: `{"status":"OK","message":"ISPMedia API is running"}`

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Três níveis de privilégios:

- **visitante** - Pode ver conteúdos e criar playlists/críticas
- **editor** - Pode criar/editar artistas, álbuns e músicas
- **admin** - Acesso total, incluindo gestão de utilizadores

### Utilizadores Padrão

```javascript
// Admin
username: "admin";
email: "admin@ispmedia.com";
password: "password123";

// Editor
username: "editor1";
email: "editor@ispmedia.com";
password: "password123";

// Visitante
username: "visitante1";
email: "visitante@ispmedia.com";
password: "password123";
```

## 📚 Documentação da API

### Endpoints Principais

#### Autenticação

- `POST /api/auth/register` - Registar novo utilizador
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/refresh` - Renovar token

#### Utilizadores

- `GET /api/users` - Listar utilizadores (admin)
- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/:id` - Obter utilizador por ID
- `PUT /api/users/:id` - Atualizar utilizador (admin)
- `DELETE /api/users/:id` - Eliminar utilizador (admin)

#### Artistas

- `GET /api/artists` - Listar artistas
- `GET /api/artists/:id` - Obter artista por ID
- `POST /api/artists` - Criar artista (editor/admin)
- `PUT /api/artists/:id` - Atualizar artista (editor/admin)
- `DELETE /api/artists/:id` - Eliminar artista (admin)
- `GET /api/artists/:id/albums` - Álbuns do artista
- `GET /api/artists/:id/musics` - Músicas do artista

#### Álbuns

- `GET /api/albums` - Listar álbuns
- `GET /api/albums/:id` - Obter álbum por ID
- `POST /api/albums` - Criar álbum (editor/admin)
- `PUT /api/albums/:id` - Atualizar álbum (editor/admin)
- `DELETE /api/albums/:id` - Eliminar álbum (admin)
- `GET /api/albums/:id/musics` - Músicas do álbum

#### Músicas

- `GET /api/musics` - Listar músicas
- `GET /api/musics/top` - Músicas mais tocadas
- `GET /api/musics/:id` - Obter música por ID
- `POST /api/musics` - Criar música (editor/admin)
- `PUT /api/musics/:id` - Atualizar música (editor/admin)
- `DELETE /api/musics/:id` - Eliminar música (admin)
- `POST /api/musics/:id/play` - Incrementar reproduções

#### Playlists

- `GET /api/playlists/my` - Minhas playlists
- `GET /api/playlists/public` - Playlists públicas
- `GET /api/playlists/:id` - Obter playlist por ID
- `POST /api/playlists` - Criar playlist
- `PUT /api/playlists/:id` - Atualizar playlist
- `DELETE /api/playlists/:id` - Eliminar playlist
- `POST /api/playlists/:id/musics` - Adicionar música
- `DELETE /api/playlists/:id/musics/:musicId` - Remover música
- `PUT /api/playlists/:id/reorder` - Reordenar músicas

#### Críticas

- `GET /api/reviews` - Listar críticas
- `GET /api/reviews/stats` - Estatísticas de ratings
- `GET /api/reviews/:id` - Obter crítica por ID
- `POST /api/reviews` - Criar crítica
- `PUT /api/reviews/:id` - Atualizar crítica
- `DELETE /api/reviews/:id` - Eliminar crítica

#### Upload

- `POST /api/upload/music` - Upload de música (editor/admin)
- `POST /api/upload/image` - Upload de imagem
- `POST /api/upload/multiple` - Upload múltiplo (editor/admin)
- `GET /api/upload/files` - Listar ficheiros
- `GET /api/upload/files/:filename` - Info do ficheiro
- `DELETE /api/upload/files/:filename` - Eliminar ficheiro

### Parâmetros de Query Comuns

#### Filtros

- `search` - Pesquisa textual
- `genre` - Filtro por género
- `artistId` - Filtro por artista
- `albumId` - Filtro por álbum

#### Paginação

- `limit` - Número máximo de resultados
- `offset` - Número de resultados a saltar

## 🔧 Exemplos de Uso

Ver ficheiro `API_EXAMPLES.md` para exemplos completos de como consumir a API do front-end.

### Exemplo Rápido - Obter Músicas

```javascript
// Obter músicas com filtros
fetch("http://localhost:3000/api/musics?search=beatles&limit=10")
  .then((response) => response.json())
  .then((data) => console.log(data));

// Login e obter perfil
fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "admin",
    password: "password123",
  }),
})
  .then((response) => response.json())
  .then((data) => {
    const token = data.token;

    // Usar token para obter perfil
    return fetch("http://localhost:3000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
  })
  .then((response) => response.json())
  .then((profile) => console.log(profile));
```

## 📁 Upload de Ficheiros

O sistema suporta upload de:

- **Músicas**: MP3, WAV, OGG, AAC, FLAC (máx. 50MB)
- **Imagens**: JPEG, PNG, GIF, WebP (máx. 50MB)

Os ficheiros são organizados em subdiretórios:

- `/uploads/musics/` - Ficheiros de áudio
- `/uploads/images/` - Imagens (capas, fotos de artistas)
- `/uploads/avatars/` - Avatares de utilizadores

### Exemplo de Upload

```javascript
const formData = new FormData();
formData.append("music", fileInput.files[0]);

fetch("http://localhost:3000/api/upload/music", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log("Ficheiro carregado:", data.file.url));
```

## 🗃️ Estrutura de Dados

### Utilizador

```javascript
{
  id: Number,
  username: String,
  email: String,
  password: String (hash),
  role: 'visitante' | 'editor' | 'admin',
  firstName: String,
  lastName: String,
  avatar: String | null,
  createdAt: Date,
  updatedAt: Date
}
```

### Artista

```javascript
{
  id: Number,
  name: String,
  bio: String,
  image: String | null,
  genre: String,
  country: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Álbum

```javascript
{
  id: Number,
  title: String,
  artistId: Number,
  releaseDate: Date,
  genre: String,
  description: String,
  cover: String | null,
  tracks: Number,
  duration: Number, // em segundos
  createdAt: Date,
  updatedAt: Date
}
```

### Música

```javascript
{
  id: Number,
  title: String,
  artistId: Number,
  albumId: Number | null,
  duration: Number, // em segundos
  genre: String,
  file: String | null,
  lyrics: String,
  trackNumber: Number | null,
  playCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Playlist

```javascript
{
  id: Number,
  name: String,
  description: String,
  userId: Number,
  musics: Number[], // IDs das músicas
  isPublic: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Crítica

```javascript
{
  id: Number,
  userId: Number,
  musicId: Number | null,
  albumId: Number | null,
  artistId: Number | null,
  rating: Number, // 1-5
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚨 Tratamento de Erros

A API retorna erros em formato JSON:

```javascript
{
  "error": "Mensagem de erro descritiva"
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação/dados inválidos
- `401` - Não autenticado
- `403` - Sem privilégios
- `404` - Recurso não encontrado
- `409` - Conflito (duplicação)
- `500` - Erro interno do servidor

## 🔒 Segurança

- Passwords são hasheadas com bcrypt
- Tokens JWT com expiração configurável
- Middleware de autenticação e autorização
- Validação de tipos de ficheiro no upload
- Sanitização de dados de entrada

## 🧪 Testes

Para testar a API pode usar:

1. **Postman/Insomnia** - Importar a coleção de endpoints
2. **curl** - Comandos de linha
3. **Browser** - Para endpoints GET públicos

### Exemplo com curl

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Obter músicas
curl http://localhost:3000/api/musics?limit=5
```

## 🔄 Próximos Passos

1. **Integração MySQL** - Substituir dados mock por base de dados real
2. **Caching** - Implementar Redis para melhor performance
3. **Rate Limiting** - Controlo de requisições por utilizador
4. **Websockets** - Updates em tempo real
5. **Testes Automatizados** - Unit e integration tests
6. **Docker** - Containerização da aplicação
7. **API Documentation** - Swagger/OpenAPI

## 🐛 Resolução de Problemas

### Servidor não inicia

- Verificar se a porta 3000 está disponível
- Verificar se todas as dependências estão instaladas
- Verificar o ficheiro `.env`

### Erro de autenticação

- Verificar se o token JWT é válido
- Verificar se o header Authorization está correto
- Verificar se o utilizador existe na base de dados mock

### Upload não funciona

- Verificar se o diretório `uploads` tem permissões de escrita
- Verificar o tamanho do ficheiro (máx. 50MB)
- Verificar o tipo MIME do ficheiro

### Dados não persistem

- **Normal** - Os dados estão em memória e são perdidos quando o servidor reinicia
- Para persistência real, implementar integração com MySQL

## 📞 Suporte

Para questões e problemas:

1. Verificar este README
2. Consultar `API_EXAMPLES.md`
3. Verificar logs do servidor no terminal
4. Usar ferramentas de debug (Postman, browser dev tools)
