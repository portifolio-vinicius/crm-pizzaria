import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: JSX.Element;
  role?: string | string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { token, role: userRole } = useAuth();

  if (!token) {
    return <Navigate to="/profile" replace />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (userRole && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
