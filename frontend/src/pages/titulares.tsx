import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { ITitularInput } from '../types'; // Certifique-se que o caminho está correto

// components
import Button from '../components/Button';
import SecondaryButton from '../components/SecondaryButton';
import SideBar from '../base/Sidebar';
import TitularRow from '@/components/TitularRow';

import Image from 'next/image';

const Titulares = () => {

    // Tipando o estado com a interface fornecida
    const [titulares, setTitulares] = useState<ITitularInput[]>([])
    const [filteredTitulares, setFilteredTitulares] = useState<ITitularInput[]>([])
    
    const [isOpen, setisOpen] = useState(false) // Para abrir modal de criação
    const [isLoading, setisLoading] = useState(true)

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getTitulares = async () => {
        if (!isLoading) setisLoading(true);

        try {
            // A chamada deve corresponder à sua API (api.getTitulares)
            const { data } = await api.getTitulares()
            if (data) {
                setTitulares(data);
                setFilteredTitulares(data);
            }
        } catch (error) {
            console.error("Erro ao buscar titulares:", error)
        } finally {
            setisLoading(false)
        }
    }

    // Busca inicial
    useEffect(() => {
        getTitulares()
    }, [])

    // Lógica de Filtro (Busca por Nome ou CPF)
    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = titulares.filter((titular) => 
            titular.nome.toLowerCase().includes(lowerQuery) || 
            titular.cpf.includes(lowerQuery)
        );
        setFilteredTitulares(filtered);
        setCurrentPage(1); // Reseta para página 1 ao filtrar
    }, [query, titulares])

    // Lógica de Paginação
    const totalPages = Math.ceil(filteredTitulares.length / maxRows)
    const currentTitulares = filteredTitulares.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    return (
        <>
            <SideBar name={"Titulares"} />
            <TitularesContainer>
                <TitularesTitle>
                    <h5>Titulares</h5>

                    <TitularesInteractions>
                        <TitularesFilter>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nome ou CPF..."
                            />
                            <Button onClick={() => getTitulares()}>Atualizar</Button>
                        </TitularesFilter>
                        <span />
                        <SecondaryButton onClick={() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton>

                    </TitularesInteractions>

                </TitularesTitle>

                {/* Cabeçalho da Tabela */}
                <TitularesGrid>
                    <label>CPF</label>
                    <label>Nome</label>
                    <label>Endereço</label>
                    <label>Telefone</label>
                </TitularesGrid>

                <TitularesWrapper>
                    {!isLoading &&
                        currentTitulares.map((titular, index) => {
                            // Renderiza a linha. 
                            // Nota: Você deve criar/adaptar o componente TitularRow para aceitar estas props
                            // e usar o mesmo Grid CSS definido abaixo.
                            return (
                                <TitularRow
                                    key={titular.cpf} // CPF é chave única
                                    isEven={index % 2 === 0}
                                    cpf={titular.cpf}
                                    nome={titular.nome}
                                    endereco={titular.endereco || '-'}
                                    telefone={titular.telefone || '-'}
                                    // Funções de update/delete podem ser passadas aqui
                                    updateList={getTitulares} 
                                />
                            )
                        })
                    }

                    {!isLoading && filteredTitulares.length === 0 &&
                        <p className='allRow noTitulares'>Nenhum titular encontrado :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
         
                        </div>
                    }

                </TitularesWrapper>

                <TitularesFooter>
                    <p>{filteredTitulares.length} titulares encontrados</p>
                    {!isLoading && filteredTitulares.length > 0 &&
                        <Pagination>
                            <Button
                                className={currentPage === 1 ? 'noInteraction' : ''}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            >{"<"}</Button>
                            
                            {/* Lógica simples de paginação (pode ser otimizada para muitos números) */}
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
                </TitularesFooter>
            </TitularesContainer>
        </>
    )
}

export default Titulares;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const TitularesContainer = styled.div`
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

const TitularesTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const TitularesFilter = styled.div`
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

const TitularesInteractions = styled.div`
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
        max-width: 10rem; /* Aumentei um pouco para caber "+ Adicionar" */
    }
`

// GRID DEFINITION: Alterado para comportar as 5 colunas do Titular
// Layout sugerido: CPF (fixo), Nome (flex), RG (fixo), Endereço (flex maior), Telefone (fixo)
const TitularesGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* CPF | Nome | Endereço | Telefone */
    grid-template-columns: 1fr 2fr 2.5fr 1fr; 
    grid-column-gap: 1.5rem;
    align-items: center;
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

const TitularesWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px; /* Evita pulo de layout no loading */

    .noTitulares{
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

const TitularesFooter = styled.footer`
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