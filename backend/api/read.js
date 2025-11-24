
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
      return res.status(500).json({ error: "Erro ao consultar usuários" });
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
      return res.status(500).json({ error: "Erro ao consultar túmulos" });
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
        return res.status(404).json({ error: "Túmulo não encontrado" });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar túmulo" });
    }
  };
}

export default {

  getTitulares,
  
  getTumulos,
  getTumuloPorId
};
