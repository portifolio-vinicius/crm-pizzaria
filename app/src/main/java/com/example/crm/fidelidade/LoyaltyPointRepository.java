package com.example.crm.fidelidade;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoyaltyPointRepository extends JpaRepository<LoyaltyPoint, Long> {
    List<LoyaltyPoint> findByClienteId(Long clienteId);
}
