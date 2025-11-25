import styled from "styled-components";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// api
import api from "../services/api";
import { IEventoInput } from "../types";

// components
import Button from "../components/Button";
import SecondaryButton from "../components/SecondaryButton";
import EventRow from "@/components/EventRow";
import SideBar from "@/base/Sidebar";
import Pagination from "@/components/Paginantion";// Assumindo a existência conforme padrões anteriores

const Events = () => {
    const router = useRouter()
    const [isLoading, setisLoading] = useState(true)
    const [events, setEvents] = useState<IEventoInput[]>([])
    const [filteredEvents, setFilteredEvents] = useState<IEventoInput[]>([])

    // Funcionalidades
    const [currentPage, setCurrentPage] = useState(1)
    const [query, setQuery] = useState('')
    const maxRows = 11;

    const getEvents = async() => {
        setisLoading(true)
        try {
            const { data } = await api.getEventos()
            if (data) {
                setEvents(data)
                setFilteredEvents(data)
            }
        }
        catch(err) {
            console.log(err)
        }
        finally {
            setisLoading(false)
        }
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
                <EventsTitle>
                    <h5>Eventos</h5>

                    <EventsInteractions>
                        <EventsFilter>
                            <input 
                                type="text"
                                onChange={(e) => setQuery(e.target.value)} 
                                placeholder="Buscar por ID ou Lugar...">
                            </input>
                            <Button onClick={() => handleSearch(query)}>Consultar</Button>
                        </EventsFilter>
                        <span/>
                        <SecondaryButton onClick={() => router.push({pathname: '/eventForm'})}>
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
                            {/* Loading placeholder */}
                        </div>
                    }

                </EventsWrapper>

                <EventsFooter>
                    <p>{filteredEvents.length} eventos encontrados</p>
                    {!isLoading && filteredEvents.length > 0 &&
                        <Pagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                        />
                    }
                </EventsFooter>
            </EventsContainer>
        </>    
    )
}

export default Events

// ================= STYLES =================

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

        &:hover, &:focus-visible{ background-color: var(--background-neutrals-secondary); }
        &:focus-visible{ border: 1px solid var(--brand-primary); }
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

    label { font: 700 1.125rem/1.5rem 'At Aero Bold'; }
`

const EventsWrapper = styled.div`
    width: 100%; display: flex; flex-direction: column;
    padding-bottom: 0.75rem; margin-bottom: 1rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    .noEvents{ text-align: center; font: 700 1.125rem/1.5rem 'At Aero Bold'; margin-top: 2rem; }
    .allRow{ display: flex; justify-content: center; align-items: center; width: 100%; padding: 5rem; }
`

const EventsFooter = styled.footer`
    width: 100%; display: flex; justify-content: space-between;
    p { font: 700 1rem/1.5rem 'At Aero Bold'; }
`