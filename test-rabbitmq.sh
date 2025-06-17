#!/bin/bash

# Script para testar o funcionamento completo do RabbitMQ no CRM Pizzaria
# Este script testa:
# 1. Criação de um cliente
# 2. Criação de um produto  
# 3. Criação de um pedido (que dispara evento pedido.criado)
# 4. Marcar pedido como entregue (que dispara evento pedido.entregue)
# 5. Verificar se os pontos de fidelidade foram criados

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧪 TESTANDO FLUXO COMPLETO DO RABBITMQ - CRM PIZZARIA${NC}"
echo ""

BASE_URL="http://localhost:8080/v1"

# Primeiro vamos registrar um cliente
echo -e "${BLUE}1. Registrando cliente...${NC}"

CLIENT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register/client" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cliente.teste@exemplo.com",
    "password": "123456"
  }')

echo "Resposta do registro de cliente: $CLIENT_RESPONSE"

# Fazer login para obter token
echo -e "${BLUE}2. Fazendo login...${NC}"

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cliente.teste@exemplo.com", 
    "password": "123456"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Erro: Não foi possível obter o token de autenticação${NC}"
    echo "Resposta do login: $LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Login realizado com sucesso!${NC}"

# Criar um cliente na base
echo -e "${BLUE}3. Criando cliente na base de dados...${NC}"

CLIENTE_RESPONSE=$(curl -s -X POST "$BASE_URL/clientes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Cliente Teste",
    "email": "cliente.teste@exemplo.com",
    "telefone": "(11) 99999-9999"
  }')

CLIENTE_ID=$(echo $CLIENTE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$CLIENTE_ID" ]; then
    echo -e "${RED}❌ Erro: Não foi possível criar o cliente${NC}"
    echo "Resposta: $CLIENTE_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Cliente criado com ID: $CLIENTE_ID${NC}"

# Criar um produto
echo -e "${BLUE}4. Criando produto...${NC}"

PRODUTO_RESPONSE=$(curl -s -X POST "$BASE_URL/produtos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "Pizza Margherita Teste",
    "descricao": "Pizza de teste para RabbitMQ",
    "preco": 29.90,
    "categoria": "PIZZA"
  }')

PRODUTO_ID=$(echo $PRODUTO_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$PRODUTO_ID" ]; then
    echo -e "${RED}❌ Erro: Não foi possível criar o produto${NC}"
    echo "Resposta: $PRODUTO_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Produto criado com ID: $PRODUTO_ID${NC}"

# Criar um pedido (isso deve disparar o evento pedido.criado)
echo -e "${BLUE}5. Criando pedido (dispara evento pedido.criado)...${NC}"

PEDIDO_RESPONSE=$(curl -s -X POST "$BASE_URL/pedidos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"cliente\": {
      \"id\": $CLIENTE_ID
    },
    \"itens\": [
      {
        \"produto\": {
          \"id\": $PRODUTO_ID
        },
        \"quantidade\": 2,
        \"precoUnitario\": 29.90
      }
    ]
  }")

PEDIDO_ID=$(echo $PEDIDO_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$PEDIDO_ID" ]; then
    echo -e "${RED}❌ Erro: Não foi possível criar o pedido${NC}"
    echo "Resposta: $PEDIDO_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Pedido criado com ID: $PEDIDO_ID${NC}"
echo "💬 Verifique os logs da aplicação para ver a mensagem 'Pedido criado com ID: $PEDIDO_ID - Evento processado!'"

# Aguardar um pouco para o evento ser processado
sleep 2

# Marcar pedido como entregue (isso deve disparar o evento pedido.entregue)
echo -e "${BLUE}6. Marcando pedido como entregue (dispara evento pedido.entregue)...${NC}"

# Primeiro vamos alterar o status para CONFIRMADO
curl -s -X PUT "$BASE_URL/pedidos/$PEDIDO_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "CONFIRMADO"
  }' > /dev/null

# Agora marcar como entregue
ENTREGA_RESPONSE=$(curl -s -X POST "$BASE_URL/pedidos/$PEDIDO_ID/entregar" \
  -H "Authorization: Bearer $TOKEN")

if [[ $ENTREGA_RESPONSE == *"ENTREGUE"* ]]; then
    echo -e "${GREEN}✅ Pedido marcado como entregue!${NC}"
else
    echo -e "${RED}❌ Erro ao marcar pedido como entregue${NC}"
    echo "Resposta: $ENTREGA_RESPONSE"
fi

# Aguardar processamento dos eventos
sleep 3

# Verificar se os pontos de fidelidade foram criados
echo -e "${BLUE}7. Verificando pontos de fidelidade...${NC}"

PONTOS_RESPONSE=$(curl -s -X GET "$BASE_URL/fidelidade" \
  -H "Authorization: Bearer $TOKEN")

if [[ $PONTOS_RESPONSE == *"$CLIENTE_ID"* ]]; then
    echo -e "${GREEN}✅ Pontos de fidelidade foram criados com sucesso!${NC}"
    echo "Resposta: $PONTOS_RESPONSE"
else
    echo -e "${RED}❌ Pontos de fidelidade não foram encontrados${NC}"
    echo "Resposta: $PONTOS_RESPONSE"
fi

echo ""
echo -e "${GREEN}🎉 TESTE COMPLETO FINALIZADO!${NC}"
echo ""
echo -e "${BLUE}📊 Resumo do teste:${NC}"
echo "  • Cliente ID: $CLIENTE_ID"
echo "  • Produto ID: $PRODUTO_ID" 
echo "  • Pedido ID: $PEDIDO_ID"
echo ""
echo -e "${BLUE}🔍 Para verificar as filas no RabbitMQ:${NC}"
echo "  • Acesse: http://localhost:15672"
echo "  • Login: guest / guest"
echo "  • Vá em 'Queues' para ver as filas 'pedido.criado' e 'pedido.entregue'"
echo ""
echo -e "${BLUE}📝 Para verificar os logs da aplicação:${NC}"
echo "  • Verifique a saída do terminal onde a aplicação está rodando"
echo "  • Procure pelas mensagens de eventos processados"
