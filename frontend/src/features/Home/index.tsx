import React from 'react';
import { Typography, Card, CardContent, Box, Chip } from '@mui/material';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
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

  return (
    <div className="home-page">
      <Box textAlign="center" mb={4}>
        <RestaurantIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Bem-vindo ao CRM Pizzaria
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Sistema de gerenciamento completo para sua pizzaria
        </Typography>
        
        {token && role && (
          <Chip 
            label={`Logado como: ${role}`} 
            color="primary" 
            sx={{ mb: 3 }}
          />
        )}
      </Box>

      {/* Seção do contador (exemplo) */}
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
                <Button variant="contained" component={Link} to="/produtos">
                  Gerenciar Produtos
                </Button>
              ) : (
                <Button variant="outlined" component={Link} to="/profile">
                  Faça Login para Gerenciar
                </Button>
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
                <Button variant="outlined" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button variant="outlined" component={Link} to="/pedidos">
                  Pedidos
                </Button>
                <Button variant="outlined" component={Link} to="/fidelidade">
                  Fidelidade
                </Button>
              </>
            )}
            {role === 'ADMIN' && (
              <Button variant="outlined" component={Link} to="/clientes">
                Clientes
              </Button>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Home;
