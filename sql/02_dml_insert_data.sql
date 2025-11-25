-- ============================================
-- INSERÇÃO DE REGISTROS 
-- ============================================

-- 1. TITULARES (20 registros)
INSERT INTO titular (CPF, nome, endereco, email, telefone) VALUES
('12345678901', 'João Silva', 'Rua A, 123 - Centro - São Paulo/SP', 'joao.silva@email.com', '11999990001'),
('23456789012', 'Maria Santos', 'Av. B, 456 - Jardim - Rio de Janeiro/RJ', 'maria.santos@email.com', '21999990002'),
('34567890123', 'Pedro Oliveira', 'Rua C, 789 - Vila Nova - Belo Horizonte/MG', 'pedro.oliveira@email.com', '31999990003'),
('45678901234', 'Ana Costa', 'Alameda D, 321 - Centro - Porto Alegre/RS', 'ana.costa@email.com', '51999990004'),
('56789012345', 'Carlos Pereira', 'Praça E, 654 - Jardim - Salvador/BA', 'carlos.pereira@email.com', '71999990005'),
('67890123456', 'Fernanda Lima', 'Rua F, 987 - Centro - Curitiba/PR', 'fernanda.lima@email.com', '41999990006'),
('78901234567', 'Ricardo Alves', 'Av. G, 654 - Vila Mariana - São Paulo/SP', 'ricardo.alves@email.com', '11999990007'),
('89012345678', 'Juliana Martins', 'Rua H, 321 - Jardins - Rio de Janeiro/RJ', 'juliana.martins@email.com', '21999990008'),
('90123456789', 'Roberto Souza', 'Alameda I, 159 - Centro - Belo Horizonte/MG', 'roberto.souza@email.com', '31999990009'),
('01234567890', 'Patrícia Rocha', 'Praça J, 753 - Moinhos - Porto Alegre/RS', 'patricia.rocha@email.com', '51999990010'),
('11223344556', 'Marcos Ferreira', 'Rua K, 951 - Barra - Salvador/BA', 'marcos.ferreira@email.com', '71999990011'),
('22334455667', 'Camila Dias', 'Av. L, 357 - Batel - Curitiba/PR', 'camila.dias@email.com', '41999990012'),
('33445566778', 'Lucas Barbosa', 'Rua M, 864 - Centro - Fortaleza/CE', 'lucas.barbosa@email.com', '85999990013'),
('44556677889', 'Amanda Correia', 'Alameda N, 246 - Aldeota - Fortaleza/CE', 'amanda.correia@email.com', '85999990014'),
('55667788990', 'Bruno Nunes', 'Praça O, 135 - Centro - Recife/PE', 'bruno.nunes@email.com', '81999990015'),
('66778899001', 'Tatiane Ramos', 'Rua P, 975 - Boa Viagem - Recife/PE', 'tatiane.ramos@email.com', '81999990016'),
('77889900112', 'Diego Castro', 'Av. Q, 642 - Centro - Brasília/DF', 'diego.castro@email.com', '61999990017'),
('88990011223', 'Vanessa Monteiro', 'Rua R, 318 - Asa Sul - Brasília/DF', 'vanessa.monteiro@email.com', '61999990018'),
('99001122334', 'Felipe Cardoso', 'Alameda S, 789 - Centro - Manaus/AM', 'felipe.cardoso@email.com', '92999990019'),
('00112233445', 'Laura Mendes', 'Praça T, 456 - Parque 10 - Manaus/AM', 'laura.mendes@email.com', '92999990020');

