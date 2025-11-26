import { useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import { IFuncionarioInput } from '../types'; // Certifique-se que o caminho está correto

// components
import Button from '../components/Button';
import SecondaryButton from '../components/SecondaryButton';
import SideBar from '../base/Sidebar';
import FuncionarioRow from '../components/FuncionarioRow';
import FuncionarioPopUp from '@/components/FuncionarioPopUp'; // Novo componente

import Image from 'next/image';

const Funcionarios = () => {

    const [funcionarios, setFuncionarios] = useState<IFuncionarioInput[]>([])
    const [filteredFuncionarios, setFilteredFuncionarios] = useState<IFuncionarioInput[]>([])
    
    const [isOpen, setisOpen] = useState(false)
    const [isLoading, setisLoading] = useState(true)

    // Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getFuncionarios = async () => {
        if (!isLoading) setisLoading(true);

        try {
            const { data } = await api.getFuncionarios()
            if (data) {
                setFuncionarios(data);
                setFilteredFuncionarios(data);
            }
        } catch (error) {
            console.error("Erro ao buscar funcionários:", error)
        } finally {
            setisLoading(false)
        }
    }

    // Handler para fechar o modal e recarregar a lista se necessário
    const OnClosePopUp = async (shouldRefresh?: boolean) => {
        setisOpen(false);
        if (shouldRefresh) {
            await getFuncionarios();
        }
    }

    // Busca inicial
    useEffect(() => {
        getFuncionarios()
    }, [])

    // Lógica de Filtro (Busca por Nome, CPF ou Função)
    useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = funcionarios.filter((func) => 
            func.nome.toLowerCase().includes(lowerQuery) || 
            func.cpf.includes(lowerQuery) ||
            func.funcao.toLowerCase().includes(lowerQuery)
        );
        setFilteredFuncionarios(filtered);
        setCurrentPage(1);
    }, [query, funcionarios])

    // Lógica de Paginação
    const totalPages = Math.ceil(filteredFuncionarios.length / maxRows)
    const currentFuncionarios = filteredFuncionarios.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    return (
        <>
            <SideBar name={"Funcionários"} />
            <FuncionariosContainer>
                <FuncionariosTitle>
                    <h5>Funcionários</h5>

                    <FuncionariosInteractions>
                        <FuncionariosFilter>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nome, CPF ou função..."
                            />
                            <Button onClick={() => getFuncionarios()}>Atualizar</Button>
                        </FuncionariosFilter>
                        <span />
                        <SecondaryButton onClick={() => setisOpen(true)}>
                            + Adicionar
                        </SecondaryButton>

                        {/* Modal de Adição */}
                        <FuncionarioPopUp isOpen={isOpen} onClose={OnClosePopUp} />

                    </FuncionariosInteractions>

                </FuncionariosTitle>

                {/* Cabeçalho da Tabela - Adaptado para 6 colunas */}
                <FuncionariosGrid>
                    <label>CPF</label>
                    <label>Nome</label>
                    <label>Função</label>
                    <label>Modelo</label>
                    <label>Hrs</label>
                    <label>Salário</label>
                </FuncionariosGrid>

                <FuncionariosWrapper>
                    {!isLoading &&
                        currentFuncionarios.map((func, index) => {
                            return (
                                <FuncionarioRow
                                    key={func.cpf}
                                    isEven={index % 2 === 0}
                                    cpf={func.cpf}
                                    nome={func.nome}
                                    funcao={func.funcao}
                                    modelo_contrato={func.modelo_contrato}
                                    horas_semanais={func.horas_semanais}
                                    salario={func.salario}
                                    updateList={getFuncionarios} 
                                />
                            )
                        })
                    }

                    {!isLoading && filteredFuncionarios.length === 0 &&
                        <p className='allRow noFuncionarios'>Nenhum funcionário encontrado :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
   
                        </div>
                    }

                </FuncionariosWrapper>

                <FuncionariosFooter>
                    <p>{filteredFuncionarios.length} funcionários encontrados</p>
                    {!isLoading && filteredFuncionarios.length > 0 &&
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
                </FuncionariosFooter>
            </FuncionariosContainer>
        </>
    )
}

export default Funcionarios;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const FuncionariosContainer = styled.div`
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

const FuncionariosTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
`

const FuncionariosFilter = styled.div`
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

const FuncionariosInteractions = styled.div`
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
// CPF (pequeno) | Nome (flex) | Função (médio) | Modelo (pequeno) | Hrs (mini) | Salário (pequeno)
const FuncionariosGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* CPF | Nome | Função | Modelo | Hrs | Salário */
    grid-template-columns: 0.8fr 2fr 1.2fr 1fr 0.5fr 0.8fr; 
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

const FuncionariosWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px;

    .noFuncionarios{
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

const FuncionariosFooter = styled.footer`
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