import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import './AdminLayout.css';

export interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | false;
  showBreadcrumbs?: boolean;
  className?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  maxWidth = 'lg',
  showBreadcrumbs = true,
  className = '',
}) => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [
      { label: 'Início', path: '/dashboard', icon: <HomeIcon fontSize="small" /> }
    ];

    // Mapear segmentos de URL para labels amigáveis
    const segmentLabels: Record<string, string> = {
      dashboard: 'Dashboard',
      clientes: 'Clientes',
      produtos: 'Produtos',
      pedidos: 'Pedidos',
      motoboys: 'Motoboys',
      usuarios: 'Usuários',
      fidelidade: 'Fidelidade',
      cardapio: 'Cardápio',
      criar: 'Criar',
      editar: 'Editar',
    };

    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (index < pathSegments.length - 1) {
        breadcrumbs.push({ label, path });
      } else {
        breadcrumbs.push({ label, path: '', current: true });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const classes = [
    'admin-layout',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <Container maxWidth={maxWidth} className="admin-layout__container">
        {/* Breadcrumbs */}
        {showBreadcrumbs && breadcrumbs.length > 1 && (
          <Breadcrumbs className="admin-layout__breadcrumbs" separator="›">
            {breadcrumbs.map((crumb, index) => {
              if (crumb.current) {
                return (
                  <Typography key={index} className="admin-layout__breadcrumb admin-layout__breadcrumb--current">
                    {crumb.label}
                  </Typography>
                );
              }

              return (
                <MuiLink
                  key={index}
                  component={RouterLink}
                  to={crumb.path}
                  className="admin-layout__breadcrumb-link"
                >
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {crumb.icon}
                    {crumb.label}
                  </Box>
                </MuiLink>
              );
            })}
          </Breadcrumbs>
        )}

        {/* Header */}
        <Box className="admin-layout__header">
          <Box className="admin-layout__title-section">
            <Typography variant="h4" className="admin-layout__title">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" className="admin-layout__subtitle">
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {actions && (
            <Box className="admin-layout__actions">
              {actions}
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box className="admin-layout__content">
          {children}
        </Box>
      </Container>
    </div>
  );
};

export default AdminLayout;
