import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import './styles.css';

const Header: React.FC = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div">
        CRM Pizzaria
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
