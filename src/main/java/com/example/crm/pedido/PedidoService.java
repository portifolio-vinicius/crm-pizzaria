package com.example.crm.pedido;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class PedidoService {
    private final PedidoRepository repository;
    private final RabbitTemplate rabbitTemplate;
    private final PaymentGateway paymentGateway;

    public PedidoService(PedidoRepository repository, RabbitTemplate rabbitTemplate, PaymentGateway paymentGateway) {
        this.repository = repository;
        this.rabbitTemplate = rabbitTemplate;
        this.paymentGateway = paymentGateway;
    }

    public Pedido save(Pedido p) {
        if (p.getStatus() == null) {
            p.setStatus("CRIADO");
        }
        if (p.getCreatedAt() == null) {
            p.setCreatedAt(LocalDateTime.now());
        }
        Pedido saved = repository.save(p);
        rabbitTemplate.convertAndSend("pedido.criado", saved.getId());
        saved.setPagamentoStatus(paymentGateway.process());
        return repository.save(saved);
    }

    public List<Pedido> findAll() {
        return repository.findAll();
    }

    public Pedido findById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
