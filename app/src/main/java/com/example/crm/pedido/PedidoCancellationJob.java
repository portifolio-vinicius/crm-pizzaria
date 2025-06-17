package com.example.crm.pedido;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.crm.pedido.PedidoStatus;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class PedidoCancellationJob {
    private final PedidoRepository repository;

    public PedidoCancellationJob(PedidoRepository repository) {
        this.repository = repository;
    }

    @Scheduled(fixedDelay = 300000)
    public void cancelOldPending() {
        LocalDateTime limit = LocalDateTime.now().minusMinutes(15);
        List<Pedido> pendentes = repository.findByStatusAndCreatedAtBefore(PedidoStatus.PENDENTE, limit);
        for (Pedido p : pendentes) {
            p.setStatus(PedidoStatus.CANCELADO);
            repository.save(p);
        }
    }
}
