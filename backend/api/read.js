function construtorDeWhere(filtros) {
  const conditions = [];
  const values = [];
  let contador = 1;

  for (const campo in filtros) {
    const valor = filtros[campo];

    // Ignora undefined, null, string vazia
    if (valor !== undefined && valor !== null && valor !== "") {
      conditions.push(`${campo} = $${contador}`);
      values.push(valor);
      contador++;
    }
  }

  const where = conditions.length > 0
    ? "WHERE " + conditions.join(" AND ")
    : "";

  return { where, values };
}


//-------------------------------------------------------------------------//
//                               CONTRATOS                                 //
//-_______________________________________________________________________-//
// Retorna todos os registros da tabela Contratos                          //
//-------------------------------------------------------------------------//
const getContratos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM contrato");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao consultar todos os contratos" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna um contrato cujo cpf = :cpf                                     //
//-------------------------------------------------------------------------//
const getContratoPorCpf = (db) => {
  return async (req, res) => {
    const { cpf } = req.params;
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT * FROM contrato WHERE cpf = ${cpf}`
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "Contrato por cpf não encontrado" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar contrato por cpf" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna uma lista de contratos com base em um filtro                    //
//-------------------------------------------------------------------------//
const getContratoFiltro = (db) => {
  return async (req, res) => {

    const filtros = {
      cpf: req.query.cpf,
      id_tumulo: req.query.id_tumulo,
      data_inicio: req.query.data_inicio,
      prazo_vigencia: req.query.prazo_vigencia,
      valor: req.query.valor,
      status: req.query.status
    };

    const { where, values } = construtorDeWhere(filtros);

    try {
      const result = await db.query(
        `SELECT * FROM contrato ${where}`,
        values
      );

      return res.json(result.rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar contratos filtrados" });
    }

  };
};

//-------------------------------------------------------------------------//
//                                 EVENTOS                                 //
//-_______________________________________________________________________-//
// Retorna todos os registros da tabela Eventos                            //
//-------------------------------------------------------------------------//
const getEventos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM evento");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao consultar todos os eventos" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna um evento cujo id = :id_evento                                  //
//-------------------------------------------------------------------------//
const getEventoPorId = (db) => {
  return async (req, res) => {
    const { id_evento } = req.params;
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT * FROM evento WHERE id_evento = ${id_evento}`
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "Evento por id_evento não encontrado" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar evento por id_evento" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna uma lista de Eventos com base em um filtro                      //
//-------------------------------------------------------------------------//
const getEventosFiltro = (db) => {
  return async (req, res) => {

    const filtros = {
      id_evento: req.query.id_evento,
      lugar: req.query.lugar,
      dia: req.query.dia,
      horario: req.query.horario,
      valor: req.query.valor
    };

    const { where, values } = construtorDeWhere(filtros);

    try {
      const result = await db.query(
        `SELECT * FROM evento ${where}`,
        values
      );

      return res.json(result.rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar eventos filtrados" });
    }

  };
};

//-------------------------------------------------------------------------//
//                               FALECIDOS                                 //
//-_______________________________________________________________________-//
// Retorna todos os registros da tabela Falecido                           //
//-------------------------------------------------------------------------//
const getFalecidos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM falecido");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao consultar todos os falecidos" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna um falecido cujo cpf = :cpf                                     //
//-------------------------------------------------------------------------//
const getFalecidoPorCpf = (db) => {
  return async (req, res) => {
    const { cpf } = req.params;
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT * FROM falecido WHERE cpf = ${cpf}`
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "Falecido por cpf não encontrado" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar falecido por cpf" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna uma lista de falecidos com base em um filtro                    //
//-------------------------------------------------------------------------//
const getFalecidosFiltro = (db) => {
  return async (req, res) => {

    const filtros = {
      cpf: req.query.cpf,
      nome: req.query.nome,
      data_falecimento: req.query.data_falecimento,
      data_nascimento: req.query.data_nascimento,
      motivo: req.query.motivo,
      id_tumulo: req.query.id_tumulo
    };

    const { where, values } = construtorDeWhere(filtros);

    try {
      const result = await db.query(
        `SELECT * FROM falecido ${where}`,
        values
      );

      return res.json(result.rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar falecidos filtrados" });
    }

  };
};

//-------------------------------------------------------------------------//
//                              FORNECEDORES                               //
//-_______________________________________________________________________-//
// Retorna todos os registros da tabela Fornecedores                       //
//-------------------------------------------------------------------------//
const getFornecedores = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM fornecedor");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao consultar todos os fornecedores" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna uma lista de fornecedores com base em um filtro                 //
//-------------------------------------------------------------------------//
const getFornecedoresFiltro = (db) => {
  return async (req, res) => {

    const filtros = {
      cnpj: req.query.cnpj,
      nome: req.query.nome,
      endereco: req.query.endereco
    };

    const { where, values } = construtorDeWhere(filtros);

    try {
      const result = await db.query(
        `SELECT * FROM fornecedor ${where}`,
        values
      );

      return res.json(result.rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar fornecedores filtrados" });
    }

  };
};

//-------------------------------------------------------------------------//
//                              FUNCIONARIOS                               //
//-_______________________________________________________________________-//
// Retorna todos os registros da tabela Funcionarios                       //
//-------------------------------------------------------------------------//
const getFuncionarios = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM funcionario");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao consultar todos os funcionários" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna uma lista de funcionarios com base em um filtro                 //
//-------------------------------------------------------------------------//
const getFuncionariosFiltro = (db) => {
  return async (req, res) => {

    const filtros = {
      cnpj: req.query.cnpj,
      nome: req.query.nome,
      endereco: req.query.endereco
    };

    const { where, values } = construtorDeWhere(filtros);

    try {
      const result = await db.query(
        `SELECT * FROM fornecedor ${where}`,
        values
      );

      return res.json(result.rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar fornecedores filtrados" });
    }

  };
};

//-------------------------------------------------------------------------//
//                               TITULARES                                 //
//-_______________________________________________________________________-//
// Retorna todos os registros da tabela Titular                            //
//-------------------------------------------------------------------------//
const getTitulares = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM titular");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao consultar todos os titulares" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna uma lista de titulares com base em um filtro                    //
//-------------------------------------------------------------------------//
const getTitularesFiltro = (db) => {
  return async (req, res) => {

    const filtros = {
      cpf: req.query.cpf,
      nome: req.query.nome,
      endereco: req.query.endereco,
      email: req.query.email,
      telefone: req.query.telefone
    };

    const { where, values } = construtorDeWhere(filtros);

    try {
      const result = await db.query(
        `SELECT * FROM titular ${where}`,
        values
      );

      return res.json(result.rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar titulares filtrados" });
    }

  };
};

//-------------------------------------------------------------------------//
//                                TÚMULOS                                  //
//-_______________________________________________________________________-//
// Lista todos os registros da tabela Tumulo                               //
//-------------------------------------------------------------------------//
const getTumulos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM tumulo");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao consultar todos os túmulos" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna um túmulo cujo id = :id_tumulo                                  //
//-------------------------------------------------------------------------//
const getTumuloPorId = (db) => {
  return async (req, res) => {
    const { id_tumulo } = req.params;
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT * FROM tumulo WHERE id_tumulo = ${id_tumulo}`
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "Túmulo por id_tumulo não encontrado" });
      }
      
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar túmulo por id_tumulo" });
    }
  };
}

//-------------------------------------------------------------------------//
// Retorna uma lista de túmulos com base em um filtro                      //
//-------------------------------------------------------------------------//
const getTumuloFiltro = (db) => {
  return async (req, res) => {

    const filtros = {
      id_tumulo: req.query.id_tumulo,
      status: req.query.status,
      tipo: req.query.tipo,
      capacidade: req.query.capacidade
    };

    const { where, values } = construtorDeWhere(filtros);

    try {
      const result = await db.query(
        `SELECT * FROM tumulo ${where}`,
        values
      );

      return res.json(result.rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar túmulos" });
    }

  };
};


export default {
  // Contratos
  getContratos,
  getContratoPorCpf,
  getContratoFiltro,

  // Eventos
  getEventos,
  getEventoPorId,
  getEventosFiltro,

  // Fornecedores
  getFornecedores,
  getContratoFiltro,

  // Funcionarios
  getFuncionarios,
  getFuncionariosFiltro,

  // Titulares
  getTitulares,
  getTitularesFiltro,
  
  // Túmulos
  getTumulos,
  getTumuloPorId,
  getTumuloFiltro
};
