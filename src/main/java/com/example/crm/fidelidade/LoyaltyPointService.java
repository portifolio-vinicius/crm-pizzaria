package com.example.crm.fidelidade;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoyaltyPointService {
    private final LoyaltyPointRepository repository;

    public LoyaltyPointService(LoyaltyPointRepository repository) {
        this.repository = repository;
    }

    public LoyaltyPoint save(LoyaltyPoint lp) {
        return repository.save(lp);
    }

    public List<LoyaltyPoint> findAll() {
        return repository.findAll();
    }
}
