import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// api
import api from "../services/api";
import { IEventoInput } from "../types";

// components
import Button from "../components/Button";
import SecondaryButton from "../components/SecondaryButton";
import EventRow from "@/components/EventRow";
import SideBar from "@/base/Sidebar";

const Events = () => {
    const router = useRouter()
    const [isLoading, setisLoading] = useState(true)
    const [events, setEvents] = useState<IEventoInput[]>([])
    const [filteredEvents, setFilteredEvents] = useState<IEventoInput[]>([])

    // Estado para o Feedback (Toast)
    const [showFeedback, setShowFeedback] = useState(false);

    // Funcionalidades de Paginação e Filtro
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getEvents = async() => {
        setisLoading(true)
        try {
            const { data } = await api.getEventos()
            if (data) {
                // ORDENAÇÃO: Data mais recente primeiro (Decrescente)
                const sortedData = data.sort((a: IEventoInput, b: IEventoInput) => {
                    const dateA = new Date(a.dia).getTime();
                    const dateB = new Date(b.dia).getTime();
                    
                    // Se as datas forem iguais, desempata pelo horário
                    if (dateA === dateB) {
                        return (b.horario || '').localeCompare(a.horario || '');
                    }
                    return dateB - dateA; 
                });

                setEvents(sortedData)
                setFilteredEvents(sortedData)
            }
        }
        catch(err) {
            console.log(err)
        }
        finally {
            setisLoading(false)
        }
    }

    // Função para atualizar a lista e mostrar feedback (passada para EventRow)
    const handleUpdate = async () => {
        await getEvents();
        setShowFeedback(true);
        setTimeout(() => {
            setShowFeedback(false);
        }, 3000);
    }

    useEffect(() => {
        getEvents()
    }, [])

    const totalPages = Math.ceil(filteredEvents.length / maxRows)
    const currentEvents = filteredEvents.slice(
        (currentPage - 1) * maxRows,
        currentPage * maxRows
    )

    const handleSearch = (e: string) => {
        const queryLower = e.toLowerCase()
        const filtered = events.filter(event => 
            event.lugar.toLowerCase().includes(queryLower) ||
            event.id_evento.toString().includes(queryLower)
        )
        setFilteredEvents(filtered)
        setCurrentPage(1)
    }

    useEffect(() => {
        handleSearch(query)
    }, [query, events])

    return (
        <>
            <SideBar name="Eventos"/>

            <EventsContainer>
                {/* COMPONENTE DE FEEDBACK */}
                {showFeedback && (
                    <ToastMessage>
                        <span>✅</span> Lista atualizada com sucesso!
                    </ToastMessage>
                )}

                <EventsTitle>
                    <h5>Eventos</h5>

                    <EventsInteractions>
                        <EventsFilter>
                            <input 
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)} 
                                placeholder="Buscar por ID ou Lugar...">
                            </input>
                            <Button onClick={() => handleSearch(query)}>Consultar</Button>
                        </EventsFilter>
                        <span/>
                        {/* Mantive a navegação por rota conforme seu código original */}
                        <SecondaryButton onClick={() => router.push({pathname: '/eventoForm'})}>
                            + Adicionar
                        </SecondaryButton> 
                    </EventsInteractions>

                </EventsTitle>

                {/* Grid Atualizado com coluna Equipe */}
                <EventsGrid>
                    <label>ID</label>
                    <label>Lugar</label>
                    <label>Equipe</label>
                    <label>Dia</label>
                    <label>Horário</label>
                    <label>Valor</label>
                </EventsGrid>

                <EventsWrapper>
                    {!isLoading &&
                        currentEvents.map((event, index) => {
                            return (
                                <EventRow
                                    key={event.id_evento}
                                    isEven={index % 2 === 0}
                                    {...event}
                                /> 
                            )
                        })
                    }

                    {!isLoading && events.length === 0 &&
                        <p className='allRow noEvents'>Sem eventos cadastrados :(</p>
                    }

                    {isLoading &&
                        <div className="allRow">
                            <p>Carregando...</p>
                        </div>
                    }

                </EventsWrapper>

                <EventsFooter>
                    <p>{filteredEvents.length} eventos encontrados</p>
                    {!isLoading && filteredEvents.length > 0 &&
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
                </EventsFooter>
            </EventsContainer>
        </>    
    )
}

export default Events

// ================= STYLES =================

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

const EventsContainer = styled.div`
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    align-items: center;

    * { color: var(--content-neutrals-primary); }
`

const EventsTitle = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; margin-bottom: 1.5rem;
`

const EventsFilter = styled.div`
    display: flex; gap: 0.5rem; width: 100%; align-items: center;
    justify-content: flex-end; margin-left: 1.5rem;

    input {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%; max-width: 30rem; padding: 0.75rem 1rem;
        background-color: transparent; transition: all 200ms ease-in-out;
        border: 1px solid var(--content-neutrals-primary);
        border-radius: 4px;

        &:hover, &:focus-visible{ background-color: var(--background-neutrals-secondary); }
        &:focus-visible{ border: 1px solid var(--brand-primary); outline: none; }
    }

    button { max-width: 8rem; }
`

const EventsInteractions = styled.div`
    width: 100%; display: flex; align-items: center; gap: 1rem; height: 100%;
    span { height: 3rem; border-left: 1px solid var(--outline-neutrals-secondary); }
    button { max-width: 8rem; }
`

// Grid ajustado para 6 colunas: ID | Lugar | Equipe | Dia | Horário | Valor
const EventsGrid = styled.div`
    width: 100%;
    border-block: 1px solid var(--outline-neutrals-secondary);
    padding: 1.5rem 0.5rem;
    display: grid;
    /* ID | Lugar | Equipe | Dia | Horário | Valor */
    grid-template-columns: 0.5fr 2fr 2fr 1fr 1fr 1fr; 
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

const EventsWrapper = styled.div`
    width: 100%; display: flex; flex-direction: column;
    padding-bottom: 0.75rem; margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
    min-height: 200px;

    .noEvents{ text-align: center; font: 700 1.125rem/1.5rem 'At Aero Bold'; margin-top: 2rem; }
    .allRow{ display: flex; justify-content: center; align-items: center; width: 100%; padding: 5rem; }
`

const EventsFooter = styled.footer`
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    p { font: 700 1rem/1.5rem 'At Aero Bold'; }
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