package com.example.crm.cardapio;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/categorias")
public class CategoriaController {
    
    private final CategoriaService categoriaService;
    
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }
    
    @GetMapping
    public ResponseEntity<List<Categoria>> findAll() {
        return ResponseEntity.ok(categoriaService.findAllActive());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> findById(@PathVariable Long id) {
        return categoriaService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Categoria> create(@RequestBody CreateCategoriaRequest request) {
        Categoria categoria = categoriaService.create(request.getNome(), request.getDescricao());
        return ResponseEntity.ok(categoria);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Categoria> update(@PathVariable Long id, @RequestBody UpdateCategoriaRequest request) {
        Categoria categoria = categoriaService.update(id, request.getNome(), request.getDescricao(), request.getAtiva());
        return ResponseEntity.ok(categoria);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoriaService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        categoriaService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
    
    // DTOs
    public static class CreateCategoriaRequest {
        private String nome;
        private String descricao;
        
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
    }
    
    public static class UpdateCategoriaRequest {
        private String nome;
        private String descricao;
        private Boolean ativa;
        
        public String getNome() { return nome; }
        public void setNome(String nome) { this.nome = nome; }
        
        public String getDescricao() { return descricao; }
        public void setDescricao(String descricao) { this.descricao = descricao; }
        
        public Boolean getAtiva() { return ativa; }
        public void setAtiva(Boolean ativa) { this.ativa = ativa; }
    }
}
