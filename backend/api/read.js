import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


//-------------------------------------------------------------------------//
// GET /titular/:cpf                                                       //
// Retorna todos os campos do registro da tabela Titular cujo CPF = :cpf   //
//-------------------------------------------------------------------------//
const getTitularByCpf = async (req, res) => {
  const { cpf } = req.params; // coletando o parâmetro :cpf da url
  
  try {
    const titular = await prisma.titular.findUnique({
      where: { cpf },
    });

    // Caso ele não encontre nada, retorna 404:
    if (!titular) {
      return res.status(404).json({ error: "Titular não encontrado" });
    }

    res.json(titular);

  // Erros
  } catch (error) {
    console.error("Erro ao buscar titular:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


//-------------------------------------------------------------------------//
// GET /titulares                                                          //
// Retorna todos os registros da tabela Titular                            //
//-------------------------------------------------------------------------//
const getAllTitulares = async (req, res) => {
  try {
    const titulares = await prisma.titular.findMany();
    res.json(titulares);

  } catch (error) {
    console.error("Erro ao buscar titulares:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


//-------------------------------------------------------------------------//
// GET /contratos/cpf/:cpf                                                 //
// Busca todos os contratos cujo CPF = :cpf                                //
//-------------------------------------------------------------------------//
async function getContratosByCpf(req, res) {
  const { cpf } = req.params;

  try {
    const contratos = await prisma.contrato.findMany({
      where: { cpf }
    });

    res.json(contratos);

  } catch (error) {
    console.error("Erro ao buscar contratos por CPF:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /contratos/tumulo/:id_tumulo                                        //
// Busca todos os contratos associados ao túmulo de id = :id_tumulo        //
//-------------------------------------------------------------------------//
async function getContratosByTumulo(req, res) {
  const { id_tumulo } = req.params;

  try {
    const contratos = await prisma.contrato.findMany({
      where: { id_tumulo: parseInt(id_tumulo) }
    });

    res.json(contratos);

  } catch (error) {
    console.error("Erro ao buscar contratos por tumulo:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /contratos                                                           //
// Lista todos os registros da tabela Contrato                             //
//-------------------------------------------------------------------------//
async function getContratos(req, res) {
  try {
    const contratos = await prisma.contrato.findMany();
    res.json(contratos);

  } catch (error) {
    console.error("Erro ao listar contratos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /falecidos                                                          //
// Lista todos os registros da tabela Falecido                             //
//-------------------------------------------------------------------------//
async function getAllFalecidos(req, res) {
  try {
    const falecidos = await prisma.falecido.findMany();
    res.json(falecidos);

  } catch (error) {
    console.error("Erro ao listar falecidos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /falecido/:cpf                                                      //
// Busca todos os falecidos cujo CPF = :cpf                                //
//-------------------------------------------------------------------------//
async function getFalecidoByCpf(req, res) {
  const { cpf } = req.params;

  try {
    const falecidos = await prisma.falecido.findMany({
      where: { cpf }
    });

    if (falecidos.length === 0) {
      return res.status(404).json({ error: "Falecido não encontrado" });
    }

    res.json(falecidos);

  } catch (error) {
    console.error("Erro ao buscar falecido:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /tumulos                                                            //
// Lista todos os registros da tabela Tumulo                               //
//-------------------------------------------------------------------------//
async function getAllTumulos(req, res) {
  try {
    const tumulos = await prisma.tumulo.findMany();
    res.json(tumulos);

  } catch (error) {
    console.error("Erro ao listar túmulos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /tumulo/:id_tumulo                                                  //
// Retorna um túmulo cujo id = :id_tumulo                                  //
//-------------------------------------------------------------------------//
async function getTumuloById(req, res) {
  const { id_tumulo } = req.params;

  try {
    const tumulo = await prisma.tumulo.findUnique({
      where: { id_tumulo: parseInt(id_tumulo) }
    });

    if (!tumulo) {
      return res.status(404).json({ error: "Túmulo não encontrado" });
    }

    res.json(tumulo);

  } catch (error) {
    console.error("Erro ao buscar túmulo:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /tumulos/status?status=STATUS                                       //
// Filtra túmulos pelo campo "status"                                      //
//-------------------------------------------------------------------------//
async function getTumuloByStatus(req, res) {
  const { status } = req.params;

  try {
    const tumulos = await prisma.tumulo.findMany({
      where: { status }
    });

    res.json(tumulos);

  } catch (error) {
    console.error("Erro ao filtrar túmulos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /funcionarios                                                       //
// Retorna todos os funcionários                                           //
//-------------------------------------------------------------------------//
async function getFuncionarios(req, res) {
  try {
    const funcionarios = await prisma.funcionario.findMany();
    res.json(funcionarios);

  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /eventos                                                            //
// Retorna todos os eventos                                                //
//-------------------------------------------------------------------------//
async function getEventos(req, res) {
  try {
    const eventos = await prisma.evento.findMany();
    res.json(eventos);

  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /eventos/:id_evento                                                 //
// Retorna um evento cujo id = :id_evento                                  //
//-------------------------------------------------------------------------//
async function getEventoById(req, res) {
  const { id_evento } = req.params;

  try {
    const evento = await prisma.evento.findUnique({
      where: { id_evento: Number(id_evento) }
    });

    if (!evento) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json(evento);

  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


//-------------------------------------------------------------------------//
// GET /fornecedores                                                       //
// Retorna todos os fornecedores                                           //
//-------------------------------------------------------------------------//
async function getFornecedores(req, res) {
  try {
    const fornecedores = await prisma.fornecedor.findMany();
    res.json(fornecedores);

  } catch (error) {
    console.error("Erro ao buscar fornecedores:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


export default  {
  getTitularByCpf,
  getAllTitulares,

  getContratosByCpf,
  getContratosByTumulo,
  getContratos,

  getAllFalecidos,
  getFalecidoByCpf,

  getAllTumulos,
  getTumuloById,
  getTumuloByStatus,

  getFuncionarios,

  getEventos,
  getEventoById,

  getFornecedores
};