-- 2. TÚMULOS (20 registros)
INSERT INTO tumulo (ID_tumulo, status, tipo, capacidade) VALUES
(1, 'Ocupado', 'Túmulo Familiar', 4),
(2, 'Livre', 'Gaveta', 1),
(3, 'Ocupado', 'Túmulo Duplo', 2),
(4, 'Reservado', 'Mausoléu', 6),
(5, 'Ocupado', 'Túmulo Simples', 1),
(6, 'Livre', 'Túmulo Familiar', 4),
(7, 'Ocupado', 'Gaveta', 1),
(8, 'Reservado', 'Túmulo Duplo', 2),
(9, 'Ocupado', 'Mausoléu', 6),
(10, 'Livre', 'Túmulo Simples', 1),
(11, 'Ocupado', 'Túmulo Familiar', 4),
(12, 'Livre', 'Gaveta', 1),
(13, 'Ocupado', 'Túmulo Duplo', 2),
(14, 'Reservado', 'Mausoléu', 6),
(15, 'Ocupado', 'Túmulo Simples', 1),
(16, 'Livre', 'Túmulo Familiar', 4),
(17, 'Ocupado', 'Gaveta', 1),
(18, 'Reservado', 'Túmulo Duplo', 2),
(19, 'Ocupado', 'Mausoléu', 6),
(20, 'Livre', 'Túmulo Simples', 1);

-- 3. LOCALIZAÇÃO_TUMULO (20 registros)
INSERT INTO localizacao_tumulo (ID_tumulo, quadra, setor, numero) VALUES
(1, 'A', '1', 101), (2, 'A', '1', 102), (3, 'A', '1', 103), (4, 'A', '1', 104), (5, 'A', '1', 105),
(6, 'B', '2', 201), (7, 'B', '2', 202), (8, 'B', '2', 203), (9, 'B', '2', 204), (10, 'B', '2', 205),
(11, 'C', '3', 301), (12, 'C', '3', 302), (13, 'C', '3', 303), (14, 'C', '3', 304), (15, 'C', '3', 305),
(16, 'D', '4', 401), (17, 'D', '4', 402), (18, 'D', '4', 403), (19, 'D', '4', 404), (20, 'D', '4', 405);

-- 4. CONTRATOS (20 registros)
INSERT INTO contrato (CPF, ID_tumulo, data_inicio, prazo_vigencia, valor, status) VALUES
('12345678901', 1, '2020-01-15', 50, 15000.00, 'Ativo'),
('23456789012', 2, '2021-03-20', 25, 8000.00, 'Ativo'),
('34567890123', 3, '2019-11-10', 30, 12000.00, 'Ativo'),
('45678901234', 4, '2022-05-05', 100, 35000.00, 'Reservado'),
('56789012345', 5, '2023-02-28', 20, 5000.00, 'Ativo'),
('67890123456', 6, '2021-07-15', 40, 18000.00, 'Ativo'),
('78901234567', 7, '2020-12-10', 15, 6000.00, 'Ativo'),
('89012345678', 8, '2022-09-25', 35, 14000.00, 'Reservado'),
('90123456789', 9, '2018-06-30', 80, 28000.00, 'Ativo'),
('01234567890', 10, '2023-01-05', 10, 4500.00, 'Ativo'),
('11223344556', 11, '2017-04-18', 60, 22000.00, 'Ativo'),
('22334455667', 12, '2022-11-12', 20, 7000.00, 'Ativo'),
('33445566778', 13, '2021-08-22', 30, 11000.00, 'Ativo'),
('44556677889', 14, '2023-03-08', 90, 32000.00, 'Reservado'),
('55667788990', 15, '2020-05-14', 25, 8500.00, 'Ativo'),
('66778899001', 16, '2022-12-01', 45, 19000.00, 'Ativo'),
('77889900112', 17, '2021-10-19', 15, 5500.00, 'Ativo'),
('88990011223', 18, '2023-04-25', 40, 16000.00, 'Reservado'),
('99001122334', 19, '2019-02-28', 70, 25000.00, 'Ativo'),
('00112233445', 20, '2023-06-10', 12, 4800.00, 'Ativo');

