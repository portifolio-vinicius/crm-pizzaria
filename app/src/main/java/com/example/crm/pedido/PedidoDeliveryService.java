package com.example.crm.pedido;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.example.crm.config.RabbitMQConfig;

@Service
public class PedidoDeliveryService {

    private final PedidoRepository pedidoRepository;
    private final RabbitTemplate rabbitTemplate;

    public PedidoDeliveryService(PedidoRepository pedidoRepository, RabbitTemplate rabbitTemplate) {
        this.pedidoRepository = pedidoRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Marca um pedido como entregue e envia evento para processamento de pontos de fidelidade
     */
    public Pedido marcarComoEntregue(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElse(null);
        if (pedido == null) {
            throw new IllegalArgumentException("Pedido não encontrado: " + pedidoId);
        }

        if (pedido.getStatus() != PedidoStatus.CONFIRMADO && pedido.getStatus() != PedidoStatus.EM_PREPARO) {
            throw new IllegalStateException("Pedido não pode ser entregue no status atual: " + pedido.getStatus());
        }

        // Atualizar status do pedido
        pedido.setStatus(PedidoStatus.ENTREGUE);
        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        // Enviar evento para processamento de pontos de fidelidade
        rabbitTemplate.convertAndSend(RabbitMQConfig.PEDIDO_ENTREGUE_ROUTING_KEY, pedidoId);

        return pedidoSalvo;
    }

    /**
     * Simula entrega automática de pedidos confirmados (para testes)
     */
    public void simularEntregaAutomatica(Long pedidoId) {
        try {
            marcarComoEntregue(pedidoId);
        } catch (Exception e) {
            // Log do erro em ambiente real
            System.err.println("Erro ao simular entrega automática do pedido " + pedidoId + ": " + e.getMessage());
        }
    }
}
