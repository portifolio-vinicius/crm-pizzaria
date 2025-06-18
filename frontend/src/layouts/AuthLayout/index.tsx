import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__container">
        <div className="auth-layout__brand">
          <div className="auth-layout__logo">🍕</div>
          <h1 className="auth-layout__title">CRM Pizzaria</h1>
          <p className="auth-layout__subtitle">
            Sistema de gestão completo para sua pizzaria
          </p>
        </div>
        
        <div className="auth-layout__content">
          <Outlet />
        </div>
      </div>
      
      <div className="auth-layout__background">
        <div className="auth-layout__pattern"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
