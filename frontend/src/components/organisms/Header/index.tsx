import React, { useState, useRef, useEffect } from 'react';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  DeliveryDining as DeliveryIcon,
  Star as StarIcon,
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Button from '../../atoms/Button';
import UserMenu from '../../molecules/UserMenu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Header.css';

const Header: React.FC = () => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    navigate('/profile');
  };

  const menuItems = React.useMemo(() => {
    if (!token) return [];
    
    const items = [];
    
    if (role === 'ADMIN') {
      items.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
        { text: 'Produtos', icon: <RestaurantIcon />, path: '/produtos' },
        { text: 'Pedidos', icon: <ShoppingCartIcon />, path: '/pedidos' },
        { text: 'Criar Pedido', icon: <ShoppingCartIcon />, path: '/pedidos/criar' },
        { text: 'Motoboys', icon: <DeliveryIcon />, path: '/motoboys' },
        { text: 'Fidelidade', icon: <StarIcon />, path: '/fidelidade' },
        { text: 'Usuários', icon: <PersonAddIcon />, path: '/usuarios' },
      );
    } else if (role === 'ASSISTENTE') {
      items.push(
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Produtos', icon: <RestaurantIcon />, path: '/produtos' },
        { text: 'Pedidos', icon: <ShoppingCartIcon />, path: '/pedidos' },
        { text: 'Criar Pedido', icon: <ShoppingCartIcon />, path: '/pedidos/criar' },
        { text: 'Motoboys', icon: <DeliveryIcon />, path: '/motoboys' },
        { text: 'Fidelidade', icon: <StarIcon />, path: '/fidelidade' },
      );
    } else if (role === 'CLIENTE') {
      items.push(
        { text: 'Cardápio', icon: <RestaurantIcon />, path: '/cardapio' },
        { text: 'Meus Pedidos', icon: <ShoppingCartIcon />, path: '/meus-pedidos' },
        { text: 'Meus Pontos', icon: <StarIcon />, path: '/meus-pontos' },
      );
    }
    
    return items;
  }, [token, role]);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'ASSISTENTE': return 'Assistente';
      case 'CLIENTE': return 'Cliente';
      default: return '';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Painel Administrativo';
      case 'ASSISTENTE': return 'Painel do Assistente';
      case 'CLIENTE': return 'Área do Cliente';
      default: return '';
    }
  };

  return (
    <>
      <header className="header">
        <div className="header__toolbar">
          {token && menuItems.length > 0 && (
            <button
              className="header__menu-button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </button>
          )}
          
          <Link 
            to={token ? '/dashboard' : '/home'}
            className="header__brand"
          >
            🍕 CRM Pizzaria
          </Link>

          {/* Desktop Navigation */}
          {token && menuItems.length > 0 && (
            <nav className="header__nav">
              {menuItems.slice(0, 4).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`header__nav-link ${
                    location.pathname === item.path ? 'header__nav-link--active' : ''
                  }`}
                >
                  {item.icon}
                  {item.text}
                </Link>
              ))}
            </nav>
          )}

          <div className="header__user-section">
            {token ? (
              <>
                {role && (
                  <span className="header__role-badge">
                    {getRoleName(role)}
                  </span>
                )}
                <UserMenu
                  onLogout={handleLogout}
                  profilePath="/profile"
                />
              </>
            ) : (
              <Link to="/profile" className="header__login-button">
                <Button
                  variant="outlined"
                  size="sm"
                >
                  <AccountCircleIcon />
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <>
          <div 
            className="header__overlay header__overlay--open"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="header__drawer" ref={drawerRef}>
            <div className="header__drawer-header">
              <h3 className="header__drawer-title">Menu</h3>
              {role && (
                <p className="header__drawer-subtitle">
                  {getRoleDescription(role)}
                </p>
              )}
            </div>
            <nav className="header__drawer-nav">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`header__drawer-item ${
                    location.pathname === item.path ? 'header__drawer-item--active' : ''
                  }`}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span className="header__drawer-icon">
                    {item.icon}
                  </span>
                  {item.text}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;
