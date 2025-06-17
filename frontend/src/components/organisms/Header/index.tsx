import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  DeliveryDining as DeliveryIcon,
  Star as StarIcon,
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Button from '../../atoms/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './styles.css';

const Header: React.FC = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/profile');
    handleCloseProfileMenu();
  };

  const menuItems = React.useMemo(() => {
    if (!token) return [];
    
    const items = [];
    
    if (role === 'ADMIN') {
      items.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
        { text: 'Produtos', icon: <RestaurantIcon />, path: '/produtos' },
        { text: 'Pedidos', icon: <ShoppingCartIcon />, path: '/pedidos' },
        { text: 'Criar Pedido', icon: <ShoppingCartIcon />, path: '/pedidos/criar' },
        { text: 'Motoboys', icon: <DeliveryIcon />, path: '/motoboys' },
        { text: 'Fidelidade', icon: <StarIcon />, path: '/fidelidade' },
        { text: 'Usuários', icon: <PersonAddIcon />, path: '/usuarios' },
      );
    } else if (role === 'ASSISTENTE') {
      items.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Produtos', icon: <RestaurantIcon />, path: '/produtos' },
        { text: 'Pedidos', icon: <ShoppingCartIcon />, path: '/pedidos' },
        { text: 'Criar Pedido', icon: <ShoppingCartIcon />, path: '/pedidos/criar' },
        { text: 'Motoboys', icon: <DeliveryIcon />, path: '/motoboys' },
        { text: 'Fidelidade', icon: <StarIcon />, path: '/fidelidade' },
      );
    }
    
    return items;
  }, [token, role]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {token && menuItems.length > 0 && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CRM Pizzaria
          </Typography>

          {token ? (
            <Box>
              <IconButton
                color="inherit"
                onClick={handleProfileMenu}
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseProfileMenu}
              >
                <MenuItem onClick={handleCloseProfileMenu} component={Link} to="/profile">
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" component={Link} to="/profile">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
