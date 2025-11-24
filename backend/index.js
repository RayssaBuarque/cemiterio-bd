import express from "express";
import { Pool } from "pg";

import readRoutes from './api/read.js';

const app = express();
app.use(express.json());

// Conexão com PostgreSQL
const db = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/cemiterio"
});

const PORT = process.env.PORT || 3000;


// Rotas de LEITURA
app.get("/titulares", readRoutes.getTitulares(db));
app.get("/tumulo/:id_tumulo", readRoutes.getTumuloPorId(db));



// Rotas de INSERÇÃO
// app.post("/titular", insertRoutes.createTitular);
// // (...)

// // Rotas de DELEÇÃO
// app.delete("/titular/:cpf", deleteRoutes.deleteTitularByCpf);
// (...)

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});