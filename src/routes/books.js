export default async function booksRoutes(app) {
  const bookBodySchema = {
    type: 'object',
    required: ['title', 'author'],
    properties: {
      title: { type: 'string', minLength: 1 },
      author: { type: 'string', minLength: 1 },
    }
  };

  const idParamSchema = {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', pattern: '^[0-9]+$' }
    }
  };

  // CREATE
  app.post('/books', { schema: { body: bookBodySchema } }, async (request, reply) => {
    const { title, author } = request.body;
    const book = await app.prisma.book.create({ data: { title, author } });
    return reply.code(201).send(book);
  });

  // READ ALL
  app.get('/books', async (request, reply) => {
    const books = await app.prisma.book.findMany({
      orderBy: { id: 'asc' }
    });
    return reply.send(books);
  });

  // READ BY ID
  app.get('/books/:id', { schema: { params: idParamSchema } }, async (request, reply) => {
    const id = parseInt(request.params.id);
    const book = await app.prisma.book.findUnique({ where: { id } });

    if (!book) {
      return reply.code(404).send({ error: 'Livro não encontrado' });
    }

    return reply.send(book);
  });

  // UPDATE
  app.put('/books/:id', {
    schema: {
      params: idParamSchema,
      body: bookBodySchema
    }
  }, async (request, reply) => {
    const id = parseInt(request.params.id);
    const { title, author } = request.body;

    try {
      const updated = await app.prisma.book.update({
        where: { id },
        data: { title, author }
      });
      return reply.send(updated);
    } catch (error) {
      return reply.code(404).send({ error: 'Livro não encontrado para atualização' });
    }
  });

  // DELETE
  app.delete('/books/:id', { schema: { params: idParamSchema } }, async (request, reply) => {
    const id = parseInt(request.params.id);

    try {
      await app.prisma.book.delete({ where: { id } });
      return reply.code(204).send();
    } catch (error) {
      return reply.code(404).send({ error: 'Livro não encontrado para exclusão' });
    }
  });
}
