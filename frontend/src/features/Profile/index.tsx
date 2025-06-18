import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '../../components/atoms/Button';
import { useAuth } from '../../hooks/useAuth';
import './styles.css';

const Profile: React.FC = () => {
  const { token, role, login, logout, register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
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
  };

  return (
    <div className="profile-page">
      {token ? (
        <div className="profile-info">
          <h2>Perfil do Usuário</h2>
          <div className="user-details">
            <p><strong>Status:</strong> Conectado</p>
            {role && <p><strong>Tipo:</strong> {role}</p>}
          </div>
          <Button variant="contained" onClick={logout} color="secondary">
            Sair
          </Button>
        </div>
      ) : (
        <div className="auth-container">
          <div className="auth-header">
            <h2>{isRegistering ? 'Criar Conta' : 'Entrar'}</h2>
            <p className="auth-subtitle">
              {isRegistering 
                ? 'Crie sua conta para começar a usar o sistema'
                : 'Entre com suas credenciais para acessar o sistema'
              }
            </p>
          </div>

          {error && (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" style={{ marginBottom: '16px' }}>
              {success}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <TextField
              label="Email"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={loading}
              placeholder="seu.email@exemplo.com"
            />
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              disabled={loading}
              placeholder="Digite sua senha"
            />
            
            <Button 
              variant="contained" 
              type="submit"
              fullWidth
              disabled={loading}
              style={{ 
                marginTop: '20px', 
                height: '48px',
                position: 'relative'
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" style={{ marginRight: '8px' }} />
                  {isRegistering ? 'Criando conta...' : 'Entrando...'}
                </>
              ) : (
                isRegistering ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>

          <div className="auth-toggle">
            <p>
              {isRegistering ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="auth-toggle-link"
                disabled={loading}
              >
                {isRegistering ? 'Entrar' : 'Criar conta'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
