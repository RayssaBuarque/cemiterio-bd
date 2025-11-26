import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

interface LocationData {
    name: string;
    value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function LocationChart({ data }: { data: LocationData[] }) {
    return (
        <ChartContainer>
            <ChartHeader>
                <h4>Distribuição Geográfica</h4>
                <p>Contratos ativos por localização</p>
            </ChartHeader>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

const ChartContainer = styled.div`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const ChartHeader = styled.div`
    margin-bottom: 1.5rem;
    h4 { font: 700 1.125rem 'At Aero Bold'; color: var(--content-neutrals-primary); }
    p { font: 400 0.875rem 'At Aero'; color: var(--content-neutrals-secondary); }
`;