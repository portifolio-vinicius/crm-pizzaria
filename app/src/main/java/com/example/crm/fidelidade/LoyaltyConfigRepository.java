package com.example.crm.fidelidade;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface LoyaltyConfigRepository extends JpaRepository<LoyaltyConfig, Long> {
    
    // Buscar configuração geral (categoria_id = NULL)
    @Query("SELECT lc FROM LoyaltyConfig lc WHERE lc.categoria IS NULL AND lc.ativo = true")
    Optional<LoyaltyConfig> findConfigurationGeral();
    
    // Buscar configuração por categoria
    @Query("SELECT lc FROM LoyaltyConfig lc WHERE lc.categoria.id = :categoriaId AND lc.ativo = true")
    Optional<LoyaltyConfig> findByCategoriaId(@Param("categoriaId") Long categoriaId);
    
    // Buscar configuração ativa (prioriza categoria específica, senão geral)
    @Query("""
        SELECT lc FROM LoyaltyConfig lc 
        WHERE (lc.categoria.id = :categoriaId OR lc.categoria IS NULL) 
        AND lc.ativo = true 
        ORDER BY CASE WHEN lc.categoria.id = :categoriaId THEN 1 ELSE 2 END
        """)
    Optional<LoyaltyConfig> findBestConfigurationForCategoria(@Param("categoriaId") Long categoriaId);
}
