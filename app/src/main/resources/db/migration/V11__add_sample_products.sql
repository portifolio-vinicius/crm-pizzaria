-- Adicionar categorias
INSERT INTO categoria (nome, descricao, ativa, updated_at) VALUES
('Pizzas', 'Deliciosas pizzas artesanais', true, NOW()),
('Bebidas', 'Bebidas refrescantes', true, NOW()),
('Sobremesas', 'Sobremesas deliciosas', true, NOW()),
('Acompanhamentos', 'Acompanhamentos variados', true, NOW());

-- Adicionar produtos
INSERT INTO produto (nome, preco, descricao, categoria_id, ativo, created_at, updated_at) VALUES
('Pizza Margherita', 25.90, 'Pizza clássica com molho de tomate, mussarela e manjericão', 1, true, '2025-06-01 10:00:00', NOW()),
('Pizza Pepperoni', 29.90, 'Pizza com molho de tomate, mussarela e pepperoni', 1, true, '2025-06-02 11:00:00', NOW()),
('Pizza Quatro Queijos', 32.90, 'Pizza com mussarela, parmesão, gorgonzola e provolone', 1, true, '2025-06-03 12:00:00', NOW()),
('Coca-Cola 350ml', 5.90, 'Refrigerante Coca-Cola lata 350ml', 2, true, '2025-06-04 13:00:00', NOW()),
('Suco de Laranja', 7.90, 'Suco natural de laranja', 2, true, '2025-06-05 14:00:00', NOW()),
('Água Mineral 500ml', 3.90, 'Água mineral sem gás 500ml', 2, true, '2025-06-06 15:00:00', NOW()),
('Brownie de Chocolate', 12.90, 'Brownie artesanal com cobertura de chocolate', 3, true, '2025-06-07 16:00:00', NOW()),
('Torta de Limão', 14.90, 'Torta de limão com merengue', 3, true, '2025-06-08 17:00:00', NOW()),
('Sorvete de Creme', 10.90, 'Sorvete de creme artesanal', 3, true, '2025-06-09 18:00:00', NOW()),
('Batata Frita', 8.90, 'Porção de batata frita crocante', 4, true, '2025-06-10 19:00:00', NOW()),
('Onion Rings', 9.90, 'Anéis de cebola empanados e fritos', 4, true, '2025-06-11 20:00:00', NOW()),
('Pão de Alho', 6.90, 'Pão de alho assado na brasa', 4, true, '2025-06-12 21:00:00', NOW()),
('Pizza Calabresa', 27.90, 'Pizza com molho de tomate, mussarela e calabresa', 1, true, '2025-06-13 22:00:00', NOW()),
('Pizza Vegetariana', 28.90, 'Pizza com vegetais frescos e queijo', 1, true, '2025-06-14 23:00:00', NOW()),
('Pizza Portuguesa', 30.90, 'Pizza com presunto, ovos, cebola e azeitonas', 1, true, '2025-06-15 10:00:00', NOW());
