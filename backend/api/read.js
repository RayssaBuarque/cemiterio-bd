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
      capacidade: req.query.capacidade,
      atual: req.query.atual
      
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

const getContratosAVencer = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query("SELECT c.CPF, t.nome, c.ID_tumulo, c.data_inicio, (c.data_inicio + c.prazo_vigencia) AS data_fim FROM contrato c JOIN titular t ON c.CPF = t.CPF WHERE (c.data_inicio + c.prazo_vigencia) BETWEEN CURRENT_DATE AND CURRENT_DATE + 30;");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao achar contratos vencendo" });
    }
  };
}

// 1. Custo total dos eventos (evento + compras)
const getCustoTotalEventos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          e.ID_evento,
          e.lugar,
          e.dia,
          e.valor AS valor_evento,
          COALESCE(SUM(c.valor), 0) AS total_compras,
          e.valor + COALESCE(SUM(c.valor), 0) AS custo_total
        FROM evento e
        LEFT JOIN compra c ON e.ID_evento = c.ID_evento
        GROUP BY e.ID_evento
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao calcular custos dos eventos" });
    }
  };
};

// 2. Funcionários que mais trabalharam em eventos
const getFuncionariosMaisTrabalhadores = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          f.CPF,
          f.nome,
          f.funcao,
          f.horas_semanais,
          COUNT(fe.ID_evento) AS total_eventos
        FROM funcionario f
        LEFT JOIN funcionario_evento fe ON f.CPF = fe.CPF
        GROUP BY f.CPF
        ORDER BY total_eventos DESC
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar funcionários" });
    }
  };
};

// 3. Túmulos mais ocupados
const getTumulosMaisOcupados = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          t.ID_tumulo,
          t.tipo,
          t.capacidade,
          COUNT(f.CPF) AS total_falecidos
        FROM tumulo t
        LEFT JOIN falecido f ON t.ID_tumulo = f.ID_tumulo
        GROUP BY t.ID_tumulo
        ORDER BY total_falecidos DESC
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar túmulos" });
    }
  };
};

// 4. Localização com mais contratos ativos
const getLocalizacaoContratosAtivos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          lt.quadra,
          lt.setor,
          lt.numero,
          COUNT(c.CPF) AS contratos_ativos
        FROM localizacao_tumulo lt
        JOIN contrato c ON c.ID_tumulo = lt.ID_tumulo
        WHERE c.status = 'Ativo'
        GROUP BY lt.quadra, lt.setor, lt.numero
        ORDER BY contratos_ativos DESC
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar localizações" });
    }
  };
};

// 5. Fornecedores com maior volume de compras
const getFornecedoresMaiorGastos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          f.CNPJ,
          f.nome,
          SUM(c.valor) AS total_gasto
        FROM fornecedor f
        JOIN compra c ON f.CNPJ = c.CNPJ
        GROUP BY f.CNPJ
        ORDER BY total_gasto DESC
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar fornecedores" });
    }
  };
};

// 6. Estatísticas de compras por item
const getEstatisticasCompras = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          item,
          COUNT(*) AS qtd_compras,
          SUM(valor) AS soma_valor,
          AVG(valor) AS valor_medio,
          MAX(valor) AS maior_compra
        FROM compra
        GROUP BY item
        ORDER BY soma_valor DESC
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao calcular estatísticas" });
    }
  };
};

// 7. Estatísticas de falecidos por ano
const getEstatisticasFalecidos = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          EXTRACT(YEAR FROM data_falecimento) AS ano,
          COUNT(*) AS total_falecidos,
          AVG(EXTRACT(YEAR FROM data_falecimento) - EXTRACT(YEAR FROM data_nascimento)) AS idade_media
        FROM falecido
        GROUP BY EXTRACT(YEAR FROM data_falecimento)
        ORDER BY ano
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao calcular estatísticas" });
    }
  };
};


// 8. Fornecedor mais usado por tipo de evento
const getFornecedorMaisUsado = (db) => {
  return async (req, res) => {
    try {
      const result = await db.query(`
        SELECT 
          tipo_evento,
          CNPJ,
          nome_fornecedor,
          total_usos
        FROM (
          SELECT 
            te.tipo_evento,
            f.CNPJ,
            f.nome AS nome_fornecedor,
            COUNT(*) AS total_usos,
            ROW_NUMBER() OVER (PARTITION BY te.tipo_evento ORDER BY COUNT(*) DESC) AS rn
          FROM fornecedor f
          JOIN compra c ON f.CNPJ = c.CNPJ
          JOIN (
            SELECT ID_evento, 'sepultamento' AS tipo_evento FROM evento_sepultamento
            UNION ALL
            SELECT ID_evento, 'velorio' FROM evento_velorio
            UNION ALL
            SELECT ID_evento, 'cremacao' FROM evento_cremacao
          ) te ON te.ID_evento = c.ID_evento
          GROUP BY te.tipo_evento, f.CNPJ, f.nome
        ) ranking
        WHERE rn = 1
      `);
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar fornecedores" });
    }
  };
};

const getFuncionariosLivres = (db) => {
  return async (req, res) => {
    try {
      const { data, horario } = req.query;
      
      if (!data || !horario) {
        return res.status(400).json({ 
          error: "Parâmetros 'data' e 'horario' são obrigatórios. Formato: data=YYYY-MM-DD&horario=HH:MM:SS" 
        });
      }

      const result = await db.query(`
        SELECT 
          f.CPF,
          f.nome,
          f.funcao,
          f.horas_semanais
        FROM funcionario f
        WHERE f.CPF NOT IN (
          SELECT fe.CPF
          FROM funcionario_evento fe
          JOIN evento e ON fe.ID_evento = e.ID_evento
          WHERE e.dia = $1 
            AND e.horario = $2
        )
        ORDER BY f.nome
      `, [data, horario]);

      return res.json({
        data_consulta: data,
        horario_consulta: horario,
        funcionarios_livres: result.rows,
        total_livres: result.rows.length
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar funcionários livres" });
    }
  };
};

export default {
  // Contratos
  getContratos,
  getContratoPorCpf,
  getContratoFiltro,

  // Falecidos
  getFalecidos,
  getFalecidoPorCpf,
  getFalecidosFiltro,

  // Eventos
  getEventos,
  getEventoPorId,
  getEventosFiltro,

  // Fornecedores
  getFornecedores,
  getFornecedoresFiltro,

  // Funcionarios
  getFuncionarios,
  getFuncionariosFiltro,
  getFuncionariosLivres,

  // Titulares
  getTitulares,
  getTitularesFiltro,
  
  // Túmulos
  getTumulos,
  getTumuloPorId,
  getTumuloFiltro,

  //Avancados
  getContratosAVencer,
  getCustoTotalEventos,
  getFuncionariosMaisTrabalhadores,
  getTumulosMaisOcupados,
  getLocalizacaoContratosAtivos,
  getFornecedoresMaiorGastos,
  getEstatisticasCompras,
  getEstatisticasFalecidos,
  getFornecedorMaisUsado

};
