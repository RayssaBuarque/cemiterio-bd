# Cemitério 💀
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)    ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)   ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)   ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Este repositório guarda códigos e documentações sobre o Sistema de Banco de Dados desenvolvido como projeto da disciplina ACH2004 (Banco de Dados I).

O sistema tem como objetivo gerenciar as informações do Cemitério **fictício** Lira Silenciosa, facilitando o controle dos falecidos, contratos, titulares, funcionários, túmulos e
sepultamentos.


## ✍️ Como executar:

#### 1. **Crie o banco de dados no PostgreSQL**
- Crie um servidor no PgAdmin e copie em ordem o SQL dos arquivos na pasta /sql 
- [Vídeo explicativo sobre como montar o BD](https://www.youtube.com/watch?v=9bLcnLmpuGY)

#### 2. **Instale as dependências**
```bash
npm install
```
<!-- npm install express pg -->

#### 4. **Execute o servidor back-end**
```bash
cd .\backend\
node index.js
```

#### 5. **Execute o servidor front-end**
```bash
cd .\frontend\
npm run dev
```

<!-- #### 5. **Teste a API**
Abra no navegador:
```
http://localhost:<PORTA>/titular
 ``` -->

## 📂 Estrutura do Repositório

* `docs/`: Contém diagramas (DER, Modelo Relacional), relatórios de entrega e documentações.
* `frontend/`: 
* `backend/`: 
    * `api/`: Scripts de criação, inserção e remoção de registros do Banco de Dados.
        * `api/create.js`: Comandos de POST.
        * `api/delete.js`: Comandos de DELETE.
        * `api/read.js`: Comandos de GET.
    * `.env`: Arquivo auxiliar que armazena o endereço da base de dados no postgre localmente - Devido à natureza educativa do trabalho, optou-se por deixar o arquivo com visualização pública neste repositório.
    * `index.js`: Script fundamental de construção do servidor back-end.
* `sql/`: Scripts de criação (`DDL`), populamento (`DML`) e consultas.
    * `sql/01_ddl_create_tables.sql`: Script principal para criação das tabelas e chaves.
    * `sql/02_dml_insert_data.sql`: Script com dados de exemplo.
* `README.md`: Este arquivo.

## 📚 Bibliotecas, Frameworks e Ferramentas

<!-- Github Badges : https://github.com/Ileriayo/markdown-badges -->

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)    ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)    ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)    ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

---

# Vídeo
Video ensinando a como executar estas instruções...
https://youtu.be/9bLcnLmpuGY

A seguir, a lista dos membros da equipe que contribuíram ativamente para a modelagem, implementação e documentação deste projeto.

| Nome | GitHub | Função Principal |
| :--- | :---: | :---: |
| **Ana Julia Silva** 💋 | [@najusilva](https://github.com/najusilva) | back-end |
| **Eduardo Araujo** 👽 | [@F1NH4WK](https://github.com/F1NH4WK) | front-end |
| **Rayssa Buarque** 🦉 | [@RayssaBuarque](https://github.com/RayssaBuarque) | back-end |
| **Rebecka Bocci** | [@NightHuntress141](https://github.com/NightHuntress141) | front-end |
| **Yuri Van Steen** 🤓 | [@Yurivansteen](https://github.com/Yurivansteen) | CEO |

