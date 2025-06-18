import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import { AxiosError } from 'axios';

interface ErrorDetails {
  message: string;
  status?: number;
  statusText?: string;
}

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    
    apiClient
      .get<T>(url)
      .then((res) => setData(res.data))
      .catch((err: AxiosError) => {
        let errorMessage = 'Erro ao carregar dados';
        let details: ErrorDetails = { message: errorMessage };

        if (err.response) {
          // Servidor respondeu com erro
          const status = err.response.status;
          const statusText = err.response.statusText;
          
          switch (status) {
            case 401:
              errorMessage = 'Você precisa fazer login para acessar este recurso';
              break;
            case 403:
              errorMessage = 'Você não tem permissão para acessar este recurso';
              break;
            case 404:
              errorMessage = 'Recurso não encontrado';
              break;
            case 500:
              errorMessage = 'Erro interno do servidor';
              break;
            default:
              errorMessage = `Erro ${status}: ${statusText}`;
          }
          
          details = { message: errorMessage, status, statusText };
        } else if (err.request) {
          // Requisição foi feita mas não houve resposta
          errorMessage = 'Servidor não está respondendo. Verifique sua conexão.';
          details = { message: errorMessage };
        }

        setError(errorMessage);
        setErrorDetails(details);
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error, errorDetails };
}
