import React from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { IFuncionarioInput } from '../types';

// Components
import Button from './Button'; // Ajuste o caminho se necessário
import SecondaryButton from './SecondaryButton'; // Ajuste o caminho se necessário

interface FuncionarioPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

export default function FuncionarioPopUp({ isOpen, onClose }: FuncionarioPopUpProps) {
    if (!isOpen) {
        return null;
    }

    const { register, handleSubmit } = useForm<IFuncionarioInput>();

    const postFuncionario = async (data: IFuncionarioInput) => {
        try {
            // Garante que números sejam enviados como números
            const payload = {
                ...data,
                horas_semanais: Number(data.horas_semanais),
                salario: Number(data.salario)
            };

            await api.createFuncionario(payload);
            onClose(true); // Fecha e sinaliza para atualizar a lista
        } catch (err) {
            console.error("Erro ao criar funcionário:", err);
            alert("Erro ao criar funcionário. Verifique os dados.");
        }
    }

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Adicionar Funcionário</h5>
                    <div className='close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" />
                        </svg>
                    </div>
                </PopUpHeader>
                
                <form onSubmit={handleSubmit(postFuncionario)}>
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
                                        placeholder="Nome do funcionário"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="cpf">CPF</StyledLabel>
                                    <StyledInput 
                                        id="cpf" 
                                        type="text"
                                        {...register('cpf', { required: true })}
                                        placeholder="000.000.000-00"
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 2: Função e Modelo de Contrato */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="funcao">Função / Cargo</StyledLabel>
                                    <StyledInput 
                                        id="funcao" 
                                        type="text" 
                                        {...register('funcao', { required: true })}
                                        placeholder="Ex: Zelador"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="modelo_contrato">Modelo Contrato</StyledLabel>
                                    <StyledInput 
                                        id="modelo_contrato" 
                                        type="text" 
                                        {...register('modelo_contrato', { required: true })}
                                        placeholder="Ex: CLT, PJ"
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 3: Horas e Salário */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="horas_semanais">Horas Semanais</StyledLabel>
                                    <StyledInput 
                                        id="horas_semanais" 
                                        type="number" 
                                        {...register('horas_semanais', { required: true, valueAsNumber: true })}
                                        placeholder="Ex: 40"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="salario">Salário (R$)</StyledLabel>
                                    <StyledInput 
                                        id="salario" 
                                        type="number" 
                                        step="0.01"
                                        {...register('salario', { valueAsNumber: true })}
                                        placeholder="0.00"
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const PopUpContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%;
    max-width: 50rem;
    padding: 2rem;
    border: 0.063rem solid var(--outline-neutrals-secondary);
    box-shadow: 0 0.313rem 1rem rgba(0,0,0,0.3);
    color: var(--content-neutrals-primary);
    border-radius: 8px;
`;

const PopUpHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 0.063rem solid var(--outline-neutrals-secondary);

    h5 {
        color: var(--content-neutrals-primary);
        font-size: 2rem;
        font-weight: 700;
        line-height: 2.5rem;
        flex: 1 0 0;
    }

    .close {
        padding: 0.5rem;
        cursor: pointer;   
        svg path {
            fill: var(--content-neutrals-primary)
        }
        transition: opacity 0.2s;
        &:hover { opacity: 0.7; }
    }
`;

const PopUpFooter = styled.footer`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.5rem;
    width: 100%;
    margin-top: 1.5rem;

    button {
        max-width: none;
        padding: 0.75rem 1.5rem;
    }
`;

const MainPopUp = styled.main`
    padding: 1.5rem 0;
    border-bottom: 0.063rem solid var(--outline-neutrals-secondary);
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const FormRow = styled.div<{ $columns?: string }>`
  display: grid;
  gap: 1rem; 
  grid-template-columns: ${(props) => props.$columns || '1fr'};
  
  @media(max-width: 600px) {
      grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column; 
    gap: 0.5rem;
`;

const StyledLabel = styled.label`
    font: 700 1rem/1.5rem 'AT Aero Bold';
    color: var(--content-neutrals-primary);
`;

const InputStyle = css`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    padding: 0.75rem 1rem;
    color: var(--content-neutrals-primary);
    font-size: 1rem;
    width: 100%;
    border-radius: 4px;
    
    &:focus { 
        outline: 1px solid var(--brand-primary); 
    }
`;

const StyledInput = styled.input`
  ${InputStyle}
`;