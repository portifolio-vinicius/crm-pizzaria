# CRM Pizzaria

Este repositório contém a base para o back-end de uma aplicação de CRM para uma pizzaria. A aplicação utiliza Docker **apenas** para os serviços de banco de dados e mensageria (Postgres, Redis e RabbitMQ). O servidor do Spring Boot roda localmente utilizando o web server embutido.

## 🚀 Início Rápido (Recomendado)

Para iniciar todo o ambiente de desenvolvimento com hot reloading:

```bash
./start-dev.sh
```

Para parar todos os serviços:

```bash
./stop-dev.sh
```

Após executar `./start-dev.sh`, você terá acesso a:
- **Frontend**: http://localhost:5173 (com hot reloading)
- **Backend**: http://localhost:8080 (com hot reloading) 
- **API Docs**: http://localhost:8080/swagger-ui.html
- **RabbitMQ**: http://localhost:15672 (guest/guest)

📖 **Documentação completa**: [`docs/scripts-desenvolvimento.md`](docs/scripts-desenvolvimento.md)

## Como iniciar os bancos de dados (método manual)

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

## Variáveis de Ambiente

Em produção, defina a variável `JWT_SECRET` com a chave utilizada para assinar os tokens JWT. No ambiente de desenvolvimento essa chave possui um valor padrão definido em `application.yml`.
