import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';

interface Evento {
  id_evento: number;
  lugar: string;
  dia: string;
  valor_evento: string;
  total_compras: string;
  // outros campos se necessário
}

interface CustoTotalChartProps {
  data: Evento[];
  isLoading?: boolean;
}

const CustoTotalChart = ({ data, isLoading = false }: CustoTotalChartProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Função para agrupar eventos por mês
  const agruparPorMes = (eventos: Evento[]) => {
    const mesesMap = new Map();
    
    eventos.forEach(evento => {
      const date = new Date(evento.dia);
      const mesAno = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const nomeMes = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      const valorEvento = parseFloat(evento.valor_evento) || 0;
      const totalCompras = parseFloat(evento.total_compras) || 0;
      const custoTotal = valorEvento + totalCompras;
      
      if (mesesMap.has(mesAno)) {
        const existing = mesesMap.get(mesAno);
        mesesMap.set(mesAno, {
          ...existing,
          custo_total: existing.custo_total + custoTotal,
          quantidade_eventos: existing.quantidade_eventos + 1
        });
      } else {
        mesesMap.set(mesAno, {
          mes: nomeMes,
          custo_total: custoTotal,
          quantidade_eventos: 1,
          mesAno: mesAno // para ordenação
        });
      }
    });
    
    // Converter para array e ordenar por data
    return Array.from(mesesMap.values())
      .sort((a, b) => {
        const [mesA, anoA] = a.mesAno.split('/').map(Number);
        const [mesB, anoB] = b.mesAno.split('/').map(Number);
        return new Date(anoA, mesA - 1).getTime() - new Date(anoB, mesB - 1).getTime();
      })
      .map(({ mesAno, ...rest }) => rest); // Remover mesAno do resultado final
  };

  // Função para top lugares por custo
  const topLugaresPorCusto = (eventos: Evento[], limit = 8) => {
    const lugaresMap = new Map();
    
    eventos.forEach(evento => {
      const valorEvento = parseFloat(evento.valor_evento) || 0;
      const totalCompras = parseFloat(evento.total_compras) || 0;
      const custoTotal = valorEvento + totalCompras;
      
      if (lugaresMap.has(evento.lugar)) {
        lugaresMap.set(evento.lugar, lugaresMap.get(evento.lugar) + custoTotal);
      } else {
        lugaresMap.set(evento.lugar, custoTotal);
      }
    });
    
    return Array.from(lugaresMap.entries())
      .map(([lugar, custo_total]) => ({ lugar, custo_total }))
      .sort((a, b) => b.custo_total - a.custo_total)
      .slice(0, limit);
  };

  const chartDataPorMes = agruparPorMes(data);
  const chartDataPorLugar = topLugaresPorCusto(data);
  const totalGeral = data.reduce((sum, evento) => {
    const valorEvento = parseFloat(evento.valor_evento) || 0;
    const totalCompras = parseFloat(evento.total_compras) || 0;
    return sum + valorEvento + totalCompras;
  }, 0);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (isLoading) {
    return (
      <ChartContainer>
        <ChartTitle>Custo Total de Eventos</ChartTitle>
        <LoadingMessage>Carregando dados...</LoadingMessage>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>Custo Total de Eventos</ChartTitle>
        <EmptyMessage>Nenhum evento encontrado</EmptyMessage>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Custo Total de Eventos</ChartTitle>
        <TotalValue>{formatCurrency(totalGeral)}</TotalValue>
      </ChartHeader>
      
      <ChartSubtitle>
        {data.length} eventos realizados • {chartDataPorMes.length} meses
      </ChartSubtitle>

      <ChartsGrid>
        {/* Gráfico por Mês */}
        <ChartSection>
          <SectionTitle>Evolução Mensal</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartDataPorMes} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="mes" 
                stroke="#888"
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis 
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
              />
              <RechartsTooltip 
                formatter={(value: number) => [formatCurrency(value), 'Custo']}
                labelFormatter={(label) => `Mês: ${label}`}
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: 'none', 
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="custo_total" 
                name="Custo Total"
                radius={[2, 2, 0, 0]}
              >
                {chartDataPorMes.map((entry, index) => (
                  <Cell key={`cell-mes-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>

        {/* Gráfico por Lugar */}
        <ChartSection>
          <SectionTitle>Top Locais por Custo</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart 
              data={chartDataPorLugar} 
              layout="vertical"
              margin={{ top: 10, right: 10, left: 80, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
              <XAxis 
                type="number"
                stroke="#888"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value / 1000}k`}
              />
              <YAxis 
                type="category" 
                dataKey="lugar"
                stroke="#888"
                fontSize={11}
                width={75}
                tick={{ fontSize: 10 }}
              />
              <RechartsTooltip 
                formatter={(value: number) => [formatCurrency(value), 'Custo']}
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: 'none', 
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="custo_total" 
                name="Custo por Local"
                radius={[0, 2, 2, 0]}
              >
                {chartDataPorLugar.map((entry, index) => (
                  <Cell key={`cell-lugar-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>
      </ChartsGrid>
    </ChartContainer>
  );
};

export default CustoTotalChart;

// ================= STYLES =================

const ChartContainer = styled.div`
  background-color: var(--background-neutrals-secondary);
  border: 1px solid var(--outline-neutrals-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 400px;
  transition: transform 0.2s;
  grid-column: 1 / -1;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--brand-primary);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ChartTitle = styled.h4`
  font: 700 1.125rem 'At Aero Bold';
  color: var(--content-neutrals-primary);
  margin: 0;
`;

const TotalValue = styled.span`
  font: 700 1.5rem 'At Aero Bold';
  color: var(--brand-primary);
`;

const ChartSubtitle = styled.p`
  font: 400 0.875rem 'At Aero';
  color: var(--content-neutrals-secondary);
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h5`
  font: 700 0.875rem 'At Aero Bold';
  color: var(--content-neutrals-secondary);
  margin: 0;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--content-neutrals-secondary);
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--content-neutrals-secondary);
  font-style: italic;
`;