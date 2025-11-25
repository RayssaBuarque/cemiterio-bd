export interface IFiltros extends Record<string, any> {
    data_inicio?: string;
    data_fim?: string;
    limit?: number;
    page?: number;
    id_evento?: number;
}

// === CONTRATOS ===
export interface IContrato {
    id: number;
    data_assinatura: string;
}

// === TITULARES ===
export interface ITitularInput {
    cpf: string;
    nome: string;
    endereco?: string;
    telefone?: string;
}

// === TÚMULOS ===
export interface ITumuloInput {
    id_tumulo: number,
    status: 'Cheio' | 'Reservado' | 'Vazio';
    tipo: 'Túmulo Familiar' | 'Gaveta' | 'Mausoléu' | 'Túmulo Duplo';
    capacidade: number;
}

// === FORNECEDORES ===
export interface IFornecedorInput {
    cnpj: string;
    razao_social: string;
    nome_fantasia?: string;
    contato?: string;
}

// === FUNCIONÁRIOS ===
export interface IFuncionarioInput {
    cpf: string;
    nome: string;
    funcao: string;
    modelo_contrato: string;
    horas_semanais: number;
    salario?: number;
}

// === EVENTOS ===
export interface IEventoInput {
    id_evento: number;
    lugar: string;
    dia: string;
    horario: string;
    valor?: number;
}