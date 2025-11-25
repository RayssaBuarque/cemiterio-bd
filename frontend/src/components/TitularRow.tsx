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

    const formatCPF = (cpf: string | undefined) => {
        if (!cpf) return '';
        // Remove tudo que não é dígito
        const cleaned = cpf.replace(/\D/g, '');
        // Aplica a máscara XXX.XXX.XXX-XX
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    const formatPhone = (phone: string | undefined) => {
        if (!phone) return '';
        // Remove tudo que não é dígito
        const cleaned = phone.replace(/\D/g, '');
        
        // Verifica se tem 11 dígitos (celular com DDD) ou 10 (fixo com DDD)
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        
        return phone;
    }

    const handleClick = () => {
        router.push(`/titular/${cpf}`);
    }

    return (
        <RowWrapper onClick={handleClick} $isEven={isEven}>
            <p title={cpf}>{formatCPF(cpf)}</p>
            <p title={nome}>{nome}</p>
            <p title={endereco}>{endereco}</p>
            <p title={telefone}>{formatPhone(telefone)}</p>
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