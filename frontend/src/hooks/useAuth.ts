import { useAppDispatch, useAppSelector } from '../state/redux/hooks';
import apiClient from '../services/apiClient';
import { setToken, clearToken } from '../state/redux/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const role = useAppSelector((state) => state.auth.role);

  const login = async (username: string, password: string) => {
    const res = await apiClient.post('/auth/login', { username, password });
    dispatch(setToken(res.data.token));
  };

  const register = async (username: string, password: string) => {
    const res = await apiClient.post('/auth/register/client', { username, password });
    // Após registro bem-sucedido, fazer login automaticamente
    await login(username, password);
  };

  const logout = () => {
    dispatch(clearToken());
  };

  return { token, role, login, register, logout };
}
