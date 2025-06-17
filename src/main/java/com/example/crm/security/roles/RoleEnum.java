package com.example.crm.security.roles;

public enum RoleEnum {
    ADMIN("ROLE_ADMIN"),
    ASSISTENTE("ROLE_ASSISTENTE");

    private final String value;

    RoleEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
