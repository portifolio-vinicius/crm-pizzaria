#!/bin/bash

# Script para gerar apresentação CRM Pizzaria
# Evita timeouts do Puppeteer com configurações otimizadas

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_message() {
    echo -e "${BLUE}[MARP-GENERATOR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[MARP-GENERATOR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[MARP-GENERATOR]${NC} $1"
}

print_error() {
    echo -e "${RED}[MARP-GENERATOR]${NC} $1"
}

# Verificar se marp-cli está instalado
if ! command -v marp >/dev/null 2>&1; then
    print_error "Marp CLI não encontrado. Instalando..."
    npm install -g @marp-team/marp-cli
fi

# Criar diretórios de saída
print_message "Criando diretórios de saída..."
mkdir -p saidas/{html,pdf,pptx}

# Configurações otimizadas para evitar timeout
MARP_OPTIONS="--html --allow-local-files --timeout 300000"

print_message "Gerando apresentação em HTML..."
marp $MARP_OPTIONS --output saidas/html/crm-pizzaria-apresentacao.html slides/*.md
print_success "HTML gerado com sucesso!"

print_message "Gerando apresentação em PDF..."
marp $MARP_OPTIONS --pdf --output saidas/pdf/crm-pizzaria-apresentacao.pdf slides/*.md
print_success "PDF gerado com sucesso!"

print_warning "Tentando gerar PPTX (pode demorar mais)..."
if marp $MARP_OPTIONS --pptx --output saidas/pptx/crm-pizzaria-apresentacao.pptx slides/*.md; then
    print_success "PPTX gerado com sucesso!"
else
    print_error "Erro ao gerar PPTX. Tentando método alternativo..."
    
    # Método alternativo: gerar slides individuais
    print_message "Gerando slides individuais em PPTX..."
    for slide in slides/*.md; do
        filename=$(basename "$slide" .md)
        print_message "Processando: $filename"
        
        if marp --pptx --timeout 180000 --output "saidas/pptx/${filename}.pptx" "$slide"; then
            print_success "✅ $filename.pptx"
        else
            print_error "❌ Falha em $filename"
        fi
    done
fi

print_message "Listando arquivos gerados..."
echo ""
echo "📁 HTML:"
ls -la saidas/html/
echo ""
echo "📁 PDF:"
ls -la saidas/pdf/
echo ""
echo "📁 PPTX:"
ls -la saidas/pptx/
echo ""

print_success "🎉 Geração concluída!"
print_message "Para visualizar:"
print_message "  HTML: firefox saidas/html/crm-pizzaria-apresentacao.html"
print_message "  PDF: evince saidas/pdf/crm-pizzaria-apresentacao.pdf"
