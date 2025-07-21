import express from 'express';

const router = express.Router();

// GET /api/users
router.get('/', async (req, res) => {
  try {
    // TODO: Implementar busca de usuários
    const mockUsers = [
      {
        id: '1',
        displayName: 'Usuário Exemplo',
        userType: 'user',
        isVerified: false
      }
    ];

    res.json({
      users: mockUsers,
      total: mockUsers.length
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Implementar busca por ID
    const mockUser = {
      id,
      displayName: 'Usuário Exemplo',
      userType: 'user',
      isVerified: false,
      bio: 'Biografia do usuário'
    };

    res.json(mockUser);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

export default router;
