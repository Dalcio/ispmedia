import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

// Importar rotas
import authRoutes from './routes/auth';
import tracksRoutes from './routes/tracks';
import playlistsRoutes from './routes/playlists';
import usersRoutes from './routes/users';

// Configurar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança e otimização
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/users', usersRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ISPmedia API está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'ISPmedia API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// Middleware de erro 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/tracks',
      'GET /api/playlists',
      'GET /api/users'
    ]
  });
});

// Middleware de tratamento de erros
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', error);
  
  res.status(error.status || 500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ISPmedia rodando na porta ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔥 API URL: http://localhost:${PORT}`);
  console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
});

export default app;
