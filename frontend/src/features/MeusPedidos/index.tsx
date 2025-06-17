import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
  Stack,
  Avatar,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { useFetch } from '../../hooks/useFetch';
import { Pedido } from '../../types/Pedido';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'CRIADO':
      return <PendingIcon color="info" />;
    case 'PENDENTE':
      return <TimeIcon color="warning" />;
    case 'CANCELADO':
      return <CancelIcon color="error" />;
    default:
      return <ReceiptIcon color="action" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CRIADO':
      return 'info';
    case 'PENDENTE':
      return 'warning';
    case 'CANCELADO':
      return 'error';
    default:
      return 'default';
  }
};

const getPagamentoColor = (status: string) => {
  switch (status) {
    case 'APROVADO':
      return 'success';
    case 'PENDENTE':
      return 'warning';
    default:
      return 'default';
  }
};

const MeusPedidos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { role } = useAuth();
  const [expandedPedido, setExpandedPedido] = useState<number | null>(null);
  
  // Se não for cliente, redireciona para a tela normal
  const endpoint = role === 'CLIENTE' ? '/pedidos/meus' : '/pedidos';
  const { data: pedidos, loading, error } = useFetch<Pedido[]>(endpoint);

  const handleToggleExpand = (pedidoId: number) => {
    setExpandedPedido(expandedPedido === pedidoId ? null : pedidoId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Carregando seus pedidos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">Erro ao carregar pedidos</Typography>
      </Box>
    );
  }

  const totalPedidos = pedidos?.length || 0;
  const valorTotal = pedidos?.reduce((acc, pedido) => acc + pedido.valorTotal, 0) || 0;

  return (
    <div className="meus-pedidos-page">
      {/* Header mobile-friendly */}
      <Box mb={isMobile ? 2 : 3}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <ShoppingCartIcon />
          </Avatar>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1">
              Meus Pedidos
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Acompanhe seus pedidos em tempo real
            </Typography>
          </Box>
        </Stack>

        {/* Resumo em cards mobile */}
        <Stack direction={isMobile ? "column" : "row"} spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: isMobile ? 1.5 : 2 }}>
              <Typography variant="body2" color="textSecondary">
                Total de Pedidos
              </Typography>
              <Typography variant="h6" color="primary">
                {totalPedidos}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: isMobile ? 1.5 : 2 }}>
              <Typography variant="body2" color="textSecondary">
                Valor Total
              </Typography>
              <Typography variant="h6" color="secondary">
                R$ {valorTotal.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Lista de pedidos otimizada para mobile */}
      {pedidos?.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Nenhum pedido encontrado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Seus pedidos aparecerão aqui quando você fizer um
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {pedidos?.map((pedido, index) => (
            <React.Fragment key={pedido.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  mb: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                {/* Header do pedido */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  onClick={() => handleToggleExpand(pedido.id)}
                  sx={{ cursor: 'pointer', py: 1 }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(pedido.status)}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Pedido #{pedido.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(pedido.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      R$ {pedido.valorTotal.toFixed(2)}
                    </Typography>
                    <IconButton size="small">
                      {expandedPedido === pedido.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Status chips */}
                <Stack direction="row" spacing={1} mb={1}>
                  <Chip
                    label={pedido.status}
                    color={getStatusColor(pedido.status) as any}
                    size="small"
                  />
                  <Chip
                    label={pedido.pagamentoStatus}
                    color={getPagamentoColor(pedido.pagamentoStatus) as any}
                    size="small"
                  />
                  <Chip
                    label={`${pedido.itens.length} ${pedido.itens.length === 1 ? 'item' : 'itens'}`}
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                {/* Detalhes expansíveis */}
                <Collapse in={expandedPedido === pedido.id} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Itens do Pedido:
                  </Typography>
                  
                  {pedido.itens.map((item, itemIndex) => (
                    <Box
                      key={itemIndex}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      py={0.5}
                      sx={{
                        borderBottom: itemIndex < pedido.itens.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                      }}
                    >
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.produto.nome}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          R$ {item.precoUnitario.toFixed(2)} × {item.quantidade}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="bold">
                        R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                    pt={1}
                    sx={{ borderTop: '2px solid', borderColor: 'primary.main' }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total do Pedido
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      R$ {pedido.valorTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Collapse>
              </ListItem>
              
              {index < (pedidos?.length || 0) - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
  );
};

export default MeusPedidos;
