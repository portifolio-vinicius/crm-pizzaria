---
marp: true
theme: default
paginate: true
header: "🗄️ CRM Pizzaria - Banco de Dados"
footer: "FATEC - Engenharia de Software"
size: 16:9
style: |
  :root {
    --color-primary: #27ae60;
    --color-accent: #e74c3c;
    --color-info: #3498db;
  }
  section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 25px;
    padding: 35px;
  }
  h1 {
    color: #f39c12;
    font-size: 2.0em;
    text-align: center;
    margin-bottom: 0.4em;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
  h2 {
    color: #27ae60;
    font-size: 1.3em;
    margin-bottom: 0.3em;
  }
  .db-schema {
    background: rgba(39, 174, 96, 0.15);
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #27ae60;
    margin: 10px 0;
    font-size: 0.8em;
    font-family: monospace;
  }
  .normalization {
    background: rgba(52, 152, 219, 0.15);
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #3498db;
    margin: 10px 0;
    font-size: 0.85em;
  }
  .entity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin: 15px 0;
  }
  .entity-box {
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 8px;
    border: 2px solid rgba(255,255,255,0.2);
    font-size: 0.8em;
  }
---

# 🗄️ Modelagem de Banco
## Estrutura Normalizada 3FN

<div class="db-schema">
PostgreSQL + Flyway + Normalização Completa
</div>

---

## 📊 Entidades Principais

<div class="entity-grid">

<div class="entity-box">
<strong>👥 CLIENTE</strong><br>
• id, nome, email*<br>
• telefone, timestamps<br>
• Índice único em email
</div>

<div class="entity-box">
<strong>🍕 PRODUTO</strong><br>
• id, nome, preço<br>
• categoria_id (FK)<br>
• ativo, timestamps
</div>

</div>

<div class="entity-grid">

<div class="entity-box">
<strong>📝 PEDIDO</strong><br>
• id, cliente_id (FK)<br>
• status, pagamento_status<br>
• **SEM valor_total** (3FN)
</div>

<div class="entity-box">
<strong>🎯 LOYALTY_POINT</strong><br>
• id, cliente_id, pedido_id<br>
• config_id (FK), pontos<br>
• Flexível por categoria
</div>

</div>

<div class="normalization">
<strong>✅ Normalização 3FN:</strong> Valor total calculado via view, pontos com configuração específica
</div>

---

## 🏗️ Entidades Core do Sistema

### **1. Cliente**
<div class="db-schema">

```sql
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Características:**
- Email único para autenticação
- Timestamps para auditoria
- Índices em email para performance

</div>

### **2. Categoria + Produto (Normalizado)**
<div class="db-schema">

```sql
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10,2) NOT NULL,
    categoria_id INTEGER REFERENCES categoria(id),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

</div>

---

## 📝 Entidades de Pedido

### **3. Pedido (Normalizado - Sem valor_total)**
<div class="normalization">

```sql
CREATE TABLE pedido (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES cliente(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    pagamento_status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- View para cálculo dinâmico do total
CREATE OR REPLACE VIEW pedido_with_total AS
SELECT 
    p.*,
    COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0) AS valor_total
FROM pedido p
LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
GROUP BY p.id, p.cliente_id, p.status, p.pagamento_status, p.created_at;
```

**✅ Normalização 3FN:** Valor total calculado dinamicamente, não armazenado

</div>

### **4. Pedido Item**
<div class="db-schema">

