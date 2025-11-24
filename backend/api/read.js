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
// Retorna um contrato cujo id_tumulo = :id_tumulo                         //
//-------------------------------------------------------------------------//
const getContratoPorId_Tumulo = (db) => {
  return async (req, res) => {
    const { id_tumulo } = req.params;
    try {
      const { id } = req.params;
      const result = await db.query(
        `SELECT * FROM contrato WHERE id_tumulo = ${id_tumulo}`
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "Contrato por id_tumulo não encontrado" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar contrato por id_tumulo" });
    }
  };
}

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

export default {
  // Contratos
  getContratos,
  getContratoPorCpf,
  getContratoPorId_Tumulo,

  // Eventos
  getEventos,
  getEventoPorId,

  // Fornecedores
  getFornecedores,

  // Funcionarios
  getFuncionarios,

  // Titulares
  getTitulares,
  
  // Túmulos
  getTumulos,
  getTumuloPorId
};
