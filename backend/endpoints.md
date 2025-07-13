# ISPMedia Backend Endpoints

## Autenticação (`/api/auth`)

### POST /api/auth/register

- Regista novo utilizador
- Público
- Body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "visitante|editor|admin"
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@email.com","password":"123456"}'
```

### POST /api/auth/login

- Login do utilizador
- Público
- Body:

```json
{
  "username": "string",
  "password": "string"
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"123456"}'
```

### GET /api/auth/verify

- Verifica token JWT
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer <token>"
```

### POST /api/auth/refresh

- Renova token JWT
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer <token>"
```

---

## Utilizadores (`/api/users`)

### GET /api/users

- Lista todos os utilizadores
- Apenas admin
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <token>"
```

### GET /api/users/profile

- Perfil do utilizador logado
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <token>"
```

### PUT /api/users/profile

- Atualiza perfil do utilizador logado
- Privado
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "currentPassword": "string",
  "newPassword": "string"
}
```

- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"NovoNome"}'
```

### GET /api/users/:id

- Obter utilizador por ID
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <token>"
```

### PUT /api/users/:id

- Atualiza utilizador
- Apenas admin
- Header: `Authorization: Bearer <token>`
- Body: igual ao PUT /profile
- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"NovoNome"}'
```

### DELETE /api/users/:id

- Elimina utilizador
- Apenas admin
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer <token>"
```

---

## Uploads (`/api/upload`)

### POST /api/upload/music

- Upload de música
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- FormData: `music` (file)
- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/upload/music \
  -H "Authorization: Bearer <token>" \
  -F "music=@/caminho/para/ficheiro.mp3"
```

### POST /api/upload/image

- Upload de imagem
- Privado
- Header: `Authorization: Bearer <token>`
- FormData: `image` (file)
- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/upload/image \
  -H "Authorization: Bearer <token>" \
  -F "image=@/caminho/para/imagem.jpg"
```

### POST /api/upload/multiple

- Upload múltiplos ficheiros
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- FormData: múltiplos ficheiros
- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/upload/multiple \
  -H "Authorization: Bearer <token>" \
  -F "music=@/caminho/ficheiro1.mp3" \
  -F "image=@/caminho/imagem1.jpg"
```

### GET /api/upload/files

- Lista ficheiros
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/upload/files \
  -H "Authorization: Bearer <token>"
```

### GET /api/upload/files/:filename

- Info de ficheiro
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/upload/files/nome.mp3 \
  -H "Authorization: Bearer <token>"
```

### DELETE /api/upload/files/:filename

- Elimina ficheiro
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/upload/files/nome.mp3 \
  -H "Authorization: Bearer <token>"
```

---

## Reviews (`/api/reviews`)

### GET /api/reviews

- Lista críticas (filtros: musicId, albumId, artistId, userId, limit, offset)
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET "http://localhost:3000/api/reviews?musicId=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

### GET /api/reviews/stats

- Estatísticas de ratings
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/reviews/stats \
  -H "Authorization: Bearer <token>"
```

### GET /api/reviews/:id

- Obter crítica por ID
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/reviews/1 \
  -H "Authorization: Bearer <token>"
```

### POST /api/reviews

- Criar crítica
- Privado
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "rating": 5,
  "comment": "Muito bom!",
  "musicId": 1
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Muito bom!","musicId":1}'
```

### PUT /api/reviews/:id

- Atualizar crítica
- Privado
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "rating": 4,
  "comment": "Atualizado!"
}
```

- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/reviews/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"rating":4,"comment":"Atualizado!"}'
```

### DELETE /api/reviews/:id

- Eliminar crítica
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/reviews/1 \
  -H "Authorization: Bearer <token>"
```

---

## Playlists (`/api/playlists`)

### GET /api/playlists/my

- Minhas playlists
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/playlists/my \
  -H "Authorization: Bearer <token>"
```

### GET /api/playlists/public

- Playlists públicas
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/playlists/public \
  -H "Authorization: Bearer <token>"
```

### GET /api/playlists/:id

- Obter playlist por ID
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/playlists/1 \
  -H "Authorization: Bearer <token>"
```

### POST /api/playlists

- Criar playlist
- Privado
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "name": "Minha Playlist",
  "description": "Descrição",
  "isPublic": true,
  "musics": [1, 2, 3]
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/playlists \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Minha Playlist","isPublic":true,"musics":[1,2,3]}'
```

### PUT /api/playlists/:id

- Atualizar playlist
- Privado
- Header: `Authorization: Bearer <token>`
- Body: igual ao POST
- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/playlists/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Nova Playlist"}'
```

### DELETE /api/playlists/:id

- Eliminar playlist
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/playlists/1 \
  -H "Authorization: Bearer <token>"
```

### POST /api/playlists/:id/musics