```sql
CREATE TABLE pedido_item (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedido(id),
    produto_id INTEGER REFERENCES produto(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

</div>

---

## 🎯 Sistema de Fidelidade Normalizado

### **5. Loyalty Config (Configuração Flexível)**
<div class="normalization">

```sql
CREATE TABLE loyalty_config (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categoria(id), -- NULL = config geral
    multiplicador NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    pontos_minimos INTEGER NOT NULL DEFAULT 1,
    valor_minimo NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Funcionalidade:**
- Configuração geral (categoria_id = NULL)
- Configuração específica por categoria
- Flexibilidade para diferentes regras de pontuação

</div>

### **6. Loyalty Point (Normalizado)**
<div class="normalization">

```sql
CREATE TABLE loyalty_point (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES cliente(id),
    pedido_id INTEGER REFERENCES pedido(id),
    config_id INTEGER REFERENCES loyalty_config(id),
    pontos INTEGER NOT NULL,
    valor_pedido NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**✅ Normalização 3FN:** Pontos relacionados à configuração específica usada

</div>

---

## 👥 Entidades de Gestão

### **7. Usuario (Autenticação)**
<div class="db-schema">

```sql
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL, -- email
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENTE',
    created_by INTEGER REFERENCES usuario(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Roles suportados:** ADMIN, ASSISTENTE, CLIENTE

</div>

### **8. Motoboy**
<div class="db-schema">

```sql
CREATE TABLE motoboy (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    placa_veiculo VARCHAR(10),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

</div>

---

## 🔄 Migrações Flyway

### **Versionamento Controlado**

<div class="normalization">

**Histórico de Migrações:**
- **V1** → Estrutura inicial (cliente, produto, pedido, loyalty_point)
- **V2** → Adição de pedido_item
- **V3** → Criação de usuario  
- **V4** → Criação de motoboy
- **V5** → Adição de created_by em usuario
- **V6** → Campo valor_pedido em loyalty_point
- **V7** → Novos status de pedido (CONFIRMADO, EM_PREPARO, ENTREGUE)
- **V8** → Dados iniciais de produtos pizza
- **V9** → **Normalização produto/categoria** 
- **V10** → **Normalização pedido/fidelidade**
- **V11** → Produtos de exemplo adicionais

</div>

### **Exemplo V9 - Normalização Categoria:**
```sql
-- Criar tabela categoria
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Migrar dados existentes
INSERT INTO categoria (nome) 
SELECT DISTINCT categoria FROM produto WHERE categoria IS NOT NULL;

-- Adicionar FK em produto
ALTER TABLE produto ADD COLUMN categoria_id INTEGER REFERENCES categoria(id);
UPDATE produto SET categoria_id = (SELECT id FROM categoria WHERE nome = produto.categoria);
ALTER TABLE produto DROP COLUMN categoria;
```

---

## 📈 Índices e Performance

### **Índices Estratégicos**

<div class="db-schema">

```sql
-- Índices para performance
CREATE INDEX idx_cliente_email ON cliente(email);
CREATE INDEX idx_produto_categoria ON produto(categoria_id);
CREATE INDEX idx_produto_ativo ON produto(ativo) WHERE ativo = true;
CREATE INDEX idx_pedido_cliente ON pedido(cliente_id);
CREATE INDEX idx_pedido_status ON pedido(status);
CREATE INDEX idx_pedido_item_pedido ON pedido_item(pedido_id);
CREATE INDEX idx_loyalty_point_cliente ON loyalty_point(cliente_id);
CREATE INDEX idx_loyalty_point_pedido ON loyalty_point(pedido_id);
```

**Otimizações:**
- Índices parciais para registros ativos
- Índices compostos para consultas frequentes
- Foreign keys automaticamente indexadas

</div>

---

## ✅ Conformidade 3FN Alcançada

### **Verificação das Formas Normais**

<div class="normalization">

**✅ 1FN (Primeira Forma Normal):**
- Todos os campos são atômicos
- Sem grupos repetitivos
- Chaves primárias definidas

**✅ 2FN (Segunda Forma Normal):**
- Em conformidade com 1FN
- Sem dependências parciais
- Dependências funcionais completas

**✅ 3FN (Terceira Forma Normal):**
- Em conformidade com 2FN
- **ZERO dependências transitivas**
- `valor_total` removido → calculado dinamicamente
- `pontos` relacionados à configuração específica
- Categoria separada de produto

</div>

### **Benefícios Obtidos:**
- **Integridade** → Constraints FK garantem consistência
- **Flexibilidade** → Sistema de fidelidade configurável
- **Performance** → Views e índices otimizados
- **Manutenibilidade** → Estrutura clara e normalizada

---

<!-- Notas do apresentador:
- Destacar evolução das migrações V9 e V10
- Explicar benefícios da normalização 3FN
- Mencionar performance com índices estratégicos
- Falar sobre flexibilidade do sistema de fidelidade
- Destacar uso de views para cálculos dinâmicos
-->
