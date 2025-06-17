import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '../../atoms/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './styles.css';

const Header: React.FC = () => {
  const { token, role } = useAuth();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          CRM Pizzaria
        </Typography>
        {token && role === 'ADMIN' && (
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        )}
        <Button color="inherit" component={Link} to="/profile">
          {token ? 'Perfil' : 'Login'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
