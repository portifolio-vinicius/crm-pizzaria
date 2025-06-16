package com.example.crm.pedido;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.crm.pedido.PedidoStatus;

import java.util.List;

@RestController
@RequestMapping("/v1/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Pedido> create(@RequestBody Pedido p) {
        p.setStatus(PedidoStatus.PENDENTE);
        return ResponseEntity.ok(service.save(p));
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> byId(@PathVariable Long id) {
        Pedido p = service.findById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }
}
