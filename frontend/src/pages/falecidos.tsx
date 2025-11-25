import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { IFalecidoInput } from '../types'; // Ajuste o caminho conforme necessário

// components
import Button from '@/components/Button';
import SecondaryButton from '@/components/SecondaryButton';
import SideBar from '@/base/Sidebar';
import FalecidoRow from '@/components/FalecidoRow';
import FalecidoPopUp from '@/components/FalecidoPopUp'; // Importando o Modal de Adição

const Falecidos = () => {

    const [falecidos, setFalecidos] = useState<IFalecidoInput[]>([])
    const [filteredFalecidos, setFilteredFalecidos] = useState<IFalecidoInput[]>([])
    
    const [isOpen, setisOpen] = useState(false) // Controle de estado do modal
    const [isLoading, setisLoading] = useState(true)

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

        const getFalecidos = async () => {
        if (!isLoading) setisLoading(true);

        try {
            const { data } = await api.getFalecidos() 
            if (data) {
                setFalecidos(data);
                setFilteredFalecidos(data);
            }
        } catch (error) {
            console.error("Erro ao buscar falecidos:", error)
        } finally {
            setisLoading(false)
        }
    }

    // Função chamada ao fechar o modal. Se refresh for true, recarrega a lista.
    const OnClosePopUp = async (shouldRefresh?: boolean) => {
        setisOpen(false);
        if (shouldRefresh) {
            await getFalecidos();
        }
    }

    // Busca inicial
    useEffect(() => {
        getFalecidos()
    }, [])

    // Lógica de Filtro (Busca por Nome, CPF do Titular ou ID do Túmulo)
    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = falecidos.filter((f) => 
            f.nome.toLowerCase().includes(lowerQuery) || 
            f.cpf.includes(lowerQuery) ||
            f.id_tumulo.toString().includes(lowerQuery)
        );
        setFilteredFalecidos(filtered);
        setCurrentPage(1); 
    }, [query, falecidos])

    // Lógica de Paginação
    const totalPages = Math.ceil(filteredFalecidos.length / maxRows)
    const currentFalecidos = filteredFalecidos.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    return (
        <>
            <SideBar name={"Falecidos"} />
            <FalecidosContainer>
                <FalecidosTitle>
                    <h5>Falecidos</h5>

                    <FalecidosInteractions>
                        <FalecidosFilter>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nome, CPF titular ou túmulo..."
                            />
                            <Button onClick={() => getFalecidos()}>Atualizar</Button>
                        </FalecidosFilter>
                        <span />
                        <SecondaryButton onClick={() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton>

                        {/* Modal de Adição */}
                        <FalecidoPopUp isOpen={isOpen} onClose={OnClosePopUp} />

                    </FalecidosInteractions>

                </FalecidosTitle>

                {/* Cabeçalho da Tabela */}
                <FalecidosGrid>
                    <label>Nome</label>
                    <label>Titular (CPF)</label>
                    <label>Túmulo</label>
                    <label>Nascimento</label>
                    <label>Falecimento</label>
                    <label>Motivo</label>
                </FalecidosGrid>

                <FalecidosWrapper>
                    {!isLoading &&
                        currentFalecidos.map((falecido, index) => {
                            return (
                                <FalecidoRow
                                    // Usando chave composta para garantir unicidade caso não haja ID único explícito
                                    key={`${falecido.id_tumulo}-${falecido.nome}-${falecido.cpf}`}
                                    isEven={index % 2 === 0}
                                    {...falecido} 
                                    updateList={getFalecidos} 
                                />
                            )
                        })
                    }

                    {!isLoading && filteredFalecidos.length === 0 &&
                        <p className='allRow noFalecidos'>Nenhum registro encontrado :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
     
                        </div>
                    }

                </FalecidosWrapper>

                <FalecidosFooter>
                    <p>{filteredFalecidos.length} registros encontrados</p>
                    {!isLoading && filteredFalecidos.length > 0 &&
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
                </FalecidosFooter>
            </FalecidosContainer>
        </>
    )
}

export default Falecidos;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const FalecidosContainer = styled.div`
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

const FalecidosTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const FalecidosFilter = styled.div`
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

const FalecidosInteractions = styled.div`
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

// GRID DEFINITION: 6 colunas
// Nome (Grande) | CPF Titular (Médio) | ID Túmulo (Pequeno) | Nasc (Pequeno) | Falec (Pequeno) | Motivo (Resto)
const FalecidosGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* Nome | Titular | Túmulo | Nasc | Falec | Motivo */
    grid-template-columns: 2fr 1.2fr 0.8fr 1fr 1fr 1.5fr; 
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

const FalecidosWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px;

    .noFalecidos{
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

const FalecidosFooter = styled.footer`
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