export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  ativa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoriaRequest {
  nome: string;
  descricao?: string;
}

export interface UpdateCategoriaRequest {
  nome: string;
  descricao?: string;
  ativa: boolean;
}
