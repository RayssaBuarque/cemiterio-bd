import styled from "styled-components";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

// API & Types
import api from "../services/api";
import { IEventoInput, IFuncionarioInput } from "../types";

// Components
import Button from "@/components/Button";
import SecondaryButton from "@/components/SecondaryButton";
import FuncionarioInput from "@/components/FuncionarioInput";
import SideBar from "@/base/Sidebar";

const EventForm = () => {
    const router = useRouter();
    const { id } = router.query;

    const [isLoading, setIsLoading] = useState(true);
    
    // Funcionários que aparecerão no select (Livres + Já alocados neste evento)
    const [availableFuncionarios, setAvailableFuncionarios] = useState<IFuncionarioInput[]>([]);
    
    // Funcionários selecionados visualmente ("id|nome")
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<string[]>([]);
    
    // Guarda os funcionários originais para garantir que eles apareçam na lista de disponíveis durante a edição
    const [originalFuncionarios, setOriginalFuncionarios] = useState<IFuncionarioInput[]>([]);

    const { register, handleSubmit, watch, reset } = useForm<IEventoInput>();

    // Observa mudanças para disparar a busca de disponibilidade
    const watchedDia = watch("dia");
    const watchedHorario = watch("horario");

    // 1. Busca dados do evento se for edição
    useEffect(() => {
        if (!router.isReady) return;

        const loadEventData = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                // Busca dados do evento
                const { data: eventData } = await api.getEventoPorId(id as string);
                
                if (eventData) {
                    const formattedDate = eventData.dia ? eventData.dia.split('T')[0] : '';
                    
                    reset({
                        lugar: eventData.lugar,
                        dia: formattedDate,
                        horario: eventData.horario,
                        valor: eventData.valor,
                    });

                    // Busca funcionários alocados com tratamento seguro de erro
                    try {
                        const { data: funcData } = await api.getFuncionarioByEvento(id as string);
                        
                        if (funcData && Array.isArray(funcData)) {
                            setOriginalFuncionarios(funcData);
                            const formattedSelected = funcData.map((f: any) => `${f.cpf}|${f.nome}`);
                            setSelectedFuncionarios(formattedSelected);
                        } else {
                            setOriginalFuncionarios([]);
                            setSelectedFuncionarios([]);
                        }
                    } catch (funcErr: any) {
                        // Se for 404, significa apenas que não tem funcionários alocados ainda
                        if (funcErr.response && funcErr.response.status === 404) {
                            setOriginalFuncionarios([]);
                            setSelectedFuncionarios([]);
                        } else {
                            console.error("Erro ao buscar funcionários do evento:", funcErr);
                        }
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar evento:", err);
                alert("Erro ao carregar dados do evento.");
            } finally {
                setIsLoading(false);
            }
        };

        loadEventData();
    }, [router.isReady, id, reset]);

    // 2. Busca funcionários disponíveis quando Dia ou Horário mudam
    useEffect(() => {
        const fetchAvailableTeam = async () => {
            if (!watchedDia || !watchedHorario) return;
            
            // Validação básica para evitar chamadas com datas incompletas
            if (watchedDia.length !== 10 || watchedHorario.length !== 5) return;

            try {
                const { data } = await api.getFuncionariosLivres(watchedDia, watchedHorario);
                let combinedList = data || [];

                // Se estivermos editando, reinserimos os funcionários originais na lista de disponíveis
                // Isso corrige o problema deles sumirem do select porque o backend os considera "ocupados" com este evento
                if (originalFuncionarios.length > 0) {
                    const currentIds = new Set(combinedList.map((f: IFuncionarioInput) => f.cpf));
                    const missingOriginals = originalFuncionarios.filter(orig => !currentIds.has(orig.cpf));
                    combinedList = [...combinedList, ...missingOriginals];
                }

                setAvailableFuncionarios(combinedList);
            } catch (err) {
                console.error("Erro ao buscar equipe disponível", err);
            }
        };

        fetchAvailableTeam();
    }, [watchedDia, watchedHorario, originalFuncionarios]);

    // 3. Submit (Create ou Update)
    const submitEvent = async (data: IEventoInput) => {
        // Extrai apenas os IDs (CPFs)
        const funcionariosIds = selectedFuncionarios.map(f => f.split('|')[0]);

        const payload = {
            ...data,
            funcionarios: funcionariosIds
        };

        try {
            if (!id) {
                await api.createEvento(payload);
            } else {
                // await api.updateEvento(id, payload);
                console.log("Update payload:", payload);
                // Exemplo: await api.put(`/eventos/${id}`, payload);
            }
            router.push('/events');
        } catch (err) {
            console.error("Erro ao salvar evento", err);
            alert("Erro ao salvar as informações do evento.");
        }
    };

    // 4. Delete
    const removeEvent = async () => {
        if (!confirm("Deseja realmente excluir este evento?")) return;

        try {
            // await api.deleteEvento(id);
            console.log("Delete simulado para id:", id);
            router.push('/events');
        } catch (err) {
            console.error(err);
            alert("Erro ao deletar evento.");
        }
    };

    return (
        <>
            <SideBar name={`Eventos > ${id ? 'Editar Evento' : 'Adicionar Evento'}`} />
            <FormContainer onClick={(e) => e.stopPropagation()}>
                <FormHeader>
                    <h5>{id ? 'Editar Evento' : 'Adicionar Evento'}</h5>
                </FormHeader>

                {!isLoading && (
                    <form onSubmit={handleSubmit(submitEvent)}>
                        <FormWrapper>
                            <FormGroup>
                                <label htmlFor="lugar">Lugar</label>
                                <input
                                    id="lugar"
                                    type="text"
                                    placeholder="Local do evento..."
                                    {...register('lugar', { required: true })}
                                />
                            </FormGroup>

                            <FormColumn $columns="1fr 1fr 1fr">
                                <FormGroup>
                                    <label htmlFor="dia">Dia</label>
                                    <input
                                        id="dia"
                                        type="date"
                                        {...register('dia', { required: true })}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <label htmlFor="horario">Horário</label>
                                    <input
                                        id="horario"
                                        type="time"
                                        {...register('horario', { required: true })}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <label htmlFor="valor">Valor (R$)</label>
                                    <input
                                        id="valor"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        {...register('valor')}
                                    />
                                </FormGroup>
                            </FormColumn>

                            <FormGroup>
                                <FuncionarioInput
                                    funcionarios={availableFuncionarios}
                                    selectedFuncionarios={selectedFuncionarios}
                                    setSelectedFuncionarios={setSelectedFuncionarios}
                                />
                                {(!watchedDia || !watchedHorario) && (
                                    <small style={{ color: 'var(--content-neutrals-secondary)', marginTop: '0.5rem' }}>
                                        Selecione um dia e horário para ver a equipe disponível.
                                    </small>
                                )}
                            </FormGroup>

                        </FormWrapper>

                        <FormFooter $update={!!id}>
                            {id && (
                                <Cancel>
                                    <Button type="button" style={{ backgroundColor: '#F82122' }} onClick={removeEvent}>
                                        Deletar evento
                                    </Button>
                                </Cancel>
                            )}
                            <FormButtons>
                                <SecondaryButton onClick={() => router.back()} type="button">
                                    Cancelar
                                </SecondaryButton>
                                <Button type="submit">
                                    {id ? 'Salvar Alterações' : 'Adicionar novo evento'}
                                </Button>
                            </FormButtons>
                        </FormFooter>
                    </form>
                )}
            </FormContainer>
        </>
    );
};

