package com.example.crm.auth;

import com.example.crm.usuario.Usuario;
import com.example.crm.usuario.UsuarioService;
import com.example.crm.exception.UserAlreadyExistsException;
import com.example.crm.exception.ErrorResponse;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    @PostMapping("/register/client")
    public ResponseEntity<?> registerClient(@RequestBody Usuario u) {
        System.out.println("DEBUG: Registering client with username: " + u.getUsername());
        try {
            Usuario registeredUser = usuarioService.registerCliente(u);
            System.out.println("DEBUG: User registered successfully with ID: " + registeredUser.getId());
            return ResponseEntity.ok(registeredUser);
        } catch (UserAlreadyExistsException e) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Usuário já existe", e.getMessage()));
        } catch (Exception e) {
            System.err.println("DEBUG: Error registering user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Erro ao registrar usuário", e.getMessage()));
        }
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
