//-------------------------------------------------------------------------//
//                                TITULAR                                  //
//-_______________________________________________________________________-//
const createTitular = (db) => {
  return async (req, res) => {
    const { cpf, nome, endereco, email, telefone } = req.body;

    try {
      if (!cpf || !nome) {
        return res.status(400).json({ error: "CPF e nome são obrigatórios" });
      }

      const query = `
        INSERT INTO titular (cpf, nome, endereco, email, telefone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const values = [cpf, nome, endereco, email, telefone];

      const result = await db.query(query, values);

      return res.status(201).json({
        message: "Titular criado com sucesso",
        titular: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar titular:\n ${error.message} ` });
    }
  };
};

//-------------------------------------------------------------------------//
//                                CONTRATO                                 //
//-_______________________________________________________________________-//
const createContrato = (db) => {
  return async (req, res) => {
    const {cpf,id_tumulo,data_inicio,prazo_vigencia,valor,status} = req.body;

    try {
      if (!cpf || !id_tumulo) {
        return res.status(400).json({ error: "CPF e id_tumulo são obrigatórios" });
      }

      const query = `
        INSERT INTO contrato (cpf, id_tumulo, data_inicio, prazo_vigencia, valor, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const values = [cpf,id_tumulo,data_inicio,prazo_vigencia,valor,status];

      const result = await db.query(query, values);

      return res.status(201).json({
        message: "Contrato criado com sucesso",
        titular: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar contrato:\n ${error.message} ` });
    }
  };
};

//-------------------------------------------------------------------------//
//                               FORNECEDOR                                //
//-_______________________________________________________________________-//
const createFornecedor = (db) => {
  return async (req, res) => {
    const { cnpj, nome, endereco } = req.body;

    try {
      if (!cnpj) {
        return res.status(400).json({ error: "CNPJ é obrigatório" });
      }

      const query = `
        INSERT INTO fornecedor (cnpj, nome, endereco)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const values = [cnpj, nome, endereco];

      const result = await db.query(query, values);

      return res.status(201).json({
        message: "Fornecedor criado com sucesso",
        fornecedor: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar fornecedor:\n ${error.message} ` });
    }
  };
};

//-------------------------------------------------------------------------//
//                               TUMULO                                    //
//-_______________________________________________________________________-//
const createTumulo = (db) => {
  return async (req, res) => {
    const { status, tipo, capacidade, quadra, setor, numero } = req.body;

    try {
      // Início da transação
      await db.query("BEGIN");

      const insertTumuloQuery = `
        INSERT INTO tumulo (status, tipo, capacidade)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const tumuloResult = await db.query(insertTumuloQuery, [
        status, tipo, capacidade
      ]);

      const id_tumulo = tumuloResult.rows[0].id_tumulo;

      // Segundo: insere na tabela localizacao_tumulo
      const insertLocalizacaoQuery = `
        INSERT INTO localizacao_tumulo (id_tumulo, quadra, setor, numero)
        VALUES ($1, $2, $3, $4)
      `;

      await db.query(insertLocalizacaoQuery, [id_tumulo, quadra, setor, numero]);

      // Commit final
      await db.query("COMMIT");

      return res.status(201).json({
        message: "Túmulo criado com sucesso",
        id_tumulo
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar tumulo:\n ${error.message} ` });
    }
  };
};

//-------------------------------------------------------------------------//
//                               FUNCIONARIO                                //
//-_______________________________________________________________________-//
const createFuncionario = (db) => {
  return async (req, res) => {
    const { cpf, nome, funcao, modelo_contrato, horas_semanais, salario } = req.body;

    try {
      if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório" });
      }

      const query = `
        INSERT INTO funcionario (cpf, nome, funcao, modelo_contrato, horas_semanais, salario)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const values = [cpf, nome, funcao, modelo_contrato, horas_semanais, salario];

      const result = await db.query(query, values);

      return res.status(201).json({
        message: "Funcionario criado com sucesso",
        funcionario: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar funcionario:\n ${error.message} ` });
    }
  };
};

