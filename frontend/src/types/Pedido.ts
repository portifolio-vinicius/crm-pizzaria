export interface Pedido {
  id: number;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  status: 'CRIADO' | 'PENDENTE' | 'CANCELADO';
  itens: PedidoItem[];
  valorTotal: number;
  pagamentoStatus: 'APROVADO' | 'PENDENTE';
  createdAt: string;
}

export interface PedidoItem {
  id?: number;
  produto: {
    id: number;
    nome: string;
    preco: number;
  };
  quantidade: number;
  precoUnitario: number;
}

export interface CreatePedidoRequest {
  cliente: {
    id: number;
  };
  itens: {
    produto: {
      id: number;
    };
    quantidade: number;
    precoUnitario: number;
  }[];
}
