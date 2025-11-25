import axios, { AxiosResponse } from 'axios';
import { 
    IFiltros, 
    ITitularInput, 
    ITumuloInput, 
    IFornecedorInput, 
    IFuncionarioInput, 
    IEventoInput 
} from '../src/types'; 

const BASE_URL = "http://localhost:3000";

axios.defaults.baseURL = BASE_URL;

const api = {

    // ==========================================
    // CONTRATOS
    // ==========================================
    getContratos: async (): Promise<AxiosResponse<any>> => {
        const requestUrl = "/contrato";
        return await axios.get(requestUrl);
    },

    getContratoPorCpf: async (cpf: string): Promise<AxiosResponse<any>> => {
        const requestUrl = `/contrato/${cpf}`;
        return await axios.get(requestUrl);
    },

    getContratoFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        const requestUrl = "/contrato/filtro";
        return await axios.get(requestUrl, { params: filtros });
    },

    // ==========================================
    // TITULARES
    // ==========================================
    getTitulares: async (): Promise<AxiosResponse<any>> => {
        const requestUrl = "/titular";
        return await axios.get(requestUrl);
    },

    getTitularesFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        const requestUrl = "/titular/filtro";
        return await axios.get(requestUrl, { params: filtros });
    },

    createTitular: async (dadosTitular: ITitularInput): Promise<AxiosResponse<any>> => {
        const requestUrl = "/titular";
        return await axios.post(
            requestUrl,
            dadosTitular,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    },

    deleteTitular: async (cpf: string): Promise<AxiosResponse<any>> => {
        const requestUrl = `/titular/${cpf}`;
        return await axios.delete(requestUrl);
    },

    // ==========================================
    // TÚMULOS
    // ==========================================
    getTumulos: async (): Promise<AxiosResponse<any>> => {
        const requestUrl = "/tumulo";
        return await axios.get(requestUrl);
    },

    getTumuloPorId: async (id_tumulo: number | string): Promise<AxiosResponse<any>> => {
        const requestUrl = `/tumulo/${id_tumulo}`;
        return await axios.get(requestUrl);
    },

    getTumuloFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        const requestUrl = "/tumulo/filtro";
        return await axios.get(requestUrl, { params: filtros });
    },

    createTumulo: async (dadosTumulo: ITumuloInput): Promise<AxiosResponse<any>> => {
        const requestUrl = "/tumulo";
        return await axios.post(
            requestUrl,
            dadosTumulo,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    },

    // ==========================================
    // FORNECEDORES
    // ==========================================
    getFornecedores: async (): Promise<AxiosResponse<any>> => {
        const requestUrl = "/fornecedor";
        return await axios.get(requestUrl);
    },

    getFornecedoresFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        const requestUrl = "/fornecedor/filtro";
        return await axios.get(requestUrl, { params: filtros });
    },

    createFornecedor: async (dadosFornecedor: IFornecedorInput): Promise<AxiosResponse<any>> => {
        const requestUrl = "/fornecedor";
        return await axios.post(
            requestUrl,
            dadosFornecedor,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    },

    // ==========================================
    // FUNCIONÁRIOS
    // ==========================================
    getFuncionarios: async (): Promise<AxiosResponse<any>> => {
        const requestUrl = "/funcionario";
        return await axios.get(requestUrl);
    },

    getFuncionariosFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        const requestUrl = "/funcionario/filtro";
        return await axios.get(requestUrl, { params: filtros });
    },

    createFuncionario: async (dadosFuncionario: IFuncionarioInput): Promise<AxiosResponse<any>> => {
        const requestUrl = "/funcionario";
        return await axios.post(
            requestUrl,
            dadosFuncionario,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    },

    // ==========================================
    // EVENTOS
    // ==========================================
    getEventos: async (): Promise<AxiosResponse<any>> => {
        const requestUrl = "/evento";
        return await axios.get(requestUrl);
    },

    getEventoPorId: async (id: number | string): Promise<AxiosResponse<any>> => {
        const requestUrl = `/evento/${id}`;
        return await axios.get(requestUrl);
    },

    getEventosFiltro: async (filtros: IFiltros): Promise<AxiosResponse<any>> => {
        const requestUrl = "/evento/filtro";
        return await axios.get(requestUrl, { params: filtros });
    },

    createEvento: async (dadosEvento: IEventoInput): Promise<AxiosResponse<any>> => {
        const requestUrl = "/evento";
        return await axios.post(
            requestUrl,
            dadosEvento,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

export default api;