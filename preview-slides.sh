#!/bin/bash

# Script para teste rápido dos slides otimizados
echo "🎨 Testando slides otimizados..."

cd "/home/vinicius/Documentos/dev/fatec/java/crm-pizzaria-v-1-3/slides"

# Teste HTML com live preview
echo "📄 Iniciando preview HTML..."
marp --html --allow-local-files --watch 01-apresentacao.md &
MARP_PID=$!

echo "✅ Preview iniciado!"
echo "🌐 Abra: http://localhost:8080"
echo ""
echo "💡 Pressione Ctrl+C para parar o preview"
echo "🔧 Para gerar PPTX: ./gerar-slides-otimizado.sh"

# Aguarda interrupção
trap "kill $MARP_PID 2>/dev/null" EXIT
wait $MARP_PID
