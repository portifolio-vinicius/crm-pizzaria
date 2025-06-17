# Scripts de Desenvolvimento - CRM Pizzaria

Este projeto inclui scripts automatizados para facilitar o desenvolvimento local com hot reloading para frontend e backend.

## Scripts Disponíveis

### `./start-dev.sh` - Iniciar Ambiente de Desenvolvimento

Este script inicializa todos os serviços necessários para desenvolvimento:

- **Banco de Dados**: PostgreSQL, Redis, RabbitMQ (via Docker)
- **Backend**: Spring Boot com DevTools (hot reloading automático)
- **Frontend**: React com Vite (hot reloading automático)

#### Como usar:
```bash
./start-dev.sh
```

#### O que o script faz:

1. **Verificações iniciais**:
   - Verifica se todas as dependências estão instaladas (Docker, Java, Node.js, etc.)
   - Verifica se as portas necessárias estão livres
   
2. **Inicia serviços de infraestrutura**:
   - PostgreSQL na porta 5432
   - Redis na porta 6379  
   - RabbitMQ na porta 5672 (management: 15672)

3. **Configura e inicia o backend**:
   - Compila o projeto Spring Boot
   - Inicia com DevTools habilitado (hot reloading)
   - Disponibiliza debug na porta 5005
   - Roda na porta 8080

4. **Configura e inicia o frontend**:
   - Instala dependências NPM se necessário
   - Inicia Vite com hot reloading
   - Roda na porta 5173

#### Serviços disponíveis após a inicialização:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

#### Hot Reloading:

- **Frontend**: Mudanças em arquivos `.tsx`, `.ts`, `.css` são refletidas automaticamente
- **Backend**: Mudanças em arquivos `.java` são recompiladas e recarregadas automaticamente

### `./stop-dev.sh` - Parar Ambiente de Desenvolvimento

Para parar todos os serviços de uma vez:

```bash
./stop-dev.sh
```

Este script:
- Para todos os containers Docker
- Mata processos do Spring Boot
- Mata processos do Vite/Node.js
- Remove arquivos de log temporários

## Monitoramento e Debug

### Logs em tempo real:
```bash
# Backend
tail -f backend.log

# Frontend  
tail -f frontend.log
```

### Debug do Backend:
- Porta de debug: **5005**
- Configure sua IDE para conectar no debug remoto na porta 5005

### Verificar status dos serviços:
```bash
# Verificar containers Docker
docker ps

# Verificar processos Java
ps aux | grep java

# Verificar processos Node
ps aux | grep node
```

## Resolução de Problemas

### Erro: "Porta já em uso"
```bash
# Verificar qual processo está usando a porta
lsof -i :8080  # Para backend
lsof -i :5173  # Para frontend

# Matar processo específico
kill -9 <PID>
```

### Erro: "Docker containers não iniciam"
```bash
# Verificar logs dos containers
docker-compose logs db
docker-compose logs redis
docker-compose logs rabbit

# Reiniciar containers
docker-compose down
docker-compose up -d db redis rabbit
```

### Erro: "Backend não compila"
```bash
# Limpar e recompilar
cd app
./mvnw clean compile
```

### Erro: "Frontend não instala dependências"
```bash
# Limpar node_modules e reinstalar
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Requisitos do Sistema

### Software necessário:
- **Docker** e **Docker Compose**
- **Java 21** ou superior
- **Node.js 18** ou superior
- **NPM**
- **netcat** (para verificação de portas)

### Instalação no Ubuntu/Debian:
```bash
# Instalar dependências básicas
sudo apt update
sudo apt install openjdk-21-jdk nodejs npm docker.io docker-compose netcat-openbsd

# Configurar Docker para usuário atual
sudo usermod -aG docker $USER
# (reinicie a sessão após este comando)
```

## Estrutura de Desenvolvimento

O projeto segue o padrão **Feature Folders** com hot reloading completo:

```
crm-pizzaria/
├── app/                    # Backend Spring Boot
│   ├── src/main/java/     # Código Java (hot reload ativo)
│   └── src/main/resources/ # Configurações
├── frontend/              # Frontend React
│   └── src/               # Código React/TS (hot reload ativo)
├── start-dev.sh          # Script principal
└── stop-dev.sh           # Script para parar serviços
```

## Configurações de Hot Reloading

### Backend (Spring Boot DevTools):
- Recompilação automática de classes Java
- Restart automático do contexto Spring
- Live reload para recursos estáticos
- Debug remoto habilitado

### Frontend (Vite HMR):
- Hot Module Replacement instantâneo
- Refresh automático em mudanças de CSS
- Preservação de estado React
- Overlay de erros no browser
