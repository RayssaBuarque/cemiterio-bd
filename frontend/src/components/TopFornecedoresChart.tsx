import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';

interface FornecedorData {
  tipo_evento: string;
  cnpj: string;
  nome_fornecedor: string;
  total_usos: string;
}

interface TopFornecedoresChartProps {
  data: FornecedorData[];
  isLoading?: boolean;
}

const TopFornecedoresChart = ({ data, isLoading = false }: TopFornecedoresChartProps) => {
  // Cores para os diferentes tipos de evento
  const CORES_POR_EVENTO: { [key: string]: string } = {
    cremacao: '#FF8042',     // Laranja
    sepultamento: '#0088FE',  // Azul
    velorio: '#00C49F',       // Verde
    exumacao: '#FFBB28',      // Amarelo
    translado: '#8884d8',     // Roxo
    default: '#82ca9d'        // Verde água (padrão)
  };

  // Formatar dados para o gráfico
  const formatarDados = (fornecedores: FornecedorData[]) => {
    return fornecedores.map(item => ({
      ...item,
      total_usos_num: parseInt(item.total_usos) || 0,
      tipo_evento_formatado: formatarTipoEvento(item.tipo_evento),
      cor: CORES_POR_EVENTO[item.tipo_evento] || CORES_POR_EVENTO.default
    }));
  };

  // Função para formatar o tipo de evento para exibição
  const formatarTipoEvento = (tipo: string) => {
    const formatos: { [key: string]: string } = {
      cremacao: 'Cremacão',
      sepultamento: 'Sepultamento',
      velorio: 'Velório',
      exumacao: 'Exumação',
      translado: 'Translado'
    };
    return formatos[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  const dadosFormatados = formatarDados(data);
  
  // Ordenar por total de usos (decrescente)
  const dadosOrdenados = [...dadosFormatados].sort((a, b) => b.total_usos_num - a.total_usos_num);

  const formatTooltip = (value: number, name: string, props: any) => {
    return [`${value} uso${value !== 1 ? 's' : ''}`, 'Total de Usos'];
  };

  if (isLoading) {
    return (
      <ChartContainer>
        <ChartTitle>Top Fornecedores por Evento</ChartTitle>
        <LoadingMessage>Carregando dados...</LoadingMessage>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>Top Fornecedores por Evento</ChartTitle>
        <EmptyMessage>Nenhum dado de fornecedor disponível</EmptyMessage>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Top Fornecedores por Tipo de Evento</ChartTitle>
        <TotalFornecedores>{data.length} fornecedores</TotalFornecedores>
      </ChartHeader>

      <ChartSubtitle>
        Fornecedor mais utilizado para cada tipo de evento
      </ChartSubtitle>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={dadosOrdenados}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
          <XAxis 
            type="number"
            stroke="#888"
            tickFormatter={(value) => `${value} uso${value !== 1 ? 's' : ''}`}
          />
          <YAxis 
            type="category" 
            dataKey="nome_fornecedor"
            stroke="#888"
            width={140}
            tick={{ fontSize: 12 }}
          />
          <RechartsTooltip 
            formatter={formatTooltip}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div>
                    <strong>{data.nome_fornecedor}</strong>
                    <br />
                    <span style={{ color: '#aaa' }}>
                      {data.tipo_evento_formatado} • CNPJ: {data.cnpj}
                    </span>
                  </div>
                );
              }
              return label;
            }}
            contentStyle={{ 
              backgroundColor: '#1E1E1E', 
              border: 'none', 
              borderRadius: '4px',
              color: '#fff'
            }}
          />
          <Legend 
            formatter={(value, entry: any) => {
              const tipo = entry.payload?.tipo_evento_formatado || value;
              return <span style={{ color: '#fff', fontSize: '12px' }}>{tipo}</span>;
            }}
          />
          <Bar 
            dataKey="total_usos_num" 
            name="Tipo de Evento"
            radius={[0, 4, 4, 0]}
          >
            {dadosOrdenados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda de cores */}
      <LegendaContainer>
        <LegendaTitle>Legenda por Tipo de Evento:</LegendaTitle>
        <LegendaGrid>
          {Object.entries(CORES_POR_EVENTO).map(([tipo, cor]) => {
            if (tipo === 'default') return null;
            const eventoFormatado = formatarTipoEvento(tipo);
            const existeNoData = data.some(item => item.tipo_evento === tipo);
            
            if (!existeNoData) return null;
            
            return (
              <LegendaItem key={tipo}>
                <LegendaColor style={{ backgroundColor: cor }} />
                <LegendaText>{eventoFormatado}</LegendaText>
              </LegendaItem>
            );
          })}
        </LegendaGrid>
      </LegendaContainer>

      {/* Estatísticas rápidas */}
      <StatsContainer>
        <StatItem>
          <StatLabel>Maior uso:</StatLabel>
          <StatValue>
            {dadosOrdenados[0]?.total_usos_num || 0} - {dadosOrdenados[0]?.nome_fornecedor}
          </StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Tipos de evento:</StatLabel>
          <StatValue>
            {new Set(data.map(item => item.tipo_evento)).size} diferentes
          </StatValue>
        </StatItem>
      </StatsContainer>
    </ChartContainer>
  );
};

export default TopFornecedoresChart;

// ================= STYLES =================

const ChartContainer = styled.div`
  background-color: var(--background-neutrals-secondary);
  border: 1px solid var(--outline-neutrals-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 500px;
  width: 100%;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--brand-primary);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const ChartTitle = styled.h4`
  font: 700 1.125rem 'At Aero Bold';
  color: var(--content-neutrals-primary);
  margin: 0;
`;

const TotalFornecedores = styled.span`
  font: 700 1rem 'At Aero Bold';
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
`;

const ChartSubtitle = styled.p`
  font: 400 0.875rem 'At Aero';
  color: var(--content-neutrals-secondary);
  margin: 0;
  margin-bottom: 1rem;
`;

const LegendaContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: var(--background-neutrals-primary);
  border-radius: 6px;
  border: 1px solid var(--outline-neutrals-secondary);
`;

const LegendaTitle = styled.h5`
  font: 700 0.875rem 'At Aero Bold';
  color: var(--content-neutrals-secondary);
  margin: 0 0 0.75rem 0;
`;

const LegendaGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LegendaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendaColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid var(--outline-neutrals-secondary);
`;

const LegendaText = styled.span`
  font: 400 0.75rem 'At Aero';
  color: var(--content-neutrals-secondary);
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--outline-neutrals-secondary);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font: 400 0.75rem 'At Aero';
  color: var(--content-neutrals-secondary);
`;

const StatValue = styled.span`
  font: 700 0.875rem 'At Aero Bold';
  color: var(--content-neutrals-primary);
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--content-neutrals-secondary);
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--content-neutrals-secondary);
  font-style: italic;
  text-align: center;
`;