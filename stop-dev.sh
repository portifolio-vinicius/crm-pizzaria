#!/bin/bash

# Script para parar todos os serviços do CRM Pizzaria

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_message() {
    echo -e "${BLUE}[CRM-PIZZARIA-STOP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[CRM-PIZZARIA-STOP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[CRM-PIZZARIA-STOP]${NC} $1"
}

# Função para detectar comando docker compose correto
get_docker_compose_cmd() {
    if docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    elif command -v docker-compose >/dev/null 2>&1; then
        echo "docker-compose"
    else
        return 1
    fi
}

print_message "Parando todos os serviços do CRM Pizzaria..."

# Detectar comando docker compose correto
DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)

# Parar containers Docker
print_message "Parando containers Docker..."
if [ $? -eq 0 ] && [ -n "$DOCKER_COMPOSE_CMD" ]; then
    cd app 2>/dev/null && $DOCKER_COMPOSE_CMD down 2>/dev/null && cd .. 2>/dev/null
    print_success "Containers Docker parados."
else
    print_warning "Docker Compose não encontrado, pulando containers Docker."
fi

# Matar processos do Spring Boot
print_message "Parando backend (Spring Boot)..."
pkill -f "spring-boot:run" 2>/dev/null || true
pkill -f "mvnw" 2>/dev/null || true
print_success "Backend parado."

# Matar processos do Vite/Node
print_message "Parando frontend (Vite)..."
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
print_success "Frontend parado."

# Remover arquivos de log
print_message "Limpando arquivos de log..."
rm -f backend.log frontend.log 2>/dev/null || true
print_success "Arquivos de log removidos."

print_success "Todos os serviços foram parados com sucesso!"
