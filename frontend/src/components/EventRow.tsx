import styled from "styled-components";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { IEventoInput } from "../types"; // Ajuste o caminho conforme sua estrutura de pastas
import api from "../services/api";

interface EventRowProps extends IEventoInput {
    isEven: boolean;
}

const EventRow = ({ id_evento, lugar, dia, horario, valor, isEven }: EventRowProps) => {

    const router = useRouter();
    const [teamNames, setTeamNames] = useState<string>('Carregando...');

    // Formata data YYYY-MM-DD para DD/MM/YYYY
    const formatedDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = dateString.split('T')[0];
        return date.split('-').reverse().join('/');
    }

    // Formata valor monetário
    const formatCurrency = (val?: number) => {
        if (val === undefined || val === null) return 'Grátis';
        if (val === 0) return 'Grátis';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    const updateEvent = () => {
        router.push({
            pathname: '/eventoForm',
            query: {
                id: id_evento
            }
        })
    }

    // Busca funcionários alocados neste evento específico
    useEffect(() => {
        let isMounted = true;

        const fetchTeam = async () => {
            try {
                const { data } = await api.getFuncionarioByEvento(id_evento);
                
                if (isMounted) {
                    if (data && Array.isArray(data) && data.length > 0) {
                        // Pega apenas o primeiro nome para não poluir a tabela
                        const names = data.map((f: any) => f.nome.split(' ')[0]);
                        setTeamNames(names.join(', '));
                    } else {
                        setTeamNames('-');
                    }
                }
            } catch (error: any) {
                if (isMounted) setTeamNames('-');
            }
        };

        fetchTeam();

        return () => { isMounted = false };
    }, [id_evento]);

    return (
        <EventWrapper $isEven={isEven} onClick={updateEvent}>
            <p>#{id_evento}</p>
            <p title={lugar}>{lugar}</p>
            {/* Coluna de Equipe */}
            <p title={teamNames} style={{ color: 'var(--content-neutrals-secondary)' }}>
                {teamNames}
            </p>
            <p>{formatedDate(dia)}</p>
            <p>{horario}</p>
            <p>{formatCurrency(valor)}</p>
        </EventWrapper>
    )
}

export default EventRow;

// O Grid deve bater com o definido na listagem (Events.tsx): 0.5fr 2fr 2fr 1fr 1fr 1fr
const EventWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%;
    align-items: center;
    cursor: pointer;
    display: grid;
    /* ID | Lugar | Equipe | Dia | Horário | Valor */
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1fr 1fr; 
    grid-column-gap: 1rem; padding: 1rem 0.5rem; 
    align-items: center;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 0.2s;
    
    &:hover{ background-color: var(--state-layers-neutrals-primary-008, rgba(255,255,255,0.05)); }
    
    p { 
        font-size: 1rem; color: var(--content-neutrals-primary);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
`