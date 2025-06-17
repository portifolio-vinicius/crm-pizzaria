-- Migration para adicionar campo valorPedido na tabela LoyaltyPoint
ALTER TABLE loyalty_point ADD COLUMN valor_pedido DOUBLE;
