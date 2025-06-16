package com.example.crm.pedido;

import org.springframework.stereotype.Service;

@Service
public class PaymentGateway {
    public String process() {
        return Math.random() > 0.5 ? "APROVADO" : "PENDENTE";
    }
}
