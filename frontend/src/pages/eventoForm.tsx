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
    // Estado para controlar os funcionários disponíveis no select (vindos da API)
    const [availableFuncionarios, setAvailableFuncionarios] = useState<IFuncionarioInput[]>([]);
    // Estado para controlar os funcionários selecionados visualmente ("id|nome")
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<string[]>([]);

    const { register, handleSubmit, watch, setValue, reset } = useForm<IEventoInput>();

    // Observa mudanças para disparar a busca de disponibilidade
    const watchedDia = watch("dia");
    const watchedHorario = watch("horario");

    // 1. Busca dados do evento se for edição
    useEffect(() => {
        const getEventData = async () => {
            if (!router.isReady) return;

            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                const { data } = await api.getEventoPorId(id as string)
                if (data) {
                    // Preenche os campos do React Hook Form
                    // Formata a data para YYYY-MM-DD se necessário
                    const formattedDate = data.dia ? data.dia.split('T')[0] : '';
                    
                    reset({
                        lugar: data.lugar,
                        dia: formattedDate,
                        horario: data.horario,
                        valor: data.valor,
                    });
                    
                    try{
                        const res = await api.getFuncionarioByEvento(id as string);
                        // Se o evento já tiver funcionários alocados, popula o estado
                        // Assumindo que data.funcionarios seja um array de objetos { cpf, nome, ... }
                        if (res.data && Array.isArray(res.data)) {
                            const formattedSelected = res.data.map((f: any) => `${f.cpf}|${f.nome}`);
                            setSelectedFuncionarios(formattedSelected);
                        }
                    }
                    catch(err){
                        console.error("Nenhum funcionário alocado para este evento ou erro na busca", err);
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar evento", err);
                alert("Erro ao carregar dados do evento.");
            } finally {
                setIsLoading(false);
            }
        };

        getEventData();
    }, [router.isReady, id, reset]);

    // 2. Busca funcionários disponíveis quando Dia ou Horário mudam
    useEffect(() => {
        const fetchAvailableTeam = async () => {
            if (watchedDia && watchedHorario) {
                try {
                    // Chama a API passando dia e horário para filtrar quem está livre
                    // Nota: Se for edição, a API idealmente deve retornar também os que já estão neste evento
                    const { data } = await api.getFuncionariosLivres(watchedDia, watchedHorario);
                    setAvailableFuncionarios(data || []);
                } catch (err) {
                    console.error("Erro ao buscar equipe disponível", err);
                    // Não limpa o array drasticamente para não quebrar a UX caso seja um erro temporário,
                    // mas em um cenário real poderia setar vazio ou mostrar erro.
                }
            }
        };

        // Debounce simples ou verificação se os campos estão completos
        if (watchedDia && watchedHorario && watchedDia.length === 10 && watchedHorario.length === 5) {
            fetchAvailableTeam();
        }
    }, [watchedDia, watchedHorario]);

    // 3. Submit (Create ou Update)
    const submitEvent = async (data: IEventoInput) => {
        // Extrai apenas os IDs (CPFs) do array de strings "id|nome"
        const funcionariosIds = selectedFuncionarios.map(f => f.split('|')[0]);

        const payload = {
            ...data,
            funcionarios: funcionariosIds // Envia array de IDs para o backend
        };

        try {
            if (!id) {
                await api.createEvento(payload);
            } else {
                // await api.updateEvento(id, payload);
                console.log("Update simulado:", id, payload);
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
                            {/* Linha 1: Lugar */}
                            <FormGroup>
                                <label htmlFor="lugar">Lugar</label>
                                <input
                                    id="lugar"
                                    type="text"
                                    placeholder="Local do evento..."
                                    {...register('lugar', { required: true })}
                                />
                            </FormGroup>

                            {/* Linha 2: Dia, Horário, Valor */}
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

                            {/* Linha 3: Input customizado de Funcionários */}
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