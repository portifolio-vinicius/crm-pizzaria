import React from 'react';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Restaurant as RestaurantIcon,
  DeliveryDining as DeliveryIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MoneyIcon,
  Pending as PendingIcon,
  CheckCircle as CheckIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useFetch } from '../../hooks/useFetch';
import { Cliente } from '../../types/Cliente';
import { Product } from '../../types/Product';
import { Pedido } from '../../types/Pedido';
import { Motoboy } from '../../types/Motoboy';
import { LoyaltyPoint } from '../../types/LoyaltyPoint';
import { calcularValorTotalPedido } from '../../utils/pedidoUtils';
import Card from '../../components/atoms/Card';
import Button from '../../components/atoms/Button';
import Loading from '../../components/atoms/Loading';
import Breadcrumbs from '../../components/molecules/Breadcrumbs';
import './Dashboard.css';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  loading = false,
  trend
}) => (
  <Card className="dashboard-card" variant="elevated">
    <div className="dashboard-card__header">
      <div className="dashboard-card__info">
        <h3 className="dashboard-card__title">{title}</h3>
        {subtitle && <p className="dashboard-card__subtitle">{subtitle}</p>}
      </div>
      <div 
        className="dashboard-card__icon"
        style={{ backgroundColor: `${color}15`, color }}
      >
        {icon}
      </div>
    </div>
    
    <div className="dashboard-card__content">
      {loading ? (
        <div className="dashboard-card__loading">
          <Loading size="sm" />
          <span>Carregando...</span>
        </div>
      ) : (
        <>
          <div className="dashboard-card__value">{value}</div>
          {trend && (
            <div className={`dashboard-card__trend dashboard-card__trend--${trend.isPositive ? 'positive' : 'negative'}`}>
              <TrendingUpIcon className="dashboard-card__trend-icon" />
              <span>{trend.value}%</span>
            </div>
          )}
        </>
      )}
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const { data: clientes, loading: loadingClientes } = useFetch<Cliente[]>('/clientes');
  const { data: produtos, loading: loadingProdutos } = useFetch<Product[]>('/produtos');
  const { data: pedidos, loading: loadingPedidos } = useFetch<Pedido[]>('/pedidos');
  const { data: motoboys, loading: loadingMotoboys } = useFetch<Motoboy[]>('/motoboys');
  const { data: loyaltyPoints, loading: loadingLoyalty } = useFetch<LoyaltyPoint[]>('/fidelidade');

  // Cálculos dos dados
  const totalClientes = clientes?.length || 0;
  const totalProdutos = produtos?.length || 0;
  const totalPedidos = pedidos?.length || 0;
  const totalMotoboys = motoboys?.length || 0;
  
  const valorTotalVendas = pedidos?.reduce((acc, pedido) => acc + calcularValorTotalPedido(pedido), 0) || 0;
  const pedidosPendentes = pedidos?.filter(p => p.status === 'PENDENTE').length || 0;
  const pedidosAprovados = pedidos?.filter(p => p.pagamentoStatus === 'APROVADO').length || 0;
  
  const totalPontosFidelidade = loyaltyPoints?.reduce((acc, point) => acc + point.pontos, 0) || 0;
  const clientesComPontos = loyaltyPoints ? 
    [...new Set(loyaltyPoints.map(p => p.cliente.id))].length : 0;

  return (
    <div className="dashboard">
      <Breadcrumbs
        items={[
          { label: 'Dashboard' }
        ]}
        showHome={false}
      />

      <div className="dashboard__header">
        <div className="dashboard__header-content">
          <div>
            <h1 className="dashboard__title">Dashboard</h1>
            <p className="dashboard__subtitle">Visão geral do sistema de gestão da pizzaria</p>
          </div>
          <div className="dashboard__header-actions">
            <Button
              variant="outlined"
              size="sm"
              icon={<RefreshIcon />}
            >
              Atualizar
            </Button>
            <div className="dashboard__status-badge">
              <span className="dashboard__status-indicator" />
              Tempo Real
            </div>
          </div>
        </div>
      </div>

      {/* Cards principais */}
      <div className="dashboard__grid">
        <DashboardCard
          title="Total de Clientes"
          subtitle="Clientes cadastrados"
          value={totalClientes.toLocaleString()}
          icon={<PeopleIcon />}
          color="#667eea"
          loading={loadingClientes}
          trend={{ value: 12, isPositive: true }}
        />
        
        <DashboardCard
          title="Produtos Ativos"
          subtitle="Itens no cardápio"
          value={totalProdutos.toLocaleString()}
          icon={<RestaurantIcon />}
          color="#48bb78"
          loading={loadingProdutos}
          trend={{ value: 5, isPositive: true }}
        />
        
        <DashboardCard
          title="Total de Pedidos"
          subtitle="Pedidos realizados"
          value={totalPedidos.toLocaleString()}
          icon={<ShoppingCartIcon />}
          color="#ed8936"
          loading={loadingPedidos}
          trend={{ value: 8, isPositive: true }}
        />
        
        <DashboardCard
          title="Motoboys Ativos"
          subtitle="Entregadores disponíveis"
          value={totalMotoboys.toLocaleString()}
          icon={<DeliveryIcon />}
          color="#38b2ac"
          loading={loadingMotoboys}
        />
        
        <DashboardCard
          title="Faturamento Total"
          subtitle="Receita total"
          value={`R$ ${valorTotalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<MoneyIcon />}
          color="#9f7aea"
          loading={loadingPedidos}
          trend={{ value: 15, isPositive: true }}
        />
        
        <DashboardCard
          title="Pedidos Pendentes"
          subtitle="Aguardando processamento"
          value={pedidosPendentes.toLocaleString()}
          icon={<PendingIcon />}
          color="#f56565"
          loading={loadingPedidos}
        />
        
        <DashboardCard
          title="Pedidos Aprovados"
          subtitle="Pagamentos confirmados"
          value={pedidosAprovados.toLocaleString()}
          icon={<CheckIcon />}
          color="#48bb78"
          loading={loadingPedidos}
        />
        
        <DashboardCard
          title="Pontos de Fidelidade"
          subtitle={`${clientesComPontos} clientes participantes`}
          value={totalPontosFidelidade.toLocaleString()}
          icon={<StarIcon />}
          color="#ed8936"
          loading={loadingLoyalty}
        />
      </div>

      {/* Seção de métricas adicionais */}
      <Card className="dashboard__metrics" variant="outlined">
        <div className="dashboard__metrics-header">
          <h2 className="dashboard__metrics-title">Métricas de Performance</h2>
          <p className="dashboard__metrics-subtitle">Indicadores chave de performance do negócio</p>
        </div>
        
        <div className="dashboard__metrics-grid">
          <div className="dashboard__metric">
            <div className="dashboard__metric-header">
              <h4 className="dashboard__metric-title">Taxa de Aprovação</h4>
              <span className="dashboard__metric-value">
                {totalPedidos > 0 ? Math.round((pedidosAprovados / totalPedidos) * 100) : 0}%
              </span>
            </div>
            <div className="dashboard__metric-bar">
              <div 
                className="dashboard__metric-progress"
                style={{ 
                  width: `${totalPedidos > 0 ? (pedidosAprovados / totalPedidos) * 100 : 0}%`,
                  backgroundColor: '#48bb78'
                }}
              />
            </div>
          </div>
          
          <div className="dashboard__metric">
            <div className="dashboard__metric-header">
              <h4 className="dashboard__metric-title">Engajamento Fidelidade</h4>
              <span className="dashboard__metric-value">
                {totalClientes > 0 ? Math.round((clientesComPontos / totalClientes) * 100) : 0}%
              </span>
            </div>
            <div className="dashboard__metric-bar">
              <div 
                className="dashboard__metric-progress"
                style={{ 
                  width: `${totalClientes > 0 ? (clientesComPontos / totalClientes) * 100 : 0}%`,
                  backgroundColor: '#ed8936'
                }}
              />
            </div>
          </div>
          
          <div className="dashboard__metric">
            <div className="dashboard__metric-header">
              <h4 className="dashboard__metric-title">Capacidade de Entrega</h4>
              <span className="dashboard__metric-value">
                {totalMotoboys > 0 ? Math.min(100, Math.round((totalMotoboys / Math.max(1, pedidosPendentes)) * 100)) : 0}%
              </span>
            </div>
            <div className="dashboard__metric-bar">
              <div 
                className="dashboard__metric-progress"
                style={{ 
                  width: `${totalMotoboys > 0 ? Math.min(100, (totalMotoboys / Math.max(1, pedidosPendentes)) * 100) : 0}%`,
                  backgroundColor: '#38b2ac'
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
