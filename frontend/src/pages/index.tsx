import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';

import api from '../services/api';
import SideBar from '@/base/Sidebar';
import DashboardCard from '@/components/DashboardCard';;
import Image from 'next/image';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para os dados
    const [custoTotal, setCustoTotal] = useState(0);
    const [localizacaoData, setLocalizacaoData] = useState<any[]>([]);
    const [fornecedorData, setFornecedorData] = useState<any[]>([]);
    const [contratosVencendo, setContratosVencendo] = useState<any[]>([]);
    const [tumulosOcupados, setTumulosOcupados] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Chamadas paralelas para performance
            const [
                resCusto, 
                resLocal, 
                resFornecedor,
                resContratosVencendo,
                resTumulos
            ] = await Promise.all([
                api.getCustoTotalEventos(),
                api.getLocalizacaoContratosAtivos(),
                api.getFornecedorMaisUsadoCadaEvento(),
                api.getContratosVencendo(), // Extra que você já tinha na API
                api.getTumulosMaisOcupados() // Extra
            ]);

            // Tratamento de Custo Total
            // Assumindo que retorna { total: number } ou o número direto
            const total = resCusto.data?.total || resCusto.data || 0;
            setCustoTotal(total);

            // Tratamento de Localização (Para Pie Chart)
            // Esperado: [{ name: 'Setor A', value: 30 }, ...]
            if (resLocal.data) {
                // Adapte conforme o retorno real da sua API
                const formattedLocal = Array.isArray(resLocal.data) ? resLocal.data : [];
                setLocalizacaoData(formattedLocal);
            }

            // Tratamento de Fornecedores (Para Bar Chart ou Lista)
            // Esperado: [{ evento: 'Casamento', fornecedor: 'Buffet X', total: 10 }]
            if (resFornecedor.data) {
                setFornecedorData(Array.isArray(resFornecedor.data) ? resFornecedor.data : []);
            }

            if (resContratosVencendo.data) {
                setContratosVencendo(Array.isArray(resContratosVencendo.data) ? resContratosVencendo.data : []);
            }

            if (resTumulos.data) {
                setTumulosOcupados(Array.isArray(resTumulos.data) ? resTumulos.data : []);
            }

        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <>
            <SideBar name="Dashboard" />
            <Container>
                <Header>
                    <h3>Visão Geral</h3>
                    <p>Métricas e indicadores de desempenho</p>
                </Header>

                {isLoading ? (
                     <LoadingWrapper>
                       
                     </LoadingWrapper>
                ) : (
                    <ContentGrid>
                        {/* 1. KPI CARDS ROW */}
                        <KpiRow>
                            <DashboardCard 
                                title="Custo Total de Eventos" 
                                value={formatCurrency(custoTotal)}
                                color="#F82122" // Brand Red
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.38z"/></svg>
                                }
                            />
                            <DashboardCard 
                                title="Contratos a Vencer" 
                                value={contratosVencendo.length}
                                color="#F59E0B" // Warning Yellow
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                                }
                            />
                            <DashboardCard 
                                title="Ocupação Túmulos" 
                                value={tumulosOcupados.reduce((acc, curr) => acc + (curr.ocupados || 0), 0)}
                                color="#10B981" // Success Green
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                                }
                            />
                        </KpiRow>

                        {/* 2. CHARTS ROW */}
                        <ChartsRow>
                            {/* Gráfico de Pizza: Localização */}
                            <ChartWrapper>
                                <ChartTitle>Localização Contratos Ativos</ChartTitle>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={localizacaoData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value" // Certifique-se que sua API retorna { name: '...', value: number }
                                            nameKey="name"
                                        >
                                            {localizacaoData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '4px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartWrapper>

                            {/* Gráfico de Barras: Fornecedores Mais Usados */}
                            <ChartWrapper>
                                <ChartTitle>Top Fornecedores por Evento</ChartTitle>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={fornecedorData}
                                        layout="vertical"
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis type="number" stroke="#888" />
                                        <YAxis dataKey="nome" type="category" width={100} stroke="#888" />
                                        <RechartsTooltip 
                                            cursor={{fill: 'transparent'}}
                                            contentStyle={{ backgroundColor: '#1E1E1E', border: 'none', borderRadius: '4px' }}
                                        />
                                        <Bar dataKey="total_usos" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                            {fornecedorData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartWrapper>
                        </ChartsRow>

                        {/* 3. LISTA DE DETALHES (Opcional: Contratos Vencendo) */}
                        <Section>
                            <ChartTitle>Próximos Vencimentos de Contrato</ChartTitle>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>CPF</th>
                                        <th>ID Túmulo</th>
                                        <th>Data Fim</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contratosVencendo.slice(0, 5).map((contrato) => (
                                        <tr key={`${contrato.cpf}-${contrato.id_tumulo}`}>
                                            <td>{contrato.cpf}</td>
                                            <td>#{contrato.id_tumulo}</td>
                                            <td>{new Date(contrato.data_fim).toLocaleDateString()}</td>
                                            <td><Badge>{contrato.status}</Badge></td>
                                        </tr>
                                    ))}
                                    {contratosVencendo.length === 0 && (
                                        <tr><td colSpan={4} style={{textAlign: 'center'}}>Nenhum contrato vencendo em breve.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </Section>
                    </ContentGrid>
                )}
            </Container>
        </>
    );
};

export default Dashboard;

// ================= STYLES =================

const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    padding: 2rem;
    max-width: 1920px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
    * { color: var(--content-neutrals-primary); }
`;

const Header = styled.header`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    h3 {
        font: 700 2rem 'At Aero Bold';
        color: var(--content-neutrals-primary);
    }
    p {
        font: 400 1rem 'At Aero';
        color: var(--content-neutrals-secondary);
    }
`;

const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
`;

const ContentGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const KpiRow = styled.div`
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
`;

const ChartsRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const ChartWrapper = styled.div`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 350px;
`;

const ChartTitle = styled.h4`
    font: 700 1.125rem 'At Aero Bold';
    margin-bottom: 0.5rem;
`;

const Section = styled.div`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    border-radius: 8px;
    padding: 1.5rem;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;

    th {
        text-align: left;
        padding: 0.75rem;
        color: var(--content-neutrals-secondary);
        font-weight: 700;
        border-bottom: 1px solid var(--outline-neutrals-secondary);
    }

    td {
        padding: 0.75rem;
        border-bottom: 1px solid var(--outline-neutrals-secondary);
    }

    tr:last-child td {
        border-bottom: none;
    }
`;

const Badge = styled.span`
    background-color: #F59E0B;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 700;
`;