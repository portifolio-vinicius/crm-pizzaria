#!/bin/bash

# Script para iniciar todos os serviços em modo de desenvolvimento
# Com hot reloading para frontend e backend

set -e  # Para o script em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${BLUE}[CRM-PIZZARIA]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[CRM-PIZZARIA]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[CRM-PIZZARIA]${NC} $1"
}

print_error() {
    echo -e "${RED}[CRM-PIZZARIA]${NC} $1"
}

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para detectar comando docker compose correto
get_docker_compose_cmd() {
    if docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    elif command_exists docker-compose; then
        echo "docker-compose"
    else
        return 1
    fi
}

# Função para verificar se uma porta está em uso
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

# Função para aguardar que um serviço esteja disponível
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local max_attempts=30
    local attempt=1

    print_message "Aguardando $service_name estar disponível em $host:$port..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            print_success "$service_name está disponível!"
            return 0
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "$service_name não ficou disponível após $max_attempts tentativas"
            return 1
        fi
        
        sleep 2
        attempt=$((attempt + 1))
    done
}

# Função para limpar processos ao sair
cleanup() {
    print_warning "Parando todos os serviços..."
    
    # Parar containers Docker
    if [ -n "$DOCKER_COMPOSE_CMD" ]; then
        cd app && $DOCKER_COMPOSE_CMD down && cd ..
    fi
    
    # Matar processos do backend e frontend se estiverem rodando
    pkill -f "spring-boot:run" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    
    print_success "Todos os serviços foram parados."
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Verificar dependências
print_message "Verificando dependências..."

if ! command_exists docker; then
    print_error "Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Detectar comando docker compose correto
DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)
if [ $? -ne 0 ]; then
    print_error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

print_message "Usando comando: $DOCKER_COMPOSE_CMD"

if ! command_exists java; then
    print_error "Java não está instalado. Por favor, instale o Java 21 primeiro."
    exit 1
fi

if ! command_exists node; then
    print_error "Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

if ! command_exists npm; then
    print_error "NPM não está instalado. Por favor, instale o NPM primeiro."
    exit 1
fi

if ! command_exists nc; then
    print_error "netcat (nc) não está instalado. Por favor, instale: sudo apt install netcat-openbsd"
    exit 1
fi

print_success "Todas as dependências estão instaladas!"

# Verificar se as portas necessárias estão livres
print_message "Verificando disponibilidade das portas..."

if port_in_use 8080; then
    print_error "Porta 8080 (Backend) já está em uso. Por favor, pare o processo que está usando esta porta."
    exit 1
fi

if port_in_use 5173; then
    print_error "Porta 5173 (Frontend) já está em uso. Por favor, pare o processo que está usando esta porta."
    exit 1
fi

# Verificar porta do debugger Java
if port_in_use 5005; then
    print_error "Porta 5005 (Debug) já está em uso. Por favor, pare o processo que está usando esta porta."
    exit 1
fi

print_success "Todas as portas necessárias estão disponíveis!"

# Iniciar containers Docker (banco de dados e serviços)
print_message "Iniciando containers Docker (PostgreSQL, Redis, RabbitMQ)..."
cd app
$DOCKER_COMPOSE_CMD up -d db redis rabbit
cd ..

# Aguardar serviços estarem disponíveis
wait_for_service localhost 5432 "PostgreSQL"
wait_for_service localhost 6379 "Redis"
wait_for_service localhost 5672 "RabbitMQ"

print_success "Todos os containers Docker estão funcionando!"

# Verificar se as dependências do frontend estão instaladas
print_message "Verificando dependências do frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    print_message "Instalando dependências do frontend..."
    npm install
    print_success "Dependências do frontend instaladas!"
else
    print_message "Dependências do frontend já estão instaladas."
fi
cd ..

# Compilar o backend (se necessário)
print_message "Compilando o backend..."
cd app
./mvnw clean compile -DskipTests
print_success "Backend compilado com sucesso!"
cd ..

# Iniciar o backend em background com hot reloading
print_message "Iniciando o backend (Spring Boot) com hot reloading na porta 8080..."
cd app
nohup ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005" > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar o backend estar disponível
wait_for_service localhost 8080 "Backend (Spring Boot)"

# Iniciar o frontend em background com hot reloading
print_message "Iniciando o frontend (Vite) com hot reloading na porta 5173..."
cd frontend
nohup npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Aguardar o frontend estar disponível
wait_for_service localhost 5173 "Frontend (Vite)"

# Mostrar informações dos serviços
echo ""
echo "=========================================="
echo -e "${GREEN}🚀 TODOS OS SERVIÇOS ESTÃO FUNCIONANDO! 🚀${NC}"
echo "=========================================="
echo ""
echo -e "${BLUE}📊 Serviços disponíveis:${NC}"
echo "  • Frontend (React + Vite):     http://localhost:5173"
echo "  • Backend (Spring Boot):       http://localhost:8080"
echo "  • API Documentation:           http://localhost:8080/swagger-ui.html"
echo "  • PostgreSQL:                  localhost:5432"
echo "  • Redis:                       localhost:6379"
echo "  • RabbitMQ Management:         http://localhost:15672 (guest/guest)"
echo ""
echo -e "${YELLOW}🔥 Hot Reloading ativo:${NC}"
echo "  • Frontend: Mudanças em arquivos .tsx/.ts são recarregadas automaticamente"
echo "  • Backend: Mudanças em arquivos .java são recarregadas automaticamente"
echo ""
echo -e "${PURPLE}📝 Logs:${NC}"
echo "  • Backend: tail -f backend.log"
echo "  • Frontend: tail -f frontend.log"
echo ""
echo -e "${BLUE}🔧 Debug:${NC}"
echo "  • Backend Debug Port: 5005 (para conectar IDEs)"
echo ""
echo -e "${RED}⏹️  Para parar todos os serviços: Ctrl+C${NC}"
echo ""

# Manter o script rodando e mostrar logs em tempo real
print_message "Monitorando serviços... (Ctrl+C para parar tudo)"

# Criar um loop que monitora os processos e mostra logs
while true; do
    # Verificar se o backend ainda está rodando
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend parou inesperadamente! Verifique o log: tail -f backend.log"
        cleanup
    fi
    
    # Verificar se o frontend ainda está rodando
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend parou inesperadamente! Verifique o log: tail -f frontend.log"
        cleanup
    fi
    
    sleep 5
done
