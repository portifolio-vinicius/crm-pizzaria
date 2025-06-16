package com.example.crm.cliente;

import com.example.crm.common.BaseEntity;
import jakarta.persistence.Entity;

@Entity
public class Cliente extends BaseEntity {

    private String nome;
    private String email;

    // getters and setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
