import React from 'react';
import Container from '@mui/material/Container';
import Header from '../../components/organisms/Header';
import './styles.css';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <Container className="main-container">{children}</Container>
  </>
);

export default MainLayout;
