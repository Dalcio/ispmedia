// Simulação de dados em memória
let users = [
  {
    id: 1,
    username: "admin",
    email: "admin@ispmedia.com",
    password: "$2b$10$.lv9IMcILyLmVzSMVmoROudnDQabhspqsktgbdKD1m4vTPFlhDDfy", // password123
    role: "admin",
    firstName: "Administrador",
    lastName: "Sistema",
    avatar: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    username: "editor1",
    email: "editor@ispmedia.com",
    password: "$2b$10$.lv9IMcILyLmVzSMVmoROudnDQabhspqsktgbdKD1m4vTPFlhDDfy", // password123
    role: "editor",
    firstName: "João",
    lastName: "Editor",
    avatar: null,
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-02"),
  },
  {
    id: 3,
    username: "visitante1",
    email: "visitante@ispmedia.com",
    password: "$2b$10$.lv9IMcILyLmVzSMVmoROudnDQabhspqsktgbdKD1m4vTPFlhDDfy", // password123
    role: "visitante",
    firstName: "Maria",
    lastName: "Silva",
    avatar: null,
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-03"),
  },
];

let artists = [
  {
    id: 1,
    name: "The Beatles",
    bio: "Banda britânica de rock formada em Liverpool em 1960.",
    image: null,
    genre: "Rock",
    country: "Reino Unido",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    name: "Queen",
    bio: "Banda britânica de rock formada em Londres em 1970.",
    image: null,
    genre: "Rock",
    country: "Reino Unido",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

let albums = [
  {
    id: 1,
    title: "Abbey Road",
    artistId: 1,
    releaseDate: new Date("1969-09-26"),
    genre: "Rock",
    description: "Último álbum gravado pelos Beatles.",
    cover: null,
    tracks: 17,
    duration: 2847, // em segundos
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    title: "Bohemian Rhapsody",
    artistId: 2,
    releaseDate: new Date("1975-10-31"),
    genre: "Rock",
    description: "Álbum clássico do Queen.",
    cover: null,
    tracks: 12,
    duration: 2580,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

let musics = [
  {
    id: 1,
    title: "Come Together",
    artistId: 1,
    albumId: 1,
    duration: 259, // em segundos
    genre: "Rock",
    file: null,
    lyrics: "Here come old flat top...",
    trackNumber: 1,
    playCount: 1000,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    title: "Something",
    artistId: 1,
    albumId: 1,
    duration: 183,
    genre: "Rock",
    file: null,
    lyrics: "Something in the way she moves...",
    trackNumber: 2,
    playCount: 800,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 3,
    title: "Bohemian Rhapsody",
    artistId: 2,
    albumId: 2,
    duration: 355,
    genre: "Rock",
    file: null,
    lyrics: "Is this the real life...",
    trackNumber: 1,
    playCount: 2000,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

let playlists = [
  {
    id: 1,
    name: "Meus Favoritos",
    description: "Minhas músicas favoritas",
    userId: 3,
    musics: [1, 3],
    isPublic: true,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

let reviews = [
  {
    id: 1,
    userId: 3,
    musicId: 1,
    albumId: null,
    artistId: null,
    rating: 5,
    comment: "Excelente música! Um clássico dos Beatles.",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    userId: 2,
    musicId: null,
    albumId: 1,
    artistId: null,
    rating: 5,
    comment: "Abbey Road é simplesmente perfeito.",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

// Contadores para IDs únicos
let counters = {
  users: 3,
  artists: 2,
  albums: 2,
  musics: 3,
  playlists: 1,
  reviews: 2,
};

// Função para gerar próximo ID
const getNextId = (entity) => {
  counters[entity]++;
  return counters[entity];
};

module.exports = {
  users,
  artists,
  albums,
  musics,
  playlists,
  reviews,
  getNextId,
};
