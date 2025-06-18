-- Adicionar colunas descricao e categoria na tabela produto
ALTER TABLE produto ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE produto ADD COLUMN IF NOT EXISTS categoria VARCHAR(50);

-- Inserir produtos de pizza com preços realistas
INSERT INTO produto (nome, preco, descricao, categoria) VALUES
-- Pizzas Tradicionais
('Pizza Margherita', 32.90, 'Molho de tomate, mussarela, manjericão fresco e azeite extravirgem', 'PIZZA'),
('Pizza Calabresa', 36.90, 'Molho de tomate, mussarela, calabresa acebolada e orégano', 'PIZZA'),
('Pizza Portuguesa', 42.90, 'Molho de tomate, mussarela, presunto, ovos, cebola, azeitona e orégano', 'PIZZA'),
('Pizza Quatro Queijos', 44.90, 'Molho de tomate, mussarela, gorgonzola, parmesão e provolone', 'PIZZA'),
('Pizza Pepperoni', 38.90, 'Molho de tomate, mussarela e pepperoni', 'PIZZA'),

-- Pizzas Especiais
('Pizza Frango com Catupiry', 41.90, 'Molho de tomate, mussarela, frango desfiado, catupiry e milho', 'PIZZA'),
('Pizza Bacon', 39.90, 'Molho de tomate, mussarela, bacon crocante e cebola', 'PIZZA'),
('Pizza Atum', 43.90, 'Molho de tomate, mussarela, atum, cebola, azeitona e orégano', 'PIZZA'),
('Pizza Napolitana', 34.90, 'Molho de tomate, mussarela, tomate fatiado, manjericão e alho', 'PIZZA'),
('Pizza Vegetariana', 37.90, 'Molho de tomate, mussarela, abobrinha, berinjela, pimentão, tomate e rúcula', 'PIZZA'),

-- Pizzas Gourmet
('Pizza Salmão', 52.90, 'Cream cheese, mussarela, salmão, alcaparras e dill', 'PIZZA'),
('Pizza Camarão', 54.90, 'Molho branco, mussarela, camarão, alho poró e pimentão', 'PIZZA'),
('Pizza Rúcula com Tomate Seco', 45.90, 'Molho de tomate, mussarela, rúcula, tomate seco, parmesão e azeite', 'PIZZA'),
('Pizza Burrata', 48.90, 'Molho de tomate, burrata, tomate cereja, manjericão e azeite trufado', 'PIZZA'),
('Pizza Lombo Canadense', 46.90, 'Molho de tomate, mussarela, lombo canadense, abacaxi e orégano', 'PIZZA'),

-- Pizzas Doces
('Pizza Chocolate com Morango', 29.90, 'Chocolate ao leite, morangos frescos e açúcar de confeiteiro', 'PIZZA'),
('Pizza Banana com Canela', 26.90, 'Banana fatiada, canela, açúcar e leite condensado', 'PIZZA'),
('Pizza Romeu e Julieta', 28.90, 'Queijo minas, goiabada e açúcar cristal', 'PIZZA'),

-- Bebidas
('Coca-Cola 350ml', 5.50, 'Refrigerante de cola gelado', 'BEBIDA'),
('Guaraná Antarctica 350ml', 5.50, 'Refrigerante de guaraná gelado', 'BEBIDA'),
('Água Mineral 500ml', 3.50, 'Água mineral sem gás', 'BEBIDA'),
('Suco de Laranja Natural 300ml', 8.90, 'Suco de laranja natural', 'BEBIDA'),
('Cerveja Heineken 350ml', 9.90, 'Cerveja importada gelada', 'BEBIDA'),

-- Sobremesas
('Pudim de Leite', 12.90, 'Pudim caseiro com calda de caramelo', 'SOBREMESA'),
('Tiramisu', 15.90, 'Sobremesa italiana com café e mascarpone', 'SOBREMESA'),
('Petit Gateau', 18.90, 'Bolinho de chocolate quente com sorvete de baunilha', 'SOBREMESA'),

-- Acompanhamentos
('Batata Frita', 16.90, 'Porção de batata frita crocante', 'ACOMPANHAMENTO'),
('Pão de Alho', 12.90, 'Pão francês com manteiga de alho e ervas', 'ACOMPANHAMENTO'),
('Bruschetta', 18.90, 'Pão italiano com tomate, manjericão e mussarela de búfala', 'ACOMPANHAMENTO');
