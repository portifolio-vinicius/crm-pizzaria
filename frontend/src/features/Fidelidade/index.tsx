import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { useFetch } from '../../hooks/useFetch';
import { LoyaltyPoint } from '../../types/LoyaltyPoint';
import './styles.css';

const Fidelidade: React.FC = () => {
  const { data: loyaltyPoints, loading, error } = useFetch<LoyaltyPoint[]>('/fidelidade');

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Agrupa pontos por cliente
  const pontosAgrupados = loyaltyPoints?.reduce((acc, point) => {
    const clienteId = point.cliente.id;
    if (!acc[clienteId]) {
      acc[clienteId] = {
        cliente: point.cliente,
        totalPontos: 0,
        registros: []
      };
    }
    acc[clienteId].totalPontos += point.pontos;
    acc[clienteId].registros.push(point);
    return acc;
  }, {} as Record<number, { cliente: any, totalPontos: number, registros: LoyaltyPoint[] }>) || {};

  const clientesComPontos = Object.values(pontosAgrupados).sort((a, b) => b.totalPontos - a.totalPontos);
  const totalPontos = loyaltyPoints?.reduce((acc, point) => acc + point.pontos, 0) || 0;

  return (
    <div className="fidelidade-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Programa de Fidelidade
        </Typography>
        <Box display="flex" gap={2}>
          <Chip 
            label={`${clientesComPontos.length} clientes ativos`} 
            color="primary" 
            icon={<StarIcon />}
          />
          <Chip 
            label={`${totalPontos} pontos totais`} 
            color="secondary" 
          />
        </Box>
      </Box>

      {/* Ranking de clientes */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ranking de Clientes
              </Typography>
              <Grid container spacing={2}>
                {clientesComPontos.slice(0, 3).map((cliente, index) => (
                  <Grid item xs={12} sm={4} key={cliente.cliente.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : '#cd7f32', mr: 2 }}>
                            {index + 1}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{cliente.cliente.nome}</Typography>
                            <Typography color="textSecondary">{cliente.cliente.email}</Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label={`${cliente.totalPontos} pontos`}
                          color="primary"
                          icon={<StarIcon />}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela detalhada */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Todos os Clientes
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Posição</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Total de Pontos</TableCell>
                  <TableCell align="center">Registros</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientesComPontos.map((cliente, index) => (
                  <TableRow key={cliente.cliente.id}>
                    <TableCell>
                      <Avatar sx={{ 
                        bgcolor: index < 3 ? 'primary.main' : 'grey.400',
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}>
                        {index + 1}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {cliente.cliente.nome}
                      </Typography>
                    </TableCell>
                    <TableCell>{cliente.cliente.email}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={cliente.totalPontos}
                        color="primary"
                        size="small"
                        icon={<StarIcon />}
                      />
                    </TableCell>
                    <TableCell align="center">{cliente.registros.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {clientesComPontos.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            Nenhum ponto de fidelidade encontrado
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default Fidelidade;
