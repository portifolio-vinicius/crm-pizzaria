package com.example.crm.auth;

import com.example.crm.usuario.Usuario;
import com.example.crm.usuario.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.crm.security.roles.RolePermissions;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public AuthController(UsuarioService usuarioService,
                          AuthenticationManager authManager,
                          JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register/client")
    public ResponseEntity<Usuario> registerClient(@RequestBody Usuario u) {
        return ResponseEntity.ok(usuarioService.registerCliente(u));
    }

    @PreAuthorize(RolePermissions.Auth.REGISTER_OPERADOR)
    @PostMapping("/register/operador")
    public ResponseEntity<Usuario> registerOperador(@RequestBody Usuario u, Authentication auth) {
        Long adminId = null;
        if (auth != null && auth.getPrincipal() instanceof UserDetails details) {
            // createdBy not fully reliable without id but kept null
        }
        return ResponseEntity.ok(usuarioService.registerOperador(u, adminId));
    }

    @PreAuthorize(RolePermissions.Auth.REGISTER_ADMIN)
    @PostMapping("/register/admin")
    public ResponseEntity<Usuario> registerAdmin(@RequestBody Usuario u, Authentication auth) {
        Long adminId = null;
        return ResponseEntity.ok(usuarioService.registerAdmin(u, adminId));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        UserDetails user = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new TokenResponse(token));
    }
}
