package com.example.crm.cardapio;

import com.example.crm.common.BaseEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "produto")
public class Produto extends BaseEntity {
    
    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private Double preco;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", foreignKey = @ForeignKey(name = "fk_produto_categoria"))
    private Categoria categoria;
    
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
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Método de conveniência para obter nome da categoria
    public String getCategoriaNome() {
        return categoria != null ? categoria.getNome() : null;
    }
}
