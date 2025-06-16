package com.example.crm.pedido;

import org.springframework.stereotype.Service;

import com.example.crm.pedido.PagamentoStatus;

@Service
public class PaymentGateway {
    public PagamentoStatus process() {
        return Math.random() > 0.5 ? PagamentoStatus.APROVADO : PagamentoStatus.PENDENTE;
    }
}
