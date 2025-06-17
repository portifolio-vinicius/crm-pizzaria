import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Restaurant as RestaurantIcon,
  DeliveryDining as DeliveryIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useFetch } from '../../hooks/useFetch';
import { Cliente } from '../../types/Cliente';
import { Product } from '../../types/Product';
import { Pedido } from '../../types/Pedido';
import { Motoboy } from '../../types/Motoboy';
import { LoyaltyPoint } from '../../types/LoyaltyPoint';
import './styles.css';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, loading }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {loading ? <LinearProgress /> : value}
          </Typography>
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
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
  
  const valorTotalVendas = pedidos?.reduce((acc, pedido) => acc + pedido.valorTotal, 0) || 0;
  const pedidosPendentes = pedidos?.filter(p => p.status === 'PENDENTE').length || 0;
  const pedidosAprovados = pedidos?.filter(p => p.pagamentoStatus === 'APROVADO').length || 0;
  
  const totalPontosFidelidade = loyaltyPoints?.reduce((acc, point) => acc + point.pontos, 0) || 0;
  const clientesComPontos = loyaltyPoints ? 
    [...new Set(loyaltyPoints.map(p => p.cliente.id))].length : 0;

  return (
    <div className="dashboard-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Chip 
          label="Visão Geral" 
          color="primary" 
          icon={<TrendingUpIcon />}
        />
      </Box>

      {/* Cards principais */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total de Clientes"
            value={totalClientes}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="primary"
            loading={loadingClientes}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total de Produtos"
            value={totalProdutos}
            icon={<RestaurantIcon sx={{ fontSize: 40 }} />}
            color="secondary"
            loading={loadingProdutos}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total de Pedidos"
            value={totalPedidos}
            icon={<ShoppingCartIcon sx={{ fontSize: 40 }} />}
            color="success"
            loading={loadingPedidos}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Motoboys Ativos"
            value={totalMotoboys}
            icon={<DeliveryIcon sx={{ fontSize: 40 }} />}
            color="warning"
            loading={loadingMotoboys}
          />
        </Grid>
      </Grid>

      {/* Cards secundários */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Valor Total de Vendas"
            value={`R$ ${valorTotalVendas.toFixed(2)}`}
            icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
            color="success"
            loading={loadingPedidos}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Pedidos Pendentes"
            value={pedidosPendentes}
            icon={<ShoppingCartIcon sx={{ fontSize: 40 }} />}
            color="warning"
            loading={loadingPedidos}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard
            title="Pedidos Aprovados"
            value={pedidosAprovados}
            icon={<ShoppingCartIcon sx={{ fontSize: 40 }} />}
            color="success"
            loading={loadingPedidos}
          />
        </Grid>
      </Grid>

      {/* Cards de fidelidade */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DashboardCard
            title="Total de Pontos"
            value={totalPontosFidelidade}
            icon={<StarIcon sx={{ fontSize: 40 }} />}
            color="info"
            loading={loadingLoyalty}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DashboardCard
            title="Clientes com Pontos"
            value={clientesComPontos}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="info"
            loading={loadingLoyalty}
          />
        </Grid>
      </Grid>

      {/* Resumo rápido */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Resumo Rápido
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary.main">
                  {((pedidosAprovados / Math.max(totalPedidos, 1)) * 100).toFixed(1)}%
                </Typography>
                <Typography color="textSecondary">Taxa de Aprovação</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="success.main">
                  R$ {totalPedidos > 0 ? (valorTotalVendas / totalPedidos).toFixed(2) : '0.00'}
                </Typography>
                <Typography color="textSecondary">Ticket Médio</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="info.main">
                  {clientesComPontos > 0 ? (totalPontosFidelidade / clientesComPontos).toFixed(0) : '0'}
                </Typography>
                <Typography color="textSecondary">Pontos por Cliente</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning.main">
                  {totalMotoboys > 0 ? Math.ceil(totalPedidos / totalMotoboys) : '0'}
                </Typography>
                <Typography color="textSecondary">Pedidos por Motoboy</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
