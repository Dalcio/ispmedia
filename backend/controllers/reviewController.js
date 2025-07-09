const {
  reviews,
  musics,
  albums,
  artists,
  getNextId,
} = require("../data/mockData");

const reviewController = {
  // Listar críticas com filtros
  getAll: (req, res) => {
    try {
      const { musicId, albumId, artistId, userId, limit, offset } = req.query;
      let filteredReviews = [...reviews];

      // Filtros
      if (musicId) {
        filteredReviews = filteredReviews.filter(
          (r) => r.musicId === parseInt(musicId)
        );
      }
      if (albumId) {
        filteredReviews = filteredReviews.filter(
          (r) => r.albumId === parseInt(albumId)
        );
      }
      if (artistId) {
        filteredReviews = filteredReviews.filter(
          (r) => r.artistId === parseInt(artistId)
        );
      }
      if (userId) {
        filteredReviews = filteredReviews.filter(
          (r) => r.userId === parseInt(userId)
        );
      }

      // Adicionar informações do utilizador e item criticado
      const { users } = require("../data/mockData");
      const reviewsWithDetails = filteredReviews.map((review) => {
        const user = users.find((u) => u.id === review.userId);
        let item = null;
        let itemType = null;

        if (review.musicId) {
          const music = musics.find((m) => m.id === review.musicId);
          if (music) {
            const artist = artists.find((a) => a.id === music.artistId);
            item = {
              id: music.id,
              title: music.title,
              artist: artist ? { id: artist.id, name: artist.name } : null,
            };
            itemType = "music";
          }
        } else if (review.albumId) {
          const album = albums.find((a) => a.id === review.albumId);
          if (album) {
            const artist = artists.find((a) => a.id === album.artistId);
            item = {
              id: album.id,
              title: album.title,
              artist: artist ? { id: artist.id, name: artist.name } : null,
            };
            itemType = "album";
          }
        } else if (review.artistId) {
          const artist = artists.find((a) => a.id === review.artistId);
          if (artist) {
            item = {
              id: artist.id,
              name: artist.name,
            };
            itemType = "artist";
          }
        }

        return {
          ...review,
          user: user
            ? {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
              }
            : null,
          item,
          itemType,
        };
      });

      // Ordenar por data (mais recentes primeiro)
      reviewsWithDetails.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Paginação
      const total = reviewsWithDetails.length;
      const limitNum = parseInt(limit) || total;
      const offsetNum = parseInt(offset) || 0;

      const paginatedReviews = reviewsWithDetails.slice(
        offsetNum,
        offsetNum + limitNum
      );

      res.json({
        reviews: paginatedReviews,
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

  // Obter crítica por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const review = reviews.find((r) => r.id === parseInt(id));

      if (!review) {
        return res.status(404).json({ error: "Crítica não encontrada" });
      }

      // Adicionar informações do utilizador e item criticado
      const { users } = require("../data/mockData");
      const user = users.find((u) => u.id === review.userId);

      let item = null;
      let itemType = null;

      if (review.musicId) {
        const music = musics.find((m) => m.id === review.musicId);
        if (music) {
          const artist = artists.find((a) => a.id === music.artistId);
          const album = albums.find((a) => a.id === music.albumId);
          item = {
            ...music,
            artist: artist ? { id: artist.id, name: artist.name } : null,
            album: album ? { id: album.id, title: album.title } : null,
          };
          itemType = "music";
        }
      } else if (review.albumId) {
        const album = albums.find((a) => a.id === review.albumId);
        if (album) {
          const artist = artists.find((a) => a.id === album.artistId);
          item = {
            ...album,
            artist: artist ? { id: artist.id, name: artist.name } : null,
          };
          itemType = "album";
        }
      } else if (review.artistId) {
        const artist = artists.find((a) => a.id === review.artistId);
        if (artist) {
          item = artist;
          itemType = "artist";
        }
      }

      const reviewWithDetails = {
        ...review,
        user: user
          ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          : null,
        item,
        itemType,
      };

      res.json(reviewWithDetails);
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Criar nova crítica
  create: (req, res) => {
    try {
      const { musicId, albumId, artistId, rating, comment } = req.body;
      const userId = req.user.id;

      // Validações
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          error: "Rating deve ser um número entre 1 e 5",
        });
      }

      // Verificar se pelo menos um item foi especificado
      if (!musicId && !albumId && !artistId) {
        return res.status(400).json({
          error: "Deve especificar pelo menos um: musicId, albumId ou artistId",
        });
      }

      // Verificar se apenas um item foi especificado
      const specifiedItems = [musicId, albumId, artistId].filter(Boolean);
      if (specifiedItems.length > 1) {
        return res.status(400).json({
          error: "Deve especificar apenas um: musicId, albumId ou artistId",
        });
      }

      // Verificar se o item existe
      let item = null;
      if (musicId) {
        item = musics.find((m) => m.id === parseInt(musicId));
        if (!item) {
          return res.status(404).json({ error: "Música não encontrada" });
        }
      } else if (albumId) {
        item = albums.find((a) => a.id === parseInt(albumId));
        if (!item) {
          return res.status(404).json({ error: "Álbum não encontrado" });
        }
      } else if (artistId) {
        item = artists.find((a) => a.id === parseInt(artistId));
        if (!item) {
          return res.status(404).json({ error: "Artista não encontrado" });
        }
      }

      // Verificar se utilizador já fez crítica para este item
      const existingReview = reviews.find(
        (r) =>
          r.userId === userId &&
          r.musicId === (musicId ? parseInt(musicId) : null) &&
          r.albumId === (albumId ? parseInt(albumId) : null) &&
          r.artistId === (artistId ? parseInt(artistId) : null)
      );

      if (existingReview) {
        return res.status(409).json({
          error: "Já fez uma crítica para este item",
        });
      }

      const newReview = {
        id: getNextId("reviews"),
        userId,
        musicId: musicId ? parseInt(musicId) : null,
        albumId: albumId ? parseInt(albumId) : null,
        artistId: artistId ? parseInt(artistId) : null,
        rating: parseInt(rating),
        comment: comment || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      reviews.push(newReview);

      // Adicionar informações na resposta
      const { users } = require("../data/mockData");
      const user = users.find((u) => u.id === userId);

      let itemType = null;
      if (musicId) itemType = "music";
      else if (albumId) itemType = "album";
      else if (artistId) itemType = "artist";

      const reviewWithDetails = {
        ...newReview,
        user: user
          ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          : null,
        itemType,
      };

      res.status(201).json({
        message: "Crítica criada com sucesso",
        review: reviewWithDetails,
      });
    } catch (error) {
      console.error("Erro ao criar crítica:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Atualizar crítica
  update: (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      const reviewIndex = reviews.findIndex((r) => r.id === parseInt(id));
      if (reviewIndex === -1) {
        return res.status(404).json({ error: "Crítica não encontrada" });
      }

      const review = reviews[reviewIndex];

      // Verificar se o utilizador é o autor da crítica
      if (review.userId !== userId) {
        return res.status(403).json({
          error: "Apenas o autor pode editar a crítica",
        });
      }

      // Validar rating se fornecido
      if (rating !== undefined) {
        if (rating < 1 || rating > 5) {
          return res.status(400).json({
            error: "Rating deve ser um número entre 1 e 5",
          });
        }
        review.rating = parseInt(rating);
      }

      // Atualizar comentário
      if (comment !== undefined) {
        review.comment = comment;
      }

      review.updatedAt = new Date();

      // Adicionar informações na resposta
      const { users } = require("../data/mockData");
      const user = users.find((u) => u.id === userId);

      let itemType = null;
      if (review.musicId) itemType = "music";
      else if (review.albumId) itemType = "album";
      else if (review.artistId) itemType = "artist";

      const reviewWithDetails = {
        ...review,
        user: user
          ? {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          : null,
        itemType,
      };

      res.json({
        message: "Crítica atualizada com sucesso",
        review: reviewWithDetails,
      });
    } catch (error) {
      console.error("Erro ao atualizar crítica:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Eliminar crítica
  delete: (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const reviewIndex = reviews.findIndex((r) => r.id === parseInt(id));
      if (reviewIndex === -1) {
        return res.status(404).json({ error: "Crítica não encontrada" });
      }

      const review = reviews[reviewIndex];

      // Verificar se o utilizador pode eliminar a crítica
      if (review.userId !== userId && userRole !== "admin") {
        return res.status(403).json({
          error: "Apenas o autor ou admin pode eliminar a crítica",
        });
      }

      reviews.splice(reviewIndex, 1);
      res.json({ message: "Crítica eliminada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  // Obter estatísticas de ratings para um item
  getItemStats: (req, res) => {
    try {
      const { musicId, albumId, artistId } = req.query;

      if (!musicId && !albumId && !artistId) {
        return res.status(400).json({
          error: "Deve especificar pelo menos um: musicId, albumId ou artistId",
        });
      }

      let itemReviews = reviews.filter((r) => {
        if (musicId) return r.musicId === parseInt(musicId);
        if (albumId) return r.albumId === parseInt(albumId);
        if (artistId) return r.artistId === parseInt(artistId);
        return false;
      });

      if (itemReviews.length === 0) {
        return res.json({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        });
      }

      const totalReviews = itemReviews.length;
      const sumRatings = itemReviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = Math.round((sumRatings / totalReviews) * 10) / 10;

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      itemReviews.forEach((r) => {
        ratingDistribution[r.rating]++;
      });

      res.json({
        totalReviews,
        averageRating,
        ratingDistribution,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};

module.exports = reviewController;
