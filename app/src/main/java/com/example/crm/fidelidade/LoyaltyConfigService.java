package com.example.crm.fidelidade;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LoyaltyConfigService {
    
    private final LoyaltyConfigRepository repository;
    
    public LoyaltyConfigService(LoyaltyConfigRepository repository) {
        this.repository = repository;
    }
    
    public List<LoyaltyConfig> findAll() {
        return repository.findAll();
    }
    
    public Optional<LoyaltyConfig> findById(Long id) {
        return repository.findById(id);
    }
    
    public LoyaltyConfig save(LoyaltyConfig config) {
        return repository.save(config);
    }
    
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
    
    public Optional<LoyaltyConfig> findConfigurationGeral() {
        return repository.findConfigurationGeral();
    }
    
    public Optional<LoyaltyConfig> findByCategoriaId(Long categoriaId) {
        return repository.findByCategoriaId(categoriaId);
    }
    
    public LoyaltyConfig getBestConfigurationForCategoria(Long categoriaId) {
        return repository.findBestConfigurationForCategoria(categoriaId)
                .orElse(repository.findConfigurationGeral()
                .orElseThrow(() -> new RuntimeException("Nenhuma configuração de fidelidade encontrada")));
    }
}
