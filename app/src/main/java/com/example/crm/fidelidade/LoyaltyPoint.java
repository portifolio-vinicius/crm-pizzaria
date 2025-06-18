package com.example.crm.fidelidade;

import com.example.crm.cliente.Cliente;
import com.example.crm.pedido.Pedido;
import com.example.crm.common.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_point")
public class LoyaltyPoint extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", foreignKey = @ForeignKey(name = "fk_loyalty_point_cliente"))
    private Cliente cliente;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", foreignKey = @ForeignKey(name = "fk_loyalty_point_pedido"))
    private Pedido pedido;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "config_id", foreignKey = @ForeignKey(name = "fk_loyalty_point_config"))
    private LoyaltyConfig config;

    @Column(nullable = false)
    private Integer pontos;
    
    @Column(name = "valor_pedido")
    private Double valorPedido; // Mantido para histórico
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    
    public LoyaltyConfig getConfig() { return config; }
    public void setConfig(LoyaltyConfig config) { this.config = config; }
    
    public Integer getPontos() { return pontos; }
    public void setPontos(Integer pontos) { this.pontos = pontos; }
    
    public Double getValorPedido() { return valorPedido; }
    public void setValorPedido(Double valorPedido) { this.valorPedido = valorPedido; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
