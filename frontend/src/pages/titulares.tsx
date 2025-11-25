import styled from "styled-components";
import { useState, useEffect } from "react";

// Components
import Button from "@/components/Button";
import Image from "next/image";
import TitularRow from "@/components/TitularRow";
import Pagination from "../components/Paginantion"; // Assumindo que o componente Pagination existe conforme o exemplo
import SecondaryButton from "@/components/SecondaryButton";

// API
import api from "../services/api";
import { ITitularInput } from "../types";
import SideBar from "@/base/Sidebar";

const Titulares = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [titulares, setTitulares] = useState<ITitularInput[]>([])
    const [filteredTitulares, setFilteredTitulares] = useState<ITitularInput[]>([])
    const [maxRows] = useState(11)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')

    const getTitulares = async() => {
        setIsLoading(true)
        try {
            const { data } = await api.getTitulares()
            if (data) {
                setTitulares(data)
                setFilteredTitulares(data)
            }
        }
        catch(err){
            console.log("Houve um erro na requisição dos titulares", err)
        }
        finally{
            setIsLoading(false)
        }
    }

    const formatCPF = (cpf: string | undefined) => {
        if (!cpf) return '';
        // Remove tudo que não é dígito
        const cleaned = cpf.replace(/\D/g, '');
        // Aplica a máscara XXX.XXX.XXX-XX
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    const totalPages = Math.ceil(filteredTitulares.length / maxRows)
    const currentTitulares = filteredTitulares.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    const handleSearch = (e: string) => {
        const queryLower = e.toLowerCase()
        const filtered = titulares.filter(titular => 
            titular.nome.toLowerCase().includes(queryLower)
            || titular.cpf.includes(queryLower)
        )
        setFilteredTitulares(filtered)
        setCurrentPage(1)
    }

    useEffect(() => {
        getTitulares()
    }, [])

    return (
        <>
            <SideBar name={"Titulares"}/> 

            <TitularesContainer>
                <TitularesTitle>
                    <h5>Titulares</h5>

                    <TitularesInteractions>
                        <TitularesFilter>
                            <input 
                                type="text"
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nome ou CPF...">
                            </input>
                            <Button onClick={() => handleSearch(query)}>Consultar</Button>
                        </TitularesFilter>
                        
                        {/* Botão de adicionar mantido do seu código original */}
                        <SecondaryButton onClick={() => { /* Lógica de modal */ }}>
                            + Adicionar
                        </SecondaryButton>
                    </TitularesInteractions>
                </TitularesTitle>

                <TitularesGrid>
                    <label>CPF</label>
                    <label>Nome</label>
                    <label>Endereço</label>
                    <label>Telefone</label>
                </TitularesGrid>

                <TitularesWrapper>
                    {!isLoading && 
                        currentTitulares.map((titular, index) => {
                            return(
                                <TitularRow
                                    key={titular.cpf}
                                    isEven={index % 2 === 0}
                                    cpf={titular.cpf}
                                    nome={titular.nome}
                                    endereco={titular.endereco || '-'}
                                    telefone={titular.telefone || '-'}
                                />
                            )
                        })
                    }
                    
                    {isLoading && 
                        <div className="allRow">
        
                        </div>
                    }
                </TitularesWrapper> 

                <TitularesFooter>
                    <p>{filteredTitulares.length} titulares encontrados</p>
                        {!isLoading &&
                            filteredTitulares.length > 0 &&
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        }
                </TitularesFooter>  
            </TitularesContainer>
        </>
    )
}

export default Titulares

const TitularesContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    * {
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

        &:hover, &:focus-visible{
            background-color: var(--background-neutrals-secondary);
        }

        &:focus-visible{
            border: 1px solid var(--brand-primary);
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

    button {
        max-width: 10rem;
    }
`

const TitularesGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* CPF | Nome | Endereço | Telefone */
    grid-template-columns: 1fr 2fr 2.5fr 1fr; 
    grid-column-gap: 1.5rem;
    grid-row-gap: 0.75rem; 
    margin-bottom: 0.75rem;

    label {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
    }
`

const TitularesWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

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
    
    p {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }
`