-- 5. FALECIDOS (20 registros)
INSERT INTO falecido (CPF, nome, data_falecimento, data_nascimento, motivo, ID_tumulo) VALUES
('12345678901', 'Antonio Silva', '2023-01-10', '1945-03-15', 'Causas naturais', 1),
('23456789012', 'Fernanda Lima', '2024-02-20', '1978-07-22', 'Acidente', 3),
('34567890123', 'Roberto Alves', '2022-12-05', '1952-11-30', 'Doença', 5),
('45678901234', 'Carla Santos', '2023-08-15', '1965-04-18', 'Causas naturais', 7),
('56789012345', 'Miguel Costa', '2024-01-30', '1948-09-12', 'Doença', 9),
('67890123456', 'Beatriz Oliveira', '2022-11-25', '1972-02-28', 'Acidente', 11),
('78901234567', 'Rafael Pereira', '2023-05-18', '1958-12-05', 'Causas naturais', 13),
('89012345678', 'Daniela Rodrigues', '2024-03-12', '1969-06-20', 'Doença', 15),
('90123456789', 'Sérgio Nunes', '2022-09-08', '1943-08-15', 'Causas naturais', 17),
('01234567890', 'Larissa Castro', '2023-12-01', '1975-01-25', 'Acidente', 19),
('11223344556', 'Gustavo Mendes', '2024-04-05', '1955-10-08', 'Doença', 2),
('22334455667', 'Patrícia Rocha', '2023-07-22', '1962-03-14', 'Causas naturais', 4),
('33445566778', 'Marcelo Dias', '2022-10-30', '1947-07-19', 'Doença', 6),
('44556677889', 'Tatiane Barbosa', '2024-01-15', '1970-11-03', 'Acidente', 8),
('55667788990', 'Leonardo Correia', '2023-09-28', '1950-05-27', 'Causas naturais', 10),
('66778899001', 'Vanessa Monteiro', '2022-12-20', '1967-09-08', 'Doença', 12),
('77889900112', 'Felipe Cardoso', '2024-02-10', '1940-12-12', 'Causas naturais', 14),
('88990011223', 'Laura Ramos', '2023-11-05', '1973-04-17', 'Acidente', 16),
('99001122334', 'Bruno Ferreira', '2022-08-18', '1957-02-23', 'Doença', 18),
('00112233445', 'Juliana Almeida', '2024-03-25', '1964-06-30', 'Causas naturais', 20);

-- 6. FORNECEDORES (20 registros)
INSERT INTO fornecedor (CNPJ, nome, endereco) VALUES
('12345678000101', 'Flores Para Sempre Ltda', 'Rua das Flores, 100 - Centro - São Paulo/SP'),
('23456789000102', 'Mármores Nobre SA', 'Av. das Pedras, 200 - Industrial - Rio de Janeiro/RJ'),
('34567890000103', 'Coroa Funeral ME', 'Rua das Coroas, 300 - Centro - Belo Horizonte/MG'),
('45678901000104', 'Velas Eternas Ltda', 'Alameda das Velas, 400 - Comercial - Porto Alegre/RS'),
('56789012000105', 'Urnas Sagradas SA', 'Praça das Urnas, 500 - Centro - Salvador/BA'),
('67890123000106', 'Transporte Celestial ME', 'Rua dos Transportes, 600 - Industrial - Curitiba/PR'),
('78901234000107', 'Lápides Memorial Ltda', 'Av. das Lápides, 700 - Centro - Fortaleza/CE'),
('89012345000108', 'Flores do Campo SA', 'Rua dos Campos, 800 - Jardim - Recife/PE'),
('90123456000109', 'Mármore Arte ME', 'Alameda da Arte, 900 - Centro - Brasília/DF'),
('01234567000110', 'Coroa Real Ltda', 'Praça Real, 1000 - Nobre - Manaus/AM'),
('11223344000111', 'Velas Divinas SA', 'Rua Divina, 1100 - Centro - São Paulo/SP'),
('22334455000112', 'Urnas Preciosas ME', 'Av. Preciosa, 1200 - Industrial - Rio de Janeiro/RJ'),
('33445566000113', 'Transporte Paz Ltda', 'Rua da Paz, 1300 - Centro - Belo Horizonte/MG'),
('44556677000114', 'Lápides Eternas SA', 'Alameda Eterna, 1400 - Comercial - Porto Alegre/RS'),
('55667788000115', 'Flores Perenes ME', 'Praça Perene, 1500 - Centro - Salvador/BA'),
('66778899000116', 'Mármore Divino Ltda', 'Rua Divina, 1600 - Industrial - Curitiba/PR'),
('77889900000117', 'Coroa Celestial SA', 'Av. Celestial, 1700 - Centro - Fortaleza/CE'),
('88990011000118', 'Velas Sagradas ME', 'Rua Sagrada, 1800 - Jardim - Recife/PE'),
('99001122000119', 'Urnas Memorial Ltda', 'Alameda Memorial, 1900 - Centro - Brasília/DF'),
('00112233000120', 'Transporte Angelical SA', 'Praça Angelical, 2000 - Nobre - Manaus/AM');

