package com.example.crm.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

import com.example.crm.pedido.PedidoStatus;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByStatusAndCreatedAtBefore(PedidoStatus status, LocalDateTime date);
    List<Pedido> findByClienteId(Long clienteId);
}
