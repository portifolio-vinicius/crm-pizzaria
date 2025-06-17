package com.example.crm.cliente;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.crm.security.roles.RolePermissions;

import java.util.List;

@RestController
@RequestMapping("/v1/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PreAuthorize(RolePermissions.Cliente.CREATE)
    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente c) {
        return ResponseEntity.ok(service.save(c));
    }

    @PreAuthorize(RolePermissions.Cliente.LIST)
    @GetMapping
    public ResponseEntity<List<Cliente>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize(RolePermissions.Cliente.READ)
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> byId(@PathVariable Long id) {
        Cliente c = service.findById(id);
        return c != null ? ResponseEntity.ok(c) : ResponseEntity.notFound().build();
    }

    @PreAuthorize(RolePermissions.Cliente.UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> update(@PathVariable Long id, @RequestBody Cliente c) {
        Cliente existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        c.setId(id);
        return ResponseEntity.ok(service.save(c));
    }

    @PreAuthorize(RolePermissions.Cliente.DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Cliente existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
