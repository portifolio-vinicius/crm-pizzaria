import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingCartIcon,
  DeliveryDining as DeliveryIcon,
  Star as StarIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/organisms/Header';
import Sidebar, { SidebarItem } from '../../components/organisms/Sidebar';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const { role } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getSidebarItems = (): SidebarItem[] => {
    const items: SidebarItem[] = [];
    
    if (role === 'ADMIN') {
      items.push(
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { id: 'clientes', label: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
        { id: 'produtos', label: 'Produtos', icon: <RestaurantIcon />, path: '/produtos' },
        {
          id: 'pedidos',
          label: 'Pedidos',
          icon: <ShoppingCartIcon />,
          children: [
            { id: 'pedidos-list', label: 'Lista de Pedidos', path: '/pedidos' },
            { id: 'pedidos-criar', label: 'Criar Pedido', path: '/pedidos/criar' }
          ]
        },
        { id: 'motoboys', label: 'Motoboys', icon: <DeliveryIcon />, path: '/motoboys' },
        { id: 'fidelidade', label: 'Fidelidade', icon: <StarIcon />, path: '/fidelidade' },
        { id: 'usuarios', label: 'Usuários', icon: <PersonAddIcon />, path: '/usuarios' },
      );
    } else if (role === 'ASSISTENTE') {
      items.push(
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { id: 'produtos', label: 'Produtos', icon: <RestaurantIcon />, path: '/produtos' },
        {
          id: 'pedidos',
          label: 'Pedidos',
          icon: <ShoppingCartIcon />,
          children: [
            { id: 'pedidos-list', label: 'Lista de Pedidos', path: '/pedidos' },
            { id: 'pedidos-criar', label: 'Criar Pedido', path: '/pedidos/criar' }
          ]
        },
        { id: 'motoboys', label: 'Motoboys', icon: <DeliveryIcon />, path: '/motoboys' },
        { id: 'fidelidade', label: 'Fidelidade', icon: <StarIcon />, path: '/fidelidade' },
      );
    } else if (role === 'CLIENTE') {
      items.push(
        { id: 'cardapio', label: 'Cardápio', icon: <RestaurantIcon />, path: '/cardapio' },
        { id: 'meus-pedidos', label: 'Meus Pedidos', icon: <ShoppingCartIcon />, path: '/meus-pedidos' },
        { id: 'meus-pontos', label: 'Meus Pontos', icon: <StarIcon />, path: '/meus-pontos' },
      );
    }
    
    return items;
  };

  return (
    <div className="dashboard-layout">
      <Header />
      
      <div className="dashboard-layout__container">
        <Sidebar
          items={getSidebarItems()}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          brand={{
            name: 'CRM Pizzaria',
            logo: '🍕',
            path: '/dashboard'
          }}
        />
        
        <main className={`dashboard-layout__content ${sidebarCollapsed ? 'dashboard-layout__content--expanded' : ''}`}>
          <div className="dashboard-layout__inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
