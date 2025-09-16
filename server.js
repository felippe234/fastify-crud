import { buildApp } from "./src/app.js";   
const app = buildApp();

const port = process.env.PORT ?? 3333;
app.listen({port: Number(port), host: '0.0.0.0'})
.then(() => console.log(`Server rodando em http://localhost:${port}`))
.catch((err) => {
    
    app.log.error(err)  ;
    process.exit(1);

});