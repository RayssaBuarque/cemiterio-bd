import styled from "styled-components";
import { IFuncionarioInput } from "../types";

interface FuncionarioInputProps {
    funcionarios: IFuncionarioInput[]; // Lista de disponíveis para o horário
    selectedFuncionarios: string[]; // Lista de selecionados ("cpf|nome")
    setSelectedFuncionarios: (funcionarios: string[]) => void;
}

const FuncionarioInput = ({ funcionarios, selectedFuncionarios, setSelectedFuncionarios }: FuncionarioInputProps) => {

    // Adiciona funcionário à lista do evento
    const handleAdd = (value: string) => {
        if (!value) return;
        // Evita duplicatas
        if (!selectedFuncionarios.includes(value)) {
            setSelectedFuncionarios([...selectedFuncionarios, value]);
        }
    };

    // Remove funcionário da lista do evento
    const handleRemove = (cpfToRemove: string) => {
        const newList = selectedFuncionarios.filter(item => {
            const [cpf] = item.split('|');
            return cpf !== cpfToRemove;
        });
        setSelectedFuncionarios(newList);
    };

    // Filtra a lista de opções para não mostrar quem já foi selecionado
    const availableOptions = funcionarios.filter(func => 
        !selectedFuncionarios.some(selected => selected.split('|')[0] === func.cpf)
    );

    return (
        <Container>
            <Label>Equipe do Evento</Label>
            
            <SelectionArea>
                <Select 
                    onChange={(e) => {
                        handleAdd(e.target.value);
                        e.target.value = ""; // Reseta o select
                    }}
                    defaultValue=""
                    disabled={funcionarios.length === 0}
                >
                    <option value="" disabled>
                        {funcionarios.length === 0 ? "Nenhum funcionário disponível neste horário" : "Selecione para adicionar..."}
                    </option>
                    {availableOptions.map(func => (
                        <option key={func.cpf} value={`${func.cpf}|${func.nome}`}>
                            {func.nome} - {func.funcao}
                        </option>
                    ))}
                </Select>
            </SelectionArea>

            <SelectedList>
                {selectedFuncionarios.length === 0 && (
                    <EmptyState>Nenhum funcionário escalado.</EmptyState>
                )}
                
                {selectedFuncionarios.map(item => {
                    const [cpf, nome] = item.split('|');
                    return (
                        <Tag key={cpf}>
                            <span>{nome}</span>
                            <RemoveButton type="button" onClick={() => handleRemove(cpf)}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
                                </svg>
                            </RemoveButton>
                        </Tag>
                    );
                })}
            </SelectedList>
        </Container>
    );
};

export default FuncionarioInput;

// ================= STYLES =================

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
`;

const Label = styled.label`
    font: 700 1rem/1.5rem 'At Aero Bold';
    color: var(--content-neutrals-primary);
`;

const SelectionArea = styled.div`
    width: 100%;
`;

const Select = styled.select`
    width: 100%;
    height: 3rem;
    padding: 0.75rem 1rem;
    background-color: transparent;
    border: 1px solid var(--content-neutrals-primary);
    border-radius: 4px;
    font: 400 1rem 'At Aero';
    color: var(--content-neutrals-primary);
    transition: all 200ms ease-in-out;

    &:focus {
        border-color: var(--brand-primary);
        outline: none;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    option {
        background-color: var(--background-neutrals-secondary);
        color: var(--content-neutrals-primary);
    }
`;

const SelectedList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    min-height: 3rem;
    padding: 0.5rem;
    background-color: rgba(255,255,255,0.02);
    border-radius: 4px;
    border: 1px dashed var(--outline-neutrals-secondary);
`;

const EmptyState = styled.span`
    font-size: 0.875rem;
    color: var(--content-neutrals-secondary);
    padding: 0.5rem;
`;

const Tag = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    background-color: var(--brand-primary);
    color: #fff;
    border-radius: 16px;
    font-size: 0.875rem;
    font-weight: 600;
    animation: fadeIn 0.2s ease-in-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    padding: 0;
    
    svg {
        width: 10px;
        height: 10px;
    }

    &:hover {
        opacity: 0.8;
    }
`;