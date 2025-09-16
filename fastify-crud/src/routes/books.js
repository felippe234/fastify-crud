export default async function booksRoutes(app){
    //schemas simples de validação (jason schema)
const bookBodySchema = {
    type: 'object',
    required: ['title','author'],
    properties: {
        title: { type: 'string', minLength: 1   },
        author: { type: 'string', minLength: 1 },
    }
}
const idParamSchema = {
    type: 'object',
    required: ['id'],   
    properties: {
        //mantemos como string e convertimos manualmente
        id: { type: 'string', pattern: '^[0-9]+$' }
    }
}  
// create
app.post('/books', { schema: { body: bookBodySchema } }, async (request, reply) => {    
    const { title, author } = req.body;
    const book = await app.prisma.book.create({ data: { title, author }  });
    return reply.code(201).send(book);
});

//read(lista)
app.get('/books', async (request, reply) => {    
    const books = await app.prisma.book.findMany({
      orderby: { id: 'asc' }
    });
    return reply.send(books);
});

}