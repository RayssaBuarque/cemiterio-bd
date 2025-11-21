import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


/**
 * GET /titular/:cpf
 * retorna todos os campos do registro da tabela Titular cujo CPF = :cpf
 */
const getTitularByCpf = async (req, res) => {
  const { cpf } = req.params; // coletando o parâmetro :cpf da url
  
  try {
    const titular = await prisma.titular.findUnique({
      where: { cpf },
    });

    // Caso ele não encontre nada, retorna 404:
    if (!titular) {
      return res.status(404).json({ error: "Titular não encontrado" });
    }

    res.json(titular);

  // Erros
  } catch (error) {
    console.error("Erro ao buscar titular:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * GET /titulares
 * retorna todos os registros da tabela Titular
 */
const getAllTitulares = async (req, res) => {
  try {
    const titulares = await prisma.titular.findMany();

    res.json(titulares);

  // Erros
  } catch (error) {
    console.error("Erro ao buscar titulares:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export default  {
  getTitularByCpf,
  getAllTitulares
};