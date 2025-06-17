package com.example.crm.fidelidade;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/fidelidade")
public class LoyaltyPointController {

    private final LoyaltyPointService service;

    public LoyaltyPointController(LoyaltyPointService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<LoyaltyPoint>> all() {
        return ResponseEntity.ok(service.findAll());
    }
}
