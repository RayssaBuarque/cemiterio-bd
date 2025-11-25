//-------------------------------------------------------------------------//
//                               CONTRATO                                  //
//-_______________________________________________________________________-//
const deleteContrato = (db) => {
  return async (req, res) => {
    const { cpf, data_inicio } = req.body;

    try {
      if (!cpf || !data_inicio) {
        return res.status(400).json({ error: "cpf e data_inicio são obrigatórios" });
      }

      // 2. Deletar o contrato
      const deleteContratoQuery = `
        DELETE FROM contrato
        WHERE cpf = $1
        AND data_inicio = $2
        RETURNING *;
      `;

      const eventoResult = await db.query(deleteContratoQuery, [cpf, data_inicio]);

      if (eventoResult.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: "Contrato não encontrado" });
      }

      await db.query('COMMIT');

      return res.status(200).json({
        message: "Contrato deletado com sucesso",
        cpf,
        data_inicio
      });

    } catch (error) {
      await db.query('ROLLBACK');
      console.error(error);
      return res.status(500).json({ error: `Erro ao deletar contrato: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                               FALECIDO                                  //
//-_______________________________________________________________________-//
//-------------------------------------------------------------------------//
//                               FALECIDO                                  //
//-_______________________________________________________________________-//
const deleteFalecido = (db) => {
  return async (req, res) => {
    const { cpf, nome } = req.body;

    try {
      if (!cpf || !nome) {
        return res.status(400).json({ error: "cpf e nome são obrigatórios" });
      }

      // Iniciar transação
      await db.query('BEGIN');

      // 1. Primeiro, obter os IDs dos eventos relacionados a este falecido
      const getEventosQuery = `
        SELECT id_evento FROM evento 
        WHERE cpf = $1 AND nome = $2
      `;
      const eventosResult = await db.query(getEventosQuery, [cpf, nome]);
      const eventosIds = eventosResult.rows.map(row => row.id_evento);

      // 2. Se existirem eventos, deletar das tabelas específicas primeiro
      if (eventosIds.length > 0) {
        // Deletar das tabelas específicas de eventos
        const eventosEspecificosTables = [
          'evento_velorio',
          'evento_sepultamento', 
          'evento_cremacao'
        ];

        for (const table of eventosEspecificosTables) {
          await db.query(`DELETE FROM ${table} WHERE id_evento = ANY($1)`, [eventosIds]);
        }

        // 3. Deletar das tabelas relacionadas aos eventos
        const eventosRelatedTables = [
          'compra',
          'funcionario_evento'
        ];

        for (const table of eventosRelatedTables) {
          await db.query(`DELETE FROM ${table} WHERE id_evento = ANY($1)`, [eventosIds]);
        }

        // 4. Deletar os eventos principais
        await db.query('DELETE FROM evento WHERE id_evento = ANY($1)', [eventosIds]);
      }

      // 5. Finalmente deletar o falecido
      const deleteFalecidoQuery = `
        DELETE FROM falecido
        WHERE cpf = $1
        AND nome = $2
        RETURNING *;
      `;

      const resultado = await db.query(deleteFalecidoQuery, [cpf, nome]);

      if (resultado.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: "Falecido não encontrado" });
      }

      await db.query('COMMIT');

      return res.status(200).json({
        message: "Falecido e todos os eventos relacionados deletados com sucesso",
        cpf,
        nome,
        eventosDeletados: eventosIds.length
      });

    } catch (error) {
      await db.query('ROLLBACK');
      console.error(error);
      return res.status(500).json({ error: `Erro ao deletar falecido: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                               TITULAR                                   //
//-_______________________________________________________________________-//
const deleteTitular = (db) => {
  return async (req, res) => {
    const { cpf } = req.params;

    try {
      if (!cpf) {
        return res.status(400).json({ error: "cpf é obrigatório" });
      }

      // Iniciar transação
      await db.query('BEGIN');

      // 1. Deletar registros das tabelas relacionadas primeiro
      const tablesToDelete = [
        'falecido',
        'contrato'
      ];

      for (const table of tablesToDelete) {
        await db.query(`DELETE FROM ${table} WHERE cpf = $1`, [cpf]);
      }

      // 2. Deletar o titular
      const deleteTitularQuery = `
        DELETE FROM titular
        WHERE cpf = $1
        RETURNING *;
      `;

      const eventoResult = await db.query(deleteTitularQuery, [cpf]);

      if (eventoResult.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: "Titular não encontrado" });
      }

      await db.query('COMMIT');

      return res.status(200).json({
        message: "Titular deletado com sucesso",
        cpf
      });

    } catch (error) {
      await db.query('ROLLBACK');
      console.error(error);
      return res.status(500).json({ error: `Erro ao deletar contrato: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                                 EVENTO                                  //
//-_______________________________________________________________________-//
const deleteEvento = (db) => {
  return async (req, res) => {
    const { id_evento } = req.params;

    try {
      if (!id_evento) {
        return res.status(400).json({ error: "id_evento é obrigatório" });
      }

      // Iniciar transação
      await db.query('BEGIN');

      // 1. Deletar registros das tabelas relacionadas primeiro
      const tablesToDelete = [
        'compra',
        'evento_cremacao', 
        'evento_velorio',
        'evento_sepultamento',
        'funcionario_evento'
      ];

      for (const table of tablesToDelete) {
        await db.query(`DELETE FROM ${table} WHERE id_evento = $1`, [id_evento]);
      }

      // 2. Deletar o evento
      const deleteEventoQuery = `
        DELETE FROM evento
        WHERE id_evento = $1
        RETURNING *;
      `;

      const eventoResult = await db.query(deleteEventoQuery, [id_evento]);

      if (eventoResult.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      await db.query('COMMIT');

      return res.status(200).json({
        message: "Evento deletado com sucesso",
        id_evento
      });

    } catch (error) {
      await db.query('ROLLBACK');
      console.error(error);
      return res.status(500).json({ error: `Erro ao deletar evento: ${error.message}` });
    }
  };
};

//-------------------------------------------------------------------------//
//                              FUNCIONARIO                                //
//-_______________________________________________________________________-//
const deleteFuncionario = (db) => {
  return async (req, res) => {
    const { cpf } = req.params;

    try {
      if (!cpf) {
        return res.status(400).json({ error: "cpf é obrigatório" });
      }

      // Iniciar transação
      await db.query('BEGIN');

      // 1. Deletar registros das tabelas relacionadas primeiro
      const tablesToDelete = [
        'funcionario_evento'
      ];

      for (const table of tablesToDelete) {
        await db.query(`DELETE FROM ${table} WHERE cpf = $1`, [cpf]);
      }

      // 2. Deletar o funcionário
      const deleteFuncionarioQuery = `
        DELETE FROM funcionario
        WHERE cpf = $1
        RETURNING *;
      `;

      const eventoResult = await db.query(deleteFuncionarioQuery, [cpf]);

      if (eventoResult.rows.length === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ error: "Funcionário não encontrado" });
      }

      await db.query('COMMIT');

      return res.status(200).json({
        message: "Funcionário deletado com sucesso",
        cpf
      });

    } catch (error) {
      await db.query('ROLLBACK');
      console.error(error);
      return res.status(500).json({ error: `Erro ao deletar funcionário: ${error.message}` });
    }
  };
};

export default {
  deleteContrato,
  deleteEvento,
  deleteFalecido,
  deleteFuncionario,
  deleteTitular
};