import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useFetch } from '../../hooks/useFetch';
import { Pedido } from '../../types/Pedido';
import { formatDate } from '../../utils/formatDate';
import './styles.css';

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

const Pedidos: React.FC = () => {
  const { data: pedidos, loading, error } = useFetch<Pedido[]>('/pedidos');

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalPedidos = pedidos?.length || 0;
  const valorTotal = pedidos?.reduce((acc, pedido) => acc + pedido.valorTotal, 0) || 0;

  return (
    <div className="pedidos-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gerenciar Pedidos
        </Typography>
        <Box display="flex" gap={2}>
          <Chip label={`${totalPedidos} pedidos`} color="primary" />
          <Chip label={`Total: R$ ${valorTotal.toFixed(2)}`} color="secondary" />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {pedidos?.map((pedido) => (
          <Grid item xs={12} key={pedido.id}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <Box>
                    <Typography variant="h6">
                      Pedido #{pedido.id} - {pedido.cliente.nome}
                    </Typography>
                    <Typography color="textSecondary">
                      {formatDate(pedido.createdAt)} - {pedido.cliente.email}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} mr={2}>
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
                      label={`R$ ${pedido.valorTotal.toFixed(2)}`} 
                      color="primary" 
                      size="small"
                    />
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell align="center">Quantidade</TableCell>
                        <TableCell align="right">Preço Unitário</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pedido.itens.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.produto.nome}</TableCell>
                          <TableCell align="center">{item.quantidade}</TableCell>
                          <TableCell align="right">R$ {item.precoUnitario.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3}>
                          <strong>Total do Pedido</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>R$ {pedido.valorTotal.toFixed(2)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {pedidos?.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="textSecondary">
            Nenhum pedido encontrado
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default Pedidos;