-- 7. TELEFONE_FORNECEDOR (20 registros)
INSERT INTO telefone_fornecedor (CNPJ, telefone) VALUES
('12345678000101', '1133334001'), ('12345678000101', '1133334002'),
('23456789000102', '2133334003'), ('23456789000102', '2133334004'),
('34567890000103', '3133334005'), ('34567890000103', '3133334006'),
('45678901000104', '5133334007'), ('45678901000104', '5133334008'),
('56789012000105', '7133334009'), ('56789012000105', '7133334010'),
('67890123000106', '4133334011'), ('67890123000106', '4133334012'),
('78901234000107', '8533334013'), ('78901234000107', '8533334014'),
('89012345000108', '8133334015'), ('89012345000108', '8133334016'),
('90123456000109', '6133334017'), ('90123456000109', '6133334018'),
('01234567000110', '9233334019'), ('01234567000110', '9233334020');

-- 8. FUNCIONÁRIOS (20 registros)
INSERT INTO funcionario (CPF, nome, funcao, modelo_contrato, horas_semanais, salario) VALUES
('11122233344', 'Carlos Jardineiro', 'Jardineiro', 'CLT', 44, 2200.00),
('22233344455', 'Ana Recepcionista', 'Recepcionista', 'CLT', 40, 2800.00),
('33344455566', 'Pedro Coveiro', 'Coveiro', 'CLT', 44, 2500.00),
('44455566677', 'Mariana Administradora', 'Administrador', 'CLT', 44, 4500.00),
('55566677788', 'José Motorista', 'Motorista', 'CLT', 40, 3200.00),
('66677788899', 'Cristina Cozinheira', 'Cozinheira', 'CLT', 44, 2300.00),
('77788899900', 'Roberto Segurança', 'Segurança', 'CLT', 44, 2700.00),
('88899900011', 'Fernanda Psicóloga', 'Psicóloga', 'PJ', 30, 3800.00),
('99900011122', 'Paulo Coordenador', 'Coordenador', 'CLT', 44, 5200.00),
('00011122233', 'Luciana Florista', 'Florista', 'CLT', 40, 2100.00),
('11722233300', 'Ricardo Manutenção', 'Técnico Manutenção', 'CLT', 44, 2900.00),
('22833344400', 'Sandra Limpeza', 'Auxiliar Limpeza', 'CLT', 44, 1800.00),
('33144455500', 'Felipe Assistente', 'Assistente Administrativo', 'CLT', 44, 2400.00),
('44855566600', 'Gabriela Social Media', 'Social Media', 'PJ', 20, 2000.00),
('55066677700', 'André Contador', 'Contador', 'PJ', 25, 4200.00),
('66477788800', 'Patrícia Enfermeira', 'Enfermeira', 'CLT', 40, 3500.00),
('77088899900', 'Marcos Gerente', 'Gerente', 'CLT', 44, 6800.00),
('88499900000', 'Isabela Atendente', 'Atendente', 'CLT', 40, 2200.00),
('99200011100', 'Rogério Zelador', 'Zelador', 'CLT', 44, 2300.00),
('00311122200', 'Helena Coordenadora', 'Coordenadora Eventos', 'CLT', 44, 4800.00);

