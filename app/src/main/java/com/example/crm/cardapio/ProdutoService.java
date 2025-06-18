package com.example.crm.cardapio;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProdutoService {

    private final ProdutoRepository repository;
    private final CategoriaService categoriaService;

    public ProdutoService(ProdutoRepository repository, CategoriaService categoriaService) {
        this.repository = repository;
        this.categoriaService = categoriaService;
    }

    @CacheEvict(value = "produto", allEntries = true)
    public Produto save(Produto p) {
        return repository.save(p);
    }

    @Cacheable("produto")
    @Transactional(readOnly = true)
    public List<Produto> findAll() {
        return repository.findAllActiveWithCategoryOrderByCategoryAndName();
    }
    
    @Transactional(readOnly = true)
    public List<Produto> findAllActive() {
        return repository.findAllActiveWithCategoryOrderByCategoryAndName();
    }
    
    @Transactional(readOnly = true)
    public List<Produto> findByCategoria(String categoriaNome) {
        return repository.findActiveByCategoryName(categoriaNome);
    }
    
    @Transactional(readOnly = true)
    public List<Produto> searchByNome(String nome) {
        return repository.findActiveByNomeContainingIgnoreCase(nome);
    }

    @Cacheable(value = "produto", key = "#id")
    @Transactional(readOnly = true)
    public Produto findById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public Produto create(String nome, String descricao, Double preco, Long categoriaId) {
        Categoria categoria = categoriaService.findById(categoriaId)
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        
        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPreco(preco);
        produto.setCategoria(categoria);
        produto.setAtivo(true);
        
        return save(produto);
    }
    
    public Produto update(Long id, String nome, String descricao, Double preco, Long categoriaId, Boolean ativo) {
        Produto produto = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        
        Categoria categoria = categoriaService.findById(categoriaId)
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPreco(preco);
        produto.setCategoria(categoria);
        produto.setAtivo(ativo);
        
        return save(produto);
    }
    
    @CacheEvict(value = "produto", allEntries = true)
    public void deactivate(Long id) {
        Produto produto = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
        
        produto.setAtivo(false);
        repository.save(produto);
    }

    @CacheEvict(value = "produto", allEntries = true)
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
