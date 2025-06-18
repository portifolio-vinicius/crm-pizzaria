package com.example.crm.pedido;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.crm.security.roles.RolePermissions;
import com.example.crm.cliente.Cliente;
import com.example.crm.cliente.ClienteService;
import com.example.crm.usuario.Usuario;
import com.example.crm.usuario.UsuarioService;

import com.example.crm.pedido.PedidoStatus;

import java.util.List;

@RestController
@RequestMapping("/v1/pedidos")
public class PedidoController {

    private final PedidoService service;
    private final PedidoDeliveryService deliveryService;
    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    public PedidoController(PedidoService service, PedidoDeliveryService deliveryService, ClienteService clienteService, UsuarioService usuarioService) {
        this.service = service;
        this.deliveryService = deliveryService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    @PreAuthorize(RolePermissions.Pedido.CREATE)
    @PostMapping
    public ResponseEntity<Pedido> create(@RequestBody Pedido p) {
        p.setStatus(PedidoStatus.PENDENTE);
        return ResponseEntity.ok(service.save(p));
    }

    @PreAuthorize(RolePermissions.Pedido.LIST)
    @GetMapping
    public ResponseEntity<List<Pedido>> all() {
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize(RolePermissions.Pedido.READ)
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> byId(@PathVariable Long id) {
        Pedido p = service.findById(id);
        return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
    }

    @PreAuthorize(RolePermissions.Pedido.UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> updateStatus(@PathVariable Long id, @RequestBody Pedido p) {
        Pedido existing = service.findById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        // Atualiza apenas status, mantém outros dados
        existing.setStatus(p.getStatus());
        if (p.getPagamentoStatus() != null) {
            existing.setPagamentoStatus(p.getPagamentoStatus());
        }
        return ResponseEntity.ok(service.save(existing));
    }

    @PreAuthorize(RolePermissions.Pedido.READ_OWN)
    @GetMapping("/meus")
    public ResponseEntity<List<Pedido>> meusPedidos(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String username = userDetails.getUsername();
        
        // Busca o usuário pelo username
        Usuario usuario = usuarioService.findByUsername(username);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Para clientes, busca os pedidos pelo email do usuário como cliente
        if ("CLIENTE".equals(usuario.getRole().name())) {
            Cliente cliente = clienteService.findByEmail(username); // assumindo que username é o email
            if (cliente == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(service.findByClienteId(cliente.getId()));
        }
        
        // Para outros roles, retorna todos os pedidos
        return ResponseEntity.ok(service.findAll());
    }

    @PreAuthorize(RolePermissions.Pedido.UPDATE)
    @PostMapping("/{id}/entregar")
    public ResponseEntity<Pedido> marcarComoEntregue(@PathVariable Long id) {
        try {
            Pedido pedidoEntregue = deliveryService.marcarComoEntregue(id);
            return ResponseEntity.ok(pedidoEntregue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