-- 9. EVENTOS (20 registros)
INSERT INTO evento (ID_evento, CPF, nome, lugar, dia, horario, valor) VALUES
(1, '12345678901', 'Antonio Silva', 'Capela São João', '2024-01-15', '14:00:00', 2500.00),
(2, '23456789012', 'Fernanda Lima', 'Sala Velório Paz', '2024-01-16', '16:00:00', 1800.00),
(3, '34567890123', 'Roberto Alves', 'Crematório Central', '2024-01-17', '10:00:00', 3200.00),
(4, '45678901234', 'Carla Santos', 'Cemitério Jardim da Paz', '2024-01-18', '15:00:00', 1500.00),
(5, '56789012345', 'Miguel Costa', 'Capela Santa Maria', '2024-01-19', '09:00:00', 2200.00),
(6, '67890123456', 'Beatriz Oliveira', 'Sala Velório Esperança', '2024-01-20', '11:00:00', 1900.00),
(7, '78901234567', 'Rafael Pereira', 'Crematório Oeste', '2024-01-21', '14:30:00', 3100.00),
(8, '89012345678', 'Daniela Rodrigues', 'Cemitério São Pedro', '2024-01-22', '16:30:00', 1400.00),
(9, '90123456789', 'Sérgio Nunes', 'Capela Divino Espírito', '2024-01-23', '08:00:00', 2600.00),
(10, '01234567890', 'Larissa Castro', 'Sala Velório Fé', '2024-01-24', '13:00:00', 1700.00),
(11, '11223344556', 'Gustavo Mendes', 'Crematório Leste', '2024-01-25', '15:00:00', 3300.00),
(12, '22334455667', 'Patrícia Rocha', 'Cemitério Parque das Flores', '2024-01-26', '10:30:00', 1600.00),
(13, '33445566778', 'Marcelo Dias', 'Capela Nossa Senhora', '2024-01-27', '17:00:00', 2400.00),
(14, '44556677889', 'Tatiane Barbosa', 'Sala Velório Luz', '2024-01-28', '12:00:00', 2000.00),
(15, '55667788990', 'Leonardo Correia', 'Crematório Norte', '2024-01-29', '09:30:00', 3000.00),
(16, '66778899001', 'Vanessa Monteiro', 'Cemitério Eterno Descanso', '2024-01-30', '14:00:00', 1300.00),
(17, '77889900112', 'Felipe Cardoso', 'Capela Santo Antônio', '2024-01-31', '11:30:00', 2700.00),
(18, '88990011223', 'Laura Ramos', 'Sala Velório Consolação', '2024-02-01', '15:30:00', 1850.00),
(19, '99001122334', 'Bruno Ferreira', 'Crematório Sul', '2024-02-02', '13:30:00', 3150.00),
(20, '00112233445', 'Juliana Almeida', 'Cemitério Vale da Saudade', '2024-02-03', '16:00:00', 1450.00);

