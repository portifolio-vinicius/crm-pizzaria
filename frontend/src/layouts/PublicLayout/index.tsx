import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/organisms/Header';
import './PublicLayout.css';

const PublicLayout: React.FC = () => {
  return (
    <div className="public-layout">
      <Header />
      
      <main className="public-layout__content">
        <div className="public-layout__inner">
          <Outlet />
        </div>
      </main>
      
      <footer className="public-layout__footer">
        <div className="public-layout__footer-content">
          <p>&copy; 2025 CRM Pizzaria. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
