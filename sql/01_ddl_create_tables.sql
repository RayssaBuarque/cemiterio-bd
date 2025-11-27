-- DROP TABLE IF EXISTS evento_velorio, evento_cremacao, evento_sepultamento, 
--                      funcionario_evento, compra, falecido, contrato, 
--                      localizacao_tumulo, telefone_fornecedor, tumulo, 
--                      evento, funcionario, fornecedor, titular CASCADE;


-- ============================================
-- TABELAS 
-- ============================================
SET search_path TO public;

CREATE TABLE titular (
    CPF CHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(15) UNIQUE
);

CREATE TABLE tumulo (
    id_tumulo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    status VARCHAR(20),
    tipo VARCHAR(30),
    capacidade INT,
    atual INT
);

CREATE TABLE localizacao_tumulo (
    ID_tumulo INT,
    quadra VARCHAR(10),
    setor VARCHAR(10),
    numero INT,
	PRIMARY KEY (ID_tumulo, quadra, setor, numero),
	FOREIGN KEY (ID_tumulo) REFERENCES tumulo(ID_tumulo)
);

CREATE TABLE contrato ( -----------------
    CPF CHAR(11),
    ID_tumulo INT UNIQUE,
    data_inicio DATE,
    prazo_vigencia INT,
    valor NUMERIC(10,2),
    status VARCHAR(20),
	PRIMARY KEY (CPF, data_inicio),
    FOREIGN KEY (CPF) REFERENCES titular(CPF),
    FOREIGN KEY (ID_tumulo) REFERENCES tumulo(ID_tumulo)
);

CREATE TABLE falecido ( ------------
    CPF CHAR(11),
    nome VARCHAR(100) NOT NULL,
    data_falecimento DATE,
    data_nascimento DATE,
    motivo VARCHAR(200),
	ID_tumulo INT,
	PRIMARY KEY (CPF, nome),
	FOREIGN KEY (CPF) REFERENCES titular(CPF),
	FOREIGN KEY (ID_tumulo) REFERENCES tumulo(ID_tumulo)
);

CREATE TABLE evento (
    ID_evento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    CPF CHAR(11),
    nome VARCHAR(100) NOT NULL,
    lugar VARCHAR(100),
    dia DATE,
    horario TIME,
    valor NUMERIC(10,2),
    FOREIGN KEY (CPF, nome) REFERENCES falecido(CPF, nome)
);


CREATE TABLE fornecedor (
    CNPJ CHAR(14) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(200)
);

CREATE TABLE telefone_fornecedor (
    CNPJ CHAR(14),
    telefone VARCHAR(15),
    PRIMARY KEY (CNPJ, telefone),
    FOREIGN KEY (CNPJ) REFERENCES fornecedor(CNPJ)
);

CREATE TABLE funcionario (
    CPF CHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    funcao VARCHAR(50),
    modelo_contrato VARCHAR(30),
    horas_semanais INT,
    salario NUMERIC(10,2)
);

CREATE TABLE compra (
    CNPJ CHAR(14),
	ID_evento INT,
    valor NUMERIC(10,2),
    item VARCHAR(100),
    quantidade INT,
    data_compra DATE,
	horario TIME,
	PRIMARY KEY (CNPJ, ID_evento, data_compra, horario),
    FOREIGN KEY (CNPJ) REFERENCES fornecedor(CNPJ),
	FOREIGN KEY (ID_evento) REFERENCES evento(ID_evento)
);

CREATE TABLE funcionario_evento (
    CPF CHAR(11),
    ID_evento INT,
    PRIMARY KEY (CPF, ID_evento),
    FOREIGN KEY (CPF) REFERENCES funcionario(CPF),
    FOREIGN KEY (ID_evento) REFERENCES evento(ID_evento)
);

CREATE TABLE evento_sepultamento (
    ID_evento INT,
    local_destino VARCHAR (100),
    PRIMARY KEY (id_evento, local_destino),
    FOREIGN KEY (ID_evento) REFERENCES evento(ID_evento)
);

CREATE TABLE evento_cremacao (
    ID_evento INT,
    forno INT,
    PRIMARY KEY (ID_evento, forno),
    FOREIGN KEY (ID_evento) REFERENCES evento(ID_evento)
);

CREATE TABLE evento_velorio (
    ID_evento INT,
    sala INT,
    PRIMARY KEY (ID_evento, sala),
    FOREIGN KEY (ID_evento) REFERENCES evento(ID_evento)
);