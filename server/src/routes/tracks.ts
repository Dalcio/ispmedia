import express from 'express';

const router = express.Router();

// GET /api/tracks
router.get('/', async (req, res) => {
  try {
    // TODO: Implementar busca no Firestore
    const mockTracks = [
      {
        id: '1',
        title: 'Exemplo de Música',
        artistName: 'Artista Exemplo',
        albumName: 'Álbum Exemplo',
        duration: 180,
        genre: 'Pop',
        playCount: 1000,
        averageRating: 4.5
      }
    ];

    res.json({
      tracks: mockTracks,
      total: mockTracks.length
    });
  } catch (error) {
    console.error('Erro ao buscar tracks:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/tracks/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Implementar busca por ID no Firestore
    const mockTrack = {
      id,
      title: 'Exemplo de Música',
      artistName: 'Artista Exemplo',
      albumName: 'Álbum Exemplo',
      duration: 180,
      genre: 'Pop',
      playCount: 1000,
      averageRating: 4.5
    };

    res.json(mockTrack);
  } catch (error) {
    console.error('Erro ao buscar track:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/tracks/search
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query de busca é obrigatória'
      });
    }

    // TODO: Implementar busca no Firestore
    const mockResults = [
      {
        id: '1',
        title: `Resultado para: ${query}`,
        artistName: 'Artista Exemplo',
        albumName: 'Álbum Exemplo',
        duration: 180,
        genre: 'Pop'
      }
    ];

    res.json({
      results: mockResults,
      query,
      total: mockResults.length
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
