package com.example.crm.pedido;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class PedidoService {
    private final PedidoRepository repository;
    private final RabbitTemplate rabbitTemplate;

    public PedidoService(PedidoRepository repository, RabbitTemplate rabbitTemplate) {
        this.repository = repository;
        this.rabbitTemplate = rabbitTemplate;
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
        return saved;
    }

    public List<Pedido> findAll() {
        return repository.findAll();
    }

    public Pedido findById(Long id) {
        return repository.findById(id).orElse(null);
    }
}
