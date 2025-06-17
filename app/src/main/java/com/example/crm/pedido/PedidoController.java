package com.example.crm.pedido;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.crm.security.roles.RolePermissions;

import com.example.crm.pedido.PedidoStatus;

import java.util.List;

@RestController
@RequestMapping("/v1/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PreAuthorize(RolePermissions.Pedido.CREATE)
    @PostMapping
    public ResponseEntity<Pedido> create(@RequestBody Pedido p) {
        p.setStatus(PedidoStatus.PENDENTE);
        return ResponseEntity.ok(service.save(p));
    }

    @PreAuthorize(RolePermissions.Pedido.LIST)
    @GetMapping
    public ResponseEntity<List<Pedido>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize(RolePermissions.Pedido.READ)
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> byId(@PathVariable Long id) {
        Pedido p = service.findById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @PreAuthorize(RolePermissions.Pedido.UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> updateStatus(@PathVariable Long id, @RequestBody Pedido p) {
        Pedido existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        // Atualiza apenas status, mantém outros dados
        existing.setStatus(p.getStatus());
        if (p.getPagamentoStatus() != null) {
            existing.setPagamentoStatus(p.getPagamentoStatus());
        }
        return ResponseEntity.ok(service.save(existing));
    }
}
