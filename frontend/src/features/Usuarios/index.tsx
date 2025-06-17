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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import Button from '../../components/atoms/Button';
import { Usuario, CreateUsuarioRequest } from '../../types/Usuario';
import apiClient from '../../services/apiClient';
import './styles.css';

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'ASSISTENTE' });

  // Como não há endpoint GET para usuários, simulamos uma lista vazia inicialmente
  React.useEffect(() => {
    // Aqui poderia ter um endpoint para listar usuários se existisse
    setUsuarios([]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let endpoint = '';
      switch (formData.role) {
        case 'ADMIN':
          endpoint = '/auth/register/admin';
          break;
        case 'ASSISTENTE':
          endpoint = '/auth/register/operador';
          break;
        case 'CLIENTE':
          endpoint = '/auth/register/client';
          break;
        default:
          throw new Error('Role inválida');
      }

      const payload: CreateUsuarioRequest = {
        username: formData.username,
        password: formData.password,
      };

      await apiClient.post(endpoint, payload);
      setOpen(false);
      setFormData({ username: '', password: '', role: 'ASSISTENTE' });
      alert('Usuário criado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ username: '', password: '', role: 'ASSISTENTE' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'ASSISTENTE':
        return 'warning';
      case 'CLIENTE':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="usuarios-page">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gerenciar Usuários
        </Typography>
        <Chip label={`${usuarios.length} usuários`} color="primary" />
      </Box>

      {/* Instruções para admin */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Criação de Usuários
          </Typography>
          <Typography color="textSecondary" paragraph>
            Como administrador, você pode criar novos usuários do sistema:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" mb={1}>
                <Chip label="ADMIN" color="error" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Acesso total ao sistema</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" mb={1}>
                <Chip label="ASSISTENTE" color="warning" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Gerencia produtos, pedidos e motoboys</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" mb={1}>
                <Chip label="CLIENTE" color="info" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Pode fazer pedidos</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Lista de usuários (vazia por enquanto) */}
      {usuarios.length === 0 && (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Lista de usuários não disponível
              </Typography>
              <Typography color="textSecondary">
                Use o botão + para criar novos usuários no sistema
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

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
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome de usuário"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
              margin="normal"
              required
              helperText="Nome único para login"
            />
            <TextField
              label="Senha"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              margin="normal"
              required
              helperText="Mínimo 6 caracteres"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de usuário</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Tipo de usuário"
              >
                <MenuItem value="CLIENTE">Cliente</MenuItem>
                <MenuItem value="ASSISTENTE">Assistente</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default Usuarios;
