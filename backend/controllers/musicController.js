const { musics, artists, albums, getNextId } = require("../data/mockData");

const musicController = {
  // Listar todas as músicas
  getAll: (req, res) => {
    try {
      const { search, artistId, albumId, genre, limit, offset } = req.query;
      let filteredMusics = [...musics];

      // Filtro por pesquisa
      if (search) {
        filteredMusics = filteredMusics.filter(
          (music) =>
            music.title.toLowerCase().includes(search.toLowerCase()) ||
            (music.lyrics &&
              music.lyrics.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Filtro por artista
      if (artistId) {
        filteredMusics = filteredMusics.filter(
          (music) => music.artistId === parseInt(artistId)
        );
      }

      // Filtro por álbum
      if (albumId) {
        filteredMusics = filteredMusics.filter(
          (music) => music.albumId === parseInt(albumId)
        );
      }

      // Filtro por género
      if (genre) {
        filteredMusics = filteredMusics.filter(
          (music) =>
            music.genre && music.genre.toLowerCase() === genre.toLowerCase()
        );
      }

      // Adicionar informações do artista e álbum
      const musicsWithDetails = filteredMusics.map((music) => {
        const artist = artists.find((a) => a.id === music.artistId);
        const album = albums.find((a) => a.id === music.albumId);
        return {
          ...music,
          artist: artist ? { id: artist.id, name: artist.name } : null,
          album: album ? { id: album.id, title: album.title } : null,
        };
      });

      // Paginação
      const total = musicsWithDetails.length;
      const limitNum = parseInt(limit) || total;
      const offsetNum = parseInt(offset) || 0;

      const paginatedMusics = musicsWithDetails.slice(
        offsetNum,
        offsetNum + limitNum
      );

      res.json({
        musics: paginatedMusics,
        pagination: {
          total,
          limit: limitNum,
          offset: offsetNum,
          hasMore: offsetNum + limitNum < total,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter música por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const music = musics.find((m) => m.id === parseInt(id));

      if (!music) {
        return res.status(404).json({ error: "Música não encontrada" });
      }

      // Adicionar informações do artista e álbum
      const artist = artists.find((a) => a.id === music.artistId);
      const album = albums.find((a) => a.id === music.albumId);

      const musicWithDetails = {
        ...music,
        artist: artist ? { id: artist.id, name: artist.name } : null,
        album: album ? { id: album.id, title: album.title } : null,
      };

      res.json(musicWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Criar nova música (editor/admin)
  create: (req, res) => {
    try {
      const { title, artistId, albumId, duration, genre, lyrics, trackNumber } =
        req.body;

      if (!title || !artistId) {
        return res.status(400).json({
          error: "Título e ID do artista são obrigatórios",
        });
      }

      // Verificar se artista existe
      const artist = artists.find((a) => a.id === parseInt(artistId));
      if (!artist) {
        return res.status(404).json({ error: "Artista não encontrado" });
      }

      // Verificar se álbum existe (se fornecido)
      let album = null;
      if (albumId) {
        album = albums.find((a) => a.id === parseInt(albumId));
        if (!album) {
          return res.status(404).json({ error: "Álbum não encontrado" });
        }
      }

      // Verificar se música já existe
      const existingMusic = musics.find(
        (m) =>
          m.title.toLowerCase() === title.toLowerCase() &&
          m.artistId === parseInt(artistId) &&
          (!albumId || m.albumId === parseInt(albumId))
      );

      if (existingMusic) {
        return res.status(409).json({
          error: "Música já existe para este artista/álbum",
        });
      }

      const newMusic = {
        id: getNextId("musics"),
        title,
        artistId: parseInt(artistId),
        albumId: albumId ? parseInt(albumId) : null,
        duration: duration || 0,
        genre: genre || "",
        file: null,
        lyrics: lyrics || "",
        trackNumber: trackNumber || null,
        playCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      musics.push(newMusic);

      // Atualizar contador de faixas do álbum
      if (album) {
        const albumMusics = musics.filter((m) => m.albumId === album.id);
        album.tracks = albumMusics.length;
        album.duration = albumMusics.reduce(
          (total, m) => total + (m.duration || 0),
          0
        );
        album.updatedAt = new Date();
      }

      // Adicionar informações na resposta
      const musicWithDetails = {
        ...newMusic,
        artist: { id: artist.id, name: artist.name },
        album: album ? { id: album.id, title: album.title } : null,
      };

      res.status(201).json({
        message: "Música criada com sucesso",
        music: musicWithDetails,
      });
    } catch (error) {
      console.error("Erro ao criar música:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Atualizar música (editor/admin)
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { title, artistId, albumId, duration, genre, lyrics, trackNumber } =
        req.body;

      const musicIndex = musics.findIndex((m) => m.id === parseInt(id));
      if (musicIndex === -1) {
        return res.status(404).json({ error: "Música não encontrada" });
      }

      const music = musics[musicIndex];
      const oldAlbumId = music.albumId;

      // Se está a mudar o artista, verificar se existe
      if (artistId && artistId !== music.artistId) {
        const artist = artists.find((a) => a.id === parseInt(artistId));
        if (!artist) {
          return res.status(404).json({ error: "Artista não encontrado" });
        }
        music.artistId = parseInt(artistId);
      }

      // Se está a mudar o álbum, verificar se existe
      if (albumId !== undefined) {
        if (albumId && albumId !== music.albumId) {
          const album = albums.find((a) => a.id === parseInt(albumId));
          if (!album) {
            return res.status(404).json({ error: "Álbum não encontrado" });
          }
        }
        music.albumId = albumId ? parseInt(albumId) : null;
      }

      // Verificar se novo título já existe
      if (title && title !== music.title) {
        const titleExists = musics.find(
          (m) =>
            m.title.toLowerCase() === title.toLowerCase() &&
            m.artistId === music.artistId &&
            (!music.albumId || m.albumId === music.albumId) &&
            m.id !== parseInt(id)
        );
        if (titleExists) {
          return res.status(409).json({
            error: "Título da música já existe para este artista/álbum",
          });
        }
        music.title = title;
      }

      // Atualizar outros campos
      if (duration !== undefined) music.duration = duration;
      if (genre !== undefined) music.genre = genre;
      if (lyrics !== undefined) music.lyrics = lyrics;
      if (trackNumber !== undefined) music.trackNumber = trackNumber;
      music.updatedAt = new Date();

      // Atualizar contadores dos álbuns afetados
      [oldAlbumId, music.albumId].forEach((albumId) => {
        if (albumId) {
          const album = albums.find((a) => a.id === albumId);
          if (album) {
            const albumMusics = musics.filter((m) => m.albumId === albumId);
            album.tracks = albumMusics.length;
            album.duration = albumMusics.reduce(
              (total, m) => total + (m.duration || 0),
              0
            );
            album.updatedAt = new Date();
          }
        }
      });

      // Adicionar informações na resposta
      const artist = artists.find((a) => a.id === music.artistId);
      const album = albums.find((a) => a.id === music.albumId);

      const musicWithDetails = {
        ...music,
        artist: artist ? { id: artist.id, name: artist.name } : null,
        album: album ? { id: album.id, title: album.title } : null,
      };

      res.json({
        message: "Música atualizada com sucesso",
        music: musicWithDetails,
      });
    } catch (error) {
      console.error("Erro ao atualizar música:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Eliminar música (admin)
  delete: (req, res) => {
    try {
      const { id } = req.params;
      const musicIndex = musics.findIndex((m) => m.id === parseInt(id));

      if (musicIndex === -1) {
        return res.status(404).json({ error: "Música não encontrada" });
      }

      const music = musics[musicIndex];
      const albumId = music.albumId;

      // Remover música das playlists
      const { playlists } = require("../data/mockData");
      playlists.forEach((playlist) => {
        playlist.musics = playlist.musics.filter(
          (musicId) => musicId !== parseInt(id)
        );
      });

      musics.splice(musicIndex, 1);

      // Atualizar contador do álbum
      if (albumId) {
        const album = albums.find((a) => a.id === albumId);
        if (album) {
          const albumMusics = musics.filter((m) => m.albumId === albumId);
          album.tracks = albumMusics.length;
          album.duration = albumMusics.reduce(
            (total, m) => total + (m.duration || 0),
            0
          );
          album.updatedAt = new Date();
        }
      }

      res.json({ message: "Música eliminada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Incrementar contador de reproduções
  incrementPlayCount: (req, res) => {
    try {
      const { id } = req.params;
      const music = musics.find((m) => m.id === parseInt(id));

      if (!music) {
        return res.status(404).json({ error: "Música não encontrada" });
      }

      music.playCount = (music.playCount || 0) + 1;
      music.updatedAt = new Date();

      res.json({
        message: "Reprodução registada",
        playCount: music.playCount,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter músicas mais tocadas
  getTopPlayed: (req, res) => {
    try {
      const { limit = 10 } = req.query;

      const topMusics = [...musics]
        .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        .slice(0, parseInt(limit));

      // Adicionar informações do artista e álbum
      const musicsWithDetails = topMusics.map((music) => {
        const artist = artists.find((a) => a.id === music.artistId);
        const album = albums.find((a) => a.id === music.albumId);
        return {
          ...music,
          artist: artist ? { id: artist.id, name: artist.name } : null,
          album: album ? { id: album.id, title: album.title } : null,
        };
      });

      res.json(musicsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = musicController;
