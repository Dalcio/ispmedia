const { albums, artists, getNextId } = require("../data/mockData");

const albumController = {
  // Listar todos os álbuns
  getAll: (req, res) => {
    try {
      const { search, artistId, genre, year, limit, offset } = req.query;
      let filteredAlbums = [...albums];

      // Filtro por pesquisa
      if (search) {
        filteredAlbums = filteredAlbums.filter(
          (album) =>
            album.title.toLowerCase().includes(search.toLowerCase()) ||
            (album.description &&
              album.description.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Filtro por artista
      if (artistId) {
        filteredAlbums = filteredAlbums.filter(
          (album) => album.artistId === parseInt(artistId)
        );
      }

      // Filtro por género
      if (genre) {
        filteredAlbums = filteredAlbums.filter(
          (album) =>
            album.genre && album.genre.toLowerCase() === genre.toLowerCase()
        );
      }

      // Filtro por ano
      if (year) {
        filteredAlbums = filteredAlbums.filter(
          (album) =>
            album.releaseDate &&
            album.releaseDate.getFullYear() === parseInt(year)
        );
      }

      // Adicionar informações do artista
      const albumsWithArtist = filteredAlbums.map((album) => {
        const artist = artists.find((a) => a.id === album.artistId);
        return {
          ...album,
          artist: artist ? { id: artist.id, name: artist.name } : null,
        };
      });

      // Paginação
      const total = albumsWithArtist.length;
      const limitNum = parseInt(limit) || total;
      const offsetNum = parseInt(offset) || 0;

      const paginatedAlbums = albumsWithArtist.slice(
        offsetNum,
        offsetNum + limitNum
      );

      res.json({
        albums: paginatedAlbums,
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

  // Obter álbum por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const album = albums.find((a) => a.id === parseInt(id));

      if (!album) {
        return res.status(404).json({ error: "Álbum não encontrado" });
      }

      // Adicionar informações do artista
      const artist = artists.find((a) => a.id === album.artistId);
      const albumWithArtist = {
        ...album,
        artist: artist ? { id: artist.id, name: artist.name } : null,
      };

      res.json(albumWithArtist);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Criar novo álbum (editor/admin)
  create: (req, res) => {
    try {
      const { title, artistId, releaseDate, genre, description } = req.body;

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

      // Verificar se álbum já existe para este artista
      const existingAlbum = albums.find(
        (a) =>
          a.title.toLowerCase() === title.toLowerCase() &&
          a.artistId === parseInt(artistId)
      );

      if (existingAlbum) {
        return res.status(409).json({
          error: "Álbum já existe para este artista",
        });
      }

      const newAlbum = {
        id: getNextId("albums"),
        title,
        artistId: parseInt(artistId),
        releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
        genre: genre || "",
        description: description || "",
        cover: null,
        tracks: 0,
        duration: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      albums.push(newAlbum);

      // Adicionar informações do artista na resposta
      const albumWithArtist = {
        ...newAlbum,
        artist: { id: artist.id, name: artist.name },
      };

      res.status(201).json({
        message: "Álbum criado com sucesso",
        album: albumWithArtist,
      });
    } catch (error) {
      console.error("Erro ao criar álbum:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Atualizar álbum (editor/admin)
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { title, artistId, releaseDate, genre, description } = req.body;

      const albumIndex = albums.findIndex((a) => a.id === parseInt(id));
      if (albumIndex === -1) {
        return res.status(404).json({ error: "Álbum não encontrado" });
      }

      const album = albums[albumIndex];

      // Se está a mudar o artista, verificar se existe
      if (artistId && artistId !== album.artistId) {
        const artist = artists.find((a) => a.id === parseInt(artistId));
        if (!artist) {
          return res.status(404).json({ error: "Artista não encontrado" });
        }
        album.artistId = parseInt(artistId);
      }

      // Verificar se novo título já existe para o artista
      if (title && title !== album.title) {
        const titleExists = albums.find(
          (a) =>
            a.title.toLowerCase() === title.toLowerCase() &&
            a.artistId === album.artistId &&
            a.id !== parseInt(id)
        );
        if (titleExists) {
          return res.status(409).json({
            error: "Título do álbum já existe para este artista",
          });
        }
        album.title = title;
      }

      // Atualizar outros campos
      if (releaseDate !== undefined) {
        album.releaseDate = releaseDate
          ? new Date(releaseDate)
          : album.releaseDate;
      }
      if (genre !== undefined) album.genre = genre;
      if (description !== undefined) album.description = description;
      album.updatedAt = new Date();

      // Adicionar informações do artista na resposta
      const artist = artists.find((a) => a.id === album.artistId);
      const albumWithArtist = {
        ...album,
        artist: artist ? { id: artist.id, name: artist.name } : null,
      };

      res.json({
        message: "Álbum atualizado com sucesso",
        album: albumWithArtist,
      });
    } catch (error) {
      console.error("Erro ao atualizar álbum:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Eliminar álbum (admin)
  delete: (req, res) => {
    try {
      const { id } = req.params;
      const albumIndex = albums.findIndex((a) => a.id === parseInt(id));

      if (albumIndex === -1) {
        return res.status(404).json({ error: "Álbum não encontrado" });
      }

      // Verificar se álbum tem músicas associadas
      const { musics } = require("../data/mockData");
      const hasMusics = musics.some((music) => music.albumId === parseInt(id));

      if (hasMusics) {
        return res.status(400).json({
          error: "Não é possível eliminar álbum com músicas associadas",
        });
      }

      albums.splice(albumIndex, 1);
      res.json({ message: "Álbum eliminado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter músicas do álbum
  getMusics: (req, res) => {
    try {
      const { id } = req.params;
      const album = albums.find((a) => a.id === parseInt(id));

      if (!album) {
        return res.status(404).json({ error: "Álbum não encontrado" });
      }

      const { musics } = require("../data/mockData");
      const albumMusics = musics
        .filter((music) => music.albumId === parseInt(id))
        .sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));

      // Adicionar informações do artista para cada música
      const musicsWithArtist = albumMusics.map((music) => {
        const artist = artists.find((a) => a.id === music.artistId);
        return {
          ...music,
          artist: artist ? { id: artist.id, name: artist.name } : null,
        };
      });

      res.json(musicsWithArtist);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = albumController;
