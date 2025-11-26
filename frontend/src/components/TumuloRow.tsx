import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../services/api";

import { ITumuloInput } from "../types";
import Button from "./Button";

interface TumuloRowProps {
    id: number;
    status: 'Vazio' | 'Reservado' | 'Cheio';
    tipo: 'Túmulo Familiar' | 'Gaveta' | 'Mausoléu' | 'Túmulo Duplo';
    capacidade: number;
    atual: number;
    isEven: boolean;
    updateList: () => void;
}

const TumuloRow = ({ id, status, tipo, capacidade, atual, isEven, updateList }: TumuloRowProps) => {
    
    const [isModalOpen, setisModalOpen] = useState(false);
    const { register, handleSubmit } = useForm<ITumuloInput>();

    const handleUpdateTumulo = async (data: ITumuloInput) => {
        try {
            // Adapte a chamada conforme sua API (updateTumulo)
            // await api.updateTumulo(id, data);
            console.log("Atualizando túmulo", id, data);
            
            await updateList(); 
            setisModalOpen(false);
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar túmulo.");
        }
    }

    const handleDeleteTumulo = async () => {
        if(!confirm(`Tem certeza que deseja remover o túmulo #${id}?`)) return;

        try {
            // await api.deleteTumulo(id);
            console.log("Deletando túmulo", id);
            await updateList();
            setisModalOpen(false);
        } catch (error) {
            alert("Erro ao deletar túmulo.");
        }
    }

    // Helper para cores do Status
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Vazio': return '#22C55E'; // Verde
            case 'Cheio': return '#EF4444'; // Vermelho
            case 'Reservado': return '#F59E0B'; // Amarelo
            default: return 'var(--content-neutrals-primary)';
        }
    }

    return (
        
        <>
        {isModalOpen &&
            <ModalOverlay onClick={() => setisModalOpen(false)}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Editar Túmulo #{id}</h5>
                        <div className='close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/></svg>
                        </div>
                    </ModalHeader>
                    
                    <form onSubmit={handleSubmit(handleUpdateTumulo)}>
                        <MainPopUp>
                            <FormContainer>
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="tipo">Tipo de Túmulo</StyledLabel>
                                        <StyledSelect id="tipo" defaultValue={tipo} {...register('tipo')}>
                                            <option value="Túmulo Familiar">Túmulo Familiar</option>
                                            <option value="Gaveta">Gaveta</option>
                                            <option value="Mausoléu">Mausoléu</option>
                                            <option value="Túmulo Duplo">Túmulo Duplo</option>
                                        </StyledSelect>
                                    </FormGroup>
                                    
                                    <FormGroup>
                                        <StyledLabel htmlFor="status">Status</StyledLabel>
                                        <StyledSelect id="status" defaultValue={status} {...register('status')}>
                                            <option value="Vazio">Vazio</option>
                                            <option value="Reservado">Reservado</option>
                                            <option value="Cheio">Cheio</option>
                                        </StyledSelect>
                                    </FormGroup>
                                </FormRow>

                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="capacidade">Capacidade (Nº Corpos)</StyledLabel>
                                        <StyledInput 
                                            id="capacidade" 
                                            type="number" 
                                            min="1"
                                            defaultValue={capacidade}
                                            {...register('capacidade')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="atual">Atual (Nº Corpos)</StyledLabel>
                                        <StyledInput 
                                            id="atual" 
                                            type="number" 
                                            min="0"
                                            max={capacidade}
                                            defaultValue={atual}
                                            {...register('atual')}
                                        />
                                    </FormGroup>
                                </FormRow>
                            </FormContainer>
                        </MainPopUp>
                        
                        <PopUpFooter>
                            <Button onClick={handleDeleteTumulo} type="button" style={{ backgroundColor: '#F82122' }}>
                                Remover
                            </Button>
                            <Button type="submit">Salvar Alterações</Button>
                        </PopUpFooter>
                    </form>
                </ModalContainer>
            </ModalOverlay>
        }

        {/* Linha da Tabela - ATUALIZADA com coluna Atual */}
        <TumuloWrapper onClick={() => setisModalOpen(true)} $isEven={isEven}>
            <p className="id-col">#{id}</p>
            <p>{tipo}</p>
            <StatusBadge $color={getStatusColor(status)}>{status}</StatusBadge>
            <p>{capacidade} Pessoas</p>
            <p>{atual}/{capacidade}</p> {/* NOVA COLUNA */}
        </TumuloWrapper>
        </>
    )
}

export default TumuloRow;

// ================= STYLES =================

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
`

const ModalContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%; max-width: 40rem; padding: 2rem;
    box-shadow: 0 0.313rem 1rem rgba(0,0,0,0.3);
    color: var(--content-neutrals-primary); border-radius: 8px;
`

const ModalHeader = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 1rem; border-bottom: 1px solid var(--outline-neutrals-secondary);
    h5 { font-size: 1.5rem; font-weight: 700; }
    .close { cursor: pointer; svg { fill: var(--content-neutrals-primary); } }
`

const MainPopUp = styled.main` padding: 1rem 0; border-bottom: 1px solid var(--outline-neutrals-secondary); `;
const FormContainer = styled.div` display: flex; flex-direction: column; gap: 1rem; `;
const FormRow = styled.div<{ $columns?: string }>` display: grid; gap: 1rem; grid-template-columns: ${(props) => props.$columns || '1fr'}; `;
const FormGroup = styled.div` display: flex; flex-direction: column; gap: 0.5rem; `;
const StyledLabel = styled.label` font-weight: 700; color: var(--content-neutrals-primary); `;

const inputCss = css`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    padding: 0.75rem; color: var(--content-neutrals-primary);
    border-radius: 4px; width: 100%;
    &:focus { outline: 1px solid var(--brand-primary); }
`;
const StyledInput = styled.input` ${inputCss} `;
const StyledSelect = styled.select` ${inputCss} `;

const PopUpFooter = styled.footer`
    display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
`;

// ATUALIZADO: grid-template-columns para 5 colunas (ID, Tipo, Status, Capacidade, Atual)
const TumuloWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%; cursor: pointer; display: grid;
    grid-template-columns: 0.5fr 1.5fr 1fr 0.8fr 0.8fr; /* 5 colunas agora */
    grid-column-gap: 1.5rem; padding: 1rem 0.5rem; 
    align-items: center; border-radius: 4px;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 0.2s;
    
    &:hover{ background-color: var(--state-layers-neutrals-primary-008, rgba(255,255,255,0.05)); }
    
    p { font-size: 1rem; color: var(--content-neutrals-primary); }
    .id-col { font-weight: 700; }
`

const StatusBadge = styled.span<{ $color: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    background-color: ${({ $color }) => $color};
    text-align: center;
    width: fit-content;
`