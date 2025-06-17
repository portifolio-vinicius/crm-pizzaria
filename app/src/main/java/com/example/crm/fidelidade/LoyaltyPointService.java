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

    public List<LoyaltyPoint> findByClienteId(Long clienteId) {
        return repository.findByClienteId(clienteId);
    }

    public void accruePoints(com.example.crm.cliente.Cliente cliente, Double valorPedido) {
        if (cliente == null || valorPedido == null) {
            return;
        }
        int pontos = (int) Math.floor(valorPedido * 0.05);
        if (pontos <= 0) {
            return;
        }
        LoyaltyPoint lp = new LoyaltyPoint();
        lp.setCliente(cliente);
        lp.setPontos(pontos);
        lp.setValorPedido(valorPedido);
        repository.save(lp);
    }
}
