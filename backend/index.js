import express from "express";
import { Pool } from "pg";

import readRoutes from './api/read.js';
import createRoutes from './api/create.js';

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

app.get("/fornecedor", readRoutes.getFornecedores(db))
app.get("/fornecedor/filtro", readRoutes.getContratoFiltro(db))

app.get("/funcionario", readRoutes.getFuncionarios(db))
app.get("/funcionario/filtro", readRoutes.getFuncionariosFiltro(db))

app.get("/evento", readRoutes.getEventos(db));
app.get("/evento/filtro", readRoutes.getEventosFiltro(db));
app.get("/evento/:id", readRoutes.getEventoPorId(db));





// Rotas de INSERÇÃO
app.post("/contrato", createRoutes.createContrato(db));
app.post("/cremacao", createRoutes.createCremacao(db));
app.post("/velorio", createRoutes.createVelorio(db));
app.post("/sepultamento", createRoutes.createSepultamento(db));
app.post("/falecido", createRoutes.createFalecido(db));
app.post("/fornecedor", createRoutes.createFornecedor(db));
app.post("/funcionario", createRoutes.createFuncionario(db));
app.post("/titular", createRoutes.createTitular(db));
app.post("/tumulo", createRoutes.createTumulo(db));
// (...)

// // Rotas de DELEÇÃO
// app.delete("/titular/:cpf", deleteRoutes.deleteTitularByCpf);
// (...)

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});