# 📖 Como Criar Endpoints de Leitura

## 🎯 Estrutura do Projeto
```
backend/
├── api/                 ← Nessa pastinha estão todos os nossos endpoints!
│   ├── read.js          ← Vamos trabalhar aqui!
│   ├── insert.js
│   └── delete.js
├── index.js             ← Este é o arq que configura nosso servidor backend
└── package.json
```

## 🚀 Passo a Passo para Criar um Endpoint de Leitura


### **1. Adicione uma nova função de leitura em `api/read.js`:**
```javascript
// EXEMPLO de função:
async function get<Tabela>By<Chave>(req, res) {
  const { id } = req.params;
  
  try {

    // ESSE TRECHO É EQUIVALENTE A UM SELECT
    const usuario = await prisma.usuario.findUnique({
        where: { id: parseInt(id) }, 
    });

    // ESSE TRECHO NOS AJUDA A DEBUGAR
    if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // ESSE TRECHO RETORNA NOSSA RESPOSTA COMO UM OBJETO JAVASCRIPT
    res.json(usuario);
  
  } catch (error) { 
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

// EXEMPLO: Listar todos os registros com filtro
async function get<Tabela>(req, res) {
  try {
    const { ativo } = req.query;  // Filtro opcional via query params
    
    const usuarios = await prisma.usuario.findMany({
      where: {
        ...(ativo && { ativo: ativo === 'true' })  // Filtro condicional
      }
    });

    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
```

### **3. Exporte a nova função no final de `api/read.js`:**
```javascript
export default {
  getTitularByCpf,
  getAllTitulares,
  get<Tabela>By<Chave>,        // ← Adicione aqui
  get<Tabela>                  // ← E aqui
};
```

### **4. Registre as novas rotas no `index.js`:**
```javascript
// Rotas de LEITURA
app.get("/titular/:cpf", readRoutes.getTitularByCpf);
app.get("/titulares", readRoutes.getAllTitulares);
app.get("/usuario/:id", readRoutes.get<Tabela>By<Chave>);     // ← Nova rota
app.get("/usuarios", readRoutes.get<Tabela>);          // ← Nova rota
```

## 📋 Lista de Endpoints de Leitura que precisamos:

### **👤 Titulares**
- [x] `GET /titular/:cpf` - Busca titular por CPF
- [x] `GET /titulares` - Lista todos os titulares

### **📜 Contratos**
- [ ] Busca contratos por um CPF  
- [ ] Busca contratos por um id_tumulo  
- [ ] Busca todos os contratos 

### **⚰️ Falecidos**
- [ ] `GET /falecidos` - Busca todos os Falecidos
- [ ] `GET /falecido/:cpf` - Busca Falecido por CPF

### **⚰️ Tumulos**
- [ ] `GET /tumulos` - Busca todos os Tumulos
- [ ] `GET /tumulo/:id_tumulo` - Busca Tumulo por id_tumulo
- [ ] Busca Tumulo com base em filtro de tipo (ocupado, reservado, livre) - DICA: pesquisar sobre parametro ? de request

### (Demais operações similares para demais tabelas)
Seguir de referência essa lista que o EDU Gerou no GPT: (Focar apenas nos endpoints de GET REQUEST)
https://chatgpt.com/share/6915e054-76b8-800a-8601-842dfd26ec33

## 🧪 Como Testar os Endpoints

### **No Navegador:**
```
http://localhost:3000/titulares
http://localhost:3000/titular/12345678900
```


### **No Postman (software pra testes de requisição de API):**
- Método: `GET`
- URL: `http://localhost:3000/titulares`
- Headers: `Content-Type: application/json`


---

# **Teste sempre** seu endpoint