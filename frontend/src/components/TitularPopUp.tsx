import React from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { ITitularInput } from '../types';

// Components
import Button from './Button'; 
import SecondaryButton from './SecondaryButton'; 

interface TitularPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

export default function TitularPopUp({ isOpen, onClose }: TitularPopUpProps) {
    if (!isOpen) {
        return null;
    }

    const { register, handleSubmit } = useForm<ITitularInput>();

    const postTitular = async (data: ITitularInput) => {
        try {
            // Limpeza básica de formatação se necessário, ou envio direto
            await api.createTitular(data);
            onClose(true); // Fecha e sinaliza refresh
        } catch (err) {
            console.error("Erro ao criar titular:", err);
            alert("Erro ao criar titular. Verifique se o CPF já existe.");
        }
    }

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Adicionar Titular</h5>
                    <div className='close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" />
                        </svg>
                    </div>
                </PopUpHeader>
                
                <form onSubmit={handleSubmit(postTitular)}>
                    <MainPopUp>
                        <FormContainer>
                            {/* Linha 1: Nome e CPF */}
                            <FormRow $columns="2fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="nome">Nome Completo</StyledLabel>
                                    <StyledInput 
                                        id="nome" 
                                        type="text"
                                        {...register('nome', { required: true })}
                                        placeholder="Nome do titular"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="cpf">CPF</StyledLabel>
                                    <StyledInput 
                                        id="cpf" 
                                        type="text"
                                        {...register('cpf', { required: true })}
                                        placeholder="Apenas números"
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 2: RG e Telefone */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="telefone">Telefone</StyledLabel>
                                    <StyledInput 
                                        id="telefone" 
                                        type="text" 
                                        {...register('telefone')}
                                        placeholder="(XX) XXXXX-XXXX"
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 3: Endereço */}
                            <FormGroup>
                                <StyledLabel htmlFor="endereco">Endereço Completo</StyledLabel>
                                <StyledInput 
                                    id="endereco" 
                                    type="text" 
                                    {...register('endereco')}
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
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

const InputStyle = css`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    padding: 0.75rem 1rem; color: var(--content-neutrals-primary);
    font-size: 1rem; width: 100%; border-radius: 4px;
    &:focus { outline: 1px solid var(--brand-primary); }
`;
const StyledInput = styled.input` ${InputStyle} `;