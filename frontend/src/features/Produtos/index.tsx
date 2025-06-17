import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Button from '../../components/atoms/Button';
import { useFetch } from '../../hooks/useFetch';
import { Product } from '../../types/Product';
import apiClient from '../../services/apiClient';
import './styles.css';

const Produtos: React.FC = () => {
  const { data: produtos, loading, error } = useFetch<Product[]>('/produtos');
  const [open, setOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ nome: '', preco: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
      };
      
      if (editingProduto) {
        await apiClient.put(`/produtos/${editingProduto.id}`, payload);
      } else {
        await apiClient.post('/produtos', payload);
      }
      setOpen(false);
      setEditingProduto(null);
      setFormData({ nome: '', preco: '' });
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (produto: Product) => {
    setEditingProduto(produto);
    setFormData({ nome: produto.nome, preco: produto.preco.toString() });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await apiClient.delete(`/produtos/${id}`);
        window.location.reload();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduto(null);
    setFormData({ nome: '', preco: '' });
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="produtos-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gerenciar Produtos
        </Typography>
        <Chip label={`${produtos?.length || 0} produtos`} color="primary" />
      </Box>

      <Grid container spacing={3}>
        {produtos?.map((produto) => (
          <Grid item xs={12} sm={6} md={4} key={produto.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {produto.nome}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  R$ {produto.preco.toFixed(2)}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <IconButton onClick={() => handleEdit(produto)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(produto.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        aria-label="add"
        className="fab-add"
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingProduto ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Preço"
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingProduto ? 'Salvar' : 'Criar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Produtos;
