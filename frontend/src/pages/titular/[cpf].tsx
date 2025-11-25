import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// API & Types
import api from "../../services/api";
import { ITitularInput, IContrato, ITumuloInput, IFalecidoInput } from "../../types";
import SideBar from "@/base/Sidebar";

const TitularView = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    // Dados Principais
    const [titularData, setTitularData] = useState<ITitularInput | null>(null);
    
    // Listas Relacionadas
    const [contratos, setContratos] = useState<IContrato[]>([]);
    const [tumulos, setTumulos] = useState<ITumuloInput[]>([]);
    const [falecidos, setFalecidos] = useState<IFalecidoInput[]>([]);

    // Controle de UI
    const [activeTab, setActiveTab] = useState<'contratos' | 'tumulos' | 'falecidos'>('contratos');

    const router = useRouter()
    const { cpf } = router.query

    const fetchData = async() => {
        if (!cpf) return;
        setIsLoading(true)
        try{   
            // 1. Obter dados do Titular
            const { data: titulares } = await api.getTitulares();
            const titular = titulares.find((t: ITitularInput) => t.cpf === cpf);

            if (titular) {
                setTitularData(titular);
                
                // 2. Obter contratos vinculados
                const { data: contratosData } = await api.getContratoPorCpf(String(cpf));
                let contratosArray: IContrato[] = [];

                if (Array.isArray(contratosData)) {
                    contratosArray = contratosData;
                } else if (contratosData) {
                    contratosArray = [contratosData];
                }
                setContratos(contratosArray);

                // 3. Obter Túmulos vinculados (via Contratos)
                // Pega os IDs dos túmulos presentes nos contratos deste titular
                const tumulosIds = contratosArray.map(c => c.id_tumulo);
                if (tumulosIds.length > 0) {
                    const { data: todosTumulos } = await api.getTumulos();
                    const tumulosVinculados = todosTumulos.filter((t: ITumuloInput) => tumulosIds.includes(t.id_tumulo));
                    setTumulos(tumulosVinculados);
                }

                // 4. Obter Falecidos vinculados (via CPF do Titular)
                const { data: todosFalecidos } = await api.getFalecidos();
                const falecidosVinculados = todosFalecidos.filter((f: IFalecidoInput) => f.cpf === cpf);
                setFalecidos(falecidosVinculados);
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

    const formatDate = (dateString: string | number) => {
        if (!dateString) return '-';
        // Se for number (timestamp)
        if (typeof dateString === 'number') return new Date(dateString).toLocaleDateString('pt-BR');
        // Se for string YYYY-MM-DD
        if (dateString.includes('-')) {
            const day = dateString.split('T')[0];
            return day.split('-').reverse().join('/');
        }
        return dateString;
    }


    const formatCPF = (cpf: string | undefined) => {
        if (!cpf) return '';
        // Remove tudo que não é dígito
        const cleaned = cpf.replace(/\D/g, '');
        // Aplica a máscara XXX.XXX.XXX-XX
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    const formatPhone = (phone: string | undefined) => {
        if (!phone) return '';
        // Remove tudo que não é dígito
        const cleaned = phone.replace(/\D/g, '');
        
        // Verifica se tem 11 dígitos (celular com DDD) ou 10 (fixo com DDD)
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        
        return phone;
    }

    if (!titularData && !isLoading) return <p>Titular não encontrado.</p>;

    return(
        <>
        <SideBar name={`Lista de Titulares > ${titularData?.nome || 'Detalhes'}`}/>

        <TitularContainer>
            <TitularHeader>
                <TitularData>
                    <h5>{titularData?.nome}</h5>
                    <p>CPF: {formatCPF(titularData?.cpf)}</p>
                    <p>Telefone: {formatPhone(titularData?.telefone)}</p>
                    <p>Endereço: {titularData?.endereco}</p>
                </TitularData>
                
                <TitularStats>
                    <p>Contratos Ativos:</p>
                    <h4>{contratos.filter(c => c.status === 'Ativo').length}</h4>
                </TitularStats>
            </TitularHeader>

            {/* Navegação por Abas */}
            <TabsWrapper>
                <TabButton 
                    $active={activeTab === 'contratos'} 
                    onClick={() => setActiveTab('contratos')}
                >
                    Contratos ({contratos.length})
                </TabButton>
                <TabButton 
                    $active={activeTab === 'tumulos'} 
                    onClick={() => setActiveTab('tumulos')}
                >
                    Túmulos ({tumulos.length})
                </TabButton>
                <TabButton 
                    $active={activeTab === 'falecidos'} 
                    onClick={() => setActiveTab('falecidos')}
                >
                    Falecidos ({falecidos.length})
                </TabButton>
            </TabsWrapper>

            {/* CONTEÚDO DA ABA: CONTRATOS */}
            {activeTab === 'contratos' && (
                <>
                    <GridHeader $columns="0.8fr 1fr 1fr 1fr 1fr">
                        <label>ID Túmulo</label>
                        <label>Data Início</label>
                        <label>Vigência</label>
                        <label>Valor</label>
                        <label>Status</label>
                    </GridHeader>

                    <ListWrapper>
                        {!isLoading && contratos.map((contrato, index) => (
                            <RowItem key={`${contrato.cpf}-${contrato.id_tumulo}`} $isEven={index % 2 === 0} $columns="0.8fr 1fr 1fr 1fr 1fr">
                                <p>#{contrato.id_tumulo}</p>
                                <p>{formatDate(contrato.data_inicio)}</p>
                                <p>{contrato.prazo_vigencia} meses</p>
                                <p>{formatCurrency(contrato.valor)}</p>
                                <StatusBadge $status={contrato.status}>
                                    {contrato.status}
                                </StatusBadge>
                            </RowItem>
                        ))}
                        {!isLoading && contratos.length === 0 && <div className="emptyMsg"><p>Nenhum contrato.</p></div>}
                    </ListWrapper>
                </>
            )}

            {/* CONTEÚDO DA ABA: TÚMULOS */}
            {activeTab === 'tumulos' && (
                <>
                    <GridHeader $columns="0.5fr 1.5fr 1fr 1fr">
                        <label>ID</label>
                        <label>Tipo</label>
                        <label>Status</label>
                        <label>Capacidade</label>
                    </GridHeader>

                    <ListWrapper>
                        {!isLoading && tumulos.map((tumulo, index) => (
                            <RowItem key={tumulo.id_tumulo} $isEven={index % 2 === 0} $columns="0.5fr 1.5fr 1fr 1fr">
                                <p>#{tumulo.id_tumulo}</p>
                                <p>{tumulo.tipo}</p>
                                <p>{tumulo.status}</p>
                                <p>{tumulo.capacidade}</p>
                            </RowItem>
                        ))}
                        {!isLoading && tumulos.length === 0 && <div className="emptyMsg"><p>Nenhum túmulo vinculado.</p></div>}
                    </ListWrapper>
                </>
            )}

            {/* CONTEÚDO DA ABA: FALECIDOS */}
            {activeTab === 'falecidos' && (
                <>
                    <GridHeader $columns="2fr 0.8fr 1fr 1fr 1.5fr">
                        <label>Nome</label>
                        <label>Túmulo</label>
                        <label>Nascimento</label>
                        <label>Falecimento</label>
                        <label>Motivo</label>
                    </GridHeader>

                    <ListWrapper>
                        {!isLoading && falecidos.map((falecido, index) => (
                            <RowItem key={`${falecido.id_tumulo}-${falecido.nome}`} $isEven={index % 2 === 0} $columns="2fr 0.8fr 1fr 1fr 1.5fr">
                                <p title={falecido.nome}>{falecido.nome}</p>
                                <p>#{falecido.id_tumulo}</p>
                                <p>{formatDate(falecido.data_nascimento)}</p>
                                <p>{formatDate(falecido.data_falecimento)}</p>
                                <p title={falecido.motivo}>{falecido.motivo || '-'}</p>
                            </RowItem>
                        ))}
                        {!isLoading && falecidos.length === 0 && <div className="emptyMsg"><p>Nenhum falecido registrado.</p></div>}
                    </ListWrapper>
                </>
            )}

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
    background-color: var(--background-neutrals-inverse);
    padding: 1rem 1.5rem;

    p {
        font: 700 0.875rem 'At Aero Bold';
        color: var(--content-neutrals-inverse); 
    }

    h4 {
        font: 700 2rem 'At Aero Bold';
        color: var(--content-neutrals-inverse);
        margin: 0;
    }
`

// --- TABS STYLES ---

const TabsWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 2rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    margin-bottom: 0.5rem;
`

const TabButton = styled.button<{ $active: boolean }>`
    background: none;
    border: none;
    padding-bottom: 0.75rem;
    font: ${({ $active }) => $active ? "700 1.125rem 'At Aero Bold'" : "700 1.125rem 'At Aero'"};
    color: ${({ $active }) => $active ? 'var(--content-neutrals-secondary)' : 'var(--content-neutrals-tertiary)'};
    border-bottom: 2px solid ${({ $active }) => $active ? 'var(--background-neutrals-inverse)' : 'transparent'};
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        color: var(--content-neutrals-secondary);
    }
`

// --- LIST STYLES (Reusable for all tabs) ---

const GridHeader = styled.div<{ $columns: string }>`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1rem 0.5rem;
    display: grid;
    grid-template-columns: ${({ $columns }) => $columns};
    grid-column-gap: 1.5rem;
    align-items: center;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const ListWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;

    .emptyMsg {
        padding: 3rem;
        display: flex;
        justify-content: center;
        color: var(--content-neutrals-secondary);
    }
`

const RowItem = styled.div<{ $isEven: boolean, $columns: string }>`
    display: grid;
    grid-template-columns: ${({ $columns }) => $columns};
    grid-column-gap: 1.5rem;
    min-height: 4rem;
    padding: 0.75rem 0.5rem; 
    align-items: center;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};

    p {
        font: 400 1rem 'At Aero';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const StatusBadge = styled.span<{ $status: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
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