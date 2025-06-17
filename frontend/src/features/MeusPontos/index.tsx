import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Stack,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useFetch } from '../../hooks/useFetch';
import { LoyaltyPoint } from '../../types/LoyaltyPoint';
import { formatDate } from '../../utils/formatDate';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

const MeusPontos: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useAuth();
  
  // Busca pontos de fidelidade do cliente
  const { data: pontos, loading, error } = useFetch<LoyaltyPoint[]>('/fidelidade/meus');

  if (!token) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Faça login para ver seus pontos</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography>Carregando seus pontos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">Erro ao carregar pontos</Typography>
      </Box>
    );
  }

  const totalPontos = pontos?.reduce((acc, ponto) => acc + ponto.pontos, 0) || 0;
  const proximoNivel = Math.ceil(totalPontos / 100) * 100;
  const progressoAtual = (totalPontos % 100);

  return (
    <div className="meus-pontos-page">
      {/* Header mobile-friendly */}
      <Box mb={isMobile ? 2 : 3}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            <StarIcon />
          </Avatar>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1">
              Meus Pontos
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Programa de fidelidade CRM Pizzaria
            </Typography>
          </Box>
        </Stack>

        {/* Resumo de pontos */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: isMobile ? 2 : 3 }}>
            <TrophyIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h3" color="secondary" fontWeight="bold" gutterBottom>
              {totalPontos}
            </Typography>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Pontos Acumulados
            </Typography>
            
            {totalPontos > 0 && (
              <Box mt={3}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Progresso para o próximo nível ({proximoNivel} pontos)
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progressoAtual} 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption" color="textSecondary">
                  {progressoAtual}/100 pontos para o próximo nível
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Stack direction={isMobile ? "column" : "row"} spacing={2} mb={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: isMobile ? 1.5 : 2 }}>
              <Typography variant="body2" color="textSecondary">
                Total de Registros
              </Typography>
              <Typography variant="h6" color="primary">
                {pontos?.length || 0}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ py: isMobile ? 1.5 : 2 }}>
              <Typography variant="body2" color="textSecondary">
                Média por Pedido
              </Typography>
              <Typography variant="h6" color="secondary">
                {pontos?.length ? (totalPontos / pontos.length).toFixed(1) : '0'} pts
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* Histórico de pontos */}
      {pontos?.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <StarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Nenhum ponto encontrado
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Faça pedidos para ganhar pontos de fidelidade!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Histórico de Pontos
            </Typography>
            <List sx={{ width: '100%' }}>
              {pontos?.map((ponto, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < pontos.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    px: 0,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight="medium">
                          Pedido #{ponto.id}
                        </Typography>
                        <Chip 
                          label={`+${ponto.pontos} pts`}
                          color="secondary"
                          size="small"
                          icon={<StarIcon />}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(ponto.createdAt)} • Valor: R$ {ponto.valorPedido?.toFixed(2) || '0.00'}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeusPontos;
