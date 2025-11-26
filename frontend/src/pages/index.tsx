import { useEffect, useState } from 'react';
import styled from 'styled-components';

// API
import api from '../services/api';

// Components
import SideBar from '@/base/Sidebar';
import DashboardCard from '@/components/DashboardCard';
import LocationChart from '@/components/LocationChart';
import SupplierChart from '@/components/SupplierChart';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    // --- ESTADOS DE DADOS ---
    const [kpis, setKpis] = useState({
        custoTotal: 0,
        contratosAtivos: 0,
        contratosVencendo: 0,
        ocupacaoTumulos: 0
    });

    const [chartsData, setChartsData] = useState({
        localizacao: [],
        fornecedores: [],
        funcionariosTop: [],
        contratosVencendoLista: []
    });

    // --- FETCH DATA ---
    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Chamadas paralelas para performance
            const [
                resCusto,
                resContratosAtivos,
                resContratosVencendo,
                resLocalizacao,
                resFornecedores,
                resTumulos,
                resTopFuncionarios
            ] = await Promise.all([
                api.getCustoTotalEventos(),
                api.getContratosAtivos(),
                api.getContratosVencendo(),
                api.getLocalizacaoContratosAtivos(),
                api.getFornecedorMaisUsadoCadaEvento(),
                api.getTumulosMaisOcupados(),
                api.getFuncionariosMaisTrabalhadores()
            ]);

            // 1. Processamento dos KPIs
            const custo = resCusto.data?.total || resCusto.data || 0;
            
            // Assumindo que getContratosAtivos retorna { count: number } ou um array
            const ativosCount = Array.isArray(resContratosAtivos.data) 
                ? resContratosAtivos.data.length 
                : (resContratosAtivos.data?.count || resContratosAtivos.data || 0);
            
            const vencendoLista = Array.isArray(resContratosVencendo.data) ? resContratosVencendo.data : [];
            
            // Soma a ocupação de todos os túmulos retornados
            const tumulosData = Array.isArray(resTumulos.data) ? resTumulos.data : [];
            const ocupacaoTotal = tumulosData.reduce((acc: number, curr: any) => acc + (curr.ocupados || 0), 0);

            setKpis({
                custoTotal: custo,
                contratosAtivos: Number(ativosCount),
                contratosVencendo: vencendoLista.length,
                ocupacaoTumulos: ocupacaoTotal
            });

            // 2. Processamento dos Gráficos
            
            // Localização: { name: 'Setor A', value: 10 }
            const localData = Array.isArray(resLocalizacao.data) 
                ? resLocalizacao.data.map((item: any) => ({ 
                    name: item.localizacao || item.nome || 'Geral', 
                    value: Number(item.quantidade || item.total || item.value) 
                  }))
                : [];

            // Fornecedores: { fornecedor: 'Nome', total_eventos: 5 }
            const fornecData = Array.isArray(resFornecedores.data) 
                ? resFornecedores.data.map((item: any) => ({
                    fornecedor: item.nome || item.fornecedor,
                    total_eventos: Number(item.total_usos || item.total_eventos || item.quantidade)
                  }))
                : [];

            // Funcionários Top
            const funcTopData = Array.isArray(resTopFuncionarios.data) ? resTopFuncionarios.data : [];

            setChartsData({
                localizacao: localData,
                fornecedores: fornecData,
                funcionariosTop: funcTopData,
                contratosVencendoLista: vencendoLista
            });

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

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('pt-BR');
    }

    return (
        <>
            <SideBar name="Dashboard" />
            <Container>
                <Header>
                    <h3>Painel de Controle</h3>
                    <p>Visão geral da gestão de cemitérios e eventos</p>
                </Header>

                {isLoading ? (
                     <LoadingWrapper>
                       
                     </LoadingWrapper>
                ) : (
                    <ContentGrid>
                        {/* --- SEÇÃO DE KPIs --- */}
                        <KpiGrid>
                            <DashboardCard 
                                title="Custo Total Eventos" 
                                value={formatCurrency(kpis.custoTotal)}
                                subtext="Acumulado do período"
                                color="#F82122" // Vermelho (Destaque Financeiro)
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.38z"/></svg>
                                }
                            />
                            <DashboardCard 
                                title="Contratos Ativos" 
                                value={kpis.contratosAtivos}
                                subtext="Em vigência"
                                color="#10B981" // Verde (Positivo)
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                                }
                            />
                            <DashboardCard 
                                title="Contratos a Vencer" 
                                value={kpis.contratosVencendo}
                                subtext="Próximos vencimentos"
                                color="#F59E0B" // Laranja (Atenção)
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                                }
                            />
                            <DashboardCard 
                                title="Ocupação Túmulos" 
                                value={kpis.ocupacaoTumulos}
                                subtext="Total de ocupados"
                                color="#3B82F6" // Azul
                                icon={
                                    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                }
                            />
                        </KpiGrid>

                        {/* --- SEÇÃO DE GRÁFICOS --- */}
                        <ChartsGrid>
                            <LocationChart data={chartsData.localizacao} />
                            <SupplierChart data={chartsData.fornecedores} />
                        </ChartsGrid>

                        {/* --- LISTAS DE DETALHES --- */}
                        <DetailsGrid>
                            {/* Lista: Funcionários do Mês */}
                            <Section>
                                <SectionHeader>
                                    <h4>Funcionários Mais Ativos</h4>
                                    <p>Baseado no número de eventos</p>
                                </SectionHeader>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Função</th>
                                            <th>Eventos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartsData.funcionariosTop.slice(0, 5).map((func: any, idx) => (
                                            <tr key={idx}>
                                                <td><strong>{func.nome}</strong></td>
                                                <td>{func.funcao}</td>
                                                <td><Badge $color="var(--brand-primary)">{func.total_eventos || func.count}</Badge></td>
                                            </tr>
                                        ))}
                                        {chartsData.funcionariosTop.length === 0 && (
                                            <tr><td colSpan={3} style={{textAlign: 'center'}}>Sem dados.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Section>

                            {/* Lista: Contratos Vencendo */}
                            <Section>
                                <SectionHeader>
                                    <h4>Próximos Vencimentos</h4>
                                    <p>Contratos expirando em breve</p>
                                </SectionHeader>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>CPF</th>
                                            <th>Túmulo</th>
                                            <th>Vencimento</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartsData.contratosVencendoLista.slice(0, 5).map((c: any, idx) => (
                                            <tr key={idx}>
                                                <td>{c.cpf}</td>
                                                <td>#{c.id_tumulo}</td>
                                                <td><Badge $color="#F59E0B">{formatDate(c.data_fim)}</Badge></td>
                                            </tr>
                                        ))}
                                        {chartsData.contratosVencendoLista.length === 0 && (
                                            <tr><td colSpan={3} style={{textAlign: 'center'}}>Nenhum vencimento próximo.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Section>
                        </DetailsGrid>

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
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
    * { color: var(--content-neutrals-primary); }
`;

const Header = styled.header`
    margin-bottom: 1rem;
    h3 { font: 700 2rem 'At Aero Bold'; color: var(--content-neutrals-primary); }
    p { font: 400 1rem 'At Aero'; color: var(--content-neutrals-secondary); }
`;

const LoadingWrapper = styled.div`
    display: flex; justify-content: center; align-items: center; height: 60vh;
`;

const ContentGrid = styled.div`
    display: flex; flex-direction: column; gap: 2rem;
`;

const KpiGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
`;

const ChartsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const DetailsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }
`;

const Section = styled.div`
    background-color: var(--background-neutrals-secondary);
    border: 1px solid var(--outline-neutrals-secondary);
    border-radius: 8px;
    padding: 1.5rem;
    height: 100%;
`;

const SectionHeader = styled.div`
    margin-bottom: 1.5rem;
    h4 { font: 700 1.125rem 'At Aero Bold'; }
    p { font: 400 0.875rem 'At Aero'; color: var(--content-neutrals-secondary); }
`;

const Table = styled.table`
    width: 100%; border-collapse: collapse;
    th {
        text-align: left; padding: 0.75rem;
        color: var(--content-neutrals-secondary);
        font-weight: 600; border-bottom: 1px solid var(--outline-neutrals-secondary);
        font-size: 0.875rem;
    }
    td {
        padding: 0.75rem; border-bottom: 1px solid var(--outline-neutrals-secondary);
        font-size: 0.9rem;
    }
    tr:last-child td { border-bottom: none; }
`;

const Badge = styled.span<{ $color: string }>`
    background-color: ${({ $color }) => $color};
    color: white; padding: 0.25rem 0.75rem; border-radius: 16px;
    font-weight: 700; font-size: 0.75rem;
`;