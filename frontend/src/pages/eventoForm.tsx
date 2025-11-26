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
    const eventId = Array.isArray(id) ? id[0] : id;

    const [isLoading, setIsLoading] = useState(true);
    const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);
    
    // Lista com TODOS os funcionários
    const [allFuncionarios, setAllFuncionarios] = useState<IFuncionarioInput[]>([]);
    
    // Lista visual dos selecionados ["cpf|nome"]
    const [selectedFuncionarios, setSelectedFuncionarios] = useState<string[]>([]);

    const { register, handleSubmit, reset } = useForm<IEventoInput>();

    // 1. Carregar dados (Modo Edição)
    useEffect(() => {
        if (!router.isReady) return;

        const loadEventData = async () => {
            // Se não tiver ID, é modo CRIAÇÃO
            if (!eventId) {
                setIsLoading(false);
                return;
            }

            // Modo EDIÇÃO -> Busca dados do evento
            try {
                console.log("📥 Carregando dados do evento:", eventId);
                const { data: eventData } = await api.getEventoPorId(eventId);
                
                if (eventData) {
                    console.log("✅ Dados do evento recebidos:", eventData);
                    const formattedDate = eventData.dia ? eventData.dia.split('T')[0] : '';
                    
                    reset({
                        lugar: eventData.lugar,
                        dia: formattedDate,
                        horario: eventData.horario,
                        valor: eventData.valor,
                    });

                    // Busca equipe já alocada neste evento
                    try {
                        console.log("👥 Buscando equipe do evento...");
                        const { data: funcData } = await api.getFuncionarioByEvento(eventId);
                        console.log("✅ Equipe recebida:", funcData);
                        
                        if (funcData && Array.isArray(funcData)) {
                            const formattedSelected = funcData.map((f: any) => `${f.cpf}|${f.nome}`);
                            setSelectedFuncionarios(formattedSelected);
                            console.log("👥 Funcionários selecionados definidos:", formattedSelected);
                        }
                    } catch (funcErr: any) {
                        console.log("⚠️ Erro ao buscar equipe:", funcErr);
                        if (funcErr.response?.status !== 404) {
                            console.error("Erro ao buscar equipe:", funcErr);
                        }
                    }
                }
            } catch (err) {
                console.error("❌ Erro ao carregar evento:", err);
                alert("Erro ao carregar dados do evento.");
            } finally {
                setIsLoading(false);
            }
        };

        loadEventData();
    }, [router.isReady, eventId, reset]);

    // 2. Buscar TODOS os funcionários (sem filtro de data/horário)
    useEffect(() => {
        const fetchAllFuncionarios = async () => {
            setLoadingFuncionarios(true);
            try {
                console.log("👥 Buscando TODOS os funcionários...");
                
                // Tenta buscar da rota específica de funcionários primeiro
                let funcionariosData = [];
                
                try {
                    const { data } = await api.getFuncionarios();
                    funcionariosData = data;
                    console.log("✅ Funcionários recebidos via getFuncionarios():", funcionariosData);
                } catch (err) {
                    console.log("⚠️ getFuncionarios() falhou, tentando fallback...");
                    
                    // Fallback: tenta buscar funcionários livres com data fictícia
                    try {
                        const { data } = await api.getFuncionariosLivres('2024-01-01', '00:00');
                        console.log("✅ Funcionários recebidos via fallback:", data);
                        
                        if (Array.isArray(data)) {
                            funcionariosData = data;
                        } else if (data && Array.isArray(data.funcionarios_livres)) {
                            funcionariosData = data.funcionarios_livres;
                        } else if (data && Array.isArray(data.funcionarios)) {
                            funcionariosData = data.funcionarios;
                        }
                    } catch (fallbackErr) {
                        console.error("❌ Fallback também falhou:", fallbackErr);
                    }
                }

                // Garante que é um array
                if (Array.isArray(funcionariosData)) {
                    setAllFuncionarios(funcionariosData);
                    console.log("🎯 Todos funcionários carregados:", funcionariosData.length);
                } else {
                    console.error("❌ Dados não são um array:", funcionariosData);
                    setAllFuncionarios([]);
                }

            } catch (err: any) {
                console.error("❌ Erro ao buscar funcionários:", err);
                console.error("📋 Detalhes do erro:", err.response?.data);
                setAllFuncionarios([]);
            } finally {
                setLoadingFuncionarios(false);
            }
        };

        fetchAllFuncionarios();
    }, []);

    // 3. Submit (Criação ou Atualização)
    const submitEvent = async (data: IEventoInput) => {
        console.log("🚀 Iniciando submit...");
        
        // Extrai CPFs da lista visual "cpf|nome"
        const funcionariosIds = selectedFuncionarios.map(f => f.split('|')[0]);
        console.log("👥 Funcionários selecionados (CPFs):", funcionariosIds);

        const payload = {
            ...data,
            funcionarios: funcionariosIds
        };

        console.log("📦 Payload enviado:", payload);

        try {
            if (!eventId) {
                // MODO CRIAÇÃO
                console.log("➕ Criando novo evento...");
                await api.createEvento(payload);
                alert("Evento criado com sucesso!");
            } else {
                // MODO EDIÇÃO
                console.log("✏️ Atualizando evento:", eventId);
                await api.updateEvento(eventId, payload);
                alert("Evento atualizado com sucesso!");
            }
            router.push('/eventos');
        } catch (err: any) {
            console.error("❌ Erro ao salvar:", err);
            console.error("📋 Detalhes do erro:", err.response?.data);
            alert(`Erro ao salvar evento: ${err.response?.data?.error || err.message}`);
        }
    };

    // 4. Deletar Evento
    const removeEvent = async () => {
        if (!eventId) {
            alert("ID do evento não encontrado");
            return;
        }

        if (!confirm("Tem certeza que deseja excluir este evento?")) return;
        
        try {
            console.log("🗑️ Deletando evento:", eventId);
            await api.deleteEvento(eventId);
            alert("Evento deletado com sucesso!");
            router.push('/eventos');
        } catch (err: any) {
            console.error("❌ Erro ao deletar:", err);
            console.error("📋 Detalhes do erro:", err.response?.data);
            alert(`Erro ao deletar evento: ${err.response?.data?.error || err.message}`);
        }
    };

    if (isLoading) {
        return (
            <>
                <SideBar name={`Eventos > ${eventId ? 'Editar Evento' : 'Adicionar Evento'}`} />
                <FormContainer>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando...
                    </div>
                </FormContainer>
            </>
        );
    }

    return (
        <>
            <SideBar name={`Eventos > ${eventId ? 'Editar Evento' : 'Adicionar Evento'}`} />
            <FormContainer onClick={(e) => e.stopPropagation()}>
                <FormHeader>
                    <h5>{eventId ? 'Editar Evento' : 'Adicionar Evento'}</h5>
                </FormHeader>

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
                            {/* Componente de Seleção de Funcionários */}
                            <FuncionarioInput
                                funcionarios={allFuncionarios}
                                selectedFuncionarios={selectedFuncionarios}
                                setSelectedFuncionarios={setSelectedFuncionarios}
                            />
                            
                            {/* Feedback de status */}
                            {loadingFuncionarios ? (
                                <FeedbackText $type="info">
                                    🔍 Carregando funcionários...
                                </FeedbackText>
                            ) : allFuncionarios.length === 0 ? (
                                <FeedbackText $type="warning">
                                    ⚠️ Nenhum funcionário cadastrado no sistema
                                </FeedbackText>
                            ) : (
                                <FeedbackText $type="success">
                                    ✅ {allFuncionarios.length} funcionário(s) disponível(is) para escalação
                                </FeedbackText>
                            )}
                        </FormGroup>

                    </FormWrapper>

                    <FormFooter $update={!!eventId}>
                        {eventId && (
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
                                {eventId ? 'Salvar Alterações' : 'Adicionar novo evento'}
                            </Button>
                        </FormButtons>
                    </FormFooter>
                </form>
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
    * { color: var(--content-neutrals-primary); }
`;

const FormHeader = styled.div`
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    gap: 1rem;
    align-self: stretch; 
    padding-bottom: 1rem;
    
    h5 { 
        color: var(--content-neutrals-primary); 
        font-size: 2rem; 
        font-weight: 700; 
        line-height: 2.5rem; 
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

const FeedbackText = styled.small<{ $type: 'info' | 'warning' | 'success' }>`
    margin-top: 0.5rem;
    display: block;
    color: ${({ $type }) => 
        $type === 'info' ? 'var(--content-neutrals-secondary)' :
        $type === 'warning' ? 'var(--state-layers-error)' :
        'var(--brand-primary)'
    };
    font-size: 0.875rem;
`;