import React from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { IFornecedorInput } from '../types';

// Components
import Button from './Button'; 
import SecondaryButton from './SecondaryButton'; 

interface FornecedorPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

export default function FornecedorPopUp({ isOpen, onClose }: FornecedorPopUpProps) {
    if (!isOpen) {
        return null;
    }

    const { register, handleSubmit } = useForm<IFornecedorInput>();

    const postFornecedor = async (data: IFornecedorInput) => {
        try {
            await api.createFornecedor(data);
            onClose(true); 
        } catch (err) {
            console.error("Erro ao criar fornecedor:", err);
            alert("Erro ao criar fornecedor. Verifique os dados.");
        }
    }

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Adicionar Fornecedor</h5>
                    <div className='close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/>
                        </svg>
                    </div>
                </PopUpHeader>
                
                <form onSubmit={handleSubmit(postFornecedor)}>
                    <MainPopUp>
                        <FormContainer>
                            {/* Linha 1: Nome e CNPJ */}
                            <FormRow $columns="2fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="nome">Razão Social / Nome</StyledLabel>
                                    <StyledInput 
                                        id="nome" 
                                        type="text"
                                        {...register('nome', { required: true })}
                                        placeholder="Nome do fornecedor"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="cnpj">CNPJ</StyledLabel>
                                    <StyledInput 
                                        id="cnpj" 
                                        type="text"
                                        {...register('cnpj', { required: true })}
                                        placeholder="00.000.000/0000-00"
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 2: Telefone e Endereço */}
                            <FormRow $columns="1fr 2fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="telefone">Telefone</StyledLabel>
                                    <StyledInput 
                                        id="telefone" 
                                        type="text" 
                                        {...register('telefone')}
                                        placeholder="(XX) XXXXX-XXXX"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="endereco">Endereço Completo</StyledLabel>
                                    <StyledInput 
                                        id="endereco" 
                                        type="text" 
                                        {...register('endereco', { required: true })}
                                        placeholder="Rua, Número, Bairro, Cidade - UF"
                                    />
                                </FormGroup>
                            </FormRow>
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
`;
const StyledInput = styled.input` ${InputStyle} `;