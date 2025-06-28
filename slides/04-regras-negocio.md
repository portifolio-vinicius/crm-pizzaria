---
marp: true
theme: default
paginate: true
header: "⚖️ CRM Pizzaria - Regras de Negócio"
footer: "FATEC - Engenharia de Software"
size: 16:9
style: |
  :root {
    --color-primary: #e74c3c;
    --color-accent: #f39c12;
    --color-success: #27ae60;
    --color-info: #3498db;
  }
  section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 24px;
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
    color: #e74c3c;
    font-size: 1.3em;
    margin-bottom: 0.3em;
  }
  .business-rule {
    background: rgba(231, 76, 60, 0.15);
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #e74c3c;
    margin: 10px 0;
    font-size: 0.85em;
  }
  .flow-box {
    background: rgba(52, 152, 219, 0.15);
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #3498db;
    margin: 10px 0;
    font-size: 0.85em;
  }
  .validation {
    background: rgba(39, 174, 96, 0.15);
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #27ae60;
    margin: 10px 0;
    font-size: 0.8em;
  }
  .role-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin: 15px 0;
  }
  .role-box {
    background: rgba(255,255,255,0.1);
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    font-size: 0.8em;
  }
  table {
    font-size: 0.7em;
    width: 100%;
  }
---

# ⚖️ Regras de Negócio
## Validações e Controles

<div class="business-rule">
<strong>Lógica de Negócio Implementada com Precisão</strong>
</div>

---

## 🔐 Sistema de Roles

<div class="role-grid">

<div class="role-box">
<strong>🎯 ADMIN</strong><br>
Acesso total<br>
Todas operações
</div>

<div class="role-box">
<strong>👥 ASSISTENTE</strong><br>
Operações diárias<br>
Exceto usuários
</div>

<div class="role-box">
<strong>🛒 CLIENTE</strong><br>
Próprios dados<br>
Pedidos pessoais
</div>

</div>

| **Módulo** | **ADMIN** | **ASSISTENTE** | **CLIENTE** |
|------------|-----------|----------------|-------------|
| Clientes | ✅ Total | ❌ Negado | ❌ Negado |
| Produtos | ✅ Total | ✅ Total | ❌ Negado |
| Pedidos | ✅ Total | ✅ Visualizar | ✅ Próprios |
| Fidelidade | ✅ Config | ✅ Consulta | ✅ Próprios |

---

## 📝 Fluxo de Pedidos

<div class="flow-box">
<strong>Ciclo de Vida:</strong><br>
PENDENTE → CONFIRMADO → EM_PREPARO → ENTREGUE<br>
↓ (cancelamento disponível até entrega)
</div>

<div class="business-rule">
<strong>Regras de Transição:</strong><br>
• PENDENTE → CONFIRMADO: Pagamento aprovado<br>
• CONFIRMADO → EM_PREPARO: Início produção<br>
• EM_PREPARO → ENTREGUE: Conclusão<br>
• Qualquer → CANCELADO: Antes da entrega
</div>

<div class="validation">
<strong>Validação (RN001):</strong> Só entrega pedidos CONFIRMADOS ou EM_PREPARO
</div>

---

## 💳 Regras de Pagamento

### **Gateway de Pagamento Simulado**

<div class="business-rule">

**Estados de Pagamento:**
- `PENDENTE` → Aguardando processamento
- `APROVADO` → Pagamento confirmado
- `RECUSADO` → Pagamento negado
- `CANCELADO` → Cancelado pelo sistema

</div>

### **Lógica de Processamento**

<div class="validation">

