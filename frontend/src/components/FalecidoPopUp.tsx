import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

// Services & Types
import api from '../services/api';
import { IFalecidoInput, ITitularInput, ITumuloInput } from '../types';

// Components
import Button from './Button'; 
import SecondaryButton from './SecondaryButton'; 

interface FalecidoPopUpProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
}

export default function FalecidoPopUp({ isOpen, onClose }: FalecidoPopUpProps) {
    const [titularesList, setTitularesList] = useState<ITitularInput[]>([]);
    const [tumulosList, setTumulosList] = useState<ITumuloInput[]>([]);
    const { register, handleSubmit, reset } = useForm<IFalecidoInput>();


    const formatCPF = (cpf: string | undefined) => {
        if (!cpf) return '';
        // Remove tudo que não é dígito
        const cleaned = cpf.replace(/\D/g, '');
        // Aplica a máscara XXX.XXX.XXX-XX
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }


    // Busca as listas de Titulares e Túmulos para preencher os Selects assim que o modal abre
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    // Faz as requisições em paralelo para performance
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

    const postFalecido = async (data: IFalecidoInput) => {
        try {
            const payload = {
                ...data,
                id_tumulo: Number(data.id_tumulo)
            };

            await api.createFalecido(payload);
            reset(); 
            onClose(true); 
        } catch (err) {
            console.error("Erro ao cadastrar falecido:", err);
            alert("Erro ao cadastrar falecido. Verifique os dados.");
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

                            {/* Linha 2: Titular (Select) e Túmulo (Select) */}
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
                                                {t.nome} ({formatCPF(t.cpf)})
                                            </option>
                                        ))}
                                    </StyledSelect>
                                </FormGroup>
                                <FormGroup>
                                    <StyledLabel htmlFor="id_tumulo">Túmulo</StyledLabel>
                                    <StyledSelect 
                                        id="id_tumulo" 
                                        {...register('id_tumulo', { required: true })}
                                    >
                                        <option value="">Selecione...</option>
                                        {tumulosList.map((t) => (
                                            <option key={t.id_tumulo} value={t.id_tumulo}>
                                                #{t.id_tumulo} - {t.tipo} ({t.status})
                                            </option>
                                        ))}
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
`;
const StyledInput = styled.input` ${InputStyle} `;
const StyledSelect = styled.select` ${InputStyle} `;