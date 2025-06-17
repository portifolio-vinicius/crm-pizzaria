import React from 'react';
import { Typography, Card, CardContent, Box, Chip, useMediaQuery, useTheme, Stack, Grid, Button as MuiButton } from '@mui/material';
import { Restaurant as RestaurantIcon, ShoppingCart as CartIcon, Star as StarIcon } from '@mui/icons-material';
import Button from '../../components/atoms/Button';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/redux/hooks';
import { increment } from '../../state/redux/slices/sampleSlice';
import { useFetch } from '../../hooks/useFetch';
import { Product } from '../../types/Product';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.sample.value);
  const { data: products, loading } = useFetch<Product[]>('/produtos');
  const { token, role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className="home-page">
      {/* Header responsivo */}
      <Box textAlign="center" mb={isMobile ? 3 : 4}>
        <RestaurantIcon sx={{ fontSize: isMobile ? 60 : 80, color: 'primary.main', mb: 2 }} />
        <Typography variant={isMobile ? "h4" : "h3"} component="h1" gutterBottom>
          {isMobile ? "CRM Pizzaria" : "Bem-vindo ao CRM Pizzaria"}
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} color="textSecondary" paragraph>
          {isMobile 
            ? "Gerencie sua pizzaria com facilidade" 
            : "Sistema de gerenciamento completo para sua pizzaria"
          }
        </Typography>
        
        {token && role && (
          <Chip 
            label={`${role}`} 
            color="primary" 
            sx={{ mb: 3 }}
            size={isMobile ? "small" : "medium"}
          />
        )}
      </Box>

      {/* Navegação rápida para clientes mobile */}
      {token && role === 'CLIENTE' && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: isMobile ? 2 : 3 }}>
                <CartIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Meus Pedidos
                </Typography>
                <MuiButton 
                  variant="contained" 
                  component={Link} 
                  to="/meus-pedidos"
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                >
                  Ver Pedidos
                </MuiButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: isMobile ? 2 : 3 }}>
                <StarIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Fidelidade
                </Typography>
                <MuiButton 
                  variant="outlined" 
                  component={Link} 
                  to="/meus-pontos"
                  size={isMobile ? "small" : "medium"}
                  fullWidth
                >
                  Ver Pontos
                </MuiButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Seção do contador - apenas para demonstração */}
      {!isMobile && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Contador de Exemplo
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              {value}
            </Typography>
            <Button variant="contained" onClick={() => dispatch(increment())}>
              Incrementar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Seção de produtos públicos */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Nosso Cardápio
          </Typography>
          {loading && <Typography>Carregando produtos...</Typography>}
          {products && products.length > 0 ? (
            <Box>
              <Typography variant="body1" color="textSecondary" paragraph>
                Confira alguns dos nossos produtos:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {products.slice(0, 6).map((p) => (
                  <Chip
                    key={p.id}
                    label={`${p.nome} - R$ ${p.preco.toFixed(2)}`}
                    variant="outlined"
                  />
                ))}
              </Box>
              {token ? (
                <MuiButton variant="contained" component={Link} to="/produtos">
                  Gerenciar Produtos
                </MuiButton>
              ) : (
                <MuiButton variant="outlined" component={Link} to="/profile">
                  Faça Login para Gerenciar
                </MuiButton>
              )}
            </Box>
          ) : (
            <Typography color="textSecondary">
              Nenhum produto disponível no momento.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Links de navegação */}
      {token && (
        <Box mt={4} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Acesso Rápido
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            {(role === 'ADMIN' || role === 'ASSISTENTE') && (
              <>
                <MuiButton variant="outlined" component={Link} to="/dashboard">
                  Dashboard
                </MuiButton>
                <MuiButton variant="outlined" component={Link} to="/pedidos">
                  Pedidos
                </MuiButton>
                <MuiButton variant="outlined" component={Link} to="/fidelidade">
                  Fidelidade
                </MuiButton>
              </>
            )}
            {role === 'ADMIN' && (
              <MuiButton variant="outlined" component={Link} to="/clientes">
                Clientes
              </MuiButton>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Home;
