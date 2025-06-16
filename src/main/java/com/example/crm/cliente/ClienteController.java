package com.example.crm.cliente;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('ADMIN_GERAL')")
    @PostMapping
    public ResponseEntity<Cliente> create(@RequestBody Cliente c) {
        return ResponseEntity.ok(service.save(c));
    }

    @PreAuthorize("hasRole('ADMIN_GERAL')")
    @GetMapping
    public ResponseEntity<List<Cliente>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize("hasRole('ADMIN_GERAL')")
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> byId(@PathVariable Long id) {
        Cliente c = service.findById(id);
        return c != null ? ResponseEntity.ok(c) : ResponseEntity.notFound().build();
    }
}
