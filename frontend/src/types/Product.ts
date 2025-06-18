import { Categoria } from './Categoria';

export interface Product {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  categoria?: Categoria;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  // Propriedade de conveniência para compatibilidade
  categoriaNome?: string;
}

export interface CreateProdutoRequest {
  nome: string;
  descricao?: string;
  preco: number;
  categoriaId: number;
}

export interface UpdateProdutoRequest {
  nome: string;
  descricao?: string;
  preco: number;
  categoriaId: number;
  ativo: boolean;
}
