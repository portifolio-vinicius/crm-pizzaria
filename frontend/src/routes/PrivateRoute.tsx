import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: JSX.Element;
  role?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { token, role: userRole } = useAuth();

  if (!token) {
    return <Navigate to="/profile" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
