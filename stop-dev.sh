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

print_message "Parando todos os serviços do CRM Pizzaria..."

# Parar containers Docker
print_message "Parando containers Docker..."
cd app 2>/dev/null && docker-compose down 2>/dev/null && cd .. 2>/dev/null
print_success "Containers Docker parados."

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
