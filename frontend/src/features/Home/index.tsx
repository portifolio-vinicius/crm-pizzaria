import React from 'react';
import Button from '../../components/atoms/Button';
import { useAppDispatch, useAppSelector } from '../../state/redux/hooks';
import { increment } from '../../state/redux/slices/sampleSlice';
import { useFetch } from '../../hooks/useFetch';
import { Product } from '../../types/Product';
import './styles.css';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.sample.value);
  const { data: products, loading } = useFetch<Product[]>('/produtos');

  return (
    <div className="home-page">
      <h1>Bem-vindo ao CRM Pizzaria</h1>
      <p>Contador: {value}</p>
      <Button variant="contained" onClick={() => dispatch(increment())}>
        Incrementar
      </Button>
      <h2>Produtos</h2>
      {loading && <p>Carregando...</p>}
      <ul>
        {products?.map((p) => (
          <li key={p.id}>
            {p.nome} - R$ {p.preco.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
