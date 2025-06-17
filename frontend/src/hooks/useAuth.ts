import { useState } from 'react';
import apiClient from '../services/apiClient';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const res = await apiClient.post('/auth/login', { username, password });
    setToken(res.data.token);
  };

  const logout = () => setToken(null);

  return { token, login, logout };
}
