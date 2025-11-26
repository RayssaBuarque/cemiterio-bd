import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { ITumuloInput } from '../types';

// components
import Button from '../components/Button';
import SecondaryButton from '../components/SecondaryButton';
import SideBar from '../base/Sidebar';
import TumuloRow from '../components/TumuloRow';
import TumuloPopUp from '../components/TumuloPopUp'; 

const Tumulos = () => {

    // Estado tipado com a interface de Túmulos
    const [tumulos, setTumulos] = useState<ITumuloInput[]>([])
    const [filteredTumulos, setFilteredTumulos] = useState<ITumuloInput[]>([])
    
    const [isOpen, setisOpen] = useState(false)
    const [isLoading, setisLoading] = useState(true)

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getTumulos = async () => {
        if (!isLoading) setisLoading(true);

        try {
            const { data } = await api.getTumulos()
            if (data) {
                setTumulos(data);
                setFilteredTumulos(data);
            }
        } catch (error) {
            console.error("Erro ao buscar túmulos:", error)
        } finally {
            setisLoading(false)
        }
    }

    const handleClosePopUp = (refresh?: boolean) => {
        setisOpen(false);
        if (refresh) {
            getTumulos();
        }
    }

    // Busca inicial
    useEffect(() => {
        getTumulos()
    }, [])

    // Lógica de Filtro (Busca por ID, Tipo ou Status)
    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = tumulos.filter((tumulo) => 
            tumulo.id_tumulo.toString().includes(lowerQuery) || 
            tumulo.tipo.toLowerCase().includes(lowerQuery) ||
            tumulo.status.toLowerCase().includes(lowerQuery)
        );
        setFilteredTumulos(filtered);
        setCurrentPage(1); // Reseta para página 1 ao filtrar
    }, [query, tumulos])

    // Lógica de Paginação
    const totalPages = Math.ceil(filteredTumulos.length / maxRows)
    const currentTumulos = filteredTumulos.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    return (
        <>
            <SideBar name={"Túmulos"} />
            <TumulosContainer>
                <TumulosTitle>
                    <h5>Túmulos</h5>

                    <TumulosInteractions>
                        <TumulosFilter>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por ID, tipo ou status..."
                            />
                            <Button onClick={() => getTumulos()}>Atualizar</Button>
                        </TumulosFilter>
                        <span />
                        <SecondaryButton onClick={() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton>
                    </TumulosInteractions>
                </TumulosTitle>

                {/* Cabeçalho da Tabela */}
                <TumulosGrid>
                    <label>ID</label>
                    <label>Tipo</label>
                    <label>Status</label>
                    <label>Capacidade</label>
                    <label>Atual</label>
                </TumulosGrid>

                <TumulosWrapper>
                    {!isLoading &&
                        currentTumulos.map((tumulo, index) => {
                            return (
                                <TumuloRow
                                    key={tumulo.id_tumulo}
                                    isEven={index % 2 === 0}
                                    id={tumulo.id_tumulo}
                                    tipo={tumulo.tipo}
                                    status={tumulo.status}
                                    capacidade={tumulo.capacidade}
                                    atual={tumulo.atual}
                                    updateList={getTumulos} 
                                />
                            )
                        })
                    }

                    {!isLoading && filteredTumulos.length === 0 &&
                        <p className='allRow noTumulos'>Nenhum túmulo encontrado :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
                            <p>Carregando...</p>
                        </div>
                    }
                </TumulosWrapper>

                <TumulosFooter>
                    <p>{filteredTumulos.length} túmulos encontrados</p>
                    {!isLoading && filteredTumulos.length > 0 &&
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
                </TumulosFooter>
            </TumulosContainer>

            {/* Injeção do Componente PopUp aqui */}
            <TumuloPopUp 
                isOpen={isOpen} 
                onClose={handleClosePopUp} 
            />
        </>
    )
}

export default Tumulos;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const TumulosGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* ID | Tipo | Status | Capacidade | Atual */
    grid-template-columns: 0.5fr 1.5fr 1fr 0.8fr 0.8fr;
    grid-column-gap: 1.5rem;
    align-items: center;
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--content-neutrals-primary);
    }
`

const TumulosContainer = styled.div`
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

const TumulosTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
    
    h5 {
        font-family: 'At Aero Bold';
        font-size: 1.5rem;
    }
`

const TumulosFilter = styled.div`
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

const TumulosInteractions = styled.div`
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

const TumulosWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px;

    .noTumulos{
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

const TumulosFooter = styled.footer`
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