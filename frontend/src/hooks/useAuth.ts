import { useAppDispatch, useAppSelector } from '../state/redux/hooks';
import apiClient from '../services/apiClient';
import { setToken, clearToken } from '../state/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const role = useAppSelector((state) => state.auth.role);

  const login = async (username: string, password: string) => {
    const res = await apiClient.post('/auth/login', { username, password });
    dispatch(setToken(res.data.token));
    
    // Redirecionar baseado no role após login
    const payload = JSON.parse(atob(res.data.token.split('.')[1]));
    const userRole = payload.role ? String(payload.role).replace('ROLE_', '') : null;
    
    switch (userRole) {
      case 'CLIENTE':
        navigate('/cardapio');
        break;
      case 'ADMIN':
      case 'ASSISTENTE':
        navigate('/dashboard');
        break;
      default:
        navigate('/home');
    }
  };

  const register = async (username: string, password: string) => {
    const res = await apiClient.post('/auth/register/client', { username, password });
    // Após registro bem-sucedido, fazer login automaticamente
    await login(username, password);
  };

  const logout = () => {
    dispatch(clearToken());
    navigate('/profile');
  };

  return { token, role, login, register, logout };
}
