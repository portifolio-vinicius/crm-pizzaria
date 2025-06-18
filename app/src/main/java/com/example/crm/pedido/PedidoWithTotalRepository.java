package com.example.crm.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

/**
 * Repository para trabalhar com a view pedido_with_total
 * que calcula valor total dinamicamente (conforme normalização 3FN)
 */
public interface PedidoWithTotalRepository extends JpaRepository<Pedido, Long> {
    
    /**
     * Busca pedido com valor total calculado dinamicamente
     */
    @Query(value = """
        SELECT p.*, COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0) as valor_total
        FROM pedido p
        LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
        WHERE p.id = :id
        GROUP BY p.id, p.cliente_id, p.status, p.pagamento_status, p.created_at
        """, nativeQuery = true)
    Optional<Object[]> findByIdWithTotal(@Param("id") Long id);
    
    /**
     * Busca todos os pedidos com valor total calculado
     */
    @Query(value = """
        SELECT p.*, COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0) as valor_total
        FROM pedido p
        LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
        GROUP BY p.id, p.cliente_id, p.status, p.pagamento_status, p.created_at
        ORDER BY p.created_at DESC
        """, nativeQuery = true)
    List<Object[]> findAllWithTotal();
    
    /**
     * Busca pedidos de um cliente com valor total
     */
    @Query(value = """
        SELECT p.*, COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0) as valor_total
        FROM pedido p
        LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
        WHERE p.cliente_id = :clienteId
        GROUP BY p.id, p.cliente_id, p.status, p.pagamento_status, p.created_at
        ORDER BY p.created_at DESC
        """, nativeQuery = true)
    List<Object[]> findByClienteIdWithTotal(@Param("clienteId") Long clienteId);
    
    /**
     * Busca pedidos por status com valor total
     */
    @Query(value = """
        SELECT p.*, COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0) as valor_total
        FROM pedido p
        LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
        WHERE p.status = :status
        GROUP BY p.id, p.cliente_id, p.status, p.pagamento_status, p.created_at
        ORDER BY p.created_at DESC
        """, nativeQuery = true)
    List<Object[]> findByStatusWithTotal(@Param("status") String status);
}
