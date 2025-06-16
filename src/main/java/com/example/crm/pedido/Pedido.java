package com.example.crm.pedido;

import com.example.crm.cliente.Cliente;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    private PedidoStatus status;

    private Double valorTotal;

    @Enumerated(EnumType.STRING)
    private PagamentoStatus pagamentoStatus;

    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public PedidoStatus getStatus() { return status; }
    public void setStatus(PedidoStatus status) { this.status = status; }

    public Double getValorTotal() { return valorTotal; }
    public void setValorTotal(Double valorTotal) { this.valorTotal = valorTotal; }

    public PagamentoStatus getPagamentoStatus() { return pagamentoStatus; }
    public void setPagamentoStatus(PagamentoStatus pagamentoStatus) { this.pagamentoStatus = pagamentoStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