export default EventForm;

// ================= STYLES =================

const FormContainer = styled.div`
    width: 100%;
    padding: 2rem;
    max-width: 1920px;
    margin: auto;

    * {
        color: var(--content-neutrals-primary);
    }
`;

const FormHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    align-self: stretch;
    padding-bottom: 1rem;

    h5 {
        color: var(--content-neutrals-primary, #FFF);
        font-size: 2rem;
        font-weight: 700;
        line-height: 2.5rem;
        flex: 1 0 0;
    }
`;

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-block: 1rem;
    gap: 1.5rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
        font: 700 1rem/1.5rem 'At Aero Bold';
    }

    input, select {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        height: 3rem;
        padding: 0.75rem 1rem;
        background-color: transparent;
        transition: all 200ms ease-in-out;
        border: 1px solid var(--content-neutrals-primary);
        color: var(--content-neutrals-primary);
        border-radius: 4px;

        &:hover, &:focus-visible {
            background-color: var(--background-neutrals-secondary);
        }

        &:focus-visible {
            border: 1px solid var(--brand-primary);
            outline: none;
        }
    }
`;

const FormColumn = styled.div<{ $columns: string }>`
    display: grid;
    grid-template-columns: ${({ $columns }) => $columns};
    width: 100%;
    grid-column-gap: 1rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
`;

const FormFooter = styled.div<{ $update: boolean }>`
    margin-top: 1rem;
    gap: 1.5rem;
    display: flex;
    justify-content: ${({ $update }) => ($update ? 'space-between' : 'flex-end')};
`;

const Cancel = styled.div`
    display: flex;
`;

const FormButtons = styled.div`
    display: flex;
    gap: 1.5rem;
`;