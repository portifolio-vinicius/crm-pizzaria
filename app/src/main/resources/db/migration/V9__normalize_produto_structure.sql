-- Normalizar estrutura de produtos
-- Criar tabela de categorias separada para normalização

-- 1. Criar tabela categoria
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Inserir categorias baseadas nos produtos existentes
INSERT INTO categoria (nome, descricao) VALUES
('PIZZA', 'Pizzas tradicionais, especiais e gourmet'),
('BEBIDA', 'Refrigerantes, sucos, águas e bebidas alcoólicas'),
('SOBREMESA', 'Sobremesas e doces'),
('ACOMPANHAMENTO', 'Porções e acompanhamentos');

-- 3. Adicionar campos de auditoria e controle à tabela produto
ALTER TABLE produto 
ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS categoria_id INTEGER,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();

-- 4. Atualizar categoria_id baseado na categoria existente
UPDATE produto SET categoria_id = (SELECT id FROM categoria WHERE nome = produto.categoria);

-- 5. Adicionar foreign key constraint
ALTER TABLE produto 
ADD CONSTRAINT fk_produto_categoria 
FOREIGN KEY (categoria_id) REFERENCES categoria(id);

-- 6. Remover a coluna categoria antiga (depois de migrar os dados)
ALTER TABLE produto DROP COLUMN IF EXISTS categoria;

-- 7. Adicionar índices para performance
CREATE INDEX idx_produto_categoria_id ON produto(categoria_id);
CREATE INDEX idx_produto_ativo ON produto(ativo);
CREATE INDEX idx_categoria_ativa ON categoria(ativa);

-- 8. Adicionar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_produto_updated_at 
    BEFORE UPDATE ON produto 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categoria_updated_at 
    BEFORE UPDATE ON categoria 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
