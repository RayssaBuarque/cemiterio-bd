import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';

import api from '../services/api';
import SideBar from '@/base/Sidebar';
import DashboardCard from '@/components/DashboardCard';;
import CustoTotalChart from '@/components/CustoTotalChart';
import TopFornecedoresChart  from '@/components/TopFornecedoresChart';
import Image from 'next/image';

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para os dados
    const [localizacaoData, setLocalizacaoData] = useState<any[]>([]);
    const [fornecedorData, setFornecedorData] = useState<any[]>([]);
    const [contratosVencendo, setContratosVencendo] = useState<any[]>([]);
    const [contratosAtivos, setContratosAtivos] = useState<any[]>([]);
    const [tumulosOcupados, setTumulosOcupados] = useState<any[]>([]);
    const [custoChartData, setCustoChartData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Chamadas paralelas para performance
            const [
                resCusto, 
                resLocal, 
                resFornecedor,
                resContratosVencendo,
                resContratosAtivos,
                resTumulos
            ] = await Promise.all([
                api.getCustoTotalEventos(),
                api.getLocalizacaoContratosAtivos(),
                api.getFornecedorMaisUsadoCadaEvento(),
                api.getContratosVencendo(),
                api.getContratosAtivos(),
                api.getTumulosMaisOcupados()
            ]);

            // Tratamento de Custo Total;
            setCustoChartData(Array.isArray(resCusto.data) ? resCusto.data : []);

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
                // console.log("Contratos Vencendo:", resContratosVencendo.data);
                setContratosVencendo(Array.isArray(resContratosVencendo.data) ? resContratosVencendo.data : []);
            }

            if (resContratosAtivos.data) {
                setContratosAtivos(resContratosAtivos.data.active_contracts);
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
                        {/* 1. GRÁFICO DE CUSTO TOTAL - LINHA INTEIRA */}
                        <CustoTotalChart 
                            data={custoChartData}
                            isLoading={isLoading}
                        />

                        {/* 2. PRIMEIRA LINHA DE KPI CARDS - 2 CARDS LADO A LADO */}
                        <KpiRow>
                            <DashboardCard 
                                title="Contratos Ativos" 
                                value={contratosAtivos}
                                color="#F59E0B"
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                                }
                            />
                            <DashboardCard 
                                title="Ocupação Túmulos" 
                                value={tumulosOcupados.reduce((acc, curr) => acc + (curr.ocupados || 0), 0)}
                                color="#10B981"
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                                }
                            />
                        </KpiRow>

                        {/* 3. SEGUNDA LINHA DE KPI CARDS - 2 CARDS LADO A LADO */}
                        <KpiRow>
                            <DashboardCard 
                                title="Total de Eventos" 
                                value={custoChartData.length}
                                color="#F82122"
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
                                }
                            />
                            <DashboardCard 
                                title="Fornecedores Ativos" 
                                value={fornecedorData.length}
                                color="#0088FE"
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                                }
                            />
                        </KpiRow>

                        {/* 4. GRÁFICOS PRINCIPAIS - 2 GRÁFICOS LADO A LADO */}
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
                                            dataKey="value"
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
                            <TopFornecedoresChart 
                                data={fornecedorData}
                                isLoading={isLoading}
                            />
                        </ChartsRow>

                        {/* 5. LISTA DE DETALHES (Opcional: Contratos Vencendo) */}
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
    height: 100vh; /* Altura fixa da viewport */
    padding: 2rem;
    max-width: 1400px; /* Largura máxima reduzida para melhor leitura */
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    overflow-y: auto; /* Permite scroll vertical */
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: var(--background-neutrals-secondary);
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: var(--brand-primary);
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: var(--brand-primary-dark);
    }
    
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
    flex: 1;
    padding-bottom: 2rem;
`;

// KPI ROW AGORA COM 2 CARDS LADO A LADO
const KpiRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

// CHARTS ROW COM 2 GRÁFICOS LADO A LADO
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
    min-height: 400px;
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