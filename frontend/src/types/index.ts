export interface IFiltros extends Record<string, any> {
    data_inicio?: string;
    data_fim?: string;
    limit?: number;
    page?: number;
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
    status: 'Ocupado' | 'Reservado' | 'Livre';
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
    titulo: string;
    data: string;
    descricao?: string;
    id_tumulo?: number;
}