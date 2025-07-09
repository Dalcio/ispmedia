const {
  playlists,
  musics,
  artists,
  albums,
  getNextId,
} = require("../data/mockData");

const playlistController = {
  // Listar playlists do utilizador logado
  getMyPlaylists: (req, res) => {
    try {
      const userId = req.user.id;
      const userPlaylists = playlists.filter((p) => p.userId === userId);

      // Adicionar informações das músicas
      const playlistsWithDetails = userPlaylists.map((playlist) => ({
        ...playlist,
        musicCount: playlist.musics.length,
      }));

      res.json(playlistsWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Listar playlists públicas
  getPublicPlaylists: (req, res) => {
    try {
      const { search, limit, offset } = req.query;
      let filteredPlaylists = playlists.filter((p) => p.isPublic);

      // Filtro por pesquisa
      if (search) {
        filteredPlaylists = filteredPlaylists.filter(
          (playlist) =>
            playlist.name.toLowerCase().includes(search.toLowerCase()) ||
            (playlist.description &&
              playlist.description.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // Adicionar informações do utilizador (sem dados sensíveis)
      const { users } = require("../data/mockData");
      const playlistsWithDetails = filteredPlaylists.map((playlist) => {
        const user = users.find((u) => u.id === playlist.userId);
        return {
          ...playlist,
          musicCount: playlist.musics.length,
          owner: user
            ? {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
              }
            : null,
        };
      });

      // Paginação
      const total = playlistsWithDetails.length;
      const limitNum = parseInt(limit) || total;
      const offsetNum = parseInt(offset) || 0;

      const paginatedPlaylists = playlistsWithDetails.slice(
        offsetNum,
        offsetNum + limitNum
      );

      res.json({
        playlists: paginatedPlaylists,
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

  // Obter playlist por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const playlist = playlists.find((p) => p.id === parseInt(id));

      if (!playlist) {
        return res.status(404).json({ error: "Playlist não encontrada" });
      }

      // Verificar se o utilizador tem acesso à playlist
      if (!playlist.isPublic && playlist.userId !== req.user.id) {
        return res.status(403).json({ error: "Acesso negado à playlist" });
      }

      // Obter detalhes das músicas
      const playlistMusics = playlist.musics
        .map((musicId) => {
          const music = musics.find((m) => m.id === musicId);
          if (!music) return null;

          const artist = artists.find((a) => a.id === music.artistId);
          const album = albums.find((a) => a.id === music.albumId);

          return {
            ...music,
            artist: artist ? { id: artist.id, name: artist.name } : null,
            album: album ? { id: album.id, title: album.title } : null,
          };
        })
        .filter(Boolean);

      // Adicionar informações do utilizador
      const { users } = require("../data/mockData");
      const user = users.find((u) => u.id === playlist.userId);

      const playlistWithDetails = {
        ...playlist,
        musicCount: playlistMusics.length,
        totalDuration: playlistMusics.reduce(
          (total, music) => total + (music.duration || 0),
          0
        ),
        musics: playlistMusics,
        owner: user
          ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          : null,
      };

      res.json(playlistWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Criar nova playlist
  create: (req, res) => {
    try {
      const { name, description, isPublic = false } = req.body;
      const userId = req.user.id;

      if (!name) {
        return res
          .status(400)
          .json({ error: "Nome da playlist é obrigatório" });
      }

      // Verificar se já existe playlist com o mesmo nome para o utilizador
      const existingPlaylist = playlists.find(
        (p) =>
          p.name.toLowerCase() === name.toLowerCase() && p.userId === userId
      );

      if (existingPlaylist) {
        return res.status(409).json({
          error: "Já existe uma playlist com este nome",
        });
      }

      const newPlaylist = {
        id: getNextId("playlists"),
        name,
        description: description || "",
        userId,
        musics: [],
        isPublic: Boolean(isPublic),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      playlists.push(newPlaylist);

      res.status(201).json({
        message: "Playlist criada com sucesso",
        playlist: {
          ...newPlaylist,
          musicCount: 0,
        },
      });
    } catch (error) {
      console.error("Erro ao criar playlist:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Atualizar playlist
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, isPublic } = req.body;
      const userId = req.user.id;

      const playlistIndex = playlists.findIndex((p) => p.id === parseInt(id));
      if (playlistIndex === -1) {
        return res.status(404).json({ error: "Playlist não encontrada" });
      }

      const playlist = playlists[playlistIndex];

      // Verificar se o utilizador é o dono da playlist
      if (playlist.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Apenas o dono pode editar a playlist" });
      }

      // Verificar se novo nome já existe para o utilizador
      if (name && name !== playlist.name) {
        const nameExists = playlists.find(
          (p) =>
            p.name.toLowerCase() === name.toLowerCase() &&
            p.userId === userId &&
            p.id !== parseInt(id)
        );
        if (nameExists) {
          return res.status(409).json({
            error: "Já existe uma playlist com este nome",
          });
        }
        playlist.name = name;
      }

      // Atualizar outros campos
      if (description !== undefined) playlist.description = description;
      if (isPublic !== undefined) playlist.isPublic = Boolean(isPublic);
      playlist.updatedAt = new Date();

      res.json({
        message: "Playlist atualizada com sucesso",
        playlist: {
          ...playlist,
          musicCount: playlist.musics.length,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar playlist:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Eliminar playlist
  delete: (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const playlistIndex = playlists.findIndex((p) => p.id === parseInt(id));
      if (playlistIndex === -1) {
        return res.status(404).json({ error: "Playlist não encontrada" });
      }

      const playlist = playlists[playlistIndex];

      // Verificar se o utilizador é o dono da playlist
      if (playlist.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Apenas o dono pode eliminar a playlist" });
      }

      playlists.splice(playlistIndex, 1);
      res.json({ message: "Playlist eliminada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Adicionar música à playlist
  addMusic: (req, res) => {
    try {
      const { id } = req.params;
      const { musicId } = req.body;
      const userId = req.user.id;

      if (!musicId) {
        return res.status(400).json({ error: "ID da música é obrigatório" });
      }

      const playlist = playlists.find((p) => p.id === parseInt(id));
      if (!playlist) {
        return res.status(404).json({ error: "Playlist não encontrada" });
      }

      // Verificar se o utilizador é o dono da playlist
      if (playlist.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Apenas o dono pode editar a playlist" });
      }

      // Verificar se música existe
      const music = musics.find((m) => m.id === parseInt(musicId));
      if (!music) {
        return res.status(404).json({ error: "Música não encontrada" });
      }

      // Verificar se música já está na playlist
      if (playlist.musics.includes(parseInt(musicId))) {
        return res.status(409).json({ error: "Música já está na playlist" });
      }

      playlist.musics.push(parseInt(musicId));
      playlist.updatedAt = new Date();

      res.json({
        message: "Música adicionada à playlist",
        playlist: {
          ...playlist,
          musicCount: playlist.musics.length,
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Remover música da playlist
  removeMusic: (req, res) => {
    try {
      const { id, musicId } = req.params;
      const userId = req.user.id;

      const playlist = playlists.find((p) => p.id === parseInt(id));
      if (!playlist) {
        return res.status(404).json({ error: "Playlist não encontrada" });
      }

      // Verificar se o utilizador é o dono da playlist
      if (playlist.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Apenas o dono pode editar a playlist" });
      }

      // Verificar se música está na playlist
      const musicIndex = playlist.musics.indexOf(parseInt(musicId));
      if (musicIndex === -1) {
        return res.status(404).json({ error: "Música não está na playlist" });
      }

      playlist.musics.splice(musicIndex, 1);
      playlist.updatedAt = new Date();

      res.json({
        message: "Música removida da playlist",
        playlist: {
          ...playlist,
          musicCount: playlist.musics.length,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Reordenar músicas na playlist
  reorderMusics: (req, res) => {
    try {
      const { id } = req.params;
      const { musicIds } = req.body;
      const userId = req.user.id;

      if (!Array.isArray(musicIds)) {
        return res
          .status(400)
          .json({ error: "Lista de IDs das músicas é obrigatória" });
      }

      const playlist = playlists.find((p) => p.id === parseInt(id));
      if (!playlist) {
        return res.status(404).json({ error: "Playlist não encontrada" });
      }

      // Verificar se o utilizador é o dono da playlist
      if (playlist.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Apenas o dono pode editar a playlist" });
      }

      // Verificar se todos os IDs são válidos e estão na playlist
      const validMusicIds = musicIds.filter((id) =>
        playlist.musics.includes(parseInt(id))
      );

      if (validMusicIds.length !== playlist.musics.length) {
        return res.status(400).json({
          error: "Lista de músicas não corresponde à playlist",
        });
      }

      playlist.musics = validMusicIds.map((id) => parseInt(id));
      playlist.updatedAt = new Date();

      res.json({
        message: "Ordem das músicas atualizada",
        playlist: {
          ...playlist,
          musicCount: playlist.musics.length,
        },
      });
    } catch (error) {
      console.error("Erro ao reordenar músicas:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = playlistController;
