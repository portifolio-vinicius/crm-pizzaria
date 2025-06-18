package com.example.crm.cardapio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    List<Produto> findByAtivoTrue();
    
    List<Produto> findByCategoria(Categoria categoria);
    
    List<Produto> findByCategoriaAndAtivoTrue(Categoria categoria);
    
    @Query("SELECT p FROM Produto p JOIN FETCH p.categoria WHERE p.ativo = true ORDER BY p.categoria.nome, p.nome")
    List<Produto> findAllActiveWithCategoryOrderByCategoryAndName();
    
    @Query("SELECT p FROM Produto p JOIN FETCH p.categoria WHERE p.categoria.nome = :categoriaNome AND p.ativo = true ORDER BY p.nome")
    List<Produto> findActiveByCategoryName(@Param("categoriaNome") String categoriaNome);
    
    @Query("SELECT p FROM Produto p WHERE p.nome ILIKE %:nome% AND p.ativo = true")
    List<Produto> findActiveByNomeContainingIgnoreCase(@Param("nome") String nome);
}
