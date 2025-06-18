export interface LoyaltyConfig {
  id: number;
  categoria?: {
    id: number;
    nome: string;
    descricao?: string;
  };
  multiplicador: number;
  pontosMinimos: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}
