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
//                                FALECIDO                                 //
//-_______________________________________________________________________-//
const createFalecido = (db) => {
  return async (req, res) => {
    const { cpf, nome, data_falecimento, data_nascimento, motivo, id_tumulo } = req.body;

    try {
      if (!cpf || !nome || !id_tumulo) {
        return res.status(400).json({ error: "CPF, nome e ID do túmulo são obrigatórios" });
      }

      // Início da transação
      await db.query("BEGIN");

      // 1. Verifica se o túmulo existe e sua capacidade
      const tumuloQuery = 'SELECT capacidade, atual, status FROM tumulo WHERE id_tumulo = $1';
      const tumuloResult = await db.query(tumuloQuery, [id_tumulo]);
      
      if (tumuloResult.rows.length === 0) {
        await db.query("ROLLBACK");
        return res.status(404).json({ error: "Túmulo não encontrado" });
      }

      const tumulo = tumuloResult.rows[0];
      
      // 2. Verifica se há espaço no túmulo
      if (tumulo.atual >= tumulo.capacidade) {
        await db.query("ROLLBACK");
        return res.status(400).json({ 
          error: "Túmulo está cheio",
          detalhes: `Capacidade: ${tumulo.capacidade}, Ocupado: ${tumulo.atual}`,
          aviso: "❌ Não é possível adicionar mais falecidos a este túmulo."
        });
      }

      // 3. Insere o falecido
      const insertFalecidoQuery = `
        INSERT INTO falecido (cpf, nome, data_falecimento, data_nascimento, motivo, id_tumulo)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      const values = [cpf, nome, data_falecimento, data_nascimento, motivo, id_tumulo];
      const result = await db.query(insertFalecidoQuery, values);

      // 4. Função para atualizar status do túmulo automaticamente
      const atualizarStatusTumulo = async (id_tumulo_param) => {
        try {
          // Busca informações atuais do túmulo
          const tumuloQuery = `
            SELECT t.capacidade, t.atual, t.status, 
                   COUNT(f.cpf) as total_falecidos
            FROM tumulo t
            LEFT JOIN falecido f ON t.id_tumulo = f.id_tumulo
            WHERE t.id_tumulo = $1
            GROUP BY t.id_tumulo, t.capacidade, t.atual, t.status
          `;
          
          const tumuloResult = await db.query(tumuloQuery, [id_tumulo_param]);
          
          if (tumuloResult.rows.length === 0) return;
          
          const tumulo = tumuloResult.rows[0];
          const totalFalecidos = parseInt(tumulo.total_falecidos);
          const capacidade = parseInt(tumulo.capacidade);
          
          let novoStatus = tumulo.status;
          let aviso = null;
          
          // Lógica de atualização do status
          if (totalFalecidos >= capacidade) {
            novoStatus = 'Cheio';
            aviso = `🚨 TÚMULO CHEIO! Capacidade máxima (${capacidade}) atingida.`;
          } else if (totalFalecidos > 0) {
            novoStatus = 'Reservado';
            // Aviso se está perto de ficar cheio (80% da capacidade)
            if (totalFalecidos >= capacidade * 0.8) {
              aviso = `⚠️ Túmulo quase cheio: ${totalFalecidos}/${capacidade} (${Math.round((totalFalecidos/capacidade)*100)}%)`;
            }
          } else {
            novoStatus = 'Livre';
          }
          
          // Atualiza o status se necessário
          if (novoStatus !== tumulo.status || totalFalecidos !== tumulo.atual) {
            const updateTumuloQuery = `
              UPDATE tumulo 
              SET status = $1, atual = $2
              WHERE id_tumulo = $3
            `;
            
            await db.query(updateTumuloQuery, [novoStatus, totalFalecidos, id_tumulo_param]);
            console.log(`✅ Túmulo ${id_tumulo_param} atualizado: ${tumulo.status} → ${novoStatus}, ${tumulo.atual} → ${totalFalecidos}`);
          }
          
          return { 
            id_tumulo: id_tumulo_param, 
            status_anterior: tumulo.status, 
            novo_status: novoStatus,
            total_falecidos: totalFalecidos,
            capacidade,
            aviso
          };
          
        } catch (error) {
          console.error('❌ Erro ao atualizar status do túmulo:', error);
          throw error;
        }
      };

      // 5. Atualiza o status do túmulo automaticamente
      const statusUpdate = await atualizarStatusTumulo(id_tumulo);

      // Commit final
      await db.query("COMMIT");

      // Prepara a resposta
      const resposta = {
        message: "Falecido criado com sucesso",
        falecido: result.rows[0],
        tumulo_status: statusUpdate
      };

      // Adiciona aviso se o túmulo ficou cheio
      if (statusUpdate.aviso) {
        resposta.aviso_importante = statusUpdate.aviso;
      }

      return res.status(201).json(resposta);

    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Erro ao criar falecido:", error);
      return res.status(500).json({ error: `Erro ao criar falecido: ${error.message}` });
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
    const { cnpj, nome, endereco, telefone} = req.body;

    try {
      if (!cnpj || !telefone) {
        return res.status(400).json({ error: "CNPJ e Telefone é obrigatório" });
      }

      // Início da transação
      await db.query("BEGIN");

      const query = `
        INSERT INTO fornecedor (cnpj, nome, endereco)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      
      const result = await db.query(query, [
        cnpj, nome, endereco
      ]);
      
      const queryTelefone = `
      INSERT INTO telefone_fornecedor (cnpj, telefone)
      VALUES ($1, $2)
      RETURNING *;
      `;
      
      await db.query(queryTelefone, [cnpj, telefone]);

      await db.query("COMMIT");

      return res.status(201).json({
        message: "Fornecedor criado com sucesso",
        fornecedor: result.rows[0]
      });

    } catch (error) {
      await db.query("ROLLBACK");
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
//                             EVENTO COMPRA                               //
//-_______________________________________________________________________-//
const createCompra = (db) => {
  return async (req, res) => {
    const { cnpj, id_evento, valor, item, quantidade, data_compra, horario} = req.body;

    try {
      if (!cnpj || !id_evento || !valor) {
        return res.status(400).json({ error: "CNPJ, id_evento e valor são obrigatórios" });
      }

      // Primeiro: insere na tabela evento
      const insertEventoQuery = `
        INSERT INTO compra (cnpj, id_evento, valor, item, quantidade, data_compra, horario)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const result = await db.query(insertEventoQuery, [
        cnpj, id_evento, valor, item, quantidade, data_compra, horario
      ]);


      return res.status(201).json({
        message: "Compra inserida com sucesso",
        id_evento
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: `Erro ao criar compra:\n ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                             EVENTO CREMAÇÃO                             //
//-_______________________________________________________________________-//
const createCremacao = (db) => {
  return async (req, res) => {
    const { forno, cpf, nome, lugar, dia, horario, valor, cpf_funcionario } = req.body;

    try {
      if (!cpf || !nome || !cpf_funcionario) {
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

      const insertFuncEvenQuery = `
        INSERT INTO funcionario_evento (cpf, id_evento)
        VALUES ($1, $2)
      `;
      await db.query(insertFuncEvenQuery, [cpf_funcionario, id_evento]);

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
    const { sala, cpf, nome, lugar, dia, horario, valor, cpf_funcionario } = req.body;

    try {
      if (!cpf || !nome || !cpf_funcionario) {
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

      const insertFuncEvenQuery = `
        INSERT INTO funcionario_evento (cpf, id_evento)
        VALUES ($1, $2)
      `;
      await db.query(insertFuncEvenQuery, [cpf_funcionario, id_evento]);


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
    const { local_destino, cpf, nome, lugar, dia, horario, valor, cpf_funcionario } = req.body;

    try {
      if (!cpf || !nome || !cpf_funcionario) {
        return res.status(400).json({ error: "CPF, nome e cpf_funcionario são obrigatórios" });
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

      const insertFuncEvenQuery = `
        INSERT INTO funcionario_evento (cpf, id_evento)
        VALUES ($1, $2)
      `;
      await db.query(insertFuncEvenQuery, [cpf_funcionario, id_evento]);

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

const createFuncionarioEvento = (db) => {
  return async (req, res) => {
    const { cpf, id_evento } = req.body;

    try {
      if (!cpf || !id_evento) {
        return res.status(400).json({ error: "CPF do funcionário e ID do evento são obrigatórios" });
      }

      // Verificar se o funcionário existe
      const funcionarioCheck = await db.query(
        'SELECT * FROM funcionario WHERE cpf = $1',
        [cpf]
      );

      if (funcionarioCheck.rows.length === 0) {
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      // Verificar se o evento existe
      const eventoCheck = await db.query(
        'SELECT * FROM evento WHERE id_evento = $1',
        [id_evento]
      );

      if (eventoCheck.rows.length === 0) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      // Verificar se a associação já existe
      const existingCheck = await db.query(
        'SELECT * FROM funcionario_evento WHERE cpf = $1 AND id_evento = $2',
        [cpf, id_evento]
      );

      if (existingCheck.rows.length > 0) {
        return res.status(409).json({ error: "Funcionário já está alocado neste evento" });
      }

      const query = `
        INSERT INTO funcionario_evento (cpf, id_evento)
        VALUES ($1, $2)
        RETURNING *;
      `;

      const values = [cpf, id_evento];

      const result = await db.query(query, values);

      return res.status(201).json({
        message: "Funcionário alocado ao evento com sucesso",
        alocacao: result.rows[0]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        error: `Erro ao alocar funcionário ao evento:\n ${error.message}` 
      });
    }
  };
};

export default {
  createContrato,
  createCompra,
  createCremacao,
  createFalecido,
  createFornecedor,
  createFuncionario,
  createSepultamento,
  createTitular,
  createTumulo,
  createVelorio,
  createFuncionarioEvento
};