package com.example.crm.motoboy;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.crm.security.roles.RolePermissions;

import java.util.List;

@RestController
@RequestMapping("/v1/motoboys")
public class MotoboyController {

    private final MotoboyService service;

    public MotoboyController(MotoboyService service) {
        this.service = service;
    }

    @PreAuthorize(RolePermissions.Motoboy.CREATE)
    @PostMapping
    public ResponseEntity<Motoboy> create(@RequestBody Motoboy m) {
        return ResponseEntity.ok(service.save(m));
    }

    @PreAuthorize(RolePermissions.Motoboy.LIST)
    @GetMapping
    public ResponseEntity<List<Motoboy>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize(RolePermissions.Motoboy.READ)
    @GetMapping("/{id}")
    public ResponseEntity<Motoboy> byId(@PathVariable Long id) {
        Motoboy m = service.findById(id);
        return m != null ? ResponseEntity.ok(m) : ResponseEntity.notFound().build();
    }

    @PreAuthorize(RolePermissions.Motoboy.UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Motoboy> update(@PathVariable Long id, @RequestBody Motoboy m) {
        Motoboy existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        m.setId(id);
        return ResponseEntity.ok(service.save(m));
    }

    @PreAuthorize(RolePermissions.Motoboy.DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Motoboy existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
