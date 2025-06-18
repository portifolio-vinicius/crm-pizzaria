package com.example.crm.auth;

import com.example.crm.usuario.Usuario;
import com.example.crm.usuario.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AuthControllerIT {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    private String baseUrl() {
        return "http://localhost:" + port + "/v1/auth";
    }

    @Test
    void registerAndLoginFlow() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("john@example.com");
        req.setPassword("password");

        ResponseEntity<Usuario> registerResponse = restTemplate.postForEntity(
                baseUrl() + "/register/client", req, Usuario.class);
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(usuarioRepository.findByUsername("john@example.com")).isPresent();

        LoginRequest login = new LoginRequest();
        login.setUsername("john@example.com");
        login.setPassword("password");
        ResponseEntity<TokenResponse> loginResponse = restTemplate.postForEntity(
                baseUrl() + "/login", login, TokenResponse.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginResponse.getBody()).isNotNull();
        String token = loginResponse.getBody().getToken();
        assertThat(token).isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo("john@example.com");
    }

    @Test
    void duplicateRegistrationReturnsConflict() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("dup@example.com");
        req.setPassword("password");
        restTemplate.postForEntity(baseUrl() + "/register/client", req, Usuario.class);

        ResponseEntity<String> second = restTemplate.postForEntity(baseUrl() + "/register/client", req, String.class);
        assertThat(second.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }
}
