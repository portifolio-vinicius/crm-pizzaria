import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '../../components/atoms/Button';
import { useAuth } from '../../hooks/useAuth';
import { 
  AdminPanelSettings as AdminIcon,
  SupportAgent as AssistantIcon,
  Person as ClientIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import './styles.css';

type UserType = 'client' | 'admin' | 'assistant';

const Profile: React.FC = () => {
  const { token, role, login, logout, register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegistering) {
        // Para registro, sempre usar client (apenas clientes podem se registrar diretamente)
        await register(username, password);
        setSuccess('Conta criada com sucesso! Você foi automaticamente logado.');
      } else {
        await login(username, password);
        setSuccess('Login realizado com sucesso!');
      }
      // Limpar campos após sucesso
      setUsername('');
      setPassword('');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        `Erro ao ${isRegistering ? 'criar conta' : 'fazer login'}. Tente novamente.`
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setSuccess(null);
    setSelectedUserType('client'); // Reset to client when toggling
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const userTypeOptions = [
    {
      type: 'client' as UserType,
      label: 'Cliente',
      icon: <ClientIcon />,
      description: 'Acesse o cardápio e faça pedidos',
      color: '#4CAF50'
    },
    {
      type: 'assistant' as UserType,
      label: 'Assistente',
      icon: <AssistantIcon />,
      description: 'Gerencie pedidos e produtos',
      color: '#FF9800'
    },
    {
      type: 'admin' as UserType,
      label: 'Administrador',
      icon: <AdminIcon />,
      description: 'Acesso completo ao sistema',
      color: '#F44336'
    }
  ];

  return (
    <div className="profile-page">
      {token ? (
        <div className="profile-info">
          <div className="profile-avatar">
            {role === 'ADMIN' && <AdminIcon className="profile-icon admin" />}
            {role === 'ASSISTENTE' && <AssistantIcon className="profile-icon assistant" />}
            {role === 'CLIENTE' && <ClientIcon className="profile-icon client" />}
          </div>
          <h2>Bem-vindo!</h2>
          <div className="user-details">
            <div className="user-info-item">
              <span className="info-label">Status:</span>
              <span className="info-value connected">Conectado</span>
            </div>
            {role && (
              <div className="user-info-item">
                <span className="info-label">Perfil:</span>
                <span className={`info-value role-${role.toLowerCase()}`}>
                  {role === 'ADMIN' && 'Administrador'}
                  {role === 'ASSISTENTE' && 'Assistente'}
                  {role === 'CLIENTE' && 'Cliente'}
                </span>
              </div>
            )}
          </div>
          <Button 
            variant="contained" 
            onClick={logout} 
            color="secondary"
            className="logout-button"
            startIcon={<LockIcon />}
          >
            Sair da Conta
          </Button>
        </div>
      ) : (
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-logo">
              <div className="logo-circle">
                <span className="logo-text">🍕</span>
              </div>
            </div>
            <h1 className="auth-title">
              {isRegistering ? 'Criar Conta' : 'Entrar'}
            </h1>
            <p className="auth-subtitle">
              {isRegistering 
                ? 'Crie sua conta para começar a usar nosso sistema'
                : 'Entre com suas credenciais para acessar sua conta'
              }
            </p>
          </div>

          {/* User Type Selection - Only show for login */}
          {!isRegistering && (
            <div className="user-type-section">
              <h3 className="user-type-title">Como você deseja acessar?</h3>
              <div className="user-type-grid">
                {userTypeOptions.map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    className={`user-type-card ${selectedUserType === option.type ? 'selected' : ''}`}
                    onClick={() => setSelectedUserType(option.type)}
                    disabled={loading}
                    style={{
                      borderColor: selectedUserType === option.type ? option.color : undefined,
                      backgroundColor: selectedUserType === option.type ? `${option.color}08` : undefined
                    }}
                  >
                    <div 
                      className="user-type-icon" 
                      style={{ color: option.color }}
                    >
                      {option.icon}
                    </div>
                    <h4 className="user-type-label">{option.label}</h4>
                    <p className="user-type-description">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert severity="error" className="auth-alert">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="auth-alert">
              {success}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <TextField
                label="Email"
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                disabled={loading}
                placeholder="seu.email@exemplo.com"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon className="field-icon" />
                    </InputAdornment>
                  ),
                }}
                className="auth-input"
              />
            </div>
            
            <div className="form-field">
              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                disabled={loading}
                placeholder={isRegistering ? "Mínimo 6 caracteres" : "Digite sua senha"}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon className="field-icon" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        size="small"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="auth-input"
              />
            </div>
            
            <Button 
              variant="contained" 
              type="submit"
              fullWidth
              disabled={loading}
              className="auth-submit-button"
            >
              {loading ? (
                <div className="loading-content">
                  <CircularProgress size={20} color="inherit" />
                  <span>{isRegistering ? 'Criando conta...' : 'Entrando...'}</span>
                </div>
              ) : (
                <>
                  {isRegistering ? 'Criar Conta' : 'Entrar'}
                  {!isRegistering && selectedUserType === 'admin' && ' como Admin'}
                  {!isRegistering && selectedUserType === 'assistant' && ' como Assistente'}
                </>
              )}
            </Button>
          </form>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <div className="auth-toggle">
            <p className="toggle-text">
              {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="auth-toggle-button"
              disabled={loading}
            >
              {isRegistering ? 'Entrar na sua conta' : 'Criar nova conta'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
