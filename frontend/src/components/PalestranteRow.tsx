import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";

import api from "../../services/api";
import { ITitularInput } from "../types"; // Importe a interface correta

// components
import Button from "./Button";

// Interfaces para props
interface TitularRowProps {
    cpf: string;
    nome: string;
    endereco?: string;
    telefone?: string;
    isEven: boolean;
    updateList: () => void;
}

const TitularRow = ({ cpf, nome, endereco, telefone, isEven, updateList }: TitularRowProps) => {
    
    const [isModalOpen, setisModalOpen] = useState(false);
    
    // Configurando o form com valores padrão vindos das props
    const { register, handleSubmit } = useForm<ITitularInput>();

    const handleUpdateTitular = async (data: ITitularInput) => {
        try {
            // Nota: Se a API de update espera que passemos o CPF como identificador na URL,
            // ou se o backend espera o objeto completo.
            // Aqui estou assumindo que você criará um método 'updateTitular' no seu api.ts
            // Caso não tenha update, adapte conforme sua necessidade (ex: recriar).
            
            // await api.updateTitular(cpf, data); 
            console.log("Update não implementado na API ainda. Dados:", data);
            
            await updateList(); // Atualiza a lista na tela
            setisModalOpen(false);
        } catch (error) {
            console.error("Erro ao atualizar titular:", error);
            alert("Erro ao atualizar titular.");
        }
    }

    const handleDeleteTitular = async () => {
        if(!confirm(`Tem certeza que deseja remover o titular ${nome}?`)) return;

        try {
            await api.deleteTitular(cpf);
            await updateList();
            setisModalOpen(false);
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao deletar titular. Verifique se ele não possui contratos ativos.");
        }
    }

    return (
        <>
        {isModalOpen &&
            <ModalOverlay onClick={() => setisModalOpen(false)}>
                <ModalContainer onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <h5>Editar Titular</h5>
                        <div className='close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"/>
                            </svg>
                        </div>
                    </ModalHeader>
                    
                    <form onSubmit={handleSubmit(handleUpdateTitular)}>
                        <MainPopUp>
                            <FormContainer>
                                {/* Linha 1: CPF (Geralmente ReadOnly) e Nome */}
                                <FormRow $columns="1fr 2fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="cpf">CPF</StyledLabel>
                                        <StyledInput 
                                            id="cpf" 
                                            type="text" 
                                            defaultValue={cpf}
                                            readOnly // CPF é chave primária, geralmente não se edita
                                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                            {...register('cpf')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="nome">Nome Completo</StyledLabel>
                                        <StyledInput 
                                            id="nome" 
                                            type="text" 
                                            defaultValue={nome}
                                            {...register('nome')}
                                            placeholder="Nome do titular"
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
                                            defaultValue={telefone}
                                            {...register('telefone')}
                                            placeholder="(XX) XXXXX-XXXX"
                                        />
                                    </FormGroup>
                                </FormRow>

                                {/* Linha 3: Endereço */}
                                <FormGroup>
                                    <StyledLabel htmlFor="endereco">Endereço</StyledLabel>
                                    <StyledInput 
                                        id="endereco" 
                                        type="text" 
                                        defaultValue={endereco}
                                        {...register('endereco')}
                                        placeholder="Endereço completo"
                                    />
                                </FormGroup>

                            </FormContainer>
                        </MainPopUp>
                        
                        <PopUpFooter>
                            <Button onClick={handleDeleteTitular} type="button" style={{ backgroundColor: '#F82122' }}>
                                Remover
                            </Button>
                            <Button type="submit">Salvar Alterações</Button>
                        </PopUpFooter>
                    </form>
                </ModalContainer>
            </ModalOverlay>
        }

        {/* Linha da Tabela na Listagem */}
        <TitularWrapper onClick={() => setisModalOpen(true)} $isEven={isEven}>
            <p title={cpf}>{cpf}</p>
            <p title={nome}>{nome}</p>
            <p title={endereco || '-'}>{endereco || '-'}</p>
            <p title={telefone || '-'}>{telefone || '-'}</p>
        </TitularWrapper>
        </>
    )
}

export default TitularRow;

// ==========================================
// STYLED COMPONENTS
// ==========================================

const ModalOverlay = styled.div`
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
`

const ModalContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    width: 90%;
    max-width: 50rem; /* Modal um pouco menor pois tem menos texto que palestrante */
    padding: 2rem;
    border: 0.063rem;
    box-shadow: 0 0.313rem 1rem rgba(0,0,0,0.3);
    color: var(--content-neutrals-primary);
    border-radius: 8px; /* Opcional: arredondar cantos */
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 0.063rem solid var(--outline-neutrals-secondary);

    h5{
        color: var(--content-neutrals-primary, #FFF);
        font-size: 2rem;
        font-weight: 700;
        line-height: 2.5rem;
    }

    .close {
        padding: 0.5rem;
        cursor: pointer;   
        
        svg path{
            fill: var(--content-neutrals-primary);
            transition: fill 0.2s;
        }
        
        &:hover svg path {
            fill: var(--brand-primary, #F82122); /* Cor de destaque ao fechar */
        }
    }
`

const MainPopUp = styled.main`
    padding-bottom: 1rem;
    border-bottom: 0.063rem solid var(--outline-neutrals-secondary);
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
`;

const FormRow = styled.div<{ $columns?: string }>`
  display: grid;
  gap: 1rem; 
  grid-template-columns: ${(props) => props.$columns || '1fr'};
  
  @media(max-width: 600px) {
    grid-template-columns: 1fr; /* Responsivo para mobile */
  }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column; 
    gap: 0.5rem;
`;

const StyledLabel = styled.label`
    font: 700 1rem/1.5rem 'AT Aero Bold';
    color: var(--content-neutrals-primary, #FFF);
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
        border-color: var(--brand-primary);
        outline: none;
    }
`;

const StyledInput = styled.input`
  ${InputStyle}
`;

const PopUpFooter = styled.footer`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.5rem;
    width: 100%;
    margin-top: 1.5rem;
    
    button{
        max-width: none;
        padding: 0.75rem 1.5rem;
    }
`;

const TitularWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%;
    cursor: pointer;
    display: grid;
    /* CPF | Nome | Endereço | Telefone */
    grid-template-columns: 1fr 2fr 2.5fr 1fr; 
    grid-column-gap: 1.5rem;
    padding: 1rem 0.5rem; 
    min-height: 4rem;
    align-items: center;
    background-color: ${({$isEven}) => $isEven ? 'var(--background-neutrals-secondary)' : 'transparent'};
    transition: background-color 200ms ease-in-out;
    border-radius: 4px;
    
    &:hover{
        background-color: var(--state-layers-neutrals-primary-008, rgba(255,255,255,0.05));
    }
    
    p {
        font: 400 1rem/1.5rem 'At Aero';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--content-neutrals-primary);
    }
`