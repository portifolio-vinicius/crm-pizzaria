package com.example.crm.motoboy;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/motoboys")
public class MotoboyController {

    private final MotoboyService service;

    public MotoboyController(MotoboyService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('ADMIN','ASSISTENTE')")
    @PostMapping
    public ResponseEntity<Motoboy> create(@RequestBody Motoboy m) {
        return ResponseEntity.ok(service.save(m));
    }

    @PreAuthorize("hasAnyRole('ADMIN','ASSISTENTE')")
    @GetMapping
    public ResponseEntity<List<Motoboy>> all() {
        return ResponseEntity.ok(service.findAll());
    }
}
