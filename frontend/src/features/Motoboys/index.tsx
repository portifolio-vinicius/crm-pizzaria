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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Phone as PhoneIcon } from '@mui/icons-material';
import Button from '../../components/atoms/Button';
import { useFetch } from '../../hooks/useFetch';
import { Motoboy } from '../../types/Motoboy';
import apiClient from '../../services/apiClient';
import './styles.css';

const Motoboys: React.FC = () => {
  const { data: motoboys, loading, error } = useFetch<Motoboy[]>('/motoboys');
  const [open, setOpen] = useState(false);
  const [editingMotoboy, setEditingMotoboy] = useState<Motoboy | null>(null);
  const [formData, setFormData] = useState({ nome: '', telefone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMotoboy) {
        await apiClient.put(`/motoboys/${editingMotoboy.id}`, formData);
      } else {
        await apiClient.post('/motoboys', formData);
      }
      setOpen(false);
      setEditingMotoboy(null);
      setFormData({ nome: '', telefone: '' });
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar motoboy:', error);
    }
  };

  const handleEdit = (motoboy: Motoboy) => {
    setEditingMotoboy(motoboy);
    setFormData({ nome: motoboy.nome, telefone: motoboy.telefone });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este motoboy?')) {
      try {
        await apiClient.delete(`/motoboys/${id}`);
        window.location.reload();
      } catch (error) {
        console.error('Erro ao deletar motoboy:', error);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMotoboy(null);
    setFormData({ nome: '', telefone: '' });
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="motoboys-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gerenciar Motoboys
        </Typography>
        <Chip label={`${motoboys?.length || 0} motoboys`} color="primary" />
      </Box>

      <Grid container spacing={3}>
        {motoboys?.map((motoboy) => (
          <Grid item xs={12} sm={6} md={4} key={motoboy.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {motoboy.nome}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <PhoneIcon fontSize="small" style={{ marginRight: 8 }} />
                  <Typography color="textSecondary">
                    {motoboy.telefone}
                  </Typography>
                </Box>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <IconButton onClick={() => handleEdit(motoboy)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(motoboy.id)} color="error">
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
            {editingMotoboy ? 'Editar Motoboy' : 'Novo Motoboy'}
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
              label="Telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingMotoboy ? 'Salvar' : 'Criar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Motoboys;
