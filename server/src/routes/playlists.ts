import express from 'express';

const router = express.Router();

// GET /api/playlists
router.get('/', async (req, res) => {
  try {
    // TODO: Implementar busca de playlists públicas
    const mockPlaylists = [
      {
        id: '1',
        name: 'Playlist Exemplo',
        description: 'Uma playlist de exemplo',
        totalTracks: 10,
        isPublic: true,
        owner: 'Usuário Exemplo'
      }
    ];

    res.json({
      playlists: mockPlaylists,
      total: mockPlaylists.length
    });
  } catch (error) {
    console.error('Erro ao buscar playlists:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/playlists/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Implementar busca por ID
    const mockPlaylist = {
      id,
      name: 'Playlist Exemplo',
      description: 'Uma playlist de exemplo',
      totalTracks: 10,
      isPublic: true,
      owner: 'Usuário Exemplo',
      tracks: []
    };

    res.json(mockPlaylist);
  } catch (error) {
    console.error('Erro ao buscar playlist:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
