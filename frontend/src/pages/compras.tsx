import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { ICompras } from '../types'; 

// components
import Button from '@/components/Button';
import SecondaryButton from '@/components/SecondaryButton';
import SideBar from '@/base/Sidebar';
import CompraRow from '@/components/CompraRow';
import CompraPopUp from '@/components/CompraPopUp'; // Importando o Modal

const Compras = () => {

    const [compras, setCompras] = useState<ICompras[]>([])
    const [filteredCompras, setFilteredCompras] = useState<ICompras[]>([])
    
    const [isOpen, setisOpen] = useState(false) // Controle do modal
    const [isLoading, setisLoading] = useState(true)

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getCompras = async () => {
        if (!isLoading) setisLoading(true);

        try {
            const { data } = await api.getCompras()
            if (data) {
                setCompras(data);
                setFilteredCompras(data);
            }
        } catch (error) {
            console.error("Erro ao buscar compras:", error)
        } finally {
            setisLoading(false)
        }
    }

    // Função chamada ao fechar o modal
    const OnClosePopUp = async (shouldRefresh?: boolean) => {
        setisOpen(false);
        if (shouldRefresh) {
            await getCompras();
        }
    }

    // Busca inicial
    useEffect(() => {
        getCompras()
    }, [])

    // Lógica de Filtro (Busca por CNPJ ou ID do Evento)
    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = compras.filter((compra) => 
            compra.cnpj.toLowerCase().includes(lowerQuery) || 
            compra.id_evento.toString().includes(lowerQuery)
        );
        setFilteredCompras(filtered);
        setCurrentPage(1); 
    }, [query, compras])

    const totalPages = Math.ceil(filteredCompras.length / maxRows)
    const currentCompras = filteredCompras.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    return (
        <>
            <SideBar name={"Compras"} />
            <ComprasContainer>
                <ComprasTitle>
                    <h5>Compras</h5>

                    <ComprasInteractions>
                        <ComprasFilter>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por CNPJ ou ID do Evento..."
                            />
                            <Button onClick={() => getCompras()}>Atualizar</Button>
                        </ComprasFilter>
                        <span />
                        <SecondaryButton onClick={() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton>

                        {/* Modal de Adição */}
                        <CompraPopUp isOpen={isOpen} onClose={OnClosePopUp} />

                    </ComprasInteractions>

                </ComprasTitle>

                {/* Cabeçalho da Tabela - Grid alinhado com CompraRow */}
                <ComprasGrid>
                    <label>CNPJ</label>
                    <label>Evento</label>
                    <label>Data</label>
                    <label>Hora</label>
                    <label>Qtd</label>
                    <label>Valor</label>
                </ComprasGrid>

                <ComprasWrapper>
                    {!isLoading &&
                        currentCompras.map((compra, index) => {
                            // Chave única composta para o map, pois pode não haver ID único
                            const uniqueKey = `${compra.cnpj}-${compra.id_evento}-${compra.data_compra}-${compra.horario}`;
                            return (
                                <CompraRow
                                    key={uniqueKey}
                                    isEven={index % 2 === 0}
                                    {...compra} // Passa todas as props (cnpj, id_evento, etc)
                                    updateList={getCompras} 
                                />
                            )
                        })
                    }

                    {!isLoading && filteredCompras.length === 0 &&
                        <p className='allRow noCompras'>Nenhuma compra encontrada :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
       
                        </div>
                    }

                </ComprasWrapper>

                <ComprasFooter>
                    <p>{filteredCompras.length} compras encontradas</p>
                    {!isLoading && filteredCompras.length > 0 &&
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
                </ComprasFooter>
            </ComprasContainer>
        </>
    )
}

export default Compras;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const ComprasContainer = styled.div`
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

const ComprasTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const ComprasFilter = styled.div`
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

const ComprasInteractions = styled.div`
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

// GRID DEFINITION: Deve ser idêntico ao definido em CompraRow.tsx
// 1.5fr 0.8fr 1fr 0.8fr 0.6fr 1fr
const ComprasGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* CNPJ | Evento | Data | Hora | Qtd | Valor */
    grid-template-columns: 1.5fr 0.8fr 1fr 0.8fr 0.6fr 1fr; 
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

const ComprasWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px;

    .noCompras{
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

const ComprasFooter = styled.footer`
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