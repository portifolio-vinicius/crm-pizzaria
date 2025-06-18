package com.example.crm.fidelidade;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/loyalty-config")
public class LoyaltyConfigController {
    
    private final LoyaltyConfigService service;
    
    public LoyaltyConfigController(LoyaltyConfigService service) {
        this.service = service;
    }
    
    @GetMapping
    public ResponseEntity<List<LoyaltyConfig>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<LoyaltyConfig> findById(@PathVariable Long id) {
        Optional<LoyaltyConfig> config = service.findById(id);
        return config.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/geral")
    public ResponseEntity<LoyaltyConfig> findConfigurationGeral() {
        Optional<LoyaltyConfig> config = service.findConfigurationGeral();
        return config.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<LoyaltyConfig> findByCategoriaId(@PathVariable Long categoriaId) {
        Optional<LoyaltyConfig> config = service.findByCategoriaId(categoriaId);
        return config.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<LoyaltyConfig> create(@RequestBody LoyaltyConfig config) {
        LoyaltyConfig savedConfig = service.save(config);
        return ResponseEntity.ok(savedConfig);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<LoyaltyConfig> update(@PathVariable Long id, @RequestBody LoyaltyConfig config) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        config.setId(id);
        LoyaltyConfig updatedConfig = service.save(config);
        return ResponseEntity.ok(updatedConfig);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
