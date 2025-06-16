package com.example.crm.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByStatusAndCreatedAtBefore(String status, LocalDateTime date);
}
