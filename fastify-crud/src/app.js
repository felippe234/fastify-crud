import fastify from "fastify";
import {prisma} from './db.js';
import booksRoutes from './routes/books.js';

export function buildApp(){
    const app = fastify({logger:true});

// deixe  o prisma disponivel no fastify
    app.decorate('prisma', prisma);
    
// registre as rotas
    app.register(booksRoutes);

//fecha o prisma ao encerrar o app
    app.addHook('onClose', async (instance) => {
        await instance.prisma.$disconnect();
    });
    return app; 
}