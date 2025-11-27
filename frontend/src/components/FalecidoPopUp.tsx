import React, { useEffect, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { IFalecidoInput, ITitularInput, ITumuloInput, IContrato } from '../types';

// Components
import Button from './Button'; 
import SecondaryButton from './SecondaryButton'; 

interface FalecidoPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

export default function FalecidoPopUp({ isOpen, onClose }: FalecidoPopUpProps) {
    // Listas completas vindas da API
    const [titularesList, setTitularesList] = useState<ITitularInput[]>([]);
    const [tumulosList, setTumulosList] = useState<ITumuloInput[]>([]);
    const [contratosList, setContratosList] = useState<IContrato[]>([]);
    
    const { register, handleSubmit, reset, watch, setValue } = useForm<IFalecidoInput>();

    // Monitora o CPF selecionado em tempo real
    const selectedCpf = watch('cpf');

    // Busca dados iniciais
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [titularesRes, tumulosRes, contratosRes] = await Promise.all([
                        api.getTitulares(),
                        api.getTumulos(),
                        api.getContratos()
                    ]);
                    
                    if (titularesRes.data) setTitularesList(titularesRes.data);
                    if (tumulosRes.data) setTumulosList(tumulosRes.data);
                    if (contratosRes.data) setContratosList(contratosRes.data);
                } catch (error) {
                    console.error("Erro ao buscar dados para seleção", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    // Lógica de filtragem dos túmulos
    const availableTumulos = useMemo(() => {
    if (!selectedCpf) return [];

    return tumulosList.filter(tumulo => {
        // Validação de propriedades obrigatórias
        if (!tumulo?.id_tumulo || !tumulo?.capacidade) return false;

        const ocupacao = (tumulo as any).ocupacao || 0;
        
        // 1. Remove se estiver cheio (ocupação >= capacidade) ou status 'Cheio'
        if (tumulo.status === 'Cheio' || ocupacao >= tumulo.capacidade) return false;

        // 2. Se for Vazio, não mostra (mantém a lógica original)
        if (tumulo.status === 'Vazio') return false;

        // 3. Se for Reservado, verifica se pertence ao titular selecionado
        if (tumulo.status === 'Reservado') {
            const contratoVinculado = contratosList.find(c => 
                c?.cpf === selectedCpf && 
                c?.id_tumulo === tumulo.id_tumulo &&
                c?.status === 'Ativo'
            );
            return !!contratoVinculado;
        }

        return false;
    });
}, [selectedCpf, tumulosList, contratosList]);

    // Reseta o campo de túmulo se o usuário trocar de titular
    useEffect(() => {
        setValue('id_tumulo', '' as any); 
    }, [selectedCpf, setValue]);

    const postFalecido = async (data: IFalecidoInput) => {
        try {
            const idTumulo = Number(data.id_tumulo);
            const payload = {
            ...data,
            id_tumulo: idTumulo
            };

            console.log("Enviando dados para criar falecido:", payload);

            // APENAS cria o falecido - o backend já cuida de incrementar o túmulo
            await api.createFalecido(payload);

            reset(); 
            onClose(true); 
            
        } catch (err: any) {
            console.error("Erro detalhado ao cadastrar falecido:", err);
            
            // Log mais detalhado do erro
            if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Dados do erro:", err.response.data);
            console.error("Headers:", err.response.headers);
            }
            
            alert(err.response?.data?.error || "Erro ao cadastrar falecido. Verifique os dados.");
        }
    }

    if (!isOpen) return null;

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Adicionar Falecido</h5>
                    <div className='close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/>
                        </svg>
                    </div>
                </PopUpHeader>
                
                <form onSubmit={handleSubmit(postFalecido)}>
                    <MainPopUp>
                        <FormContainer>
                            {/* Linha 1: Nome Completo */}
                            <FormGroup>
                                <StyledLabel htmlFor="nome">Nome Completo</StyledLabel>
                                <StyledInput 
                                    id="nome" 
                                    type="text"
                                    {...register('nome', { required: true })}
                                    placeholder="Nome do falecido"
                                />
                            </FormGroup>

                            {/* Linha 2: Titular e Túmulo */}
                            <FormRow $columns="2fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="cpf">Titular Responsável</StyledLabel>
                                    <StyledSelect 
                                        id="cpf"
                                        {...register('cpf', { required: true })}
                                    >
                                        <option value="">Selecione um titular...</option>
                                        {titularesList.map((t) => (
                                            <option key={t.cpf} value={t.cpf}>
                                                {t.nome} ({t.cpf})
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </FormGroup>
                                
                                <FormGroup>
                                    <StyledLabel htmlFor="id_tumulo">Túmulo Disponível</StyledLabel>
                                    <StyledSelect 
                                        id="id_tumulo" 
                                        disabled={!selectedCpf} // Bloqueia até selecionar CPF
                                        {...register('id_tumulo', { required: true })}
                                    >
                                        <option value="">
                                            {!selectedCpf ? "Selecione um titular primeiro" : "Selecione..."}
                                        </option>
                                        
                                        {availableTumulos.map((t: any) => (
                                            <option key={t.id_tumulo} value={t.id_tumulo}>
                                                #{t.id_tumulo} - {t.tipo} ({t.ocupacao || 0}/{t.capacidade})
                                            </option>
                                        ))}
                                        {availableTumulos.length === 0 && selectedCpf && (
                                            <option value="" disabled>Nenhum túmulo disponível</option>
                                        )}
                                    </StyledSelect>
                                </FormGroup>
                            </FormRow>

                            {/* Linha 3: Datas */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="data_nascimento">Data Nascimento</StyledLabel>
                                    <StyledInput 
                                        id="data_nascimento" 
                                        type="date" 
                                        {...register('data_nascimento', { required: true })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="data_falecimento">Data Falecimento</StyledLabel>
                                    <StyledInput 
                                        id="data_falecimento" 
                                        type="date" 
                                        {...register('data_falecimento', { required: true })}
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 4: Motivo */}
                            <FormGroup>
                                <StyledLabel htmlFor="motivo">Motivo (Opcional)</StyledLabel>
                                <StyledInput 
                                    id="motivo" 
                                    type="text" 
                                    {...register('motivo')}
                                    placeholder="Causa do falecimento"
                                />
                            </FormGroup>
                        </FormContainer>
                    </MainPopUp>
                    
                    <PopUpFooter>
                        <SecondaryButton onClick={() => onClose()} type="button">Cancelar</SecondaryButton>
                        <Button type="submit">Adicionar</Button>
                    </PopUpFooter>
                </form>

            </PopUpContainer>
        </PopUpOverlay>
    );
}

// ================= STYLES =================

const PopUpOverlay = styled.div`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
`;

const PopUpContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%; max-width: 50rem; padding: 2rem;
    border: 0.063rem solid var(--outline-neutrals-secondary);
    box-shadow: 0 0.313rem 1rem rgba(0,0,0,0.3);
    color: var(--content-neutrals-primary); border-radius: 8px;
`;

const PopUpHeader = styled.header`
    display: flex; justify-content: space-between; align-items: center; gap: 1rem;
    padding-bottom: 1rem; border-bottom: 0.063rem solid var(--outline-neutrals-secondary);

    h5 {
        color: var(--content-neutrals-primary); font-size: 2rem; font-weight: 700; line-height: 2.5rem; flex: 1 0 0;
    }

    .close {
        padding: 0.5rem; cursor: pointer;   
        svg { fill: var(--content-neutrals-primary) }
        transition: opacity 0.2s; &:hover { opacity: 0.7; }
    }
`;

const PopUpFooter = styled.footer`
    display: flex; align-items: center; justify-content: flex-end; gap: 1.5rem; width: 100%; margin-top: 1.5rem;
    button { max-width: none; padding: 0.75rem 1.5rem; }
`;

const MainPopUp = styled.main` padding: 1.5rem 0; border-bottom: 0.063rem solid var(--outline-neutrals-secondary); `;
const FormContainer = styled.div` display: flex; flex-direction: column; gap: 1.5rem; `;
const FormRow = styled.div<{ $columns?: string }>` display: grid; gap: 1rem; grid-template-columns: ${(props) => props.$columns || '1fr'}; @media(max-width: 600px) { grid-template-columns: 1fr; }`;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem; `;
const StyledLabel = styled.label` font: 700 1rem/1.5rem 'AT Aero Bold'; color: var(--content-neutrals-primary); `;

const InputStyle = css`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    padding: 0.75rem 1rem; color: var(--content-neutrals-primary);
    font-size: 1rem; width: 100%; border-radius: 4px;
    
    &:focus { outline: 1px solid var(--brand-primary); }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;
const StyledInput = styled.input` ${InputStyle} `;
const StyledSelect = styled.select` ${InputStyle} `;