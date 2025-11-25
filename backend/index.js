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
app.get("/contrato", readRoutes.getContratos(db));
app.get("/contrato/filtro", readRoutes.getContratoFiltro(db));
app.get("/contrato/:cpf", readRoutes.getContratoPorCpf(db));

app.get("/titular", readRoutes.getTitulares(db));
app.get("/titular/filtro", readRoutes.getTitularesFiltro(db));

app.get("/tumulo", readRoutes.getTumulos(db));
app.get("/tumulo/filtro", readRoutes.getTumuloFiltro(db));
app.get("/tumulo/:id_tumulo", readRoutes.getTumuloPorId(db));

app.get("/fornecedor", readRoutes.getFornecedores)
app.get("/fornecedor/filtro", readRoutes.getContratoFiltro)

app.get("/funcionario", readRoutes.getFuncionarios)
app.get("/funcionario/filtro", readRoutes.getFuncionariosFiltro)

app.get("/evento", readRoutes.getEventos(db));
app.get("/evento/filtro", readRoutes.getEventosFiltro(db));
app.get("/evento/:id", readRoutes.getEventoPorId(db));

app.get("/contratoVencendo", readRoutes.getContratosAVencer(db));





// Rotas de INSERÇÃO
// app.post("/titular", insertRoutes.createTitular);
// // (...)

// // Rotas de DELEÇÃO
// app.delete("/titular/:cpf", deleteRoutes.deleteTitularByCpf);
// (...)

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});