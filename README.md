# CRM Pizzaria

Este repositório contém a base para o back-end de uma aplicação de CRM para uma pizzaria. A aplicação utiliza Docker **apenas** para os serviços de banco de dados e mensageria (Postgres, Redis e RabbitMQ). O servidor do Spring Boot roda localmente utilizando o web server embutido.

## Como iniciar os bancos de dados

1. Certifique-se de ter o Docker instalado.
2. Execute:
   ```bash
   docker-compose up -d db redis rabbit
   ```
3. Verifique se os containers estão em execução com `docker ps`.

Quando terminar, pare os containers com:
```bash
docker-compose down
```

Para compilar e testar o projeto é necessário ter o Maven instalado localmente.
Use o script `./mvnw` que apenas delega para a instalação do Maven do sistema.

## Estrutura do Projeto

A organização do código segue o padrão de **Feature Folders**, em que cada funcionalidade é um pacote independente. Módulos típicos incluem `auth`, `cliente`, `cardapio`, `pedido` e `fidelidade`.

## Validação da Implementação

O passo a passo detalhado de validação do ambiente local está descrito em [`docs/validation-plan.md`](docs/validation-plan.md).
