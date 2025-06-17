import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, ShoppingCart as CartIcon } from '@mui/icons-material';
import Button from '../../components/atoms/Button';
import { useFetch } from '../../hooks/useFetch';
import { Cliente } from '../../types/Cliente';
import { Product } from '../../types/Product';
import { CreatePedidoRequest } from '../../types/Pedido';
import apiClient from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';
import './styles.css';

interface ItemCarrinho {
  produto: Product;
  quantidade: number;
  precoUnitario: number;
}

const CriarPedido: React.FC = () => {
  const navigate = useNavigate();
  const { data: clientes } = useFetch<Cliente[]>('/clientes');
  const { data: produtos } = useFetch<Product[]>('/produtos');
  
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(false);

  const adicionarAoCarrinho = () => {
    if (!produtoSelecionado) return;

    const itemExistente = carrinho.find(item => item.produto.id === produtoSelecionado.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.produto.id === produtoSelecionado.id
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      ));
    } else {
      const novoItem: ItemCarrinho = {
        produto: produtoSelecionado,
        quantidade,
        precoUnitario: produtoSelecionado.preco
      };
      setCarrinho([...carrinho, novoItem]);
    }

    setProdutoSelecionado(null);
    setQuantidade(1);
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const alterarQuantidade = (produtoId: number, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }

    setCarrinho(carrinho.map(item =>
      item.produto.id === produtoId
        ? { ...item, quantidade: novaQuantidade }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
  };

  const finalizarPedido = async () => {
    if (!clienteSelecionado || carrinho.length === 0) {
      alert('Selecione um cliente e adicione produtos ao carrinho');
      return;
    }

    setLoading(true);
    try {
      const pedidoRequest: CreatePedidoRequest = {
        cliente: {
          id: clienteSelecionado.id
        },
        itens: carrinho.map(item => ({
          produto: {
            id: item.produto.id
          },
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario
        }))
      };

      await apiClient.post('/pedidos', pedidoRequest);
      alert('Pedido criado com sucesso!');
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-pedido-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Criar Novo Pedido
        </Typography>
        <Chip 
          label={`${carrinho.length} itens no carrinho`} 
          color="primary" 
          icon={<CartIcon />}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Seleção de Cliente */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                1. Selecione o Cliente
              </Typography>
              <Autocomplete
                options={clientes || []}
                getOptionLabel={(cliente) => `${cliente.nome} - ${cliente.email}`}
                value={clienteSelecionado}
                onChange={(_, newValue) => setClienteSelecionado(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Cliente" placeholder="Selecione um cliente" />
                )}
                fullWidth
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Adição de Produtos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                2. Adicione Produtos ao Carrinho
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={produtos || []}
                    getOptionLabel={(produto) => `${produto.nome} - R$ ${produto.preco.toFixed(2)}`}
                    value={produtoSelecionado}
                    onChange={(_, newValue) => setProdutoSelecionado(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Produto" placeholder="Selecione um produto" />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    type="number"
                    label="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                    inputProps={{ min: 1 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Button
                    variant="contained"
                    onClick={adicionarAoCarrinho}
                    disabled={!produtoSelecionado}
                    startIcon={<AddIcon />}
                    fullWidth
                  >
                    Adicionar
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Carrinho de Compras */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                3. Carrinho de Compras
              </Typography>
              {carrinho.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Typography color="textSecondary">
                    Nenhum item no carrinho
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Produto</TableCell>
                          <TableCell align="center">Preço Unit.</TableCell>
                          <TableCell align="center">Quantidade</TableCell>
                          <TableCell align="center">Total</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {carrinho.map((item) => (
                          <TableRow key={item.produto.id}>
                            <TableCell>{item.produto.nome}</TableCell>
                            <TableCell align="center">R$ {item.precoUnitario.toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <Box display="flex" alignItems="center" justifyContent="center">
                                <IconButton 
                                  size="small" 
                                  onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                                >
                                  <RemoveIcon />
                                </IconButton>
                                <Typography sx={{ mx: 2 }}>{item.quantidade}</Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                color="error" 
                                onClick={() => removerDoCarrinho(item.produto.id)}
                              >
                                <RemoveIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3}>
                            <strong>Total do Pedido</strong>
                          </TableCell>
                          <TableCell align="center">
                            <strong>R$ {calcularTotal().toFixed(2)}</strong>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="outlined" onClick={() => navigate('/pedidos')}>
                      Cancelar
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={finalizarPedido}
                      disabled={!clienteSelecionado || carrinho.length === 0 || loading}
                      startIcon={<CartIcon />}
                    >
                      {loading ? 'Criando...' : 'Finalizar Pedido'}
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default CriarPedido;
