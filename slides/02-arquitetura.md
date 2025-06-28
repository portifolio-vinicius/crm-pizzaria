---
marp: true
theme: ./theme.css
paginate: true
backgroundColor: '#34495e'
header: "CRM Pizzaria - Arquitetura"
footer: "FATEC - Engenharia de Software"
size: 16:9
---

<!-- _class: architecture -->

# Arquitetura de Software
## Design Patterns e Organização

<div class="architecture-box">
<strong>Padrões Modernos para Escalabilidade e Manutenibilidade</strong>
</div>

---

## Padrões Arquiteturais

<div class="pattern-grid">

<div class="pattern-box">
<strong>Clean Architecture</strong><br>
• Controllers → API REST<br>
• Services → Lógica negócio<br>
• Repositories → Dados<br>
• Entities → Domínio
</div>

<div class="pattern-box">
<strong>Feature-Based</strong><br>
• auth/ → Autenticação<br>
• cliente/ → Gestão clientes<br>
• pedido/ → Fluxo pedidos<br>
• fidelidade/ → Pontos
</div>

</div>

<div class="architecture-box">
<strong>Benefícios:</strong> Separação responsabilidades, testabilidade, escalabilidade
</div>

---

## Arquitetura Orientada a Eventos

### **Event-Driven Architecture com RabbitMQ**

<div class="architecture-box">

**Principais Eventos:**
- `pedido.criado` → Confirmação e log de pedido
- `pedido.entregue` → Acúmulo de pontos de fidelidade
- `pagamento.processado` → Atualização de status

</div>

### **Configuração RabbitMQ**
<div class="code-block">
@Configuration
public class RabbitMQConfig {
    // Exchange direto para pedidos
    @Bean
    public DirectExchange pedidoExchange() {
        return new DirectExchange("pedido.exchange");
    }
    
    // Filas específicas por evento
    @Bean
    public Queue pedidoCriadoQueue() {
        return QueueBuilder.durable("pedido.criado").build();
    }
    
    @Bean  
    public Queue pedidoEntregueQueue() {
        return QueueBuilder.durable("pedido.entregue").build();
    }
}
</div>

---

## Arquitetura de Segurança

### **JWT + Spring Security**

<div class="architecture-box">

**Fluxo de Autenticação:**
1. **Login** → Credenciais validadas
2. **Token JWT** → Gerado com role do usuário
3. **Requests** → Token validado via filtro
4. **Autorização** → Baseada em roles e permissões

</div>

### **Controle de Acesso por Roles**
<div class="code-block">
public class RolePermissions {
    public static class Cliente {
        public static final String CREATE = "hasRole('ADMIN')";
        public static final String LIST = "hasAnyRole('ADMIN','ASSISTENTE')";
        public static final String READ = "hasAnyRole('ADMIN','ASSISTENTE')";
    }
    
    public static class Pedido {
        public static final String CREATE = "hasAnyRole('ADMIN','ASSISTENTE','CLIENTE')";
        public static final String READ_OWN = "hasRole('CLIENTE')";
    }
}
</div>

---

## Arquitetura de Dados

### **JPA + Repository Pattern**

<div class="architecture-box">

**Camadas de Abstração:**
- **Entity** → Mapeamento JPA com banco
- **Repository** → Interface de acesso a dados  
- **Service** → Lógica de negócio e transações
- **Controller** → Endpoints REST

</div>

### **Exemplo: PedidoService**
<div class="code-block">
@Service
@Transactional
public class PedidoService {
    
    private final PedidoRepository repository;
    private final RabbitTemplate rabbitTemplate;
    
    public Pedido create(Long clienteId, List<PedidoItem> itens) {
        Pedido pedido = new Pedido();
        pedido.setCliente(clienteService.findById(clienteId));
        pedido.setItens(itens);
        pedido.setStatus(PedidoStatus.PENDENTE);
        
        Pedido saved = repository.save(pedido);
        
        // Dispara evento assíncrono
        rabbitTemplate.convertAndSend("pedido.exchange", 
                                     "pedido.criado", saved);
        return saved;
    }
}
</div>

---

## Arquitetura de Cache

### **Redis para Performance**

<div class="architecture-box">

**Estratégias de Cache:**
- **@Cacheable** → Cache de consultas frequentes
- **@CacheEvict** → Invalidação em updates
- **TTL Configurável** → Expiração automática

</div>

### **Implementação**
<div class="code-block">
@Service
public class ProdutoService {
    
    @Cacheable(value = "produtos", key = "#categoria")
    public List<Produto> findByCategoria(String categoria) {
        return repository.findByCategoriaOrderByNome(categoria);
    }
    
    @CacheEvict(value = "produtos", allEntries = true)
    public Produto save(Produto produto) {
        return repository.save(produto);
    }
}
</div>

---

## Arquitetura Frontend

### **SPA com React + TypeScript**

<div class="architecture-box">

**Organização Modular:**
- **Atomic Design** → Components organizados por complexidade
- **Feature-Based** → Módulos por funcionalidade
- **Type Safety** → TypeScript em todo código
- **State Management** → Context API + Custom Hooks

</div>

### **Estrutura de Componentes**
<div class="code-block">
src/
├── components/
│   ├── atoms/         → Button, Input, Card
│   ├── molecules/     → FormField, SearchField  
│   └── organisms/     → Header, DataTable
├── features/          → Dashboard, Pedidos, Clientes
├── hooks/             → useAuth, useFetch
├── services/          → apiClient, endpoints
└── types/             → TypeScript interfaces
</div>

---

## Padrões de Integração

### **API RESTful + OpenAPI**

<div class="architecture-box">

**Padronização:**
- **Versionamento** → `/v1/` em todas as rotas
- **Status Codes** → HTTP semânticos consistentes
- **Documentação** → Swagger UI automático
- **CORS** → Configuração para desenvolvimento

</div>

### **Exemplo de Controller**
<div class="code-block">
@RestController
@RequestMapping("/v1/pedidos")
public class PedidoController {
    
    @PreAuthorize(RolePermissions.Pedido.CREATE)
    @PostMapping
    public ResponseEntity<Pedido> create(@RequestBody CreatePedidoRequest request) {
        Pedido pedido = service.create(request.getClienteId(), 
                                      request.getItens());
        return ResponseEntity.ok(pedido);
    }
    
    @PreAuthorize(RolePermissions.Pedido.READ_OWN)  
    @GetMapping("/meus")
    public ResponseEntity<List<Pedido>> meusPedidos(Authentication auth) {
        // Lógica para buscar pedidos do cliente logado
    }
}
</div>

---

<!-- Notas do apresentador:
- Enfatizar separação de responsabilidades
- Destacar uso de eventos para desacoplamento
- Explicar benefícios do cache Redis
- Mencionar vantagens do padrão Repository
- Falar sobre escalabilidade da arquitetura
-->
