package com.example.crm.motoboy;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MotoboyService {
    private final MotoboyRepository repository;

    public MotoboyService(MotoboyRepository repository) {
        this.repository = repository;
    }

    public Motoboy save(Motoboy m) {
        return repository.save(m);
    }

    public List<Motoboy> findAll() {
        return repository.findAll();
    }

    public Motoboy findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
