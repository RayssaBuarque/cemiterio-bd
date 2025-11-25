import styled from "styled-components";
import { IFuncionarioInput } from "../types"; // Importe sua interface se necessário

interface FuncionarioInputProps {
    selectedFuncionarios: string[]; // Array de strings "id|nome"
    setSelectedFuncionarios: (funcionarios: string[]) => void;
    funcionarios: IFuncionarioInput[]; // Lista de funcionários disponíveis vindos da API
}

const FuncionarioInput = ({ selectedFuncionarios = [], setSelectedFuncionarios, funcionarios }: FuncionarioInputProps) => {
    
    const handleAdd = (funcionarioValue: string) => {
        if (!funcionarioValue) return;
        // Evita duplicatas
        if (!selectedFuncionarios.includes(funcionarioValue)) {
            setSelectedFuncionarios([...selectedFuncionarios, funcionarioValue])
        }
    }

    const handleRemove = (id: string) => {
        setSelectedFuncionarios(selectedFuncionarios.filter(func => func.split("|")[0] !== id))
    }
    
    // Filtra para não mostrar no Select quem já foi selecionado
    const availableOptions = funcionarios.filter((func) => 
        !selectedFuncionarios.some(selected => selected.split("|")[0] === func.cpf) 
        // Nota: Troque 'func.cpf' por 'func.id' se o seu backend usar ID numérico
    )

    return (
        <InputContainer>
            <label>Funcionários Alocados</label>
            
            {/* Lista de Selecionados (Tags) */}
            {selectedFuncionarios.map((funcStr) => {
                const [id, nome] = funcStr.split("|");
                return(
                    <InputRow key={id}>
                        <input value={nome} readOnly/>
                        <button type="button" onClick={() => handleRemove(id)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="var(--content-neutrals-primary)"/>
                            </svg>
                        </button>
                    </InputRow>
                )
            })}

            {/* Select para Adicionar */}
            <InputRow>
                <select 
                    onChange={(e) => {
                        handleAdd(e.target.value);
                        e.target.value = "default"; // Reseta o select visualmente
                    }}
                    defaultValue="default"
                >
                    <option value="default" disabled>Selecione um Funcionário...</option>
                    {availableOptions.map((func) => {
                        return(
                            // Usando CPF como ID, ajuste se necessário
                            <option key={func.cpf} value={`${func.cpf}|${func.nome}`}>
                                {func.nome} - {func.funcao}
                            </option>
                        )
                    })}
                </select>
            </InputRow>
        </InputContainer>
    )
}

export default FuncionarioInput

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    label {
        font: 700 1rem/1.5rem 'At Aero Bold';
        color: var(--content-neutrals-primary);
    }
`

const InputRow = styled.div`
    width: 100%;
    gap: 1rem;
    display: flex;
    align-items: center;

    input, select {
        font: 400 1rem/1.5rem 'At Aero';
        width: 100%;
        height: 3rem;
        padding: 0.75rem 1rem;
        background-color: transparent;
        transition: all 200ms ease-in-out;
        border: 1px solid var(--content-neutrals-primary);
        color: var(--content-neutrals-primary);

        &:hover, &:focus-visible{
            background-color: var(--background-neutrals-secondary);
        }

        &:focus-visible{
            border: 1px solid var(--brand-primary);
            outline: none;
        }
        
        option {
            background-color: var(--background-neutrals-secondary);
            color: var(--content-neutrals-primary);
        }
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        
        &:hover svg path {
            fill: var(--brand-primary);
        }
    }
`