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
app.get("/contratos", readRoutes.getContratos);
app.get("/contrato/cpf/:cpf", readRoutes.getContratosByCpf);
app.get("/contrato/tumulo/:id_tumulo", readRoutes.getContratosByTumulo);
app.get("/falecidos", readRoutes.getAllFalecidos);
app.get("/falecido/:cpf", readRoutes.getFalecidoByCpf);
app.get("/tumulos", readRoutes.getAllTumulos);
app.get("/tumulo/:id_tumulo", readRoutes.getTumuloById);
app.get("/tumulos/:status", readRoutes.getTumuloByStatus);
app.get("/funcionarios", readRoutes.getFuncionarios);
app.get("/eventos", readRoutes.getEventos);
app.get("/evento/:id_evento", readRoutes.getEventoById);
app.get("/fornecedores", readRoutes.getFornecedores);


// Rotas de INSERÇÃO
app.post("/titular", insertRoutes.createTitular);
// (...)

// Rotas de DELEÇÃO
app.delete("/titular/:cpf", deleteRoutes.deleteTitularByCpf);
// (...)

app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});