```java
@Service
public class PaymentGateway {
    
    public PagamentoStatus process() {
        // RN002: Simulação de gateway real
        // 50% aprovado, 50% pendente para demonstração
        return Math.random() > 0.5 ? 
               PagamentoStatus.APROVADO : 
               PagamentoStatus.PENDENTE;
    }
}

@Service
public class PedidoService {
    
    public Pedido confirmarPagamento(Long pedidoId) {
        Pedido pedido = findById(pedidoId);
        
        // RN003: Só processa pagamento se pedido estiver pendente
        if (pedido.getStatus() != PedidoStatus.PENDENTE) {
            throw new IllegalStateException("Pedido não está pendente");
        }
        
        PagamentoStatus resultado = paymentGateway.process();
        
        if (resultado == PagamentoStatus.APROVADO) {
            pedido.setStatus(PedidoStatus.CONFIRMADO);
            pedido.setPagamentoStatus(PagamentoStatus.APROVADO);
        }
        
        return save(pedido);
    }
}
```

</div>

---

## 🎁 Sistema de Fidelidade

### **Regras de Acúmulo de Pontos**

<div class="business-rule">

**Configuração Flexível por Categoria:**
- **Configuração Geral** → Aplica-se a todas as categorias sem config específica
- **Configuração por Categoria** → Sobrescreve a configuração geral
- **Multiplicadores** → Diferentes pontuações por tipo de produto
- **Valores Mínimos** → Threshold para acúmulo de pontos

</div>

### **Algoritmo de Cálculo**

<div class="validation">

```java
public void accruePointsFromPedido(Pedido pedido) {
    // RN004: Só acumula pontos em pedidos entregues
    if (pedido.getStatus() != PedidoStatus.ENTREGUE) {
        return;
    }
    
    // Agrupa itens por categoria
    Map<Categoria, Double> valorPorCategoria = pedido.getItens().stream()
        .collect(groupingBy(
            item -> item.getProduto().getCategoria(),
            summingDouble(item -> item.getQuantidade() * item.getPrecoUnitario())
        ));
    
    // RN005: Calcula pontos por categoria
    valorPorCategoria.forEach((categoria, valor) -> {
        LoyaltyConfig config = configService.getBestConfigurationForCategoria(
            categoria != null ? categoria.getId() : null);
        
        Integer pontos = config.calcularPontos(valor);
        
        if (pontos > 0) {
            // Cria registro de pontos vinculado à configuração usada
            LoyaltyPoint lp = new LoyaltyPoint();
            lp.setCliente(pedido.getCliente());
            lp.setPedido(pedido);
            lp.setConfig(config);
            lp.setPontos(pontos);
            lp.setValorPedido(valor);
            repository.save(lp);
        }
    });
}
```

</div>

---

## 🏷️ Regras de Produtos e Categorias

### **Gestão de Catálogo**

<div class="business-rule">

**Produtos:**
- **Ativo/Inativo** → Controle de disponibilidade
- **Preço Obrigatório** → Valor sempre > 0
- **Categoria Obrigatória** → Todo produto tem categoria
- **Soft Delete** → Inativação em vez de exclusão

</div>

### **Validações de Negócio**

<div class="validation">

```java
@Service
public class ProdutoService {
    
    public Produto create(String nome, String descricao, 
                         Double preco, Long categoriaId) {
        
        // RN006: Preço deve ser positivo
        if (preco <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }
        
        // RN007: Categoria deve existir e estar ativa
        Categoria categoria = categoriaService.findById(categoriaId)
            .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada"));
        
        if (!categoria.getAtiva()) {
            throw new IllegalArgumentException("Categoria deve estar ativa");
        }
        
        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPreco(preco);
        produto.setCategoria(categoria);
        produto.setAtivo(true);
        
        return repository.save(produto);
    }
    
    public void deactivate(Long id) {
        // RN008: Soft delete - inativa em vez de excluir
        Produto produto = findById(id);
        produto.setAtivo(false);
        repository.save(produto);
        
        // Invalida cache
        cacheManager.getCache("produtos").evict(produto.getCategoria().getNome());
    }
}
```

</div>

---

## 👥 Regras de Clientes

### **Validações de Cadastro**

<div class="business-rule">

**Campos Obrigatórios:**
- **Nome** → Mínimo 2 caracteres
- **Email** → Formato válido e único no sistema
- **Telefone** → Opcional, formato brasileiro

