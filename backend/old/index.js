import express from 'express';
import readRoutes from './api/read.js';
import insertRoutes from './api/insert.js';
import deleteRoutes from './api/delete.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Rotas de LEITURA
app.get("/titular/:cpf", readRoutes.getTitularByCpf);
app.get("/titulares", readRoutes.getAllTitulares);
// (...)

// Rotas de INSERÇÃO
app.post("/titular", insertRoutes.createTitular);
// (...)

// Rotas de DELEÇÃO
app.delete("/titular/:cpf", deleteRoutes.deleteTitularByCpf);
// (...)

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});