package com.example.crm.pedido;

import com.example.crm.cliente.Cliente;
import com.example.crm.common.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Pedido extends BaseEntity {

    @ManyToOne
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    private PedidoStatus status;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> itens;

    @Enumerated(EnumType.STRING)
    private PagamentoStatus pagamentoStatus;

    private LocalDateTime createdAt;

    public List<PedidoItem> getItens() {
        return itens;
    }

    public void setItens(List<PedidoItem> itens) {
        this.itens = itens;
    }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public PedidoStatus getStatus() { return status; }
    public void setStatus(PedidoStatus status) { this.status = status; }

    public PagamentoStatus getPagamentoStatus() { return pagamentoStatus; }
    public void setPagamentoStatus(PagamentoStatus pagamentoStatus) { this.pagamentoStatus = pagamentoStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    // Método para calcular valor total dinamicamente (normalização 3FN)
    public Double getValorTotal() {
        if (itens == null || itens.isEmpty()) {
            return 0.0;
        }
        return itens.stream()
                .mapToDouble(item -> item.getQuantidade() * item.getPrecoUnitario())
                .sum();
    }
}
