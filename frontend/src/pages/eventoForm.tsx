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
    
    // Lista para o Select (Disponíveis + Já alocados)
    const [availableFuncionarios, setAvailableFuncionarios] = useState<IFuncionarioInput[]>([]);
    
    // Lista visual dos selecionados ["cpf|nome"]
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<string[]>([]);
    
    // Backup dos originais para garantir que apareçam na edição mesmo estando "ocupados"
    const [originalFuncionarios, setOriginalFuncionarios] = useState<IFuncionarioInput[]>([]);

    const { register, handleSubmit, watch, reset } = useForm<IEventoInput>();

    const watchedDia = watch("dia");
    const watchedHorario = watch("horario");

    // 1. Carregar dados (Modo Edição)
    useEffect(() => {
        if (!router.isReady) return;

        const loadEventData = async () => {
            // Se não tiver ID, é modo CRIAÇÃO -> Apenas libera o loading
            if (!id) {
                setIsLoading(false);
                return;
            }

            // Modo EDIÇÃO -> Busca dados
            try {
                const { data: eventData } = await api.getEventoPorId(id as string);
                
                if (eventData) {
                    const formattedDate = eventData.dia ? eventData.dia.split('T')[0] : '';
                    
                    reset({
                        lugar: eventData.lugar,
                        dia: formattedDate,
                        horario: eventData.horario,
                        valor: eventData.valor,
                    });

                    // Busca equipe alocada
                    try {
                        const { data: funcData } = await api.getFuncionarioByEvento(id as string);
                        if (funcData && Array.isArray(funcData)) {
                            setOriginalFuncionarios(funcData);
                            const formattedSelected = funcData.map((f: any) => `${f.cpf}|${f.nome}`);
                            setSelectedFuncionarios(formattedSelected);
                        }
                    } catch (funcErr: any) {
                        // 404 significa sem equipe, não é erro crítico
                        if (funcErr.response?.status !== 404) {
                            console.error("Erro ao buscar equipe:", funcErr);
                        }
                    }
                }
            } catch (err) {
                console.error("Erro ao carregar evento:", err);
                alert("Erro ao carregar dados.");
            } finally {
                setIsLoading(false);
            }
        };

        loadEventData();
    }, [router.isReady, id, reset]);

    // 2. Buscar funcionários disponíveis (Lógica de Escala)
    useEffect(() => {
        const fetchAvailableTeam = async () => {
            // Validação: Só busca se tiver data completa (YYYY-MM-DD) e hora (HH:MM)
            if (!watchedDia || !watchedHorario || watchedDia.length !== 10 || watchedHorario.length !== 5) return;

            try {
                const { data } = await api.getFuncionariosLivres(watchedDia, watchedHorario);
                let combinedList = data.funcionarios_livres || data || []; // Adapte conforme retorno da API

                // Se for edição, reinserir os funcionários que já trabalham neste evento
                if (originalFuncionarios.length > 0) {
                    const currentCpfs = new Set(combinedList.map((f: IFuncionarioInput) => f.cpf));
                    const missingOriginals = originalFuncionarios.filter(orig => !currentCpfs.has(orig.cpf));
                    combinedList = [...combinedList, ...missingOriginals];
                }

                setAvailableFuncionarios(combinedList);
            } catch (err) {
                console.error("Erro ao buscar disponibilidade:", err);
            }
        };

        fetchAvailableTeam();
    }, [watchedDia, watchedHorario, originalFuncionarios]);

    // 3. Submit (Criação ou Atualização)
    const submitEvent = async (data: IEventoInput) => {
        // Extrai CPFs da lista visual "cpf|nome"
        const funcionariosIds = selectedFuncionarios.map(f => f.split('|')[0]);

        const payload = {
            ...data,
            funcionarios: funcionariosIds
        };

        try {
            if (!id) {
                // MODO CRIAÇÃO
                await api.createEvento(payload);
                alert("Evento criado com sucesso!");
            } else {
                // MODO EDIÇÃO (Assumindo rota de update existente ou adaptada)
                // await api.updateEvento(id, payload);
                console.log("Simulando Update:", payload);
                alert("Evento atualizado com sucesso!");
            }
            router.push('/eventos');
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert("Erro ao salvar as informações do evento.");
        }
    };

    // 4. Deletar Evento
    const removeEvent = async () => {
        if (!confirm("Tem certeza que deseja excluir este evento?")) return;
        try {
            // await api.deleteEvento(id);
            console.log("Simulando Delete ID:", id);
            router.push('/eventos');
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
                                    defaultValue={id ? undefined : ""} // Garante input limpo na criação
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
                                {/* Componente de Seleção de Funcionários */}
                                <FuncionarioInput
                                    funcionarios={availableFuncionarios}
                                    selectedFuncionarios={selectedFuncionarios}
                                    setSelectedFuncionarios={setSelectedFuncionarios}
                                />
                                {(!watchedDia || !watchedHorario) && (
                                    <small style={{ color: 'var(--content-neutrals-secondary)', marginTop: '0.5rem' }}>
                                        Selecione dia e horário para ver a equipe disponível.
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
    width: 100%; padding: 2rem; max-width: 1920px; margin: auto;
    * { color: var(--content-neutrals-primary); }
`;

const FormHeader = styled.div`
    display: flex; justify-content: space-between; align-items: center; gap: 1rem;
    align-self: stretch; padding-bottom: 1rem;
    h5 { color: var(--content-neutrals-primary); font-size: 2rem; font-weight: 700; line-height: 2.5rem; }
`;

const FormWrapper = styled.div`
    display: flex; flex-direction: column; padding-block: 1rem; gap: 1.5rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);
`;

const FormGroup = styled.div`
    display: flex; flex-direction: column; gap: 0.5rem;
    label { font: 700 1rem/1.5rem 'At Aero Bold'; }
    input, select {
        font: 400 1rem/1.5rem 'At Aero'; width: 100%; height: 3rem; padding: 0.75rem 1rem;
        background-color: transparent; transition: all 200ms ease-in-out;
        border: 1px solid var(--content-neutrals-primary); border-radius: 4px;
        &:hover, &:focus-visible { background-color: var(--background-neutrals-secondary); }
        &:focus-visible { border: 1px solid var(--brand-primary); outline: none; }
    }
`;

const FormColumn = styled.div<{ $columns: string }>`
    display: grid; grid-template-columns: ${({ $columns }) => $columns};
    width: 100%; grid-column-gap: 1rem;
    @media (max-width: 768px) { grid-template-columns: 1fr; gap: 1rem; }
`;

const FormFooter = styled.div<{ $update: boolean }>`
    margin-top: 1rem; gap: 1.5rem; display: flex;
    justify-content: ${({ $update }) => ($update ? 'space-between' : 'flex-end')};
`;

const Cancel = styled.div` display: flex; `;
const FormButtons = styled.div` display: flex; gap: 1.5rem; `;