package com.example.crm.cliente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByEmail(String email);

    @Query("select c from Cliente c where c.id not in (select p.cliente.id from Pedido p where p.createdAt > :since)")
    List<Cliente> findWithoutOrdersSince(@Param("since") LocalDateTime since);
}
