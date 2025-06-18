package com.example.crm.pedido;

import com.example.crm.fidelidade.LoyaltyPointService;
import com.example.crm.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class PedidoEventListener {

    private final PedidoRepository pedidoRepository;
    private final LoyaltyPointService loyaltyPointService;
    private static final Logger logger = LoggerFactory.getLogger(PedidoEventListener.class);

    public PedidoEventListener(PedidoRepository pedidoRepository, LoyaltyPointService loyaltyPointService) {
        this.pedidoRepository = pedidoRepository;
        this.loyaltyPointService = loyaltyPointService;
    }

    @RabbitListener(queues = RabbitMQConfig.PEDIDO_ENTREGUE_QUEUE)
    public void handlePedidoEntregue(Long pedidoId) {
        Pedido p = pedidoRepository.findById(pedidoId).orElse(null);
        if (p != null && p.getValorTotal() != null && p.getCliente() != null) {
            loyaltyPointService.accruePoints(p.getCliente(), p.getValorTotal());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.PEDIDO_CRIADO_QUEUE)
    public void handlePedidoCriado(Long pedidoId) {
        // Log para demonstrar que o evento foi recebido
        logger.info("Pedido criado com ID: {} - Evento processado!", pedidoId);
        
        // Aqui pode ser implementada lógica adicional como:
        // - Notificação para a cozinha
        // - Envio de email de confirmação
        // - Processamento de estoque
        // - etc.
    }
}
