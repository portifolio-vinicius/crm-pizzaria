import { Pedido, PedidoItem } from '../types/Pedido';

/**
 * Calcula o valor total de um pedido dinamicamente
 * Conforme normalização 3FN - valor não é mais armazenado na entidade
 */
export const calcularValorTotalPedido = (pedido: Pedido): number => {
  if (!pedido.itens || pedido.itens.length === 0) {
    return 0;
  }
  
  return pedido.itens.reduce((total, item) => {
    return total + (item.quantidade * item.precoUnitario);
  }, 0);
};

/**
 * Calcula o valor total de uma lista de itens
 */
export const calcularValorTotalItens = (itens: PedidoItem[]): number => {
  if (!itens || itens.length === 0) {
    return 0;
  }
  
  return itens.reduce((total, item) => {
    return total + (item.quantidade * item.precoUnitario);
  }, 0);
};

/**
 * Formata valor em reais
 */
export const formatarValor = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};
