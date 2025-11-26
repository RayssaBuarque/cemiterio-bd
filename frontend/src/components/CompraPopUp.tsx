import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { ICompras, IFornecedorInput, IEventoInput } from '../types';

// Components
import Button from './Button'; 
import SecondaryButton from './SecondaryButton'; 

interface CompraPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

export default function CompraPopUp({ isOpen, onClose }: CompraPopUpProps) {
    const [fornecedoresList, setFornecedoresList] = useState<IFornecedorInput[]>([]);
    const [eventosList, setEventosList] = useState<IEventoInput[]>([]);
    
    const { register, handleSubmit, reset } = useForm<ICompras>();

    // Busca dados para os Selects ao abrir o modal
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [fornecedoresRes, eventosRes] = await Promise.all([
                        api.getFornecedores(),
                        api.getEventos()
                    ]);
                    
                    if (fornecedoresRes.data) setFornecedoresList(fornecedoresRes.data);
                    if (eventosRes.data) setEventosList(eventosRes.data);
                } catch (error) {
                    console.error("Erro ao buscar dados para o formulário", error);
                }
            };
            fetchData();
        }
    }, [isOpen]);

    const postCompra = async (data: ICompras) => {
        try {
            // Garantir tipagem correta dos números
            const payload = {
                ...data,
                id_evento: Number(data.id_evento),
                quantidade: Number(data.quantidade),
                valor: Number(data.valor)
            };

            await api.createCompra(payload);
            reset(); 
            onClose(true); // Fecha e atualiza a lista
        } catch (err) {
            console.error("Erro ao registrar compra:", err);
            alert("Erro ao registrar compra. Verifique os dados.");
        }
    }

    if (!isOpen) return null;

    return (
        <PopUpOverlay onClick={() => onClose()}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <PopUpHeader>
                    <h5>Registrar Nova Compra</h5>
                    <div className='close' onClick={() => onClose()}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/>
                        </svg>
                    </div>
                </PopUpHeader>
                
                <form onSubmit={handleSubmit(postCompra)}>
                    <MainPopUp>
                        <FormContainer>
                            {/* Linha 1: Fornecedor e Evento */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="cnpj">Fornecedor</StyledLabel>
                                    <StyledSelect 
                                        id="cnpj"
                                        {...register('cnpj', { required: true })}
                                    >
                                        <option value="">Selecione um fornecedor...</option>
                                        {fornecedoresList.map((f) => (
                                            <option key={f.cnpj} value={f.cnpj}>
                                                {f.nome} ({f.cnpj})
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="id_evento">Evento</StyledLabel>
                                    <StyledSelect 
                                        id="id_evento" 
                                        {...register('id_evento', { required: true })}
                                    >
                                        <option value="">Selecione um evento...</option>
                                        {eventosList.map((e) => (
                                            <option key={e.id_evento} value={e.id_evento}>
                                                #{e.id_evento} - {e.lugar}
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </FormGroup>
                            </FormRow>

                            {/* Linha 2: Data e Hora */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="data_compra">Data da Compra</StyledLabel>
                                    <StyledInput 
                                        id="data_compra" 
                                        type="date" 
                                        {...register('data_compra', { required: true })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="horario">Horário</StyledLabel>
                                    <StyledInput 
                                        id="horario" 
                                        type="time" 
                                        {...register('horario', { required: true })}
                                    />
                                </FormGroup>
                            </FormRow>

                            {/* Linha 3: Quantidade e Valor */}
                            <FormRow $columns="1fr 1fr">
                                <FormGroup>
                                    <StyledLabel htmlFor="quantidade">Quantidade</StyledLabel>
                                    <StyledInput 
                                        id="quantidade" 
                                        type="number" 
                                        min="1"
                                        {...register('quantidade', { required: true, min: 1 })}
                                        placeholder="Ex: 10"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="valor">Valor Total (R$)</StyledLabel>
                                    <StyledInput 
                                        id="valor" 
                                        type="number" 
                                        step="0.01"
                                        min="0"
                                        {...register('valor', { required: true, min: 0 })}
                                        placeholder="0.00"
                                    />
                                </FormGroup>
                            </FormRow>
                        </FormContainer>
                    </MainPopUp>
                    
                    <PopUpFooter>
                        <SecondaryButton onClick={() => onClose()} type="button">Cancelar</SecondaryButton>
                        <Button type="submit">Registrar</Button>
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