import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styled from 'styled-components';

interface SupplierData {
    fornecedor: string;
    total_eventos: number;
}

export default function SupplierChart({ data }: { data: SupplierData[] }) {
    return (
        <ChartContainer>
            <ChartHeader>
                <h4>Top Fornecedores</h4>
                <p>Volume de eventos por fornecedor</p>
            </ChartHeader>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="fornecedor" 
                        type="category" 
                        width={100} 
                        tick={{fill: 'var(--content-neutrals-secondary)', fontSize: 12}}
                    />
                    <Tooltip 
                        cursor={{fill: 'transparent'}}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                    />
                    <Bar dataKey="total_eventos" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
                        ))}
                    </Bar>
                </BarChart>
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