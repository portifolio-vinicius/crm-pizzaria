package com.example.crm.cardapio;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.crm.security.roles.RolePermissions;

import java.util.List;

@RestController
@RequestMapping("/v1/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    @PreAuthorize(RolePermissions.Produto.CREATE)
    @PostMapping
    public ResponseEntity<Produto> create(@RequestBody CreateProdutoRequest request) {
        Produto produto = service.create(
            request.getNome(), 
            request.getDescricao(), 
            request.getPreco(), 
            request.getCategoriaId()
        );
        return ResponseEntity.ok(produto);
    }

    @PreAuthorize(RolePermissions.Produto.LIST)
    @GetMapping
    public ResponseEntity<List<Produto>> all() {
        return ResponseEntity.ok(service.findAllActive());
    }
    
    @PreAuthorize(RolePermissions.Produto.LIST)
    @GetMapping("/categoria/{categoriaNome}")
    public ResponseEntity<List<Produto>> byCategoria(@PathVariable String categoriaNome) {
        return ResponseEntity.ok(service.findByCategoria(categoriaNome));
    }
    
    @PreAuthorize(RolePermissions.Produto.LIST)
    @GetMapping("/search")
    public ResponseEntity<List<Produto>> search(@RequestParam String nome) {
        return ResponseEntity.ok(service.searchByNome(nome));
    }

    @PreAuthorize(RolePermissions.Produto.READ)
    @GetMapping("/{id}")
    public ResponseEntity<Produto> byId(@PathVariable Long id) {
        Produto p = service.findById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @PreAuthorize(RolePermissions.Produto.UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Produto> update(@PathVariable Long id, @RequestBody UpdateProdutoRequest request) {
        Produto produto = service.update(
            id, 
            request.getNome(), 
            request.getDescricao(), 
            request.getPreco(), 
            request.getCategoriaId(),
            request.getAtivo()
        );
        return ResponseEntity.ok(produto);
    }

    @PreAuthorize(RolePermissions.Produto.DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Produto existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PreAuthorize(RolePermissions.Produto.UPDATE)
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        service.deactivate(id);
        return ResponseEntity.noContent().build();
    }
    
    // DTOs
    public static class CreateProdutoRequest {
        private String nome;
        private String descricao;
        private Double preco;
        private Long categoriaId;
        
        // Getters and Setters
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
        
        public Double getPreco() { return preco; }
        public void setPreco(Double preco) { this.preco = preco; }
        
        public Long getCategoriaId() { return categoriaId; }
        public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
    }
    
    public static class UpdateProdutoRequest {
        private String nome;
        private String descricao;
        private Double preco;
        private Long categoriaId;
        private Boolean ativo;
        
        // Getters and Setters
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
        
        public Double getPreco() { return preco; }
        public void setPreco(Double preco) { this.preco = preco; }
        
        public Long getCategoriaId() { return categoriaId; }
        public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
        
        public Boolean getAtivo() { return ativo; }
        public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    }
}
