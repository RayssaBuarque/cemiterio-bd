import styled, { css } from "styled-components";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../services/api";
import { ICompras } from "../types";
import Button from "./Button";

interface CompraRowProps extends ICompras {
    isEven: boolean;
    updateList: () => void;
}

const CompraRow = ({ cnpj, id_evento, data_compra, horario, quantidade, valor, isEven, updateList }: CompraRowProps) => {
    
    const [isModalOpen, setisModalOpen] = useState(false);
    const { register, handleSubmit } = useForm<ICompras>();

    // Helpers de formatação
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    const handleUpdate = async (data: ICompras) => {
        try {
            // Nota: Em tabelas de relacionamento N:N ou logs de compra, a chave primária costuma ser composta.
            // Aqui assumimos que o backend saberá identificar o registro.
            console.log("Atualizando compra:", data);
            
            // await api.updateCompra(cnpj, id_evento, data); 
            await updateList(); 
            setisModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar registro de compra.");
        }
    }

    const handleDelete = async () => {
        if(!confirm(`Deseja remover o registro de compra do CNPJ ${cnpj} para o evento ${id_evento}?`)) return;

        try {
            // await api.deleteCompra(cnpj, id_evento);
            console.log("Deletando compra:", cnpj, id_evento);
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
                        <h5>Editar Compra</h5>
                        <div className='close' onClick={() => setisModalOpen(false)}>
                            <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="currentColor"/></svg>
                        </div>
                    </ModalHeader>
                    
                    <form onSubmit={handleSubmit(handleUpdate)}>
                        <MainPopUp>
                            <FormContainer>
                                {/* Linha 1: Chaves (CNPJ e Evento) - ReadOnly na edição geralmente */}
                                <FormRow $columns="2fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="cnpj">CNPJ Fornecedor</StyledLabel>
                                        <StyledInput 
                                            id="cnpj" 
                                            defaultValue={cnpj}
                                            readOnly
                                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                            {...register('cnpj')}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="id_evento">ID Evento</StyledLabel>
                                        <StyledInput 
                                            id="id_evento" 
                                            type="number"
                                            defaultValue={id_evento}
                                            readOnly
                                            style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                            {...register('id_evento')}
                                        />
                                    </FormGroup>
                                </FormRow>

                                {/* Linha 2: Data e Hora */}
                                <FormRow $columns="1fr 1fr">
                                    <FormGroup>
                                        <StyledLabel htmlFor="data_compra">Data da Compra</StyledLabel>
                                        <StyledInput 
                                            id="data_compra" 
                                            type="date"
                                            defaultValue={data_compra}
                                            {...register('data_compra', { required: true })}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="horario">Horário</StyledLabel>
                                        <StyledInput 
                                            id="horario" 
                                            type="time"
                                            defaultValue={horario}
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
                                            defaultValue={quantidade}
                                            {...register('quantidade', { required: true })}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <StyledLabel htmlFor="valor">Valor Total (R$)</StyledLabel>
                                        <StyledInput 
                                            id="valor" 
                                            type="number"
                                            step="0.01"
                                            defaultValue={valor}
                                            {...register('valor', { required: true })}
                                        />
                                    </FormGroup>
                                </FormRow>

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

        {/* Linha da Tabela - Grid de 6 colunas */}
        <RowWrapper onClick={() => setisModalOpen(true)} $isEven={isEven}>
            <p title={cnpj}>{cnpj}</p>
            <p title={`Evento #${id_evento}`}>#{id_evento}</p>
            <p>{formatDate(data_compra)}</p>
            <p>{horario}</p>
            <p>{quantidade}</p>
            <p>{formatCurrency(valor)}</p>
        </RowWrapper>
        </>
    )
}

export default CompraRow;

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

const PopUpFooter = styled.footer`
    display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
`;

// Grid Layout: CNPJ | Evento | Data | Hora | Qtd | Valor
// Sugestão: 1.5fr 0.8fr 1fr 0.8fr 0.6fr 1fr
const RowWrapper = styled.div<{ $isEven: boolean }>`
    width: 100%; cursor: pointer; display: grid;
    grid-template-columns: 1.5fr 0.8fr 1fr 0.8fr 0.6fr 1fr; 
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