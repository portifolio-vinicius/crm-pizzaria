package com.example.crm.auth;

import com.example.crm.usuario.Usuario;
import com.example.crm.usuario.UsuarioService;
import com.example.crm.auth.RegisterRequest;
import com.example.crm.auth.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.crm.security.roles.RolePermissions;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(UsuarioService usuarioService,
                          AuthenticationManager authManager,
                          JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    @PostMapping("/register/client")
    public ResponseEntity<Usuario> registerClient(@Valid @RequestBody RegisterRequest req) {
        logger.debug("Registering client with username: {}", req.getUsername());
        Usuario u = new Usuario();
        u.setUsername(req.getUsername());
        u.setPassword(req.getPassword());
        Usuario registeredUser = usuarioService.registerCliente(u);
        logger.debug("User registered successfully with ID: {}", registeredUser.getId());
        return ResponseEntity.ok(registeredUser);
    }

    @PreAuthorize(RolePermissions.Auth.REGISTER_OPERADOR)
    @PostMapping("/register/operador")
    public ResponseEntity<Usuario> registerOperador(@Valid @RequestBody RegisterRequest req, Authentication auth) {
        Long adminId = null;
        if (auth != null && auth.getPrincipal() instanceof UserDetails details) {
            // createdBy not fully reliable without id but kept null
        }
        Usuario u = new Usuario();
        u.setUsername(req.getUsername());
        u.setPassword(req.getPassword());
        return ResponseEntity.ok(usuarioService.registerOperador(u, adminId));
    }

    @PreAuthorize(RolePermissions.Auth.REGISTER_ADMIN)
    @PostMapping("/register/admin")
    public ResponseEntity<Usuario> registerAdmin(@Valid @RequestBody RegisterRequest req, Authentication auth) {
        Long adminId = null;
        Usuario u = new Usuario();
        u.setUsername(req.getUsername());
        u.setPassword(req.getPassword());
        return ResponseEntity.ok(usuarioService.registerAdmin(u, adminId));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest req) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        UserDetails user = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new TokenResponse(token));
    }
}
