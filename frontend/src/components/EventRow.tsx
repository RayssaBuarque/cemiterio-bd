import styled from "styled-components";
import { useRouter } from "next/router";
import { IEventoInput } from "../types";

interface EventRowProps extends IEventoInput {
    isEven: boolean;
}

const EventRow = ({ id_evento, lugar, dia, horario, valor, isEven }: EventRowProps) => {

    const router = useRouter()

    const formatedDate = (dateString: string) => {
        if (!dateString) return '-';
        // Garante que a data seja interpretada corretamente independente do timezone do navegador
        // Divide "2025-05-20" em partes para criar a data localmente ou apenas formatar a string
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    const formatCurrency = (val?: number) => {
        if (val === undefined || val === null) return 'Grátis';
        if (val === 0) return 'Grátis';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    const updateEvent = () => {
        router.push({
            pathname: '/eventoForm',
            query: { id: id_evento }
        })
    }

    return (
        <EventWrapper $isEven={isEven} onClick={updateEvent}>
            <p>#{id_evento}</p>
            <p title={lugar}>{lugar}</p>
            <p>{formatedDate(dia)}</p>
            <p>{horario}</p>
            <p>{formatCurrency(valor)}</p>
        </EventWrapper>
    )
}

export default EventRow;

const EventWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%;
    align-items: center;
    cursor: pointer;
    display: grid;
    /* ID | Lugar | Dia | Horário | Valor */
    grid-template-columns: 0.5fr 3fr 1fr 1fr 1fr; 
    grid-column-gap: 3rem;
    padding: 1rem 0.5rem; 
    min-height: 4rem;
    align-items: center;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 200ms ease-in-out;
    
    &:hover{
        background-color: var(--state-layers-neutrals-primary-008, rgba(0,0,0,0.05));
    }

    p {
        font: 700 1.125rem/1.5rem 'At Aero Bold';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`