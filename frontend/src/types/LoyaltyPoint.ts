export interface LoyaltyPoint {
  id: number;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  pedido?: {
    id: number;
    status: string;
  };
  config?: {
    id: number;
    multiplicador: number;
    pontosMinimos: number;
    categoria?: {
      id: number;
      nome: string;
    };
  };
  pontos: number;
  valorPedido?: number;
  createdAt: string;
}
