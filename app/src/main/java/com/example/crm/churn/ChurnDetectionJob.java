package com.example.crm.churn;

import com.example.crm.cliente.Cliente;
import com.example.crm.cliente.ClienteRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ChurnDetectionJob {

    private final ClienteRepository clienteRepository;

    public ChurnDetectionJob(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Scheduled(cron = "0 0 2 * * *")
    public void detectChurn() {
        LocalDateTime limit = LocalDateTime.now().minusDays(60);
        List<Cliente> atRisk = clienteRepository.findWithoutOrdersSince(limit);
        for (Cliente c : atRisk) {
            System.out.println("Churn risk detected for client " + c.getId());
        }
    }
}
