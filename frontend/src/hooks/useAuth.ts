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

  const logout = () => {
    dispatch(clearToken());
  };

  return { token, role, login, logout };
}
