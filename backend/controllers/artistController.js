const { artists, getNextId } = require("../data/mockData");

const artistController = {
  // Listar todos os artistas
  getAll: (req, res) => {
    try {
      const { search, genre, country, limit, offset } = req.query;
      let filteredArtists = [...artists];

      // Filtro por pesquisa
      if (search) {
        filteredArtists = filteredArtists.filter(
          (artist) =>
            artist.name.toLowerCase().includes(search.toLowerCase()) ||
            (artist.bio &&
              artist.bio.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Filtro por género
      if (genre) {
        filteredArtists = filteredArtists.filter(
          (artist) =>
            artist.genre && artist.genre.toLowerCase() === genre.toLowerCase()
        );
      }

      // Filtro por país
      if (country) {
        filteredArtists = filteredArtists.filter(
          (artist) =>
            artist.country &&
            artist.country.toLowerCase() === country.toLowerCase()
        );
      }

      // Paginação
      const total = filteredArtists.length;
      const limitNum = parseInt(limit) || total;
      const offsetNum = parseInt(offset) || 0;

      const paginatedArtists = filteredArtists.slice(
        offsetNum,
        offsetNum + limitNum
      );

      res.json({
        artists: paginatedArtists,
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

  // Obter artista por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const artist = artists.find((a) => a.id === parseInt(id));

      if (!artist) {
        return res.status(404).json({ error: "Artista não encontrado" });
      }

      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Criar novo artista (editor/admin)
  create: (req, res) => {
    try {
      const { name, bio, genre, country } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Nome do artista é obrigatório" });
      }

      // Verificar se artista já existe
      const existingArtist = artists.find(
        (a) => a.name.toLowerCase() === name.toLowerCase()
      );

      if (existingArtist) {
        return res.status(409).json({ error: "Artista já existe" });
      }

      const newArtist = {
        id: getNextId("artists"),
        name,
        bio: bio || "",
        image: null,
        genre: genre || "",
        country: country || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      artists.push(newArtist);

      res.status(201).json({
        message: "Artista criado com sucesso",
        artist: newArtist,
      });
    } catch (error) {
      console.error("Erro ao criar artista:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Atualizar artista (editor/admin)
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { name, bio, genre, country } = req.body;

      const artistIndex = artists.findIndex((a) => a.id === parseInt(id));
      if (artistIndex === -1) {
        return res.status(404).json({ error: "Artista não encontrado" });
      }

      const artist = artists[artistIndex];

      // Verificar se novo nome já existe
      if (name && name !== artist.name) {
        const nameExists = artists.find(
          (a) =>
            a.name.toLowerCase() === name.toLowerCase() && a.id !== parseInt(id)
        );
        if (nameExists) {
          return res.status(409).json({ error: "Nome do artista já existe" });
        }
        artist.name = name;
      }

      // Atualizar outros campos
      if (bio !== undefined) artist.bio = bio;
      if (genre !== undefined) artist.genre = genre;
      if (country !== undefined) artist.country = country;
      artist.updatedAt = new Date();

      res.json({
        message: "Artista atualizado com sucesso",
        artist,
      });
    } catch (error) {
      console.error("Erro ao atualizar artista:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Eliminar artista (admin)
  delete: (req, res) => {
    try {
      const { id } = req.params;
      const artistIndex = artists.findIndex((a) => a.id === parseInt(id));

      if (artistIndex === -1) {
        return res.status(404).json({ error: "Artista não encontrado" });
      }

      // Verificar se artista tem álbuns ou músicas associadas
      const { albums, musics } = require("../data/mockData");
      const hasAlbums = albums.some((album) => album.artistId === parseInt(id));
      const hasMusics = musics.some((music) => music.artistId === parseInt(id));

      if (hasAlbums || hasMusics) {
        return res.status(400).json({
          error:
            "Não é possível eliminar artista com álbuns ou músicas associadas",
        });
      }

      artists.splice(artistIndex, 1);
      res.json({ message: "Artista eliminado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter álbuns do artista
  getAlbums: (req, res) => {
    try {
      const { id } = req.params;
      const artist = artists.find((a) => a.id === parseInt(id));

      if (!artist) {
        return res.status(404).json({ error: "Artista não encontrado" });
      }

      const { albums } = require("../data/mockData");
      const artistAlbums = albums.filter(
        (album) => album.artistId === parseInt(id)
      );

      res.json(artistAlbums);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter músicas do artista
  getMusics: (req, res) => {
    try {
      const { id } = req.params;
      const artist = artists.find((a) => a.id === parseInt(id));

      if (!artist) {
        return res.status(404).json({ error: "Artista não encontrado" });
      }

      const { musics } = require("../data/mockData");
      const artistMusics = musics.filter(
        (music) => music.artistId === parseInt(id)
      );

      res.json(artistMusics);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = artistController;
