import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { IContrato } from '../types'; 

// components
import Button from '@/components/Button';
import SecondaryButton from '@/components/SecondaryButton';
import SideBar from '@/base/Sidebar';
import ContratoRow from '@/components/ContratoRow';
import ContratoPopUp from '@/components/ContratoPopUp'; // Importando o Modal

const Contratos = () => {

    const [contratos, setContratos] = useState<IContrato[]>([])
    const [filteredContratos, setFilteredContratos] = useState<IContrato[]>([])
    
    const [isOpen, setisOpen] = useState(false) // Controle do modal
    const [isLoading, setisLoading] = useState(true)

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getContratos = async () => {
        if (!isLoading) setisLoading(true);

        try {
            const { data } = await api.getContratos()
            if (data) {
                setContratos(data);
                setFilteredContratos(data);
            }
        } catch (error) {
            console.error("Erro ao buscar contratos:", error)
        } finally {
            setisLoading(false)
        }
    }

    // Função chamada ao fechar o modal
    const OnClosePopUp = async (shouldRefresh?: boolean) => {
        setisOpen(false);
        if (shouldRefresh) {
            await getContratos();
        }
    }

    // Busca inicial
    useEffect(() => {
        getContratos()
    }, [])

    // Lógica de Filtro (Busca por CPF ou ID Túmulo)
    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = contratos.filter((contrato) => 
            contrato.cpf.includes(lowerQuery) || 
            contrato.id_tumulo.toString().includes(lowerQuery) ||
            contrato.status.toLowerCase().includes(lowerQuery)
        );
        setFilteredContratos(filtered);
        setCurrentPage(1); 
    }, [query, contratos])

    const totalPages = Math.ceil(filteredContratos.length / maxRows)
    const currentContratos = filteredContratos.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    return (
        <>
            <SideBar name={"Contratos"} />
            <ContratosContainer>
                <ContratosTitle>
                    <h5>Contratos</h5>

                    <ContratosInteractions>
                        <ContratosFilter>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por CPF, ID Túmulo ou Status..."
                            />
                            <Button onClick={() => getContratos()}>Atualizar</Button>
                        </ContratosFilter>
                        <span />
                        <SecondaryButton onClick={() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton>

                        {/* Modal de Adição */}
                        <ContratoPopUp isOpen={isOpen} onClose={OnClosePopUp} />

                    </ContratosInteractions>

                </ContratosTitle>

                {/* Cabeçalho da Tabela */}
                <ContratosGrid>
                    <label>CPF Titular</label>
                    <label>Túmulo</label>
                    <label>Data Início</label>
                    <label>Prazo (Meses)</label>
                    <label>Valor</label>
                    <label style={{textAlign: 'center'}}>Status</label>
                </ContratosGrid>

                <ContratosWrapper>
                    {!isLoading &&
                        currentContratos.map((contrato, index) => {
                            // Chave única composta
                            const uniqueKey = `${contrato.cpf}-${contrato.id_tumulo}`;
                            return (
                                <ContratoRow
                                    key={uniqueKey}
                                    isEven={index % 2 === 0}
                                    {...contrato} 
                                    updateList={getContratos} 
                                />
                            )
                        })
                    }

                    {!isLoading && filteredContratos.length === 0 &&
                        <p className='allRow noContratos'>Nenhum contrato encontrado :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
    
                        </div>
                    }

                </ContratosWrapper>

                <ContratosFooter>
                    <p>{filteredContratos.length} contratos encontrados</p>
                    {!isLoading && filteredContratos.length > 0 &&
                        <Pagination>
                            <Button
                                className={currentPage === 1 ? 'noInteraction' : ''}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            >{"<"}</Button>
                            
                            {Array.from({ length: totalPages }, (_, i) =>
                                <Button
                                    className={currentPage === i + 1 ? '' : 'disabled'}
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                >{i + 1}</Button>
                            )}

                            <Button
                                className={currentPage === totalPages ? 'noInteraction' : ''}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            >{">"}</Button>
                        </Pagination>
                    }
                </ContratosFooter>
            </ContratosContainer>
        </>
    )
}

export default Contratos;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const ContratosContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;

    *{
        color: var(--content-neutrals-primary);
    }
`

const ContratosTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const ContratosFilter = styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;
    align-items: center;
    justify-content: flex-end;
    margin-left: 1.5rem;

    input {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        max-width: 30rem;
        padding: 0.75rem 1rem;
        background-color: transparent;
        transition: all 200ms ease-in-out;
        border: 1px solid var(--content-neutrals-primary);
        border-radius: 4px;

        &:hover, &:focus-visible{
            background-color: var(--background-neutrals-secondary);
        }

        &:focus-visible{
            border: 1px solid var(--brand-primary);
            outline: none;
        }
    }

    button {
        max-width: 8rem;
    }
`

const ContratosInteractions = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 100%;

    span {
        height: 3rem;
        border-left: 1px solid var(--outline-neutrals-secondary);
    }

    button {
        max-width: 10rem;
    }
`

// GRID DEFINITION: 6 Colunas
// CPF (Grande) | ID (Médio) | Data (Médio) | Prazo (Pequeno) | Valor (Médio) | Status (Pequeno)
const ContratosGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* CPF | Túmulo | Data | Prazo | Valor | Status */
    grid-template-columns: 2fr 1fr 1.5fr 1fr 1.5fr 1fr; 
    grid-column-gap: 1rem;
    align-items: center;
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const ContratosWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px;

    .noContratos{
        text-align: center;
        font: 700 1.125rem/1.5rem 'At Aero Bold';
        margin-top: 2rem;
    }

    .allRow{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 5rem;
    }
`

const ContratosFooter = styled.footer`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`

const Pagination = styled.div`
    display: flex;
    gap: 0.75rem;

    button{
        width: 2rem;
        height: 2rem;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }
    .noInteraction{
        color: var(--content-neutrals-primary);
        opacity: 0.5;
        pointer-events: none;
    }

    .disabled{
        background-color: transparent;
        border: 1px solid var(--content-neutrals-primary);
    }
`