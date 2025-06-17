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
}
