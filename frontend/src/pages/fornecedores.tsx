import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { IFornecedorInput } from '../types';

// components
import Button from '../components/Button';
import SecondaryButton from '../components/SecondaryButton';
import SideBar from '../base/Sidebar';
import FornecedorRow from '@/components/FornecedoresRow'; // Corrigido import para singular padrão
import FornecedorPopUp from '@/components/FornecedoresPopUp';
;

const Fornecedores = () => {

    const [fornecedores, setFornecedores] = useState<IFornecedorInput[]>([])
    const [filteredFornecedores, setFilteredFornecedores] = useState<IFornecedorInput[]>([])
    
    const [isOpen, setisOpen] = useState(false)
    const [isLoading, setisLoading] = useState(true)

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getFornecedores = async () => {
        if (!isLoading) setisLoading(true);

        try {
            const { data } = await api.getFornecedores()
            if (data) {
                setFornecedores(data);
                setFilteredFornecedores(data);
            }
        } catch (error) {
            console.error("Erro ao buscar fornecedores:", error)
        } finally {
            setisLoading(false)
        }
    }

    const OnClosePopUp = async (shouldRefresh?: boolean) => {
        setisOpen(false);
        if (shouldRefresh) {
            await getFornecedores();
        }
    }

    useEffect(() => {
        getFornecedores()
    }, [])

    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = fornecedores.filter((fornecedor) => 
            fornecedor.nome.toLowerCase().includes(lowerQuery) || 
            fornecedor.cnpj.includes(lowerQuery) ||
            fornecedor.endereco.toLowerCase().includes(lowerQuery)
        );
        setFilteredFornecedores(filtered);
        setCurrentPage(1);
    }, [query, fornecedores])

    const totalPages = Math.ceil(filteredFornecedores.length / maxRows)
    const currentFornecedores = filteredFornecedores.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    return (
        <>
            <SideBar name={"Fornecedores"} />
            <FornecedoresContainer>
                <FornecedoresTitle>
                    <h5>Fornecedores</h5>

                    <FornecedoresInteractions>
                        <FornecedoresFilter>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por CNPJ, nome ou endereço..."
                            />
                            <Button onClick={() => getFornecedores()}>Atualizar</Button>
                        </FornecedoresFilter>
                        <span />
                        <SecondaryButton onClick={() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton>

                        <FornecedorPopUp isOpen={isOpen} onClose={OnClosePopUp} />

                    </FornecedoresInteractions>

                </FornecedoresTitle>

                <FornecedoresGrid>
                    <label>CNPJ</label>
                    <label>Nome</label>
                    <label>Telefone</label>
                    <label>Endereço</label>
                </FornecedoresGrid>

                <FornecedoresWrapper>
                    {!isLoading &&
                        currentFornecedores.map((fornecedor, index) => {
                            return (
                                <FornecedorRow
                                    key={fornecedor.cnpj}
                                    isEven={index % 2 === 0}
                                    cnpj={fornecedor.cnpj}
                                    nome={fornecedor.nome}
                                    telefone={fornecedor.telefone}
                                    endereco={fornecedor.endereco}
                                    updateList={getFornecedores} 
                                />
                            )
                        })
                    }

                    {!isLoading && filteredFornecedores.length === 0 &&
                        <p className='allRow noFornecedores'>Nenhum fornecedor encontrado :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
  
                         </div>
                    }

                </FornecedoresWrapper>

                <FornecedoresFooter>
                    <p>{filteredFornecedores.length} fornecedores encontrados</p>
                    {!isLoading && filteredFornecedores.length > 0 &&
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
                </FornecedoresFooter>
            </FornecedoresContainer>
        </>
    )
}

export default Fornecedores;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const FornecedoresContainer = styled.div`
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

const FornecedoresTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const FornecedoresFilter = styled.div`
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

const FornecedoresInteractions = styled.div`
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

// GRID DEFINITION: 4 colunas
const FornecedoresGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* CNPJ | Nome | Telefone | Endereço */
    grid-template-columns: 1.2fr 2fr 1.2fr 2.5fr; 
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

const FornecedoresWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px;

    .noFornecedores{
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

const FornecedoresFooter = styled.footer`
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