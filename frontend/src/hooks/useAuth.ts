import { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export function useAuth() {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('token')
  );

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    const res = await apiClient.post('/auth/login', { username, password });
    setToken(res.data.token);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
  };

  return { token, login, logout };
}
