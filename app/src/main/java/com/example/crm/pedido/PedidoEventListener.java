package com.example.crm.pedido;

import com.example.crm.fidelidade.LoyaltyPointService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class PedidoEventListener {

    private final PedidoRepository pedidoRepository;
    private final LoyaltyPointService loyaltyPointService;

    public PedidoEventListener(PedidoRepository pedidoRepository, LoyaltyPointService loyaltyPointService) {
        this.pedidoRepository = pedidoRepository;
        this.loyaltyPointService = loyaltyPointService;
    }

    @RabbitListener(queues = "pedido.entregue")
    public void handlePedidoEntregue(Long pedidoId) {
        Pedido p = pedidoRepository.findById(pedidoId).orElse(null);
        if (p != null && p.getValorTotal() != null && p.getCliente() != null) {
            loyaltyPointService.accruePoints(p.getCliente(), p.getValorTotal());
        }
    }
}
