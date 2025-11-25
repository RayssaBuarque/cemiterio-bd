import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../services/api"; // Ajuste o caminho
import { IFuncionarioInput } from "../types"; // Ajuste o caminho
import Button from "./Button";

interface FuncionarioRowProps extends IFuncionarioInput {
    isEven: boolean;
    updateList: () => void;
}

const FuncionarioRow = ({ cpf, nome, funcao, modelo_contrato, horas_semanais, salario, isEven, updateList }: FuncionarioRowProps) => {
    
    const [isModalOpen, setisModalOpen] = useState(false);
    const { register, handleSubmit } = useForm<IFuncionarioInput>();

    // Formata moeda para exibição
    const formatCurrency = (value?: number) => {
        if (value === undefined || value === null) return '-';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    const handleUpdateFuncionario = async (data: IFuncionarioInput) => {
        try {
            // await api.updateFuncionario(cpf, data); // Supondo esta rota
            console.log("Atualizando:", data);
            
            await updateList(); 
            setisModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar funcionário.");
        }
    }

    const handleDeleteFuncionario = async () => {
        if(!confirm(`Tem certeza que deseja remover ${nome}?`)) return;

        try {
            // await api.deleteFuncionario(cpf);
            console.log("Deletando:", cpf);
            await updateList();
            setisModalOpen(false);
        } catch (error) {
            alert("Erro ao deletar funcionário.");
        }
    }

    return (
        <>
        {isModalOpen &&
            <ModalOverlay onClick={() => setisModalOpen(false)}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Editar Funcionário</h5>
                        <div className='close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/></svg>
                        </div>
                    </ModalHeader>
                    
                    <form onSubmit={handleSubmit(handleUpdateFuncionario)}>
                        <MainPopUp>
                            <FormContainer>
                                {/* Linha 1: CPF e Nome */}
                                <FormRow $columns="1fr 2fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="cpf">CPF</StyledLabel>
                                        <StyledInput 
                                            id="cpf" 
                                            defaultValue={cpf}
                                            readOnly
                                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                            {...register('cpf')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="nome">Nome Completo</StyledLabel>
                                        <StyledInput 
                                            id="nome" 
                                            defaultValue={nome}
                                            {...register('nome')}
                                        />
                                    </FormGroup>
                                </FormRow>

                                {/* Linha 2: Função e Modelo */}
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="funcao">Função / Cargo</StyledLabel>
                                        <StyledInput 
                                            id="funcao" 
                                            defaultValue={funcao}
                                            {...register('funcao')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="modelo">Modelo Contrato</StyledLabel>
                                        <StyledInput 
                                            id="modelo" 
                                            defaultValue={modelo_contrato}
                                            placeholder="Ex: CLT, PJ"
                                            {...register('modelo_contrato')}
                                        />
                                    </FormGroup>
                                </FormRow>

                                {/* Linha 3: Horas e Salário */}
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="horas">Horas Semanais</StyledLabel>
                                        <StyledInput 
                                            id="horas" 
                                            type="number"
                                            defaultValue={horas_semanais}
                                            {...register('horas_semanais')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="salario">Salário (R$)</StyledLabel>
                                        <StyledInput 
                                            id="salario" 
                                            type="number"
                                            step="0.01"
                                            defaultValue={salario}
                                            {...register('salario')}
                                        />
                                    </FormGroup>
                                </FormRow>

                            </FormContainer>
                        </MainPopUp>
                        
                        <PopUpFooter>
                            <Button onClick={handleDeleteFuncionario} type="button" style={{ backgroundColor: '#F82122' }}>
                                Remover
                            </Button>
                            <Button type="submit">Salvar Alterações</Button>
                        </PopUpFooter>
                    </form>
                </ModalContainer>
            </ModalOverlay>
        }

        {/* Linha da Tabela - Deve bater com FuncionariosGrid */}
        <FuncionarioWrapper onClick={() => setisModalOpen(true)} $isEven={isEven}>
            <p title={cpf}>{cpf}</p>
            <p title={nome}>{nome}</p>
            <p title={funcao}>{funcao}</p>
            <p>{modelo_contrato}</p>
            <p>{horas_semanais}h</p>
            <p>{formatCurrency(salario)}</p>
        </FuncionarioWrapper>
        </>
    )
}

export default FuncionarioRow;

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

// Grid: 0.8fr 2fr 1.2fr 1fr 0.5fr 0.8fr
const FuncionarioWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%; cursor: pointer; display: grid;
    grid-template-columns: 0.8fr 2fr 1.2fr 1fr 0.5fr 0.8fr; 
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