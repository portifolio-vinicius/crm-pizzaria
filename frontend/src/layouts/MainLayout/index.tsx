import React from 'react';
import Container from '@mui/material/Container';
import Header from '../../components/organisms/Header';
import { useMediaQuery, useTheme } from '@mui/material';
import './styles.css';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Header />
      <Container 
        className="main-container" 
        maxWidth={isMobile ? 'sm' : 'lg'}
        sx={{
          px: isMobile ? 1 : 3,
          py: isMobile ? 1 : 2,
        }}
      >
        {children}
      </Container>
    </>
  );
};

export default MainLayout;
