# Plano de Validação da Implementação – Desenvolvimento Local

Este documento descreve os passos para validar se o ambiente local de desenvolvimento está configurado e funcionando corretamente.

## 1. Infraestrutura

1. Execute os bancos de dados com Docker:
   ```bash
   docker-compose up -d db redis rabbit
   ```
2. Verifique os containers:
   ```bash
   docker ps
   ```
3. Consulte os logs individuais, por exemplo:
   ```bash
   docker logs db
   docker logs redis
   docker logs rabbit
   ```

### Health Checks do Spring Boot

1. Acesse `http://localhost:8080/actuator/health/liveness` – a resposta deve ser `UP`.
2. Acesse `http://localhost:8080/actuator/health/readiness` – a resposta deve ser `UP`.

### Migrações Flyway

No log de inicialização do Spring Boot procure por:
```
Flyway: Successfully applied X migrations
```
Em seguida, inspecione o esquema no Postgres para conferir as tabelas criadas.

## 2. Contrato de APIs e Documentação

1. Abra a interface do Swagger em `http://localhost:8080/swagger-ui.html`.
2. Execute testes manuais em cada endpoint principal (auth, clientes, cardápio, pedido, fidelidade etc.).
3. Mantenha uma coleção Postman ou scripts `cURL` que reproduzam o fluxo completo de negócio:
   - Cadastro → login
   - CRUD cliente
   - CRUD produto
   - Carrinho + checkout
   - Simulação de entrega
   - Consulta de pontos de fidelidade

## 3. Fluxos de Negócio & Jobs Assíncronos

1. Acesse o painel do RabbitMQ em `http://localhost:15672` e verifique se as filas foram criadas.
2. Dispare manualmente um evento de entrega para validar se o serviço de fidelidade computa os pontos.
3. Teste os jobs agendados (cancelamento de pedidos pendentes e churn detection) ajustando as datas diretamente no banco.
4. Verifique as chaves no Redis executando `redis-cli` e o comando `KEYS *`.

## 4. Qualidade de Código e Testes

1. Rode os testes unitários:
   ```bash
   ./mvnw test
   ```
2. Execute apenas os testes de integração:
   ```bash
   ./mvnw -Dtest=*IT test
   ```
3. Gere cenários de erro e confira se os logs trazem mensagens claras e códigos HTTP adequados.
4. Garanta que os serviços críticos possuam Javadoc mínimo e que os DTOs/documentos descrevam claramente os campos obrigatórios.

## Checklist Rápido

| Fase              | Ação                                                                        | Status |
|-------------------|------------------------------------------------------------------------------|-------|
| **Infra**         | Containers up, health checks, migrations aplicadas                          | [ ]   |
| **APIs**          | Swagger visível, fluxos de CRUD/auth/pedido+fidelidade funcionando           | [ ]   |
| **Eventos & Jobs**| Filas criadas, listeners executando, jobs cron alteram o estado              | [ ]   |
| **Redis Cache**   | Chaves de cache presentes, invalidações corretas                             | [ ]   |
| **Testes**        | Unitários e integração 100% verdes, cobertura mínima atingida               | [ ]   |
| **Logs & Errors** | Mensagens de log claras e códigos HTTP consistentes                          | [ ]   |

