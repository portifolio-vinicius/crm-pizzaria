---
marp: true
theme: ./theme.css
paginate: true
backgroundColor: '#34495e'
header: "CRM Pizzaria"
footer: "FATEC - Engenharia de Software"
size: 16:9
_class: bg-primary

---

# CRM Pizzaria
## Sistema Completo de Gestão

<div class="highlight">
<strong>Tecnologias Modernas para Negócios Tradicionais</strong><br>
Sistema CRM robusto com Spring Boot, React, PostgreSQL e RabbitMQ
</div>

### **Projeto FATEC - Engenharia de Software**

---

## Agenda da Apresentação

<div class="feature-grid">

<div>
<strong>Visão Geral</strong>
• Objetivos e escopo<br>
• Stack tecnológica
</div>

<div>
<strong>Arquitetura</strong>
• Padrões aplicados<br>
• Organização modular
</div>

</div>

<div class="feature-grid">

<div>
<strong>Banco de Dados</strong>
• Modelagem ER<br>
• Normalização 3FN
</div>

<div>
<strong>Regras de Negócio</strong>
• Fluxos do sistema<br>
• Controles de acesso
</div>

</div>

---

## Objetivos do Sistema

<div class="feature-grid">

<div>
<strong>Para a Pizzaria</strong>
• <strong>Gestão de Pedidos</strong> - Completa<br>
• <strong>Controle de Estoque</strong> - Organizado<br>
• <strong>Sistema de Fidelidade</strong> - Retenção<br>
• <strong>Gestão de Entregas</strong> - Motoboys<br>
• <strong>Relatórios</strong> - Dashboards KPI
</div>

<div>
<strong>Para os Clientes</strong>
• <strong>Interface Mobile</strong> - Otimizada<br>
• <strong>Pedidos Online</strong> - Conveniente<br>
• <strong>Programa de Pontos</strong> - Recompensas<br>
• <strong>Histórico</strong> - Acompanhamento<br>
• <strong>Notificações</strong> - Status em tempo real
</div>

</div>

---

## Stack Tecnológica

<div class="tech-grid">

<div class="tech-box">
<strong>Backend</strong>
Spring Boot 3.2 + Java 17<br>
• Security + JWT<br>
• Data JPA + PostgreSQL<br>
• AMQP + RabbitMQ<br>
• Cache + Redis
</div>

<div class="tech-box">
<strong>Frontend</strong>
React 18 + TypeScript<br>
• Vite Build Tool<br>
• React Router SPA<br>
• Axios HTTP Client<br>
• CSS Modules
</div>

</div>

<div class="highlight">
<strong>DevOps:</strong> Docker Compose • Scripts automatizados • Flyway Migrations
</div>

---

## Principais Funcionalidades

<div class="feature-grid">

<div>
<strong>Gestão</strong>
• Clientes (CRUD + validações)<br>
• Cardápio (categorizado)<br>
• Pedidos (tracking status)<br>
• Motoboys (entregadores)
</div>

<div>
<strong>Negócios</strong>
• Pagamentos (gateway)<br>
• Fidelidade (configurável)<br>
• Relatórios (KPIs)<br>
• Notificações (eventos)
</div>

</div>

<div class="highlight">
<strong>Mobile-First:</strong> Interface responsiva com histórico de pedidos e pontos de fidelidade
</div>

---

## Fluxo Principal do Sistema

<div class="tech-grid">

<div class="tech-box">
<strong>1. Cadastro</strong><br>
Cliente registra → JWT Token → Acesso liberado
</div>

<div class="tech-box">
<strong>2. Pedido</strong><br>
Produtos → Carrinho → Pagamento → Status PENDENTE
</div>

</div>

<div class="tech-grid">

<div class="tech-box">
<strong>3. Processamento</strong><br>
CONFIRMADO → EM_PREPARO → ENTREGUE
</div>

<div class="tech-box">
<strong>4. Fidelidade</strong><br>
Evento entrega → Cálculo pontos → Crédito automático
</div>

</div>

---

<!-- Notas do apresentador:
- Destacar a arquitetura orientada a eventos
- Mencionar a normalização 3FN do banco
- Explicar benefícios do JWT para autenticação
- Falar sobre responsividade mobile-first
-->
