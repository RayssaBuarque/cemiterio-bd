//-------------------------------------------------------------------------//
//                                TITULAR                                  //
//-_______________________________________________________________________-//
const updateTitular = (db) => {
  return async (req, res) => {
    const { cpf } = req.params;
    const { nome, endereco, email, telefone } = req.body;

    try {
      if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório" });
      }

      // Verifica se o titular existe
      const checkQuery = 'SELECT * FROM titular WHERE cpf = $1';
      const checkResult = await db.query(checkQuery, [cpf]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: "Titular não encontrado" });
      }

      const query = `
        UPDATE titular 
        SET nome = COALESCE($1, nome),
            endereco = COALESCE($2, endereco),
            email = COALESCE($3, email),
            telefone = COALESCE($4, telefone)
        WHERE cpf = $5
        RETURNING *;
      `;

      const values = [nome, endereco, email, telefone, cpf];

      const result = await db.query(query, values);

      return res.status(200).json({
        message: "Titular atualizado com sucesso",
        titular: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao atualizar titular: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                                TÚMULO                                   //
//-_______________________________________________________________________-//
const updateTumulo = (db) => {
  return async (req, res) => {
    const { id_tumulo } = req.params;
    const { status, tipo, capacidade, quadra, setor, atual, numero } = req.body;

    try {
      if (!id_tumulo) {
        return res.status(400).json({ error: "ID do túmulo é obrigatório" });
      }

      // Verifica se o túmulo existe
      const checkQuery = 'SELECT * FROM tumulo WHERE id_tumulo = $1';
      const checkResult = await db.query(checkQuery, [id_tumulo]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: "Túmulo não encontrado" });
      }

      // Início da transação
      await db.query("BEGIN");

      // CORREÇÃO: Adicionada vírgula faltando e corrigidos os parâmetros
      const updateTumuloQuery = `
        UPDATE tumulo 
        SET status = COALESCE($1, status),
            tipo = COALESCE($2, tipo),
            capacidade = COALESCE($3, capacidade),
            atual = COALESCE($4, atual)
        WHERE id_tumulo = $5
        RETURNING *;
      `;

      const tumuloResult = await db.query(updateTumuloQuery, [
        status, tipo, capacidade, atual, id_tumulo  // CORRIGIDO: 5 parâmetros
      ]);

      // Atualiza a tabela localizacao_tumulo se os campos foram fornecidos
      if (quadra !== undefined || setor !== undefined || numero !== undefined) {
        const updateLocalizacaoQuery = `
          UPDATE localizacao_tumulo 
          SET quadra = COALESCE($1, quadra),
              setor = COALESCE($2, setor),
              numero = COALESCE($3, numero)
          WHERE id_tumulo = $4
        `;

        await db.query(updateLocalizacaoQuery, [quadra, setor, numero, id_tumulo]);
      }

      // Commit final
      await db.query("COMMIT");

      return res.status(200).json({
        message: "Túmulo atualizado com sucesso",
        tumulo: tumuloResult.rows[0]
      });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Erro detalhado ao atualizar túmulo:", error);
      return res.status(500).json({ 
        error: `Erro ao atualizar túmulo: ${error.message}`,
        details: error.detail || 'Sem detalhes adicionais'
      });
    }
  };
};

