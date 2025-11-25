import express from "express";
import { Pool } from "pg";
import cors from 'cors'
import readRoutes from './api/read.js';
import createRoutes from './api/create.js';
import updateHandlers from './api/update.js';


const app = express();
app.use(express.json());
app.use(cors());


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

app.get("/falecido", readRoutes.getFalecidos(db));
app.get("/falecido/filtro", readRoutes.getFalecidosFiltro(db));
app.get("/falecido/:cpf", readRoutes.getFalecidoPorCpf(db));

app.get("/fornecedor", readRoutes.getFornecedores(db))
app.get("/fornecedor/filtro", readRoutes.getFornecedoresFiltro(db))

app.get("/funcionario", readRoutes.getFuncionarios(db))
app.get("/funcionario/filtro", readRoutes.getFuncionariosFiltro(db))
app.get("/funcionarioLivre", readRoutes.getFuncionariosLivres(db))
app.get("/funcionario/:id_evento", readRoutes.getFuncionarioPorIdEvento(db));


app.get("/evento", readRoutes.getEventos(db));
app.get("/evento/filtro", readRoutes.getEventosFiltro(db));
app.get("/evento/:id_evento", readRoutes.getEventoPorId(db));

app.get("/contratoVencendo", readRoutes.getContratosAVencer(db));
app.get("/custoTotalEventos", readRoutes.getCustoTotalEventos(db));
app.get("/maisTrabalhadores", readRoutes.getFuncionariosMaisTrabalhadores(db));
app.get("/tumulosMaisOcupados", readRoutes.getTumulosMaisOcupados(db));
app.get("/localizacaoContratosAtivos", readRoutes.getLocalizacaoContratosAtivos(db));
app.get("/fornecedoresMaiorGastos", readRoutes.getFornecedoresMaiorGastos(db));
app.get("/estatisticasCompras", readRoutes.getEstatisticasCompras(db));
app.get("/estatisticasFalecidos", readRoutes.getEstatisticasFalecidos(db));
app.get("/fornecedorMaisUsadoCadaEvento", readRoutes.getFornecedorMaisUsado(db));



// Rotas de INSERÇÃO
app.post("/compra", createRoutes.createCompra(db));
app.post("/contrato", createRoutes.createContrato(db));
app.post("/cremacao", createRoutes.createCremacao(db));
app.post("/velorio", createRoutes.createVelorio(db));
app.post("/sepultamento", createRoutes.createSepultamento(db));
app.post("/falecido", createRoutes.createFalecido(db));
app.post("/fornecedor", createRoutes.createFornecedor(db));
app.post("/funcionario", createRoutes.createFuncionario(db));
app.post("/titular", createRoutes.createTitular(db));
app.post("/tumulo", createRoutes.createTumulo(db));

// // Rotas de DELEÇÃO
// app.delete("/titular/:cpf", deleteRoutes.deleteTitularByCpf);
// (...)

// Rotas de ATUALIZAÇÃO
app.put('/titular/:cpf', updateHandlers.updateTitular(db));
app.put('/tumulo/:id_tumulo', updateHandlers.updateTumulo(db));
app.put('/falecido/:cpf', updateHandlers.updateFalecido(db));
app.put('/contrato/:id_contrato', updateHandlers.updateContrato(db));
app.put('/fornecedor/:cnpj', updateHandlers.updateFornecedor(db));
app.put('/funcionario/:cpf', updateHandlers.updateFuncionario(db));


app.listen(PORT, () => {
  console.log(`Servidor rodando: http://localhost:${PORT}`);
});