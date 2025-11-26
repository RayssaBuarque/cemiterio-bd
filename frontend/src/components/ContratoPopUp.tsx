import React, { useEffect, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { IContrato, ITitularInput, ITumuloInput } from '../types';

// Components
import Button from './Button'; 
import SecondaryButton from './SecondaryButton'; 

interface ContratoPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

export default function ContratoPopUp({ isOpen, onClose }: ContratoPopUpProps) {
    const [titularesList, setTitularesList] = useState<ITitularInput[]>([]);
    const [tumulosList, setTumulosList] = useState<ITumuloInput[]>([]);
    
    const { register, handleSubmit, reset } = useForm<IContrato>();

    // Busca dados para os Selects ao abrir o modal
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [titularesRes, tumulosRes] = await Promise.all([
                        api.getTitulares(),
                        api.getTumulos()
                    ]);
                    
                    if (titularesRes.data) setTitularesList(titularesRes.data);
                    if (tumulosRes.data) setTumulosList(tumulosRes.data);
                } catch (error) {
                    console.error("Erro ao buscar dados para seleção", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    
    const tumulosDisponiveis = useMemo(() => {
        return tumulosList.filter(t => t.status === 'Vazio');
    }, [tumulosList]);

   const postContrato = async (data: IContrato) => {
        try {
            // Ajuste de tipagem para envio
            const payload = {
                ...data,
                id_tumulo: Number(data.id_tumulo),
                valor: Number(data.valor),
                prazo_vigencia: Number(data.prazo_vigencia),
                data_inicio: data.data_inicio 
            };

            await api.createContrato(payload);
            

            reset(); 
            onClose(true); 
        } catch (err) {
            console.error("Erro ao criar contrato:", err);
            alert("Erro ao criar contrato. Verifique os dados.");
        }
    }

    if (!isOpen) return null;

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Novo Contrato</h5>
                    <div className='close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/>
                        </svg>
                    </div>
                </PopUpHeader>
                
                <form onSubmit={handleSubmit(postContrato)}>
                    <MainPopUp>
                        <FormContainer>
                            {/* Linha 1: Titular e Túmulo */}
                            <FormRow $columns="1fr 1fr">
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
                                    <StyledLabel htmlFor="id_tumulo">Túmulo (Apenas Livres)</StyledLabel>
                                    <StyledSelect 
                                        id="id_tumulo" 
                                        {...register('id_tumulo', { required: true })}
                                    >
                                        <option value="">Selecione um túmulo...</option>
                                        {tumulosDisponiveis.map((t) => (
                                            <option key={t.id_tumulo} value={t.id_tumulo}>
                                                #{t.id_tumulo} - {t.tipo}
                                            </option>
                                        ))}
                                        {tumulosDisponiveis.length === 0 && (
                                            <option value="" disabled>Sem túmulos livres</option>
                                        )}
                                    </StyledSelect>
                                </FormGroup>
                            </FormRow>

                            {/* Linha 2: Data e Prazo */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="data_inicio">Data Início</StyledLabel>
                                    <StyledInput 
                                        id="data_inicio" 
                                        type="date" 
                                        {...register('data_inicio', { required: true })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="prazo_vigencia">Prazo (Meses)</StyledLabel>
                                    <StyledInput 
                                        id="prazo_vigencia" 
                                        type="number" 
                                        min="1"
                                        {...register('prazo_vigencia', { required: true, min: 1 })}
                                        placeholder="Ex: 12"
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 3: Valor e Status */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="valor">Valor (R$)</StyledLabel>
                                    <StyledInput 
                                        id="valor" 
                                        type="number" 
                                        step="0.01"
                                        min="0"
                                        {...register('valor', { required: true })}
                                        placeholder="0.00"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="status">Status</StyledLabel>
                                    <StyledSelect 
                                        id="status" 
                                        {...register('status', { required: true })}
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Reservado">Reservado</option>
                                    </StyledSelect>
                                </FormGroup>
                            </FormRow>
                        </FormContainer>
                    </MainPopUp>
                    
                    <PopUpFooter>
                        <SecondaryButton onClick={() => onClose()} type="button">Cancelar</SecondaryButton>
                        <Button type="submit">Criar Contrato</Button>
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
`;
const StyledInput = styled.input` ${InputStyle} `;
const StyledSelect = styled.select` ${InputStyle} `;