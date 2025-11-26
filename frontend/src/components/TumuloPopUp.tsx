import React from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { ITumuloInput } from '../types'; 

// Components
import Button from './Button'; 
import SecondaryButton from './SecondaryButton'; 

interface TumuloPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

// Interface estendida para o formulário (inclui dados de localização necessários no Backend)
interface ITumuloForm extends ITumuloInput {
    quadra: string;
    setor: string;
    numero: number;
}

export default function TumuloPopUp({ isOpen, onClose }: TumuloPopUpProps) {
    if (!isOpen) {
        return null;
    }

    const { register, handleSubmit } = useForm<ITumuloForm>({
        defaultValues: {
            status: 'Vazio', // Padrão para novos túmulos
            atual: 0
        }
    });

    const postTumulo = async (data: ITumuloForm) => {
        try {
            // Prepara o payload convertendo números corretamente
            const payload = {
                status: data.status,
                tipo: data.tipo,
                capacidade: Number(data.capacidade),
                atual: 0,
                quadra: data.quadra,
                setor: data.setor,
                numero: Number(data.numero)
            };

            await api.createTumulo(payload);
            onClose(true); // Fecha e sinaliza para atualizar a lista
        } catch (err) {
            console.error("Erro ao criar túmulo:", err);
            alert("Erro ao criar túmulo. Verifique os dados.");
        }
    }

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Novo Túmulo</h5>
                    <div className='close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" />
                        </svg>
                    </div>
                </PopUpHeader>
                
                <form onSubmit={handleSubmit(postTumulo)}>
                    <MainPopUp>
                        <FormContainer>
                            {/* Linha 1: Tipo e Capacidade */}
                            <FormRow $columns="2fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="tipo">Tipo de Túmulo</StyledLabel>
                                    <StyledSelect 
                                        id="tipo"
                                        {...register('tipo', { required: true })}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Túmulo Familiar">Túmulo Familiar</option>
                                        <option value="Gaveta">Gaveta</option>
                                        <option value="Mausoléu">Mausoléu</option>
                                        <option value="Túmulo Duplo">Túmulo Duplo</option>
                                    </StyledSelect>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="capacidade">Capacidade</StyledLabel>
                                    <StyledInput 
                                        id="capacidade" 
                                        type="number"
                                        min="1"
                                        {...register('capacidade', { required: true, min: 1 })}
                                        placeholder="Qtd."
                                    />
                                </FormGroup>
                            </FormRow>

                            <Divider />
                            <SectionTitle>Localização</SectionTitle>

                            {/* Linha 3: Localização (Quadra, Setor, Número) */}
                            <FormRow $columns="1fr 1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="quadra">Quadra</StyledLabel>
                                    <StyledInput 
                                        id="quadra" 
                                        type="text" 
                                        {...register('quadra', { required: true })}
                                        placeholder="Ex: A"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="setor">Setor</StyledLabel>
                                    <StyledInput 
                                        id="setor" 
                                        type="text" 
                                        {...register('setor', { required: true })}
                                        placeholder="Ex: Norte"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="numero">Número</StyledLabel>
                                    <StyledInput 
                                        id="numero" 
                                        type="number" 
                                        {...register('numero', { required: true })}
                                        placeholder="Nº"
                                    />
                                </FormGroup>
                            </FormRow>
                        </FormContainer>
                    </MainPopUp>
                    
                    <PopUpFooter>
                        <SecondaryButton onClick={() => onClose()} type="button">Cancelar</SecondaryButton>
                        <Button type="submit">Criar Túmulo</Button>
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
        svg path { fill: var(--content-neutrals-primary) }
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
const SectionTitle = styled.h6` font-size: 1.1rem; font-weight: 700; color: var(--content-neutrals-primary); margin: 0; `;
const Divider = styled.hr` border: 0; border-top: 1px solid var(--outline-neutrals-secondary); margin: 0.5rem 0; `;

const InputStyle = css`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    padding: 0.75rem 1rem; color: var(--content-neutrals-primary);
    font-size: 1rem; width: 100%; border-radius: 4px;
    &:focus { outline: 1px solid var(--brand-primary); }
`;

const StyledInput = styled.input` ${InputStyle} `;
// Reutiliza o mesmo estilo do input para o select
const StyledSelect = styled.select` ${InputStyle} `;