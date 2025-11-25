import styled from "styled-components";
import { useRouter } from "next/router";

interface TitularRowProps {
    cpf: string;
    nome: string;
    endereco: string;
    telefone: string;
    isEven: boolean;
}

const TitularRow = ({ cpf, nome, endereco, telefone, isEven }: TitularRowProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/titular/${cpf}`);
    }

    return (
        <RowWrapper onClick={handleClick} $isEven={isEven}>
            <p title={cpf}>{cpf}</p>
            <p title={nome}>{nome}</p>
            <p title={endereco}>{endereco}</p>
            <p title={telefone}>{telefone}</p>
        </RowWrapper>
    )
}

export default TitularRow;

const RowWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%;
    cursor: pointer;
    display: grid;
    /* CPF | Nome | Endereço | Telefone */
    grid-template-columns: 1fr 2fr 2.5fr 1fr; 
    grid-column-gap: 1.5rem;
    padding: 1rem 0.5rem; 
    align-items: center;
    border-radius: 4px;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 0.2s;
    
    &:hover{
        background-color: var(--state-layers-neutrals-primary-008, rgba(255,255,255,0.05));
    }
    
    p { 
        font-size: 1rem;
        color: var(--content-neutrals-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: 'At Aero', sans-serif;
    }
`