-- 10. COMPRAS (20 registros)
INSERT INTO compra (CNPJ, ID_evento, valor, item, quantidade, data_compra, horario) VALUES
('12345678000101', 1, 500.00, 'Coroa de Flores', 2, '2024-01-14', '10:00:00'),
('23456789000102', 2, 800.00, 'Lápide em Mármore', 1, '2024-01-15', '11:30:00'),
('34567890000103', 3, 300.00, 'Coroa Simples', 3, '2024-01-16', '09:00:00'),
('45678901000104', 4, 150.00, 'Velas Decorativas', 20, '2024-01-17', '14:20:00'),
('56789012000105', 5, 1200.00, 'Urna Premium', 1, '2024-01-18', '16:45:00'),
('67890123000106', 6, 400.00, 'Transporte Especial', 1, '2024-01-19', '08:30:00'),
('78901234000107', 7, 650.00, 'Lápide Básica', 1, '2024-01-20', '13:15:00'),
('89012345000108', 8, 350.00, 'Buquê de Flores', 5, '2024-01-21', '10:50:00'),
('90123456000109', 9, 280.00, 'Coroa Média', 2, '2024-01-22', '15:10:00'),
('01234567000110', 10, 900.00, 'Urna Standard', 1, '2024-01-23', '12:25:00'),
('11223344000111', 11, 200.00, 'Velas Simples', 15, '2024-01-24', '09:40:00'),
('22334455000112', 12, 750.00, 'Urna Econômica', 1, '2024-01-25', '17:00:00'),
('33445566000113', 13, 450.00, 'Transporte Básico', 1, '2024-01-26', '14:35:00'),
('44556677000114', 14, 520.00, 'Lápide Pequena', 1, '2024-01-27', '11:20:00'),
('55667788000115', 15, 380.00, 'Flores Diversas', 8, '2024-01-28', '16:15:00'),
('66778899000116', 16, 600.00, 'Mármore para Lápide', 1, '2024-01-29', '10:05:00'),
('77889900000117', 17, 320.00, 'Coroa Pequena', 4, '2024-01-30', '13:50:00'),
('88990011000118', 18, 180.00, 'Velas Aromáticas', 12, '2024-01-31', '15:25:00'),
('99001122000119', 19, 1100.00, 'Urna de Luxo', 1, '2024-02-01', '09:15:00'),
('00112233000120', 20, 480.00, 'Transporte Familiar', 1, '2024-02-02', '12:40:00');

-- 11. FUNCIONARIO_EVENTO (20 registros)
INSERT INTO funcionario_evento (CPF, ID_evento) VALUES
('11122233344', 1), ('22233344455', 1), ('33344455566', 1),
('44455566677', 2), ('55566677788', 2), ('66677788899', 2),
('77788899900', 3), ('88899900011', 3), ('99900011122', 3),
('00011122233', 4);

-- 12. EVENTO_SEPULTAMENTO (20 registros)
INSERT INTO evento_sepultamento (ID_evento, local_destino) VALUES
(1, 'Quadra A, Setor 1, Número 101'),
(4, 'Quadra A, Setor 1, Número 102'),
(8, 'Quadra B, Setor 2, Número 201'),
(12, 'Quadra C, Setor 3, Número 301'),
(16, 'Quadra D, Setor 4, Número 401'),
(2, 'Quadra A, Setor 1, Número 103'),
(5, 'Quadra B, Setor 2, Número 202'),
(9, 'Quadra C, Setor 3, Número 302'),
(13, 'Quadra D, Setor 4, Número 402'),
(17, 'Quadra A, Setor 1, Número 104'),
(20, 'Quadra B, Setor 2, Número 203'),
(3, 'Quadra C, Setor 3, Número 303'),
(6, 'Quadra D, Setor 4, Número 403'),
(10, 'Quadra A, Setor 1, Número 105'),
(14, 'Quadra B, Setor 2, Número 204'),
(18, 'Quadra C, Setor 3, Número 304'),
(7, 'Quadra D, Setor 4, Número 404'),
(11, 'Quadra A, Setor 1, Número 106'),
(15, 'Quadra B, Setor 2, Número 205'),
(19, 'Quadra C, Setor 3, Número 305');

-- 13. EVENTO_CREMAÇÃO (20 registros)
INSERT INTO evento_cremacao (ID_evento, forno) VALUES
(3, 1), (7, 2), (11, 3), (15, 4), (19, 5),
(1, 1), (5, 2), (9, 3), (13, 4), (17, 5),
(2, 1), (6, 2), (10, 3), (14, 4), (18, 5),
(4, 1), (8, 2), (12, 3), (16, 4), (20, 5);

-- 14. EVENTO_VELORIO (20 registros)
INSERT INTO evento_velorio (ID_evento, sala) VALUES
(2, 1), (6, 2), (10, 3), (14, 4), (18, 5),
(1, 1), (5, 2), (9, 3), (13, 4), (17, 5),
(3, 1), (7, 2), (11, 3), (15, 4), (19, 5),
(4, 1), (8, 2), (12, 3), (16, 4), (20, 5);
