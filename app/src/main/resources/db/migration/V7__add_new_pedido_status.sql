-- Migration para adicionar novos status de pedido (CONFIRMADO, EM_PREPARO, ENTREGUE)
-- Os status existentes são: CRIADO, PENDENTE, CANCELADO
-- Os novos status são: CONFIRMADO, EM_PREPARO, ENTREGUE

-- Esta migration não requer alterações na estrutura da tabela pois o enum é gerenciado pelo JPA
-- O JPA automaticamente suporta os novos valores do enum PedidoStatus
