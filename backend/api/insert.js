import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST /titular - Criar novo titular
const createTitular = async (req, res) => {
  const { cpf, nome, data_nascimento, endereco, telefone } = req.body;

  try {

    // Informações do banco de dados
    const novoTitular = await prisma.titular.create({
      data: {
        cpf,
        email,
        endereco,
        nome,
        telefone
      }
    });

    res.status(201).json(novoTitular);
  } catch (error) {
    console.error("Erro ao criar titular:", error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "CPF já existe" });
    }
    
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export default {
  createTitular
};