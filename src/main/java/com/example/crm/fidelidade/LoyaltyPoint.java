package com.example.crm.fidelidade;

import com.example.crm.cliente.Cliente;
import com.example.crm.common.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class LoyaltyPoint extends BaseEntity {

    @ManyToOne
    private Cliente cliente;

    private Integer pontos;

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Integer getPontos() { return pontos; }
    public void setPontos(Integer pontos) { this.pontos = pontos; }
}
