package com.example.crm.cardapio;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    @CacheEvict(value = "produto", allEntries = true)
    public Produto save(Produto p) {
        return repository.save(p);
    }

    @Cacheable("produto")
    public List<Produto> findAll() {
        return repository.findAll();
    }

    @Cacheable(value = "produto", key = "#id")
    public Produto findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    @CacheEvict(value = "produto", allEntries = true)
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
