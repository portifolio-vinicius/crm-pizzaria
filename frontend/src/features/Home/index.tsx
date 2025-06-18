import React from 'react';
import { 
  Restaurant as RestaurantIcon, 
  ShoppingCart as CartIcon, 
  Star as StarIcon,
  AdminPanelSettings as AdminIcon,
  SupportAgent as AssistantIcon,
  Person as PersonIcon,
  Storefront as StorefrontIcon,
  LocalPizza as PizzaIcon,
  DeliveryDining as DeliveryIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import Button from '../../components/atoms/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

type UserRole = 'ADMIN' | 'ASSISTENTE' | 'CLIENTE';

interface QuickAction {
  title: string;
  path: string;
  icon: React.ReactElement;
}

const Home: React.FC = () => {
  const { token, role } = useAuth();

  const features = [
    {
      icon: <StorefrontIcon />,
      title: 'Gestão Completa',
      description: 'Controle total de pedidos, clientes e produtos em um só lugar'
    },
    {
      icon: <PizzaIcon />,
      title: 'Cardápio Digital',
      description: 'Organize seus produtos de forma intuitiva e atrativa'
    },
    {
      icon: <DeliveryIcon />,
      title: 'Controle de Entregas',
      description: 'Gerencie motoboys e acompanhe entregas em tempo real'
    },
    {
      icon: <TrendingIcon />,
      title: 'Analytics Avançado',
      description: 'Relatórios detalhados para otimizar seu negócio'
    },
    {
      icon: <StarIcon />,
      title: 'Programa Fidelidade',
      description: 'Sistema de pontos para fidelizar seus clientes'
    },
    {
      icon: <SecurityIcon />,
      title: 'Segurança Total',
      description: 'Controle de acesso por níveis de usuário'
    }
  ];

  const userRoleFeatures: Record<UserRole, QuickAction[]> = {
    ADMIN: [
      { title: 'Dashboard Executivo', path: '/dashboard', icon: <TrendingIcon /> },
      { title: 'Gestão de Usuários', path: '/usuarios', icon: <AdminIcon /> },
      { title: 'Relatórios Completos', path: '/pedidos', icon: <CartIcon /> },
      { title: 'Configurações', path: '/fidelidade', icon: <StarIcon /> }
    ],
    ASSISTENTE: [
      { title: 'Painel Operacional', path: '/dashboard', icon: <TrendingIcon /> },
      { title: 'Gerenciar Pedidos', path: '/pedidos', icon: <CartIcon /> },
      { title: 'Cardápio', path: '/produtos', icon: <RestaurantIcon /> },
      { title: 'Entregas', path: '/motoboys', icon: <DeliveryIcon /> }
    ],
    CLIENTE: [
      { title: 'Ver Cardápio', path: '/cardapio', icon: <RestaurantIcon /> },
      { title: 'Meus Pedidos', path: '/meus-pedidos', icon: <CartIcon /> },
      { title: 'Meus Pontos', path: '/meus-pontos', icon: <StarIcon /> },
      { title: 'Meu Perfil', path: '/profile', icon: <PersonIcon /> }
    ]
  };

  const getRoleFeatures = (): QuickAction[] => {
    if (!role || !userRoleFeatures[role as UserRole]) {
      return [];
    }
    return userRoleFeatures[role as UserRole];
  };

  return (
    <div className="page-content">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <div className="hero-logo-circle">
              <span className="hero-logo-text">🍕</span>
            </div>
          </div>
          <h1 className="hero-title">
            {token ? `Bem-vindo de volta!` : 'CRM Pizzaria'}
          </h1>
          <p className="hero-subtitle">
            {token 
              ? `Acesse suas funcionalidades como ${role?.toLowerCase()}` 
              : 'Sistema completo de gestão para pizzarias modernas'
            }
          </p>
          
          {token && role && (
            <div className="user-badge">
              {role === 'ADMIN' && <AdminIcon className="user-badge-icon" />}
              {role === 'ASSISTENTE' && <AssistantIcon className="user-badge-icon" />}
              {role === 'CLIENTE' && <PersonIcon className="user-badge-icon" />}
              <span className="user-badge-text">
                {role === 'ADMIN' && 'Administrador'}
                {role === 'ASSISTENTE' && 'Assistente'}
                {role === 'CLIENTE' && 'Cliente'}
              </span>
            </div>
          )}

          {!token && (
            <div className="hero-actions">
              <Link to="/profile" className="hero-cta-primary">
                <Button variant="contained" size="large">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/cardapio" className="hero-cta-secondary">
                <Button variant="outlined" size="large">
                  Ver Cardápio
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* User Quick Actions (quando logado) */}
      {token && role && getRoleFeatures().length > 0 && (
        <div className="quick-actions-section">
          <div className="section-header">
            <h2 className="section-title">Acesso Rápido</h2>
            <p className="section-subtitle">Funcionalidades principais para seu perfil</p>
          </div>
          
          <div className="quick-actions-grid">
            {getRoleFeatures().map((action, index) => (
              <Link 
                key={index} 
                to={action.path} 
                className="quick-action-card"
              >
                <div className="quick-action-icon">
                  {action.icon}
                </div>
                <h3 className="quick-action-title">{action.title}</h3>
                <div className="quick-action-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Features Section (para usuários não logados) */}
      {!token && (
        <div className="features-section">
          <div className="section-header">
            <h2 className="section-title">Por que escolher nosso sistema?</h2>
            <p className="section-subtitle">Tudo que você precisa para gerir sua pizzaria com eficiência</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Digital</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Disponível</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">⚡</div>
            <div className="stat-label">Rápido</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">🔒</div>
            <div className="stat-label">Seguro</div>
          </div>
        </div>
      </div>

      {/* CTA Section para não logados */}
      {!token && (
        <div className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Pronto para transformar sua pizzaria?</h2>
            <p className="cta-subtitle">Comece agora mesmo e veja a diferença na gestão do seu negócio</p>
            <div className="cta-actions">
              <Link to="/profile" className="cta-button-primary">
                <Button variant="contained" size="large">
                  Criar Conta Grátis
                </Button>
              </Link>
              <Link to="/cardapio" className="cta-button-secondary">
                <Button variant="text" size="large">
                  Explorar Sistema
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
