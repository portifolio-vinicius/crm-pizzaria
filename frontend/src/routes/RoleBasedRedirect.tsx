import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RoleBasedRedirect: React.FC = () => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/profile" replace />;
  }

  // Redirecionar baseado no role do usuário
  switch (role) {
    case 'CLIENTE':
      return <Navigate to="/cardapio" replace />;
    case 'ADMIN':
    case 'ASSISTENTE':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/home" replace />;
  }
};

export default RoleBasedRedirect;
