import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../services/api';
import { ICompras } from '../types'; 

// components
import Button from '@/components/Button';
import SecondaryButton from '@/components/SecondaryButton';
import SideBar from '@/base/Sidebar';
import CompraRow from '@/components/CompraRow';
import CompraPopUp from '@/components/CompraPopUp'; 

const Compras = () => {

    const [compras, setCompras] = useState<ICompras[]>([])
    const [filteredCompras, setFilteredCompras] = useState<ICompras[]>([])
    
    const [isOpen, setisOpen] = useState(false) 
    const [isLoading, setisLoading] = useState(true)

    // Estado para o Feedback (Toast)
    const [showFeedback, setShowFeedback] = useState(false);

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getCompras = async () => {
        if (!isLoading) setisLoading(true);

        try {
            const { data } = await api.getCompras()
            if (data) {
                // LÓGICA DE ORDENAÇÃO: Mais recentes primeiro
                const sortedData = data.sort((a: ICompras, b: ICompras) => {
                    const dateA = new Date(a.data_compra).getTime();
                    const dateB = new Date(b.data_compra).getTime();
                    // Se as datas forem iguais, tenta desempatar pelo horário (opcional)
                    if (dateA === dateB) {
                        return (b.horario || '').localeCompare(a.horario || '');
                    }
                    return dateB - dateA; // Decrescente
                });

                setCompras(sortedData);
                setFilteredCompras(sortedData);
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
            
            // Ativa o feedback visual
            setShowFeedback(true);
            // Remove o feedback após 3 segundos
            setTimeout(() => {
                setShowFeedback(false);
            }, 3000);
        }
    }

    // Busca inicial
    useEffect(() => {
        getCompras()
    }, [])

    // Lógica de Filtro 
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
                {/* COMPONENTE DE FEEDBACK */}
                {showFeedback && (
                    <ToastMessage>
                        <span>✅</span> Alteração realizada com sucesso!
                    </ToastMessage>
                )}

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

                        <CompraPopUp isOpen={isOpen} onClose={OnClosePopUp} />

                    </ComprasInteractions>

                </ComprasTitle>

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
                            const uniqueKey = `${compra.cnpj}-${compra.id_evento}-${compra.data_compra}-${compra.horario}`;
                            return (
                                <CompraRow
                                    key={uniqueKey}
                                    isEven={index % 2 === 0}
                                    {...compra} 
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
                            <p>Carregando...</p>
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

// Animação para o Toast
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const ToastMessage = styled.div`
    position: fixed;
    top: 2rem;
    right: 2rem;
    background-color: var(--background-neutrals-secondary);
    border-left: 5px solid #4CAF50; /* Verde Sucesso */
    color: var(--content-neutrals-primary);
    padding: 1rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font: 700 1rem 'At Aero Bold';
    animation: ${slideIn} 0.3s ease-out;

    span {
        font-size: 1.2rem;
    }
`;

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