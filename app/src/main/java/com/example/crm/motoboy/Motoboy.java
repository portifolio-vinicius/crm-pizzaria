package com.example.crm.motoboy;

import com.example.crm.common.BaseEntity;
import jakarta.persistence.Entity;

@Entity
public class Motoboy extends BaseEntity {
    private String nome;
    private String telefone;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
