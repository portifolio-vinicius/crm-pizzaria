package com.example.crm.cardapio;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoriaService {
    
    private final CategoriaRepository categoriaRepository;
    
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<Categoria> findAllActive() {
        return categoriaRepository.findAllActiveOrderByNome();
    }
    
    @Transactional(readOnly = true)
    public Optional<Categoria> findById(Long id) {
        return categoriaRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Optional<Categoria> findByNome(String nome) {
        return categoriaRepository.findByNome(nome);
    }
    
    public Categoria save(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
    
    public Categoria create(String nome, String descricao) {
        if (categoriaRepository.existsByNome(nome)) {
            throw new IllegalArgumentException("Categoria com nome '" + nome + "' já existe");
        }
        
        Categoria categoria = new Categoria();
        categoria.setNome(nome);
        categoria.setDescricao(descricao);
        categoria.setAtiva(true);
        
        return categoriaRepository.save(categoria);
    }
    
    public Categoria update(Long id, String nome, String descricao, Boolean ativa) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        
        // Verificar se o novo nome já existe (exceto para a própria categoria)
        if (!categoria.getNome().equals(nome) && categoriaRepository.existsByNome(nome)) {
            throw new IllegalArgumentException("Categoria com nome '" + nome + "' já existe");
        }
        
        categoria.setNome(nome);
        categoria.setDescricao(descricao);
        categoria.setAtiva(ativa);
        
        return categoriaRepository.save(categoria);
    }
    
    public void deactivate(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        
        categoria.setAtiva(false);
        categoriaRepository.save(categoria);
    }
    
    public void delete(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new IllegalArgumentException("Categoria não encontrada");
        }
        categoriaRepository.deleteById(id);
    }
}
