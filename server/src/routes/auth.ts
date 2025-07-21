import express from 'express';

const router = express.Router();

// Tipos básicos
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  userType: 'user' | 'artist' | 'admin';
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios'
      });
    }

    // TODO: Implementar autenticação Firebase
    // Por enquanto, retorna sucesso simulado
    res.json({
      message: 'Login realizado com sucesso',
      user: {
        email,
        displayName: 'Usuário Teste',
        userType: 'user'
      },
      token: 'fake-jwt-token'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, userType }: RegisterRequest = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({
        error: 'Email, senha e nome são obrigatórios'
      });
    }

    // TODO: Implementar registro Firebase
    // Por enquanto, retorna sucesso simulado
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        email,
        displayName,
        userType: userType || 'user'
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    // TODO: Implementar logout Firebase
    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    // TODO: Implementar verificação de token Firebase
    res.json({
      user: {
        email: 'user@example.com',
        displayName: 'Usuário Teste',
        userType: 'user'
      }
    });
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(401).json({
      error: 'Token inválido'
    });
  }
});

export default router;
