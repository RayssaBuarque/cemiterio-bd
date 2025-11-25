import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../services/api";
import { IContrato } from "../types";
import Button from "./Button";

interface ContratoRowProps extends IContrato {
    isEven: boolean;
    updateList: () => void;
}

const ContratoRow = ({ cpf, id_tumulo, data_inicio, valor, prazo_vigencia, status, isEven, updateList }: ContratoRowProps) => {
    
    const [isModalOpen, setisModalOpen] = useState(false);
    const { register, handleSubmit } = useForm<IContrato>();

    // Helpers
    const formatDate = (timestamp: number) => {
        if (!timestamp) return '-';
        // Assumindo timestamp em milissegundos
        return new Date(timestamp).toLocaleDateString('pt-BR');
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    const handleUpdate = async (data: IContrato) => {
        try {
            console.log("Atualizando contrato:", data);
            // await api.updateContrato(cpf, id_tumulo, data);
            await updateList(); 
            setisModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar contrato.");
        }
    }

    const handleDelete = async () => {
        if(!confirm(`Deseja cancelar o contrato do CPF ${cpf} no túmulo ${id_tumulo}?`)) return;

        try {
            // await api.deleteContrato(cpf, id_tumulo);
            console.log("Deletando contrato:", cpf, id_tumulo);
            await updateList();
            setisModalOpen(false);
        } catch (error) {
            alert("Erro ao deletar contrato.");
        }
    }

    return (
        <>
        {isModalOpen &&
            <ModalOverlay onClick={() => setisModalOpen(false)}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Editar Contrato</h5>
                        <div className='close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/></svg>
                        </div>
                    </ModalHeader>
                    
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <MainPopUp>
                            <FormContainer>
                                {/* Linha 1: CPF Titular (Destaque) */}
                                <FormGroup>
                                    <StyledLabel htmlFor="cpf">CPF do Titular</StyledLabel>
                                    <StyledInput 
                                        id="cpf" 
                                        defaultValue={cpf}
                                        readOnly
                                        style={{ opacity: 0.7, cursor: 'not-allowed', fontWeight: 'bold' }}
                                        {...register('cpf')}
                                    />
                                </FormGroup>

                                {/* Linha 2: Túmulo e Status */}
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="id_tumulo">ID do Túmulo</StyledLabel>
                                        <StyledInput 
                                            id="id_tumulo" 
                                            type="number"
                                            defaultValue={id_tumulo}
                                            readOnly
                                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                            {...register('id_tumulo')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="status">Status</StyledLabel>
                                        <StyledSelect id="status" defaultValue={status} {...register('status')}>
                                            <option value="Ativo">Ativo</option>
                                            <option value="Reservado">Reservado</option>
                                        </StyledSelect>
                                    </FormGroup>
                                </FormRow>

                                {/* Linha 3: Valor e Prazo */}
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="valor">Valor do Contrato (R$)</StyledLabel>
                                        <StyledInput 
                                            id="valor" 
                                            type="number"
                                            step="0.01"
                                            defaultValue={valor}
                                            {...register('valor', { required: true })}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="prazo">Prazo de Vigência (Meses)</StyledLabel>
                                        <StyledInput 
                                            id="prazo" 
                                            type="number"
                                            defaultValue={prazo_vigencia}
                                            {...register('prazo_vigencia', { required: true })}
                                        />
                                    </FormGroup>
                                </FormRow>

                            </FormContainer>
                        </MainPopUp>
                        
                        <PopUpFooter>
                            <Button onClick={handleDelete} type="button" style={{ backgroundColor: '#F82122' }}>
                                Cancelar Contrato
                            </Button>
                            <Button type="submit">Salvar Alterações</Button>
                        </PopUpFooter>
                    </form>
                </ModalContainer>
            </ModalOverlay>
        }

        {/* Linha da Tabela */}
        <RowWrapper onClick={() => setisModalOpen(true)} $isEven={isEven}>
            {/* Destaque para CPF */}
            <p className="highlight" title={cpf}>{cpf}</p>
            
            {/* Destaque para Túmulo */}
            <p className="highlight" title={`Túmulo #${id_tumulo}`}>#{id_tumulo}</p>
            
            <p>{formatDate(data_inicio)}</p>
            <p>{prazo_vigencia} meses</p>
            <p>{formatCurrency(valor)}</p>
            
            {/* Badge de Status */}
            <StatusBadge $status={status}>
                {status}
            </StatusBadge>
        </RowWrapper>
        </>
    )
}

export default ContratoRow;

// ================= STYLES =================

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
`

const ModalContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%; max-width: 45rem; padding: 2rem;
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

// Grid: 2fr 1fr 1.5fr 1fr 1.5fr 1fr
const RowWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%; cursor: pointer; display: grid;
    grid-template-columns: 2fr 1fr 1.5fr 1fr 1.5fr 1fr; 
    grid-column-gap: 1rem; padding: 1rem 0.5rem; 
    align-items: center; border-radius: 4px;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 0.2s;
    
    &:hover{ background-color: var(--state-layers-neutrals-primary-008, rgba(255,255,255,0.05)); }
    
    p { 
        font-size: 1rem; color: var(--content-neutrals-primary);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    /* Destaque para as chaves relacionais */
    .highlight {
        font-weight: 700;
        color: var(--brand-primary, #FFF); /* Ou uma cor de destaque da sua paleta */
    }
`

const StatusBadge = styled.div<{ $status: 'Ativo' | 'Reservado' }>`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    width: fit-content;
    margin: 0 auto;
    
    background-color: ${({ $status }) => 
        $status === 'Ativo' ? '#22C55E' :  // Verde
        $status === 'Reservado' ? '#F59E0B' : // Amarelo/Laranja
        '#6B7280' // Default Cinza
    };
`