//-------------------------------------------------------------------------//
//                             EVENTO CREMAÇÃO                             //
//-_______________________________________________________________________-//
const createCremacao = (db) => {
  return async (req, res) => {
    const { forno, cpf, nome, lugar, dia, horario, valor } = req.body;

    try {
      if (!cpf || !nome) {
        return res.status(400).json({ error: "CPF e nome são obrigatórios" });
      }

      // Início da transação
      await db.query("BEGIN");

      // Primeiro: insere na tabela evento
      const insertEventoQuery = `
        INSERT INTO evento (cpf, nome, lugar, dia, horario, valor)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_evento;
      `;

      const eventoResult = await db.query(insertEventoQuery, [
        cpf, nome, lugar, dia, horario, valor
      ]);

      const id_evento = eventoResult.rows[0].id_evento;

      // Segundo: insere na tabela evento_cremacao
      const insertCremacaoQuery = `
        INSERT INTO evento_cremacao (id_evento, forno)
        VALUES ($1, $2)
      `;

      await db.query(insertCremacaoQuery, [id_evento, forno]);

      // Commit final
      await db.query("COMMIT");

      return res.status(201).json({
        message: "Evento de cremação criado com sucesso",
        id_evento,
        forno
      });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar cremação:\n ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                             EVENTO VELÓRIO                              //
//-_______________________________________________________________________-//
const createVelorio = (db) => {
  return async (req, res) => {
    const { sala, cpf, nome, lugar, dia, horario, valor } = req.body;

    try {
      if (!cpf || !nome) {
        return res.status(400).json({ error: "CPF e nome são obrigatórios" });
      }

      // Início da transação
      await db.query("BEGIN");

      // Primeiro: insere na tabela evento
      const insertEventoQuery = `
        INSERT INTO evento (cpf, nome, lugar, dia, horario, valor)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_evento;
      `;

      const eventoResult = await db.query(insertEventoQuery, [
        cpf, nome, lugar, dia, horario, valor
      ]);

      const id_evento = eventoResult.rows[0].id_evento;

      // Segundo: insere na tabela evento_velorio
      const insertCremacaoQuery = `
        INSERT INTO evento_velorio (id_evento, sala)
        VALUES ($1, $2)
      `;

      await db.query(insertCremacaoQuery, [id_evento, sala]);

      // Commit final
      await db.query("COMMIT");

      return res.status(201).json({
        message: "Evento de velório criado com sucesso",
        id_evento,
        sala
      });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar cremação:\n ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                           EVENTO SEPULTAMENTO                           //
//-_______________________________________________________________________-//
const createSepultamento = (db) => {
  return async (req, res) => {
    const { local_destino, cpf, nome, lugar, dia, horario, valor } = req.body;

    try {
      if (!cpf || !nome) {
        return res.status(400).json({ error: "CPF e nome são obrigatórios" });
      }

      // Início da transação
      await db.query("BEGIN");

      // Primeiro: insere na tabela evento
      const insertEventoQuery = `
        INSERT INTO evento (cpf, nome, lugar, dia, horario, valor)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_evento;
      `;

      const eventoResult = await db.query(insertEventoQuery, [
        cpf, nome, lugar, dia, horario, valor
      ]);

      const id_evento = eventoResult.rows[0].id_evento;

      // Segundo: insere na tabela evento_sepultamento
      const insertSepultamentoQuery = `
        INSERT INTO evento_sepultamento (id_evento, local_destino)
        VALUES ($1, $2)
      `;

      await db.query(insertSepultamentoQuery, [id_evento, local_destino]);

      // Commit final
      await db.query("COMMIT");

      return res.status(201).json({
        message: "Evento de sepultamento criado com sucesso",
        id_evento,
        local_destino
      });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar Sepultamento:\n ${error.message}` });
    }
  };
};


export default {
  createContrato,
  createCremacao,
  createSepultamento,
  createFornecedor,
  createFuncionario,
  createTitular,
  createTumulo,
  createVelorio
};