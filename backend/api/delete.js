import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// DELETE /titular/:cpf - Deletar titular por CPF
const deleteTitularByCpf = async (req, res) => {
  const { cpf } = req.params;

  try {
    const titular = await prisma.titular.delete({
      where: { cpf }
    });

    res.json({ message: "Titular deletado com sucesso", titular });
  } catch (error) {
    console.error("Erro ao deletar titular:", error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Titular não encontrado" });
    }
    
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};


export default {
  deleteTitularByCpf
};