- Adicionar música à playlist
- Privado
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "musicId": 1
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/playlists/1/musics \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"musicId":1}'
```

### DELETE /api/playlists/:id/musics/:musicId

- Remover música da playlist
- Privado
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/playlists/1/musics/2 \
  -H "Authorization: Bearer <token>"
```

### PUT /api/playlists/:id/reorder

- Reordenar músicas
- Privado
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "musics": [3, 1, 2]
}
```

- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/playlists/1/reorder \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"musics":[3,1,2]}'
```

---

## Músicas (`/api/musics`)

### GET /api/musics

- Lista músicas (filtros: search, artistId, albumId, genre, limit, offset)
- Público
- Exemplo curl:

```bash
curl -X GET "http://localhost:3000/api/musics?search=rock&limit=10"
```

### GET /api/musics/top

- Músicas mais tocadas
- Público
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/musics/top
```

### GET /api/musics/:id

- Obter música por ID
- Público
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/musics/1
```

### POST /api/musics/:id/play

- Incrementa contador de reproduções
- Público
- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/musics/1/play
```

### POST /api/musics

- Criar música
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "title": "string",
  "artistId": 1,
  "albumId": 1,
  "genre": "string"
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/musics \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Nova Música","artistId":1,"albumId":1,"genre":"Pop"}'
```

### PUT /api/musics/:id

- Atualizar música
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- Body: igual ao POST
- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/musics/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Música Editada"}'
```

### DELETE /api/musics/:id

- Eliminar música
- Apenas admin
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/musics/1 \
  -H "Authorization: Bearer <token>"
```

---

## Artistas (`/api/artists`)

### GET /api/artists

- Lista artistas (filtros: search, genre, country, limit, offset)
- Público
- Exemplo curl:

```bash
curl -X GET "http://localhost:3000/api/artists?search=pop&limit=10"
```

### GET /api/artists/:id

- Obter artista por ID
- Público
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/artists/1
```

### GET /api/artists/:id/albums

- Álbuns do artista
- Público
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/artists/1/albums
```

### GET /api/artists/:id/musics

- Músicas do artista
- Público
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/artists/1/musics
```

### POST /api/artists

- Criar artista
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "name": "string",
  "bio": "string",
  "genre": "string",
  "country": "string"
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/artists \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Novo Artista","genre":"Pop"}'
```

### PUT /api/artists/:id

- Atualizar artista
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- Body: igual ao POST
- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/artists/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Artista Editado"}'
```

### DELETE /api/artists/:id

- Eliminar artista
- Apenas admin
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/artists/1 \
  -H "Authorization: Bearer <token>"
```

---

## Álbuns (`/api/albums`)

### GET /api/albums

- Lista álbuns (filtros: search, artistId, genre, year, limit, offset)
- Público
- Exemplo curl:

```bash
curl -X GET "http://localhost:3000/api/albums?search=rock&limit=10"
```

### GET /api/albums/:id

- Obter álbum por ID
- Público
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/albums/1
```

### GET /api/albums/:id/musics

- Músicas do álbum
- Público
- Exemplo curl:

```bash
curl -X GET http://localhost:3000/api/albums/1/musics
```

### POST /api/albums

- Criar álbum
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "title": "string",
  "artistId": 1,
  "genre": "string",
  "releaseDate": "YYYY-MM-DD"
}
```

- Exemplo curl:

```bash
curl -X POST http://localhost:3000/api/albums \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Novo Álbum","artistId":1,"genre":"Rock","releaseDate":"2025-01-01"}'
```

### PUT /api/albums/:id

- Atualizar álbum
- Apenas editor/admin
- Header: `Authorization: Bearer <token>`
- Body: igual ao POST
- Exemplo curl:

```bash
curl -X PUT http://localhost:3000/api/albums/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Álbum Editado"}'
```

### DELETE /api/albums/:id

- Eliminar álbum
- Apenas admin
- Header: `Authorization: Bearer <token>`
- Exemplo curl:

```bash
curl -X DELETE http://localhost:3000/api/albums/1 \
  -H "Authorization: Bearer <token>"
```

---

## Autenticação

- A autenticação é feita via JWT.
- Para endpoints privados, envie o header:

```
Authorization: Bearer <token>
```

- O token é obtido no login e pode ser renovado via `/api/auth/refresh`.
- Roles: visitante, editor, admin. Alguns endpoints exigem role específica.

---

## Estrutura de Resposta

- Em geral, as respostas são objetos JSON com os dados solicitados ou mensagens de erro:

```json
{
  "error": "Mensagem de erro"
}
```

- Listagens retornam arrays ou objetos paginados.

---

## Observações

- Todos os endpoints POST/PUT esperam `Content-Type: application/json`, exceto uploads (FormData).
- Para integração frontend, use os exemplos acima com `fetch` ou Postman.

---

Documentação gerada automaticamente em 13/07/2025.
