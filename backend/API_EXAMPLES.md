# Exemplos de Chamadas Fetch para ISPMedia API

Este documento contém exemplos de como consumir a API ISPMedia do front-end usando JavaScript fetch.

## Configuração Base

```javascript
// Configuração base da API
const API_BASE_URL = "http://localhost:3000/api";

// Função auxiliar para fazer requests autenticados
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro na requisição");
  }

  return response.json();
};
```

## Autenticação

### Registo de Utilizador

```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || "visitante",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();

    // Guardar token no localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Erro no registo:", error);
    throw error;
  }
};

// Exemplo de uso
registerUser({
  username: "joao123",
  email: "joao@email.com",
  password: "password123",
  firstName: "João",
  lastName: "Silva",
})
  .then((data) => {
    console.log("Utilizador registado:", data);
  })
  .catch((error) => {
    console.error("Erro:", error.message);
  });
```

### Login

```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();

    // Guardar token no localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

// Exemplo de uso
loginUser({
  username: "joao123",
  password: "password123",
})
  .then((data) => {
    console.log("Login realizado:", data);
  })
  .catch((error) => {
    console.error("Erro:", error.message);
  });
```

### Verificar Token

```javascript
const verifyToken = async () => {
  try {
    const data = await apiRequest("/auth/verify");
    return data;
  } catch (error) {
    // Token inválido, remover do localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    throw error;
  }
};
```

### Logout

```javascript
const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
```

## Gestão de Utilizadores

### Obter Perfil

```javascript
const getUserProfile = async () => {
  try {
    const data = await apiRequest("/users/profile");
    return data;
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    throw error;
  }
};
```

### Atualizar Perfil

```javascript
const updateUserProfile = async (profileData) => {
  try {
    const data = await apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    return data;
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};

// Exemplo de uso
updateUserProfile({
  firstName: "João Pedro",
  lastName: "Silva Santos",
  email: "joao.pedro@email.com",
}).then((data) => {
  console.log("Perfil atualizado:", data);
});
```

## Gestão de Músicas

### Listar Músicas

```javascript
const getMusics = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const data = await apiRequest(`/musics?${queryParams}`);
    return data;
  } catch (error) {
    console.error("Erro ao obter músicas:", error);
    throw error;
  }
};

// Exemplo de uso
getMusics({
  search: "beatles",
  genre: "rock",
  limit: 20,
  offset: 0,
}).then((data) => {
  console.log("Músicas:", data);
});
```

### Obter Música por ID

```javascript
const getMusicById = async (id) => {
  try {
    const data = await apiRequest(`/musics/${id}`);
    return data;
  } catch (error) {
    console.error("Erro ao obter música:", error);
    throw error;
  }
};
```

### Criar Música (Editor/Admin)

```javascript
const createMusic = async (musicData) => {
  try {
    const data = await apiRequest("/musics", {
      method: "POST",
      body: JSON.stringify(musicData),
    });
    return data;
  } catch (error) {
    console.error("Erro ao criar música:", error);
    throw error;
  }
};

// Exemplo de uso
createMusic({
  title: "Yesterday",
  artistId: 1,
  albumId: 2,
  duration: 125,
  genre: "Pop",
  lyrics: "Yesterday, all my troubles seemed so far away...",
  trackNumber: 1,
}).then((data) => {
  console.log("Música criada:", data);
});
```

### Incrementar Reproduções

```javascript
const incrementPlayCount = async (musicId) => {
  try {
    const data = await apiRequest(`/musics/${musicId}/play`, {
      method: "POST",
    });
    return data;
  } catch (error) {
    console.error("Erro ao registar reprodução:", error);
    throw error;
  }
};
```

## Gestão de Artistas

### Listar Artistas

```javascript
const getArtists = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const data = await apiRequest(`/artists?${queryParams}`);
    return data;
  } catch (error) {
    console.error("Erro ao obter artistas:", error);
    throw error;
  }
};
```

### Criar Artista (Editor/Admin)

```javascript
const createArtist = async (artistData) => {
  try {
    const data = await apiRequest("/artists", {
      method: "POST",
      body: JSON.stringify(artistData),
    });
    return data;
  } catch (error) {
    console.error("Erro ao criar artista:", error);
    throw error;
  }
};

// Exemplo de uso
createArtist({
  name: "Pink Floyd",
  bio: "Banda britânica de rock progressivo...",
  genre: "Rock Progressivo",
  country: "Reino Unido",
}).then((data) => {
  console.log("Artista criado:", data);
});
```

## Gestão de Álbuns

### Listar Álbuns

```javascript
const getAlbums = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const data = await apiRequest(`/albums?${queryParams}`);
    return data;
  } catch (error) {
    console.error("Erro ao obter álbuns:", error);
    throw error;
  }
};
```

### Criar Álbum (Editor/Admin)

```javascript
const createAlbum = async (albumData) => {
  try {
    const data = await apiRequest("/albums", {
      method: "POST",
      body: JSON.stringify(albumData),
    });
    return data;
  } catch (error) {
    console.error("Erro ao criar álbum:", error);
    throw error;
  }
};

// Exemplo de uso
createAlbum({
  title: "The Dark Side of the Moon",
  artistId: 3,
  releaseDate: "1973-03-01",
  genre: "Rock Progressivo",
  description: "Álbum conceptual sobre pressões da vida moderna...",
}).then((data) => {
  console.log("Álbum criado:", data);
});
```

