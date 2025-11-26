import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
    LineChart, Line, AreaChart, Area
} from 'recharts';

// Components
import SideBar from '@/base/Sidebar';

// API
import api from '../services/api'; 

// Types (Definição local para o dashboard)
// Mantenha essa interface como o formato FINAL que o front espera
interface IDashboardData {
    taxaOcupacao: number;
    contratosAtivos: number;
    faturamentoDoMes: number;
    faturamentoAnual: Array<{ mes: string; valor: number }>;
    eventosProximos: Array<{ id_evento: number; lugar: string; dia: string; horario: string; }>;
    contratosVencendo: Array<{ cpf: string; nome_titular: string; data_fim: string; valor: number }>;
}

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<IDashboardData>({
        taxaOcupacao: 0,
        contratosAtivos: 0,
        faturamentoDoMes: 0,
        faturamentoAnual: [],
        eventosProximos: [],
        contratosVencendo: []
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatPercentageValue = (value: number) => {
        // Verifica se o valor é válido, se não for, retorna 0
        if (isNaN(value) || value === null || value === undefined) return '0,0';

        // Usa o formatador nativo do JS para garantir vírgula como separador decimal
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 1, // Garante pelo menos 1 casa (ex: 90,0)
            maximumFractionDigits: 2, // Limita a 2 casas no máximo (ex: 96,30)
        }).format(value);
    };

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [
                ocupacaoRes, 
                contratosRes, 
                faturamentoMesRes, 
                eventosRes, 
                faturamentoAnoRes,
                contratosVencendoRes
            ] = await Promise.all([
                api.getTaxaOcupacao(),
                api.getContratosAtivos(),
                api.getFaturamentoDoMes(),
                api.getEventosProximos(),
                api.getFaturamentoNoAno(),
                api.getContratosVencendo(),
            ]);

            // --- TRATAMENTO E ADAPTAÇÃO DOS DADOS ---

            // 1. Taxa de Ocupação
            // Vem como array: [{"taxa_ocupacao_percentual":"96.29..."}]
            // Precisamos pegar o índice 0 e converter string para number
            const rawOcupacao = ocupacaoRes.data?.[0];
            const taxaOcupacaoValor = rawOcupacao 
                ? parseFloat(rawOcupacao.taxa_ocupacao_percentual) 
                : 0;

            // 2. Faturamento Anual (Correção do erro .slice)
            // Vem como Objeto: { current_month_revenue: 92500, previous_month_revenue: 0, ... }
            // O Recharts precisa de Array. Vamos criar um array manual com esses 3 pontos.
            const rawFatAno = faturamentoAnoRes.data || {};
            const chartData = [
                { mes: '2 meses atrás', valor: rawFatAno.two_months_ago_revenue || 0 },
                { mes: 'Mês anterior', valor: rawFatAno.previous_month_revenue || 0 },
                { mes: 'Mês atual', valor: rawFatAno.current_month_revenue || 0 },
            ];

            // 3. Contratos Vencendo
            // Mapear 'nome' para 'nome_titular' e tratar a falta do campo 'valor'
            const rawContratos = Array.isArray(contratosVencendoRes.data) ? contratosVencendoRes.data : [];
            const contratosFormatados = rawContratos.map((c: any) => ({
                cpf: c.cpf,
                nome_titular: c.nome, // O back retorna 'nome', o front espera 'nome_titular'
                data_fim: c.data_fim,
                valor: 0 // O JSON do back não retornou valor monetário, definindo 0 para não quebrar
            }));

            // 4. Eventos Próximos
            // O JSON retorna {"upcoming_events": 2} (apenas a contagem).
            // O componente espera uma lista. Como não temos a lista, passamos array vazio
            // para evitar erro no .map, mas a contagem de '2' será perdida na visualização de lista atual.
            const eventosList = Array.isArray(eventosRes.data) ? eventosRes.data : [];

            setData({
                taxaOcupacao: taxaOcupacaoValor,
                contratosAtivos: contratosRes.data?.active_contracts || 0,
                faturamentoDoMes: faturamentoMesRes.data?.monthly_revenue || 0,
                faturamentoAnual: chartData,
                eventosProximos: eventosList, // <--- Passando a lista real aqui
                contratosVencendo: contratosFormatados
            });

        } catch (error) {
            console.error("Erro ao carregar dashboard", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <>
                <SideBar name="Dashboard" />
                <DashboardContainer>
                    <LoadingMessage>Carregando métricas...</LoadingMessage>
                </DashboardContainer>
            </>
        );
    }

    return (
        <>
            <SideBar name="Dashboard" />
            <DashboardContainer>
                <Header>
                    <h5>Visão Geral</h5>
                    <p>Métricas e indicadores chave do sistema.</p>
                </Header>

                {/* 1. KPIs (Cards do Topo) */}
                <KPIGrid>
                    <KPICard>
                        <CardIcon $color="#4CAF50">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </CardIcon>
                        <div className="content">
                            <span>Faturamento do Mês atual</span>
                            <h3>{formatCurrency(data.faturamentoDoMes)}</h3>
                        </div>
                    </KPICard>

                    <KPICard>
                        <CardIcon $color="#2196F3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                        </CardIcon>
                        <div className="content">
                            <span>Quantidade de Contratos Ativos</span>
                            <h3>{data.contratosAtivos}</h3>
                        </div>
                    </KPICard>

                    <KPICard>
                        <CardIcon $color={data.taxaOcupacao > 80 ? "#F44336" : "#FFC107"}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
                        </CardIcon>
                        <div className="content">
                            <span>Taxa de Ocupação dos Túmulos</span>

                            {/* --- AQUI ESTÁ A MUDANÇA --- */}
                            {/* Antes era: <h3>{data.taxaOcupacao}%</h3> */}
                            <h3>{formatPercentageValue(data.taxaOcupacao)}%</h3>

                            <ProgressBar>
                                {/* O ProgressBar pode continuar usando o valor bruto, sem problemas */}
                                <div style={{ width: `${Math.min(data.taxaOcupacao, 100)}%` }} />
                            </ProgressBar>
                        </div>
                    </KPICard>
                </KPIGrid>

                {/* 2. Gráfico Principal */}
                <SectionContainer>
                    <SectionTitle>Faturamento Anual</SectionTitle>
                    <ChartWrapper>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.faturamentoAnual}>
                                <defs>
                                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-neutrals-secondary)" />
                                <XAxis 
                                    dataKey="mes" 
                                    stroke="var(--content-neutrals-primary)" 
                                    tick={{fill: 'var(--content-neutrals-primary)'}}
                                />
                                <YAxis 
                                    stroke="var(--content-neutrals-primary)" 
                                    tick={{fill: 'var(--content-neutrals-primary)'}}
                                    tickFormatter={(value) => `R$ ${value/1000}k`}
                                />
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--background-neutrals-secondary)', 
                                        border: '1px solid var(--outline-neutrals-secondary)',
                                        borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: 'var(--content-neutrals-primary)' }}
                                    formatter={(value: number) => [formatCurrency(value), 'Faturamento']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="valor" 
                                    stroke="#82ca9d" 
                                    fillOpacity={1} 
                                    fill="url(#colorValor)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartWrapper>
                </SectionContainer>

                {/* 3. Listas Detalhadas (Eventos e Contratos) */}
                <DetailsGrid>
                    {/* Eventos Próximos */}
                    <SectionContainer>
                        <SectionTitle>Eventos Próximos (7 dias)</SectionTitle>
                        <ListWrapper>
                            {data.eventosProximos.length > 0 ? (
                                data.eventosProximos.map((evt) => {
                                    // Cria o objeto data para manipulação
                                    const dataEvento = new Date(evt.dia);
                                    
                                    // Tratamento simples para remover os segundos do horário (ex: "14:00:00" -> "14:00")
                                    const horarioFormatado = evt.horario.substring(0, 5);

                                    return (
                                        <ListItem key={evt.id_evento}>
                                            <div className="date-badge">
                                                {/* getDate() pega o dia do mês (1-31) */}
                                                <span>{dataEvento.getDate()}</span>
                                                
                                                {/* toLocaleDateString pega o mês abreviado (nov, dez) */}
                                                <small>
                                                    {dataEvento.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                                                </small>
                                            </div>
                                            <div className="info">
                                                <strong>{evt.lugar}</strong>
                                                <span>{horarioFormatado}</span>
                                            </div>
                                        </ListItem>
                                    );
                                })
                            ) : (
                                <p className="empty">Nenhum evento próximo.</p>
                            )}
                        </ListWrapper>
                    </SectionContainer>

                    {/* Contratos Vencendo */}
                    <SectionContainer>
                        <SectionTitle >⚠️ Contratos Vencendo (30 dias)</SectionTitle>
                        <ListWrapper>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Titular</th>
                                        <th>Vencimento</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.contratosVencendo.length > 0 ? (
                                        data.contratosVencendo.map((contrato, idx) => (
                                            <tr key={idx}>
                                                <td>{contrato.nome_titular}</td>
                                                <td>{new Date(contrato.data_fim).toLocaleDateString('pt-BR')}</td>
                                                <td>{formatCurrency(contrato.valor)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="empty">Nenhum contrato vencendo.</td>
                                        </tr>
                                    )}
                                </tbody>    
                            </Table>
                        </ListWrapper>
                    </SectionContainer>
                </DetailsGrid>

            </DashboardContainer>
        </>
    );
};

export default Dashboard;

// ================= STYLES =================

const DashboardContainer = styled.div`
    padding: 2rem;
    width: 100%;
    margin: auto;
    max-width: 1920px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    color: var(--content-neutrals-primary);
`;

const Header = styled.header`
    h5 { font: 700 2rem 'At Aero Bold'; margin-bottom: 0.5rem; }
    p { font: 400 1rem 'At Aero'; opacity: 0.7; }
`;

const KPIGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    width: 100%;
`;

const KPICard = styled.div`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);

    .content {
        flex: 1;
        span { font-size: 0.875rem; opacity: 0.8; }
        h3 { font: 700 1.75rem 'At Aero Bold'; margin: 0.25rem 0; }
    }
`;

const CardIcon = styled.div<{ $color: string }>`
    background-color: ${props => props.$color}20; /* 20% opacity */
    color: ${props => props.$color};
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 6px;
    background-color: var(--outline-neutrals-secondary);
    border-radius: 3px;
    margin-top: 0.5rem;
    overflow: hidden;

    div {
        height: 100%;
        background-color: currentColor;
        transition: width 0.5s ease-in-out;
    }
`;

const SectionContainer = styled.section`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
`;

const SectionTitle = styled.h6`
    font: 700 1.25rem 'At Aero Bold';
    margin-bottom: 1.5rem;
`;

const ChartWrapper = styled.div`
    width: 100%;
    height: 300px;
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    
    @media(max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 300px;
    overflow-y: auto;
    
    .empty { opacity: 0.5; font-style: italic; text-align: center; padding: 1rem; }
`;

const ListItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-bottom: 1px solid var(--outline-neutrals-secondary);

    &:last-child { border-bottom: none; }

    .date-badge {
        background-color: var(--background-neutrals-secondary);
        border: 1px solid var(--outline-neutrals-secondary);
        border-radius: 8px;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 3.5rem;

        span { font: 700 1.25rem 'At Aero Bold'; }
        small { font-size: 0.75rem; text-transform: uppercase; }
    }

    .info {
        display: flex;
        flex-direction: column;
        strong { font-size: 1rem; }
        span { font-size: 0.875rem; opacity: 0.7; }
    }
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th {
        text-align: left;
        padding: 0.75rem;
        font-size: 0.875rem;
        opacity: 0.7;
        border-bottom: 1px solid var(--outline-neutrals-secondary);
    }

    td {
        padding: 0.75rem;
        border-bottom: 1px solid var(--outline-neutrals-secondary);
        font-size: 0.9rem;
    }

    tr:last-child td { border-bottom: none; }
`;

const LoadingMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--content-neutrals-primary);
`;