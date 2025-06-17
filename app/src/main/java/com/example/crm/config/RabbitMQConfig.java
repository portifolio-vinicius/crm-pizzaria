package com.example.crm.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    // Nomes das filas
    public static final String PEDIDO_CRIADO_QUEUE = "pedido.criado";
    public static final String PEDIDO_ENTREGUE_QUEUE = "pedido.entregue";
    
    // Nomes dos exchanges
    public static final String PEDIDO_EXCHANGE = "pedido.exchange";
    
    // Routing keys
    public static final String PEDIDO_CRIADO_ROUTING_KEY = "pedido.criado";
    public static final String PEDIDO_ENTREGUE_ROUTING_KEY = "pedido.entregue";

    /**
     * Configuração do exchange principal para eventos de pedidos
     */
    @Bean
    public DirectExchange pedidoExchange() {
        return new DirectExchange(PEDIDO_EXCHANGE, true, false);
    }

    /**
     * Fila para pedidos criados
     */
    @Bean
    public Queue pedidoCriadoQueue() {
        return QueueBuilder.durable(PEDIDO_CRIADO_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", PEDIDO_CRIADO_QUEUE + ".dlq")
                .build();
    }

    /**
     * Fila para pedidos entregues
     */
    @Bean
    public Queue pedidoEntregueQueue() {
        return QueueBuilder.durable(PEDIDO_ENTREGUE_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", PEDIDO_ENTREGUE_QUEUE + ".dlq")
                .build();
    }

    /**
     * Dead Letter Queue para pedidos criados
     */
    @Bean
    public Queue pedidoCriadoDlq() {
        return QueueBuilder.durable(PEDIDO_CRIADO_QUEUE + ".dlq").build();
    }

    /**
     * Dead Letter Queue para pedidos entregues
     */
    @Bean
    public Queue pedidoEntreguesDlq() {
        return QueueBuilder.durable(PEDIDO_ENTREGUE_QUEUE + ".dlq").build();
    }

    /**
     * Binding da fila pedido.criado ao exchange
     */
    @Bean
    public Binding pedidoCriadoBinding() {
        return BindingBuilder
                .bind(pedidoCriadoQueue())
                .to(pedidoExchange())
                .with(PEDIDO_CRIADO_ROUTING_KEY);
    }

    /**
     * Binding da fila pedido.entregue ao exchange
     */
    @Bean
    public Binding pedidoEntregueBinding() {
        return BindingBuilder
                .bind(pedidoEntregueQueue())
                .to(pedidoExchange())
                .with(PEDIDO_ENTREGUE_ROUTING_KEY);
    }

    /**
     * Conversor de mensagens para JSON
     */
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    /**
     * Template configurado com conversor JSON
     */
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        template.setExchange(PEDIDO_EXCHANGE);
        return template;
    }
}
