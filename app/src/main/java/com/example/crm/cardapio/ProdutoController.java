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
    public ResponseEntity<Produto> create(@RequestBody Produto p) {
        return ResponseEntity.ok(service.save(p));
    }

    @GetMapping
    public ResponseEntity<List<Produto>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> byId(@PathVariable Long id) {
        Produto p = service.findById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @PreAuthorize(RolePermissions.Produto.UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Produto> update(@PathVariable Long id, @RequestBody Produto p) {
        Produto existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        p.setId(id);
        return ResponseEntity.ok(service.save(p));
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
}
