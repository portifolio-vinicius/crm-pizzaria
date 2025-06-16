package com.example.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;

@SpringBootApplication
@EnableCaching
@EnableScheduling
@EnableRabbit
public class CrmPizzariaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmPizzariaApplication.class, args);
    }
}
