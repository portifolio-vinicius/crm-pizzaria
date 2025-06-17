export interface LoyaltyPoint {
  id: number;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  pontos: number;
  valorPedido?: number;
  createdAt: string;
}
