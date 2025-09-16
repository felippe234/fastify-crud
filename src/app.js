import fastify from "fastify";
import { prisma } from './db.js';
import booksRoutes from './routes/books.js';

export function buildApp() {
  const app = fastify({ logger: true });

  // Torna o Prisma acessível via app.prisma
  app.decorate('prisma', prisma);

  // Rota raiz para evitar erro 404
  app.get('/', async (request, reply) => {
    return {
      message: '📚 Bem-vindo à API de livros!',
      endpoints: [
        { method: 'GET', path: '/books' },
        { method: 'GET', path: '/books/:id' },
        { method: 'POST', path: '/books' },
        { method: 'PUT', path: '/books/:id' },
        { method: 'DELETE', path: '/books/:id' }
      ]
    };
  });

  // Evita erro ao buscar favicon
  app.get('/favicon.ico', async (request, reply) => {
    reply.code(204).send();
  });

  // Registra rotas de livros
  app.register(booksRoutes);

  // Desconecta do Prisma ao encerrar o app
  app.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
  });

  return app;
}
