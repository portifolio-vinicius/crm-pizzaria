package com.example.crm.fidelidade;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.crm.cliente.Cliente;
import com.example.crm.cliente.ClienteService;
import com.example.crm.usuario.Usuario;
import com.example.crm.usuario.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/v1/fidelidade")
public class LoyaltyPointController {

    private final LoyaltyPointService service;
    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    public LoyaltyPointController(LoyaltyPointService service, ClienteService clienteService, UsuarioService usuarioService) {
        this.service = service;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<LoyaltyPoint>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/meus")
    public ResponseEntity<List<LoyaltyPoint>> meusPontos(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.unauthorized().build();
        }
        
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String username = userDetails.getUsername();
        
        // Busca o usuário pelo username
        Usuario usuario = usuarioService.findByUsername(username);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Para clientes, busca os pontos pelo email do usuário como cliente
        if ("CLIENTE".equals(usuario.getRole().name())) {
            Cliente cliente = clienteService.findByEmail(username);
            if (cliente == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(service.findByClienteId(cliente.getId()));
        }
        
        // Para outros roles, retorna todos os pontos
        return ResponseEntity.ok(service.findAll());
    }
}
