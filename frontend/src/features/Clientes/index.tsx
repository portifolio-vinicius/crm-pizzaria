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
import { Cliente } from '../../types/Cliente';
import apiClient from '../../services/apiClient';
import './styles.css';

const Clientes: React.FC = () => {
  const { data: clientes, loading, error } = useFetch<Cliente[]>('/clientes');
  const [open, setOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({ nome: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await apiClient.put(`/clientes/${editingCliente.id}`, formData);
      } else {
        await apiClient.post('/clientes', formData);
      }
      setOpen(false);
      setEditingCliente(null);
      setFormData({ nome: '', email: '' });
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({ nome: cliente.nome, email: cliente.email });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await apiClient.delete(`/clientes/${id}`);
        window.location.reload();
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCliente(null);
    setFormData({ nome: '', email: '' });
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="clientes-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gerenciar Clientes
        </Typography>
        <Chip label={`${clientes?.length || 0} clientes`} color="primary" />
      </Box>

      <Grid container spacing={3}>
        {clientes?.map((cliente) => (
          <Grid item xs={12} sm={6} md={4} key={cliente.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {cliente.nome}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {cliente.email}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <IconButton onClick={() => handleEdit(cliente)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cliente.id)} color="error">
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
            {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
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
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingCliente ? 'Salvar' : 'Criar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Clientes;
