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
    rg?: string;
    endereco?: string;
    telefone?: string;
}

// === TÚMULOS ===
export interface ITumuloInput {
    localizacao: string;
    tipo: 'comum' | 'jazigo' | 'gaveta';
    capacidade?: number;
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
    cargo: string;
    salario?: number;
}

// === EVENTOS ===
export interface IEventoInput {
    titulo: string;
    data: string;
    descricao?: string;
    id_tumulo?: number;
}