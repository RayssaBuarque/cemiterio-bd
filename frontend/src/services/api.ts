import axios, { AxiosResponse } from 'axios';
import { 
    IFiltros, 
    ITitularInput, 
    ITumuloInput, 
    IFornecedorInput, 
    IFuncionarioInput, 
    IEventoInput 
} from '../types'; 

const BASE_URL = "http://localhost:3000";

axios.defaults.baseURL = BASE_URL;

const api = {

    // ==========================================
    // CONTRATOS
    // ==========================================
    getContratos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/contrato");
    },

    getContratoPorCpf: async (cpf: string): Promise<AxiosResponse<any>> => {
        return await axios.get(`/contrato/${cpf}`);
    },

    getContratoFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        return await axios.get("/contrato/filtro", { params: filtros });
    },

    createContrato: async (dados: any): Promise<AxiosResponse<any>> => {
        return await axios.post("/contrato", dados, {
            headers: { "Content-Type": "application/json" }
        });
    },

    updateContrato: async (cpf: string, id_tumulo: number | string, dados: any): Promise<AxiosResponse<any>> => {
        return await axios.put(`/contrato/${cpf}/${id_tumulo}`, dados, {
            headers: { "Content-Type": "application/json" }
        });
    },

    getContratosVencendo: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/contratoVencendo");
    },

    getContratosAtivos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/contratosAtivos");
    },

    // ==========================================
    // TITULARES
    // ==========================================
    getTitulares: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/titular");
    },

    getTitularesFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        return await axios.get("/titular/filtro", { params: filtros });
    },

    createTitular: async (dadosTitular: ITitularInput): Promise<AxiosResponse<any>> => {
        return await axios.post("/titular", dadosTitular, {
            headers: { "Content-Type": "application/json" }
        });
    },

    deleteTitular: async (cpf: string): Promise<AxiosResponse<any>> => {
        return await axios.delete(`/titular/${cpf}`);
    },
    
    // ==========================================
    // TÚMULOS
    // ==========================================
    getTumulos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/tumulo");
    },

    getTumuloPorId: async (id_tumulo: number | string): Promise<AxiosResponse<any>> => {
        return await axios.get(`/tumulo/${id_tumulo}`);
    },

    getTumuloFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        return await axios.get("/tumulo/filtro", { params: filtros });
    },
    
    createTumulo: async (dadosTumulo: Omit<ITumuloInput, 'id_tumulo'>): Promise<AxiosResponse<any>> => {
        return await axios.post("/tumulo", dadosTumulo, {
            headers: { "Content-Type": "application/json" }
        });
    },

    getTumulosMaisOcupados: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/tumulosMaisOcupados");
    },

    updateTumulo: async (id_tumulo: number | string, dadosTumulo: ITumuloInput): Promise<AxiosResponse<any>> => {
        return await axios.put(`/tumulo/${id_tumulo}`, dadosTumulo, {
            headers: { "Content-Type": "application/json" }
        });
    },

    deleteTumulo: async (id_tumulo: number | string): Promise<AxiosResponse<any>> => {
        return await axios.delete(`/tumulo/${id_tumulo}`);
    },

    // ==========================================
    // FALECIDOS
    // ==========================================
    getFalecidos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/falecido");
    },

    getFalecidosFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        return await axios.get("/falecido/filtro", { params: filtros });
    },
    
    getFalecidoPorCpf: async (cpf: string): Promise<AxiosResponse<any>> => {
        return await axios.get(`/falecido/${cpf}`);
    },

    createFalecido: async (dados: any): Promise<AxiosResponse<any>> => {
        return await axios.post("/falecido", dados, {
            headers: { "Content-Type": "application/json" }
        });
    },

    getEstatisticasFalecidos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/estatisticasFalecidos");
    },

    // ==========================================
    // FORNECEDORES
    // ==========================================
    getFornecedores: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/fornecedor");
    },

    getFornecedoresFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        return await axios.get("/fornecedor/filtro", { params: filtros });
    },

    createFornecedor: async (dadosFornecedor: IFornecedorInput): Promise<AxiosResponse<any>> => {
        return await axios.post("/fornecedor", dadosFornecedor, {
            headers: { "Content-Type": "application/json" }
        });
    },
    
    getFornecedoresMaiorGastos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/fornecedoresMaiorGastos");
    },

    getFornecedorMaisUsadoCadaEvento: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/fornecedorMaisUsadoCadaEvento");
    },

    // ==========================================
    // FUNCIONÁRIOS
    // ==========================================
    getFuncionarios: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/funcionario");
    },

    getFuncionariosFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        return await axios.get("/funcionario/filtro", { params: filtros });
    },

    getFuncionarioByEvento: async (id_evento: number | string): Promise<AxiosResponse<any>> => {
        return await axios.get(`/funcionario/${id_evento}`);
    },

    getFuncionariosLivres: async (data: string, horario: string): Promise<AxiosResponse<any>> => {
        return await axios.get("/funcionarioLivre", { params: { data, horario } });
    },

    createFuncionario: async (dadosFuncionario: IFuncionarioInput): Promise<AxiosResponse<any>> => {
        return await axios.post("/funcionario", dadosFuncionario, {
            headers: { "Content-Type": "application/json" }
        });
    },

    getFuncionariosMaisTrabalhadores: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/maisTrabalhadores");
    },

    // ==========================================
    // EVENTOS
    // ==========================================
    getEventos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/evento");
    },

    getEventoPorId: async (id: number | string): Promise<AxiosResponse<any>> => {
        return await axios.get(`/evento/${id}`);
    },

    getEventosFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        return await axios.get("/evento/filtro", { params: filtros });
    },

    createEvento: async (dadosEvento: IEventoInput): Promise<AxiosResponse<any>> => {
        return await axios.post("/evento", dadosEvento, {
            headers: { "Content-Type": "application/json" }
        });
    },

    updateEvento: async (id_evento: number | string, dadosEvento: IEventoInput): Promise<AxiosResponse<any>> => {
        return await axios.put(`/evento/${id_evento}`, dadosEvento, {
            headers: { "Content-Type": "application/json" }
        });
    },

    deleteEvento: async (id_evento: string | string): Promise<AxiosResponse<any>> => {
        return await axios.delete(`/evento/${id_evento}`);
    },

    getCustoTotalEventos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/custoTotalEventos");
    },

    // ==========================================
    // COMPRAS
    // ==========================================
    createCompra: async (dadosCompra: any): Promise<AxiosResponse<any>> => {
        return await axios.post("/compra", dadosCompra, {
            headers: { "Content-Type": "application/json" }
        });
    },

    getCompras: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/compra");
    },

    getEstatisticasCompras: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/estatisticasCompras");
    },

    // ==========================================
    // LOCALIZAÇÃO / AGRUPAMENTOS
    // ==========================================
    getLocalizacaoContratosAtivos: async (): Promise<AxiosResponse<any>> => {
        return await axios.get("/localizacaoContratosAtivos");
    },

    // ==========================================
    // EVENTOS ESPECÍFICOS (CREMAÇÃO / VELÓRIO / SEPULTAMENTO)
    // ==========================================
    createCremacao: async (dados: any): Promise<AxiosResponse<any>> => {
        return await axios.post("/cremacao", dados, {
            headers: { "Content-Type": "application/json" }
        });
    },

    createVelorio: async (dados: any): Promise<AxiosResponse<any>> => {
        return await axios.post("/velorio", dados, {
            headers: { "Content-Type": "application/json" }
        });
    },

    createSepultamento: async (dados: any): Promise<AxiosResponse<any>> => {
        return await axios.post("/sepultamento", dados, {
            headers: { "Content-Type": "application/json" }
        });
    },
};

export default api;
