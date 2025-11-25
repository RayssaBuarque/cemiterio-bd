import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../services/api";
import { IFalecidoInput } from "../types";
import Button from "./Button";

interface FalecidoRowProps extends IFalecidoInput {
    isEven: boolean;
    updateList: () => void;
}

const FalecidoRow = ({ cpf, nome, data_nascimento, data_falecimento, motivo, id_tumulo, isEven, updateList }: FalecidoRowProps) => {
    
    const [isModalOpen, setisModalOpen] = useState(false);
    const { register, handleSubmit } = useForm<IFalecidoInput>();

    // Helper para formatar data (YYYY-MM-DD -> DD/MM/YYYY)
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = dateString.split('T')[0];
        return date.split('-').reverse().join('/');
    }

    const handleUpdate = async (data: IFalecidoInput) => {
        try {
            // await api.updateFalecido(id, data); // Necessário endpoint de update
            console.log("Atualizando:", data);
            
            await updateList(); 
            setisModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar registro.");
        }
    }

    const handleDelete = async () => {
        if(!confirm(`Deseja remover o registro de ${nome}?`)) return;

        try {
            // await api.deleteFalecido(id);
            console.log("Deletando falecido do túmulo:", id_tumulo);
            await updateList();
            setisModalOpen(false);
        } catch (error) {
            alert("Erro ao deletar registro.");
        }
    }

    return (
        <>
        {isModalOpen &&
            <ModalOverlay onClick={() => setisModalOpen(false)}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Editar Falecido</h5>
                        <div className='close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/></svg>
                        </div>
                    </ModalHeader>
                    
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <MainPopUp>
                            <FormContainer>
                                {/* Linha 1: Nome Completo */}
                                <FormGroup>
                                    <StyledLabel htmlFor="nome">Nome Completo</StyledLabel>
                                    <StyledInput 
                                        id="nome" 
                                        defaultValue={nome}
                                        {...register('nome', { required: true })}
                                    />
                                </FormGroup>

                                {/* Linha 2: Vínculos (Titular e Túmulo) */}
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="cpf">CPF do Titular Responsável</StyledLabel>
                                        <StyledInput 
                                            id="cpf" 
                                            defaultValue={cpf}
                                            {...register('cpf', { required: true })}
                                            placeholder="Apenas números"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="id_tumulo">ID do Túmulo</StyledLabel>
                                        <StyledInput 
                                            id="id_tumulo" 
                                            type="number"
                                            defaultValue={id_tumulo}
                                            {...register('id_tumulo', { required: true })}
                                        />
                                    </FormGroup>
                                </FormRow>

                                {/* Linha 3: Datas */}
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="nascimento">Data de Nascimento</StyledLabel>
                                        <StyledInput 
                                            id="nascimento" 
                                            type="date"
                                            defaultValue={data_nascimento}
                                            {...register('data_nascimento', { required: true })}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="falecimento">Data de Falecimento</StyledLabel>
                                        <StyledInput 
                                            id="falecimento" 
                                            type="date"
                                            defaultValue={data_falecimento}
                                            {...register('data_falecimento', { required: true })}
                                        />
                                    </FormGroup>
                                </FormRow>

                                {/* Linha 4: Motivo */}
                                <FormGroup>
                                    <StyledLabel htmlFor="motivo">Motivo do Falecimento</StyledLabel>
                                    <StyledInput 
                                        id="motivo" 
                                        defaultValue={motivo}
                                        {...register('motivo')}
                                        placeholder="Opcional"
                                    />
                                </FormGroup>

                            </FormContainer>
                        </MainPopUp>
                        
                        <PopUpFooter>
                            <Button onClick={handleDelete} type="button" style={{ backgroundColor: '#F82122' }}>
                                Remover
                            </Button>
                            <Button type="submit">Salvar Alterações</Button>
                        </PopUpFooter>
                    </form>
                </ModalContainer>
            </ModalOverlay>
        }

        {/* Linha da Tabela - Deve bater com FalecidosGrid */}
        <RowWrapper onClick={() => setisModalOpen(true)} $isEven={isEven}>
            <p title={nome}>{nome}</p>
            <p title={cpf}>{cpf}</p>
            <p title={`Túmulo #${id_tumulo}`}>#{id_tumulo}</p>
            <p>{formatDate(data_nascimento)}</p>
            <p>{formatDate(data_falecimento)}</p>
            <p title={motivo || '-'}>{motivo || '-'}</p>
        </RowWrapper>
        </>
    )
}

export default FalecidoRow;

// ================= STYLES =================

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
`

const ModalContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%; max-width: 50rem; padding: 2rem;
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

const PopUpFooter = styled.footer`
    display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
`;

// Grid: 2fr 1.2fr 0.8fr 1fr 1fr 1.5fr
const RowWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%; cursor: pointer; display: grid;
    grid-template-columns: 2fr 1.2fr 0.8fr 1fr 1fr 1.5fr; 
    grid-column-gap: 1rem; padding: 1rem 0.5rem; 
    align-items: center; border-radius: 4px;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 0.2s;
    
    &:hover{ background-color: var(--state-layers-neutrals-primary-008, rgba(255,255,255,0.05)); }
    
    p { 
        font-size: 1rem; color: var(--content-neutrals-primary);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
`