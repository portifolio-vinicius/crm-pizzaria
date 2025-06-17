import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<T>(url)
      .then((res) => setData(res.data))
      .catch(() => setError('Erro ao carregar dados'))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
