package com.example.crm.fidelidade;

import com.example.crm.cardapio.Categoria;
import com.example.crm.common.BaseEntity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loyalty_config")
public class LoyaltyConfig extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", foreignKey = @ForeignKey(name = "fk_loyalty_config_categoria"))
    private Categoria categoria; // NULL = configuração geral
    
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal multiplicador = BigDecimal.valueOf(0.05); // 5%
    
    @Column(name = "pontos_minimos", nullable = false)
    private Integer pontosMinimos = 1;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    
    public BigDecimal getMultiplicador() { return multiplicador; }
    public void setMultiplicador(BigDecimal multiplicador) { this.multiplicador = multiplicador; }
    
    public Integer getPontosMinimos() { return pontosMinimos; }
    public void setPontosMinimos(Integer pontosMinimos) { this.pontosMinimos = pontosMinimos; }
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Método para calcular pontos baseado no valor
    public Integer calcularPontos(Double valorPedido) {
        if (valorPedido == null || valorPedido <= 0) {
            return 0;
        }
        
        int pontosCalculados = (int) Math.floor(valorPedido * multiplicador.doubleValue());
        
        if (pontosCalculados < pontosMinimos) {
            return 0;
        }
        
        return pontosCalculados;
    }
}
