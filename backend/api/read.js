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

const getTumuloPorId = (db) => {
  return async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.query(
        "SELECT * FROM tumulo WHERE id_tumulo = $1",
        [id]
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
  
  getTumuloPorId
};