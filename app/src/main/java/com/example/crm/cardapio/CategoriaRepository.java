package com.example.crm.cardapio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    
    Optional<Categoria> findByNome(String nome);
    
    List<Categoria> findByAtivaTrue();
    
    @Query("SELECT c FROM Categoria c WHERE c.ativa = true ORDER BY c.nome")
    List<Categoria> findAllActiveOrderByNome();
    
    boolean existsByNome(String nome);
}