**Unicidade:**
- Email único para evitar duplicatas
- Integração com sistema de usuários para autenticação

</div>

### **Auto-Criação via Registro**

<div class="validation">

```java
@Service  
public class AuthService {
    
    public Usuario registerCliente(RegisterRequest request) {
        // RN009: Email único no sistema
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException(
                "Usuário com email " + request.getUsername() + " já existe");
        }
        
        // Cria usuário
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername()); // email
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRole(UsuarioRole.CLIENTE);
        Usuario savedUser = usuarioRepository.save(usuario);
        
        // RN010: Auto-cria cliente associado
        Cliente cliente = new Cliente();
        cliente.setNome("Cliente"); // Nome padrão
        cliente.setEmail(request.getUsername());
        clienteService.save(cliente);
        
        return savedUser;
    }
}
```

</div>

---

## 🚛 Regras de Motoboys

### **Gestão de Entregadores**

<div class="business-rule">

**Controles:**
- **Ativo/Inativo** → Disponibilidade para entregas
- **Telefone Obrigatório** → Contato essencial
- **Placa do Veículo** → Identificação opcional
- **Soft Delete** → Histórico preservado

</div>

### **Futuras Integrações**

<div class="flow-box">

**Funcionalidades Planejadas:**
- Atribuição automática de pedidos a motoboys
- Rastreamento de entregas por GPS
- Histórico de performance por entregador
- Sistema de avaliação de motoboys

```java
// Estrutura preparada para expansão
@Entity
public class Motoboy extends BaseEntity {
    private String nome;
    private String telefone;
    private String placaVeiculo;
    private Boolean ativo;
    
    // TODO: Adicionar campos para tracking
    // private List<Pedido> pedidosEmAndamento;
    // private GeoLocation localizacaoAtual;
    // private Double avaliacaoMedia;
}
```

</div>

---

## 🔄 Eventos Assíncronos

### **Regras de Processamento de Eventos**

<div class="business-rule">

**Eventos Principais:**
- `pedido.criado` → Log de confirmação
- `pedido.entregue` → Acúmulo de pontos de fidelidade
- `cliente.cadastrado` → Boas-vindas (futuro)
- `pagamento.processado` → Atualização de status (futuro)

</div>

### **Event Listeners**

<div class="validation">

```java
@Component
public class PedidoEventListener {
    
    @RabbitListener(queues = "pedido.criado")
    public void handlePedidoCriado(Pedido pedido) {
        // RN011: Log de auditoria para pedidos criados
        logger.info("Pedido criado com ID: {} - Cliente: {} - Valor: {}", 
                   pedido.getId(), 
                   pedido.getCliente().getEmail(),
                   pedido.getValorTotal());
    }
    
    @RabbitListener(queues = "pedido.entregue")
    public void handlePedidoEntregue(Pedido pedido) {
        // RN012: Processa pontos de fidelidade apenas na entrega
        logger.info("Processando pontos de fidelidade para pedido: {}", 
                   pedido.getId());
        
        loyaltyPointService.accruePointsFromPedido(pedido);
        
        logger.info("Pontos de fidelidade processados com sucesso!");
    }
}
```

</div>

---

## 📊 Regras de Relatórios e Dashboard

### **Controle de Acesso a Dados**

<div class="business-rule">

**Visualizações por Role:**
- **ADMIN** → Todos os dados, todas as métricas
- **ASSISTENTE** → Dados operacionais, sem financeiro crítico
- **CLIENTE** → Apenas seus pedidos e pontos

**Métricas Principais:**
- Total de pedidos por período
- Faturamento por categoria
- Ranking de produtos mais vendidos
- Performance do programa de fidelidade

</div>

---

<!-- Notas do apresentador:
- Enfatizar sistema de roles granular
- Destacar eventos assíncronos para desacoplamento
- Explicar flexibilidade do sistema de fidelidade
- Mencionar validações de integridade
- Falar sobre preparação para futuras funcionalidades
-->
