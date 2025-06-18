-- V10: Normalização final - Correções para 3FN em Pedido e LoyaltyPoint

-- 1. NORMALIZAÇÃO DA TABELA PEDIDO
-- Problema: valor_total é derivado dos itens (dependência transitiva)
-- Solução: Remover valor_total e calcular via query quando necessário

-- Remover coluna valor_total da tabela pedido
ALTER TABLE pedido DROP COLUMN IF EXISTS valor_total;

-- Criar view para calcular valor total dos pedidos
CREATE OR REPLACE VIEW pedido_with_total AS
SELECT 
    p.*,
    COALESCE(SUM(pi.quantidade * pi.preco_unitario), 0) AS valor_total
FROM pedido p
LEFT JOIN pedido_item pi ON pi.pedido_id = p.id
GROUP BY p.id, p.cliente_id, p.status, p.pagamento_status, p.created_at;

-- 2. NORMALIZAÇÃO DA TABELA LOYALTY_POINT
-- Problema: pontos é derivado de valor_pedido (dependência transitiva)
-- Solução: Criar tabela de configuração de pontuação

-- Criar tabela de configuração de pontuação
CREATE TABLE loyalty_config (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categoria(id),
    multiplicador DECIMAL(5,4) NOT NULL DEFAULT 0.05,
    pontos_minimos INTEGER DEFAULT 1,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO loyalty_config (categoria_id, multiplicador, pontos_minimos, ativo) VALUES
(NULL, 0.05, 1, TRUE); -- Configuração geral (quando categoria_id é NULL)

-- Inserir configurações específicas por categoria (opcional)
INSERT INTO loyalty_config (categoria_id, multiplicador, pontos_minimos, ativo) 
SELECT id, 0.05, 1, TRUE FROM categoria;

-- Adicionar referência ao pedido na tabela loyalty_point
ALTER TABLE loyalty_point 
ADD COLUMN IF NOT EXISTS pedido_id INTEGER REFERENCES pedido(id),
ADD COLUMN IF NOT EXISTS config_id INTEGER REFERENCES loyalty_config(id);

-- Criar função para calcular pontos baseado na configuração
CREATE OR REPLACE FUNCTION calcular_pontos(valor_pedido DECIMAL, config_id INTEGER) 
RETURNS INTEGER AS $$
DECLARE
    multiplicador DECIMAL(5,4);
    pontos_minimos INTEGER;
    pontos_calculados INTEGER;
BEGIN
    SELECT lc.multiplicador, lc.pontos_minimos
    INTO multiplicador, pontos_minimos
    FROM loyalty_config lc
    WHERE lc.id = config_id AND lc.ativo = TRUE;
    
    IF multiplicador IS NULL THEN
        RETURN 0;
    END IF;
    
    pontos_calculados := FLOOR(valor_pedido * multiplicador);
    
    IF pontos_calculados < pontos_minimos THEN
        RETURN 0;
    END IF;
    
    RETURN pontos_calculados;
END;
$$ LANGUAGE plpgsql;

-- Adicionar triggers para atualização automática
CREATE TRIGGER update_loyalty_config_updated_at 
    BEFORE UPDATE ON loyalty_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 3. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_loyalty_point_pedido_id ON loyalty_point(pedido_id);
CREATE INDEX idx_loyalty_point_config_id ON loyalty_point(config_id);
CREATE INDEX idx_loyalty_config_categoria_id ON loyalty_config(categoria_id);
CREATE INDEX idx_loyalty_config_ativo ON loyalty_config(ativo);

-- 4. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE loyalty_config IS 'Configuração de pontuação do programa de fidelidade';
COMMENT ON COLUMN loyalty_config.categoria_id IS 'Categoria específica (NULL = configuração geral)';
COMMENT ON COLUMN loyalty_config.multiplicador IS 'Multiplicador para cálculo de pontos (ex: 0.05 = 5%)';
COMMENT ON COLUMN loyalty_config.pontos_minimos IS 'Pontos mínimos para gerar registro';

COMMENT ON VIEW pedido_with_total IS 'View que calcula valor total do pedido dinamicamente';
COMMENT ON FUNCTION calcular_pontos(DECIMAL, INTEGER) IS 'Função para calcular pontos baseado na configuração';

-- 5. ATUALIZAR DADOS EXISTENTES (se houver)
-- Atualizar loyalty_points existentes com config_id padrão
UPDATE loyalty_point 
SET config_id = (SELECT id FROM loyalty_config WHERE categoria_id IS NULL LIMIT 1)
WHERE config_id IS NULL;