## Gestão de Playlists

### Listar Minhas Playlists

```javascript
const getMyPlaylists = async () => {
  try {
    const data = await apiRequest("/playlists/my");
    return data;
  } catch (error) {
    console.error("Erro ao obter playlists:", error);
    throw error;
  }
};
```

### Criar Playlist

```javascript
const createPlaylist = async (playlistData) => {
  try {
    const data = await apiRequest("/playlists", {
      method: "POST",
      body: JSON.stringify(playlistData),
    });
    return data;
  } catch (error) {
    console.error("Erro ao criar playlist:", error);
    throw error;
  }
};

// Exemplo de uso
createPlaylist({
  name: "Rock Clássico",
  description: "As melhores do rock dos anos 70",
  isPublic: true,
}).then((data) => {
  console.log("Playlist criada:", data);
});
```

### Adicionar Música à Playlist

```javascript
const addMusicToPlaylist = async (playlistId, musicId) => {
  try {
    const data = await apiRequest(`/playlists/${playlistId}/musics`, {
      method: "POST",
      body: JSON.stringify({ musicId }),
    });
    return data;
  } catch (error) {
    console.error("Erro ao adicionar música:", error);
    throw error;
  }
};
```

## Gestão de Críticas

### Listar Críticas

```javascript
const getReviews = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const data = await apiRequest(`/reviews?${queryParams}`);
    return data;
  } catch (error) {
    console.error("Erro ao obter críticas:", error);
    throw error;
  }
};
```

### Criar Crítica

```javascript
const createReview = async (reviewData) => {
  try {
    const data = await apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
    return data;
  } catch (error) {
    console.error("Erro ao criar crítica:", error);
    throw error;
  }
};

// Exemplo de uso - crítica para uma música
createReview({
  musicId: 1,
  rating: 5,
  comment: "Excelente música! Um clássico atemporal.",
}).then((data) => {
  console.log("Crítica criada:", data);
});

// Exemplo de uso - crítica para um álbum
createReview({
  albumId: 2,
  rating: 4,
  comment: "Muito bom álbum, com algumas faixas excepcionais.",
}).then((data) => {
  console.log("Crítica criada:", data);
});
```

### Obter Estatísticas de Ratings

```javascript
const getItemStats = async (itemType, itemId) => {
  try {
    const params = {};
    if (itemType === "music") params.musicId = itemId;
    else if (itemType === "album") params.albumId = itemId;
    else if (itemType === "artist") params.artistId = itemId;

    const queryParams = new URLSearchParams(params);
    const data = await apiRequest(`/reviews/stats?${queryParams}`);
    return data;
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    throw error;
  }
};
```

## Upload de Ficheiros

### Upload de Música (Editor/Admin)

```javascript
const uploadMusic = async (file) => {
  try {
    const formData = new FormData();
    formData.append("music", file);

    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/upload/music`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};

// Exemplo de uso
const fileInput = document.getElementById("musicFile");
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await uploadMusic(file);
      console.log("Ficheiro carregado:", result);
    } catch (error) {
      console.error("Erro:", error.message);
    }
  }
});
```

### Upload de Imagem

```javascript
const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};
```

## Tratamento de Erros Global

```javascript
// Interceptor para tratar erros de autenticação globalmente
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const response = await originalFetch.apply(this, args);

  if (response.status === 401) {
    // Token expirado ou inválido
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return response;
};
```

## Utilização em Componentes

### Exemplo de Componente de Login

```javascript
class LoginComponent {
  constructor() {
    this.form = document.getElementById("loginForm");
    this.init();
  }

  init() {
    this.form.addEventListener("submit", this.handleLogin.bind(this));
  }

  async handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(this.form);
    const credentials = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const data = await loginUser(credentials);

      // Redirecionar para dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      this.showError(error.message);
    }
  }

  showError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

// Inicializar componente
new LoginComponent();
```

### Exemplo de Lista de Músicas

```javascript
class MusicListComponent {
  constructor() {
    this.container = document.getElementById("music-list");
    this.loadMusics();
  }

  async loadMusics() {
    try {
      const data = await getMusics({ limit: 50 });
      this.renderMusics(data.musics);
    } catch (error) {
      console.error("Erro ao carregar músicas:", error);
      this.showError("Erro ao carregar músicas");
    }
  }

  renderMusics(musics) {
    this.container.innerHTML = musics
      .map(
        (music) => `
      <div class="music-item" data-id="${music.id}">
        <h3>${music.title}</h3>
        <p>Artista: ${music.artist?.name || "Desconhecido"}</p>
        <p>Álbum: ${music.album?.title || "N/A"}</p>
        <button onclick="this.playMusic(${music.id})">Reproduzir</button>
      </div>
    `
      )
      .join("");
  }

  async playMusic(musicId) {
    try {
      await incrementPlayCount(musicId);
      // Lógica para reproduzir música
      console.log(`Reproduzindo música ${musicId}`);
    } catch (error) {
      console.error("Erro ao reproduzir música:", error);
    }
  }

  showError(message) {
    this.container.innerHTML = `<p class="error">${message}</p>`;
  }
}

// Inicializar componente
new MusicListComponent();
```
