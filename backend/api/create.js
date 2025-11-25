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
    const { status, tipo, capacidade } = req.body;

    try {
      const query = `
        INSERT INTO tumulo (status, tipo, capacidade)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      const values = [status, tipo, capacidade];

      const result = await db.query(query, values);

      return res.status(201).json({
        message: "Tumulo criado com sucesso",
        tumulo: result.rows[0]
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

export default {
  createFornecedor,
  createFuncionario,
  createTitular,
  createTumulo
};