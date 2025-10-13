-- Database: cemiterio

-- DROP DATABASE IF EXISTS cemiterio;

-- CREATE DATABASE cemiterio
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'Portuguese_Brazil.1252'
--     LC_CTYPE = 'Portuguese_Brazil.1252'
--     LOCALE_PROVIDER = 'libc'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;
	
	
-- CRIANDO TABELAS DO NOSSO MODELO MER:
CREATE TABLE IF NOT EXISTS tb_titular(
	CPF				VARCHAR(11) PRIMARY KEY,
	nome 			VARCHAR(250) NOT NULL,
	email 			VARCHAR(250) UNIQUE NOT NULL,
	telefone 		INT UNIQUE,
	endereco 		VARCHAR(250)
);

CREATE TABLE IF NOT EXISTS tb_fornecedor(
	id_fornecedor 	INT PRIMARY KEY,
	nome 			VARCHAR(250) NOT NULL,
	endereco 		VARCHAR(250) NOT NULL,
	telefone 		INT UNIQUE
);

CREATE TABLE IF NOT EXISTS tb_tumulo(
	id_tumulo 		INT PRIMARY KEY,
	quadra 			INT NOT NULL,
	setor 			INT NOT NULL,
	numeracao	 	INT NOT NULL,
	status 			CHAR NOT NULL,
	tipo 			CHAR NOT NULL,
	capacidade	 	INT NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_contrato_concessao(
	CPF_titular 	VARCHAR(11),
	id_tumulo 		INT,
	status 			CHAR NOT NULL,
	valor 			DECIMAL NOT NULL,
	prazo_vigencia 	DATE NOT NULL,
	data_inicio 	DATE NOT NULL,
	PRIMARY KEY(CPF_titular, id_tumulo),
	CONSTRAINT fk_cpf_titular FOREIGN KEY (CPF_titular) REFERENCES tb_titular(CPF),
	CONSTRAINT fk_id_tumulo FOREIGN KEY (id_tumulo) REFERENCES tb_tumulo(id_tumulo)
);

