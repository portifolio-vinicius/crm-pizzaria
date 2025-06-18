import React, { useState } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import './UserMenu.css';

export interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  avatarUrl?: string;
  notificationCount?: number;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onDashboardClick?: () => void;
  onNotificationsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({
  userName,
  userEmail,
  userRole,
  avatarUrl,
  notificationCount = 0,
  onProfileClick,
  onSettingsClick,
  onDashboardClick,
  onNotificationsClick,
  onLogoutClick,
  className = '',
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const open = Boolean(anchorEl);

  // Use dados do contexto se não fornecidos via props
  const displayName = userName || user?.name || 'Usuário';
  const displayEmail = userEmail || user?.email || '';
  const displayRole = userRole || user?.role || '';

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action?: () => void) => {
    handleClose();
    action?.();
  };

  const handleLogout = () => {
    handleClose();
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      logout();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'var(--color-error)';
      case 'assistente':
        return 'var(--color-warning)';
      case 'cliente':
        return 'var(--color-success)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Administrador';
      case 'assistente':
        return 'Assistente';
      case 'cliente':
        return 'Cliente';
      default:
        return role;
    }
  };

  const classes = [
    'user-menu',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <IconButton
        onClick={handleClick}
        className="user-menu__trigger"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge 
          badgeContent={notificationCount} 
          color="error"
          className="user-menu__badge"
        >
          <Avatar 
            src={avatarUrl}
            className="user-menu__avatar"
            alt={displayName}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </Badge>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="user-menu__dropdown"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          className: 'user-menu__paper'
        }}
      >
        {/* Header do Menu */}
        <Box className="user-menu__header">
          <Avatar 
            src={avatarUrl}
            className="user-menu__header-avatar"
            alt={displayName}
          >
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <Box className="user-menu__header-info">
            <Typography variant="subtitle2" className="user-menu__name">
              {displayName}
            </Typography>
            {displayEmail && (
              <Typography variant="caption" className="user-menu__email">
                {displayEmail}
              </Typography>
            )}
            {displayRole && (
              <Typography 
                variant="caption" 
                className="user-menu__role"
                style={{ color: getRoleColor(displayRole) }}
              >
                {getRoleLabel(displayRole)}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Itens do Menu */}
        {onDashboardClick && (
          <MenuItem 
            onClick={() => handleMenuItemClick(onDashboardClick)}
            className="user-menu__item"
          >
            <ListItemIcon>
              <DashboardIcon className="user-menu__icon" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </MenuItem>
        )}

        <MenuItem 
          onClick={() => handleMenuItemClick(onProfileClick)}
          className="user-menu__item"
        >
          <ListItemIcon>
            <PersonIcon className="user-menu__icon" />
          </ListItemIcon>
          <ListItemText primary="Meu Perfil" />
        </MenuItem>

        {notificationCount > 0 && onNotificationsClick && (
          <MenuItem 
            onClick={() => handleMenuItemClick(onNotificationsClick)}
            className="user-menu__item"
          >
            <ListItemIcon>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon className="user-menu__icon" />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notificações" />
          </MenuItem>
        )}

        {onSettingsClick && (
          <MenuItem 
            onClick={() => handleMenuItemClick(onSettingsClick)}
            className="user-menu__item"
          >
            <ListItemIcon>
              <SettingsIcon className="user-menu__icon" />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </MenuItem>
        )}

        <Divider />

        <MenuItem 
          onClick={handleLogout}
          className="user-menu__item user-menu__item--logout"
        >
          <ListItemIcon>
            <LogoutIcon className="user-menu__icon" />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
