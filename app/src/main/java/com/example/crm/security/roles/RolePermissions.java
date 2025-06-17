package com.example.crm.security.roles;

public final class RolePermissions {
    private RolePermissions() {}

    public static final class Produto {
        public static final String CREATE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String READ = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String UPDATE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String DELETE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String LIST = "hasAnyRole('ADMIN','ASSISTENTE')";
    }

    public static final class Cliente {
        public static final String CREATE = "hasRole('ADMIN')";
        public static final String READ = "hasRole('ADMIN')";
        public static final String UPDATE = "hasRole('ADMIN')";
        public static final String DELETE = "hasRole('ADMIN')";
        public static final String LIST = "hasRole('ADMIN')";
    }

    public static final class Pedido {
        public static final String CREATE = "hasRole('CLIENTE')";
        public static final String READ = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String UPDATE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String DELETE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String LIST = "hasAnyRole('ADMIN','ASSISTENTE')";
    }

    public static final class Motoboy {
        public static final String CREATE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String READ = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String UPDATE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String DELETE = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String LIST = "hasAnyRole('ADMIN','ASSISTENTE')";
    }

    public static final class Auth {
        public static final String REGISTER_OPERADOR = "hasRole('ADMIN')";
        public static final String REGISTER_ADMIN = "hasRole('ADMIN')";
    }
}
