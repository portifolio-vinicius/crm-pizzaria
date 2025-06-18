package com.example.crm.usuario;

import com.example.crm.exception.UserAlreadyExistsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService implements UserDetailsService {
    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public Usuario registerCliente(Usuario u) {
        if (repository.findByUsername(u.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Usuário com email " + u.getUsername() + " já existe");
        }
        u.setRole(UsuarioRole.CLIENTE);
        u.setPassword(encoder.encode(u.getPassword()));
        return repository.save(u);
    }

    public Usuario registerOperador(Usuario u, Long adminId) {
        if (repository.findByUsername(u.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Usuário com email " + u.getUsername() + " já existe");
        }
        u.setRole(UsuarioRole.ASSISTENTE);
        u.setCreatedBy(adminId);
        u.setPassword(encoder.encode(u.getPassword()));
        return repository.save(u);
    }

    public Usuario registerAdmin(Usuario u, Long adminId) {
        if (repository.findByUsername(u.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Usuário com email " + u.getUsername() + " já existe");
        }
        u.setRole(UsuarioRole.ADMIN);
        u.setCreatedBy(adminId);
        u.setPassword(encoder.encode(u.getPassword()));
        return repository.save(u);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario u = repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return User.withUsername(u.getUsername())
                .password(u.getPassword())
                .roles(u.getRole().name())
                .build();
    }

    public Usuario findByUsername(String username) {
        return repository.findByUsername(username).orElse(null);
    }
}
