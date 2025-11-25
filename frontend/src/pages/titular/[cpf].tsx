import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// API & Types
import api from "../../services/api";
import { ITitularInput, IContrato } from "../../types";
import SideBar from "@/base/Sidebar";

const TitularView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [titularData, setTitularData] = useState<ITitularInput | null>(null);
    const [contratos, setContratos] = useState<IContrato[]>([]);

    const router = useRouter()
    const { cpf } = router.query

    const fetchData = async() => {
        if (!cpf) return;
        setIsLoading(true)
        try{   
            // 1. Obter dados do Titular (Simulando filtro se não houver endpoint específico ou usando endpoint geral)
            // Idealmente: api.getTitularPorCpf(cpf)
            const { data: titulares } = await api.getTitulares();
            const titular = titulares.find((t: ITitularInput) => t.cpf === cpf);
            

            if (titular) {
                setTitularData(titular);
                
                // 2. Obter contratos vinculados
                const { data: contratosData } = await api.getContratoPorCpf(String(cpf));
                // O endpoint retorna apenas UM contrato ou lista? Se for lista:
                if (Array.isArray(contratosData)) {
                    setContratos(contratosData);
                } else if (contratosData) {
                    setContratos([contratosData]); // Coloca em array se retornar objeto único
                }
            }
        }
        catch(err){
            console.log("Houve um erro na hora de obter os dados do titular", err)
        }
        finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(router.isReady) {
            fetchData()
        }
    }, [router.isReady, cpf])

    // Helpers de formatação
    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    const formatDate = (timestamp: number) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('pt-BR');
    }

    if (!titularData && !isLoading) return <p>Titular não encontrado.</p>;

    return(
        <>
        <SideBar name={`Lista de Titulares > ${titularData?.nome || 'Detalhes'}`}/>

        <TitularContainer>
            <TitularHeader>
                <TitularData>
                    <h5>{titularData?.nome}</h5>
                    <p>CPF: {titularData?.cpf}</p>
                    <p>Telefone: {titularData?.telefone}</p>
                    <p>Endereço: {titularData?.endereco}</p>
                </TitularData>
                
                <TitularStats>
                    <p>Contratos Ativos:</p>
                    <h4>{contratos.filter(c => c.status === 'Ativo').length}</h4>
                </TitularStats>
            </TitularHeader>

            {/* Cabeçalho da Lista de Contratos */}
            <ContractsGrid>
                <label>ID Túmulo</label>
                <label>Data Início</label>
                <label>Vigência</label>
                <label>Valor</label>
                <label>Status</label>
            </ContractsGrid>

            <ContractsWrapper>
                {!isLoading && 
                    contratos.map((contrato, index) => (
                        <ContractRow key={`${contrato.cpf}-${contrato.id_tumulo}`} $isEven={index % 2 === 0}>
                            <p>#{contrato.id_tumulo}</p>
                            <p>{formatDate(contrato.data_inicio)}</p>
                            <p>{contrato.prazo_vigencia} meses</p>
                            <p>{formatCurrency(contrato.valor)}</p>
                            <StatusBadge $status={contrato.status}>
                                {contrato.status}
                            </StatusBadge>
                        </ContractRow>
                    ))
                }

                {!isLoading && contratos.length === 0 && (
                     <div className="emptyMsg">
                         <p>Nenhum contrato vinculado a este titular.</p>
                     </div>
                )}

                {isLoading && 
                     <div className="loadingWrapper">
                      </div>
                }
            </ContractsWrapper>
        </TitularContainer>
        </>
    )
}

export default TitularView

// ================= STYLES =================

const TitularContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    * {
        color: var(--content-neutrals-primary);
    }
`

const TitularHeader = styled.div`
    max-width: 1920px;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
`

const TitularData = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h5 {
        font: 700 2rem/2.5rem 'At Aero Bold';
        margin-bottom: 0.5rem;
    }

    p {
        font: 400 1rem/1.5rem 'At Aero';
        color: var(--content-neutrals-secondary);
    }
`

const TitularStats = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--brand-primary);
    padding: 1rem 1.5rem;
    border-radius: 8px;

    p {
        font: 700 0.875rem 'At Aero Bold';
        color: #fff;
    }

    h4 {
        font: 700 2rem 'At Aero Bold';
        color: #fff;
        margin: 0;
    }
`

const ContractsGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1rem 0.5rem;
    display: grid;
    /* ID | Data | Vigência | Valor | Status */
    grid-template-columns: 0.8fr 1fr 1fr 1fr 1fr; 
    grid-column-gap: 1.5rem;
    align-items: center;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const ContractsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    .emptyMsg {
        padding: 3rem;
        display: flex;
        justify-content: center;
    }

    .loadingWrapper {
        padding: 3rem;
        display: flex;
        justify-content: center;
    }
`

const ContractRow = styled.div<{ $isEven: boolean }>`
    display: grid;
    grid-template-columns: 0.8fr 1fr 1fr 1fr 1fr; 
    grid-column-gap: 1.5rem;
    min-height: 4rem;
    padding: 0.75rem 0.5rem; 
    align-items: center;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    border-radius: 4px;

    p {
        font: 400 1rem 'At Aero';
    }
`

const StatusBadge = styled.span<{ $status: 'Ativo' | 'Reservado' }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    text-align: center;
    width: fit-content;
    
    background-color: ${({ $status }) => 
        $status === 'Ativo' ? '#22C55E' : 
        $status === 'Reservado' ? '#F59E0B' : 
        '#6B7280'
    };
`