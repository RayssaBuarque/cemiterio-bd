import styled from "styled-components";

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string; // Cor do ícone ou detalhe
}

const DashboardCard = ({ title, value, icon, color = "var(--brand-primary)" }: DashboardCardProps) => {
    return (
        <CardContainer>
            <CardHeader>
                <Title>{title}</Title>
                {icon && <IconWrapper style={{ backgroundColor: color }}>{icon}</IconWrapper>}
            </CardHeader>
            <Value>{value}</Value>
        </CardContainer>
    );
};

export default DashboardCard;

const CardContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 240px;
    flex: 1;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-2px);
        border-color: var(--brand-primary);
    }
`;

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const Title = styled.h4`
    font: 700 1rem 'At Aero Bold';
    color: var(--content-neutrals-secondary);
    margin: 0;
`;

const Value = styled.span`
    font: 700 2rem 'At Aero Bold';
    color: var(--content-neutrals-primary);
`;

const IconWrapper = styled.div`
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    
    svg {
        width: 1.25rem;
        height: 1.25rem;
        fill: currentColor;
    }
`;