//-------------------------------------------------------------------------//
//                                FALECIDO                                 //
//-_______________________________________________________________________-//
const updateFalecido = (db) => {
  return async (req, res) => {
    const { cpf } = req.params;
    const { nome, data_falecimento, data_nascimento, motivo, id_tumulo } = req.body;

    try {
      if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório" });
      }

      // Verifica se o falecido existe
      const checkQuery = 'SELECT * FROM falecido WHERE cpf = $1';
      const checkResult = await db.query(checkQuery, [cpf]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: "Falecido não encontrado" });
      }

      const query = `
        UPDATE falecido 
        SET nome = COALESCE($1, nome),
            data_falecimento = COALESCE($2, data_falecimento),
            data_nascimento = COALESCE($3, data_nascimento),
            motivo = COALESCE($4, motivo),
            id_tumulo = COALESCE($5, id_tumulo)
        WHERE cpf = $6
        RETURNING *;
      `;

      const values = [nome, data_falecimento, data_nascimento, motivo, id_tumulo, cpf];

      const result = await db.query(query, values);

      return res.status(200).json({
        message: "Falecido atualizado com sucesso",
        falecido: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao atualizar falecido: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                                CONTRATO                                 //
//-_______________________________________________________________________-//
const updateContrato = (db) => {
  return async (req, res) => {
    const { id_contrato } = req.params;
    const { data_inicio, prazo_vigencia, valor, status } = req.body;

    try {
      if (!id_contrato) {
        return res.status(400).json({ error: "ID do contrato é obrigatório" });
      }

      // Verifica se o contrato existe
      const checkQuery = 'SELECT * FROM contrato WHERE id_contrato = $1';
      const checkResult = await db.query(checkQuery, [id_contrato]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: "Contrato não encontrado" });
      }

      const query = `
        UPDATE contrato 
        SET data_inicio = COALESCE($1, data_inicio),
            prazo_vigencia = COALESCE($2, prazo_vigencia),
            valor = COALESCE($3, valor),
            status = COALESCE($4, status)
        WHERE id_contrato = $5
        RETURNING *;
      `;

      const values = [data_inicio, prazo_vigencia, valor, status, id_contrato];

      const result = await db.query(query, values);

      return res.status(200).json({
        message: "Contrato atualizado com sucesso",
        contrato: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao atualizar contrato: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                               FORNECEDOR                                //
//-_______________________________________________________________________-//
const updateFornecedor = (db) => {
  return async (req, res) => {
    const { cnpj } = req.params;
    const { nome, endereco, telefone } = req.body;

    try {
      if (!cnpj) {
        return res.status(400).json({ error: "CNPJ é obrigatório" });
      }

      // Verifica se o fornecedor existe
      const checkQuery = 'SELECT * FROM fornecedor WHERE cnpj = $1';
      const checkResult = await db.query(checkQuery, [cnpj]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: "Fornecedor não encontrado" });
      }

      // Início da transação
      await db.query("BEGIN");

      // Atualiza a tabela fornecedor
      const updateFornecedorQuery = `
        UPDATE fornecedor 
        SET nome = COALESCE($1, nome),
            endereco = COALESCE($2, endereco)
        WHERE cnpj = $3
        RETURNING *;
      `;

      const result = await db.query(updateFornecedorQuery, [nome, endereco, cnpj]);

      // Atualiza o telefone se fornecido
      if (telefone !== undefined) {
        const updateTelefoneQuery = `
          UPDATE telefone_fornecedor 
          SET telefone = $1
          WHERE cnpj = $2
        `;
        await db.query(updateTelefoneQuery, [telefone, cnpj]);
      }

      // Commit final
      await db.query("COMMIT");

      return res.status(200).json({
        message: "Fornecedor atualizado com sucesso",
        fornecedor: result.rows[0]
      });

    } catch (error) {
      await db.query("ROLLBACK");
      console.error(error);
      return res.status(500).json({ error: `Erro ao atualizar fornecedor: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                               FUNCIONARIO                               //
//-_______________________________________________________________________-//
const updateFuncionario = (db) => {
  return async (req, res) => {
    const { cpf } = req.params;
    const { nome, funcao, modelo_contrato, horas_semanais, salario } = req.body;

    try {
      if (!cpf) {
        return res.status(400).json({ error: "CPF é obrigatório" });
      }

      // Verifica se o funcionário existe
      const checkQuery = 'SELECT * FROM funcionario WHERE cpf = $1';
      const checkResult = await db.query(checkQuery, [cpf]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      const query = `
        UPDATE funcionario 
        SET nome = COALESCE($1, nome),
            funcao = COALESCE($2, funcao),
            modelo_contrato = COALESCE($3, modelo_contrato),
            horas_semanais = COALESCE($4, horas_semanais),
            salario = COALESCE($5, salario)
        WHERE cpf = $6
        RETURNING *;
      `;

      const values = [nome, funcao, modelo_contrato, horas_semanais, salario, cpf];

      const result = await db.query(query, values);

      return res.status(200).json({
        message: "Funcionário atualizado com sucesso",
        funcionario: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao atualizar funcionário: ${error.message}` });
    }
  };
};

export default {
  updateTitular,
  updateTumulo,
  updateFalecido,
  updateContrato,
  updateFornecedor,
  updateFuncionario
};