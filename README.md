# Cemitério 💀
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)    ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)   ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Este repositório guarda códigos e documentações sobre o Sistema de Banco de Dados desenvolvido como projeto da disciplina ACH2004 (Banco de Dados I).

O sistema tem como objetivo gerenciar as informações do Cemitério **fictício** Lira Silenciosa, facilitando o controle dos falecidos, contratos, titulares, funcionários, túmulos e
sepultamentos.


## ✍️ Como executar o backend
@Naju e @Rayssa - checar o arquivo [TO_TO](C:\Users\rayss\Workspace\cemiterio-bd\backend\TO_DO.md) para conferir endpoints necessários
versão ideal do prisma e prisma-client: 5.0.0

### 1. **Crie o banco de dados no PostgreSQL**
- Use PgAdmin com os arquivos SQL deste repositório

### 2.0 **Vá para a pasta do backend no terminal:**
```bash
cd .\backend\
```

### 2. **Instale as dependências**
```bash
npm install
```

### 3. **Gere o Prisma Client**
```bash
npx prisma generate
```

### 4. **Execute o servidor**
```bash
npm run dev
```

### 5. **Teste a API**
Abra no navegador:
```
http://localhost:<PORTA>/titular/12345678900
```

### ⚡ **Extra: Prisma Studio** (opcional)
```bash
npx prisma studio
```


## 📂 Estrutura do Repositório

* `docs/`: Contém diagramas (DER, Modelo Relacional), relatórios de entrega e documentações.
* `frontend/`: 
* `backend/`: 
* `sql/`: Scripts de criação (`DDL`), populamento (`DML`) e consultas.
    * `sql/01_ddl_create_tables.sql`: Script principal para criação das tabelas e chaves.
    * `sql/02_dml_insert_data.sql`: Script com dados de exemplo.
* `README.md`: Este arquivo.

## 📚 Bibliotecas, Frameworks e Ferramentas

<!-- Github Badges : https://github.com/Ileriayo/markdown-badges -->

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)    ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)    ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)   ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)    ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

---

A seguir, a lista dos membros da equipe que contribuíram ativamente para a modelagem, implementação e documentação deste projeto.

| Nome | GitHub | Função Principal | Linkedin |
| :--- | :---: | :---: | :--- |
| **Ana Julia Silva** | [@najusilva](https://github.com/najusilva) | back-end | ![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white) |
| **Eduardo Araujo** | [@F1NH4WK](https://github.com/F1NH4WK) | front-end | ![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white) |
| **Rayssa Buarque** 🦉 | [@RayssaBuarque](https://github.com/RayssaBuarque) | back-end | ![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white) |
| **Rebecka Bocci** | [@NightHuntress141](https://github.com/NightHuntress141) | front-end | ![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white) |
| **Yuri Van Steen** | [@Yurivansteen](https://github.com/Yurivansteen) | back-end | ![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white) |

