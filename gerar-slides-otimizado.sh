#!/bin/bash

# Script para gerar slides do CRM Pizzaria
# Gera tanto HTML quanto PPTX para diferentes usos

echo "🎯 Gerando slides do CRM Pizzaria..."

# Diretório dos slides
SLIDES_DIR="/home/vinicius/Documentos/dev/fatec/java/crm-pizzaria-v-1-3/slides"
OUTPUT_DIR="/home/vinicius/Documentos/dev/fatec/java/crm-pizzaria-v-1-3/saidas"

# Criar diretório de saídas se não existir
mkdir -p "$OUTPUT_DIR/html"
mkdir -p "$OUTPUT_DIR/pptx"

cd "$SLIDES_DIR"

echo "📄 Gerando HTML (com gradientes)..."
# HTML - mantém todos os efeitos CSS
marp --html --allow-local-files 01-apresentacao.md -o "$OUTPUT_DIR/html/01-apresentacao.html"
marp --html --allow-local-files 02-arquitetura.md -o "$OUTPUT_DIR/html/02-arquitetura.html"

echo "📊 Gerando PPTX (compatível PowerPoint)..."
# PPTX - usa backgroundColor como fallback
marp --pptx --allow-local-files 01-apresentacao.md -o "$OUTPUT_DIR/pptx/01-apresentacao.pptx"
marp --pptx --allow-local-files 02-arquitetura.md -o "$OUTPUT_DIR/pptx/02-arquitetura.pptx"

echo "📋 Gerando PDF..."
# PDF - boa qualidade para impressão
marp --pdf --allow-local-files 01-apresentacao.md -o "$OUTPUT_DIR/pptx/01-apresentacao.pdf"
marp --pdf --allow-local-files 02-arquitetura.md -o "$OUTPUT_DIR/pptx/02-arquitetura.pdf"

echo "✅ Slides gerados com sucesso!"
echo ""
echo "📁 Arquivos disponíveis:"
echo "   HTML: $OUTPUT_DIR/html/ (com gradientes completos)"
echo "   PPTX: $OUTPUT_DIR/pptx/ (compatível PowerPoint)"
echo "   PDF:  $OUTPUT_DIR/pptx/ (para impressão)"
echo ""
echo "💡 Dica: Use HTML para apresentação no computador e PPTX para compartilhar"
