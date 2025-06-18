import React, { useState } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Box, 
  Chip, 
  Grid, 
  Button as MuiButton,
  Tabs,
  Tab,
  CardMedia,
  CardActions,
  Divider
} from '@mui/material';
import { 
  Restaurant as RestaurantIcon, 
  LocalDrink as DrinkIcon,
  Cake as CakeIcon,
  Fastfood as SideIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { Product } from '../../types/Product';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cardapio-tabpanel-${index}`}
      aria-labelledby={`cardapio-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Cardapio: React.FC = () => {
  const { data: products, loading } = useFetch<Product[]>('/produtos');
  const { role } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getProductsByCategory = (categoria: string) => {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    return products.filter(p => {
      // Suporte para ambos os formatos: objeto categoria ou string direta
      const categoryName = typeof p.categoria === 'object' && p.categoria?.nome 
        ? p.categoria.nome 
        : p.categoriaNome || p.categoria;
      return categoryName === categoria;
    });
  };

  const getIcon = (categoria: string) => {
    switch (categoria) {
      case 'PIZZA': return <RestaurantIcon />;
      case 'BEBIDA': return <DrinkIcon />;
      case 'SOBREMESA': return <CakeIcon />;
      case 'ACOMPANHAMENTO': return <SideIcon />;
      default: return <RestaurantIcon />;
    }
  };

  const categories = [
    { key: 'PIZZA', label: 'Pizzas', icon: <RestaurantIcon /> },
    { key: 'BEBIDA', label: 'Bebidas', icon: <DrinkIcon /> },
    { key: 'SOBREMESA', label: 'Sobremesas', icon: <CakeIcon /> },
    { key: 'ACOMPANHAMENTO', label: 'Acompanhamentos', icon: <SideIcon /> }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="cardapio-page">
        <Typography>Carregando cardápio...</Typography>
      </div>
    );
  }

  return (
    <div className="cardapio-page">
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          🍕 Cardápio da Pizzaria
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Delicie-se com nossas especialidades artesanais
        </Typography>
        
        {role === 'CLIENTE' && (
          <Box mt={2}>
            <MuiButton 
              variant="contained" 
              size="large"
              startIcon={<CartIcon />}
              component={Link}
              to="/meus-pedidos"
              sx={{ mr: 2 }}
            >
              Meus Pedidos
            </MuiButton>
            <MuiButton 
              variant="outlined" 
              size="large"
              component={Link}
              to="/meus-pontos"
            >
              Meus Pontos
            </MuiButton>
          </Box>
        )}
      </Box>

      {/* Tabs para categorias */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="Categorias do cardápio"
          variant="fullWidth"
        >
          {categories.map((category, index) => (
            <Tab 
              key={category.key}
              icon={category.icon}
              label={category.label}
              id={`cardapio-tab-${index}`}
              aria-controls={`cardapio-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Conteúdo das tabs */}
      {categories.map((category, index) => (
        <TabPanel key={category.key} value={tabValue} index={index}>
          <Grid container spacing={3}>
            {getProductsByCategory(category.key).map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {product.nome}
                      </Typography>
                      <Chip 
                        label={formatPrice(product.preco)} 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    
                    {product.descricao && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {product.descricao}
                      </Typography>
                    )}
                    
                    <Chip 
                      label={category.label} 
                      variant="outlined" 
                      size="small"
                      icon={getIcon(category.key)}
                    />
                  </CardContent>
                  
                  {role === 'CLIENTE' && (
                    <>
                      <Divider />
                      <CardActions>
                        <MuiButton 
                          size="small" 
                          variant="outlined"
                          fullWidth
                          disabled
                        >
                          Adicionar ao Pedido
                        </MuiButton>
                      </CardActions>
                    </>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {getProductsByCategory(category.key).length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">
                Nenhum produto disponível nesta categoria.
              </Typography>
            </Box>
          )}
        </TabPanel>
      ))}

      {/* Seção de informações adicionais */}
      <Box mt={6} mb={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              🏪 Sobre Nossa Pizzaria
            </Typography>
            <Typography variant="body1" paragraph>
              Bem-vindo à nossa pizzaria! Servimos as melhores pizzas artesanais da região, 
              feitas com ingredientes frescos e selecionados. Nossa massa é preparada diariamente 
              e nossos fornos garantem o sabor autêntico que você procura.
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary">⏰ Horário</Typography>
                  <Typography variant="body2">
                    Seg-Dom: 18h às 23h30
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary">🚚 Entrega</Typography>
                  <Typography variant="body2">
                    Entregamos em 30-45 min
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary">📞 Contato</Typography>
                  <Typography variant="body2">
                    (11) 9999-9999
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Cardapio;
