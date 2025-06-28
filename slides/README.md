# 📊 Slides CRM Pizzaria

Este diretório contém a apresentação completa do projeto CRM Pizzaria em formato Marp (Markdown Presentation).

## 📁 Estrutura dos Slides

### **1. Apresentação Geral** (`01-apresentacao.md`)
- Objetivos do sistema
- Stack tecnológica
- Principais funcionalidades
- Fluxo principal do sistema

### **2. Arquitetura de Software** (`02-arquitetura.md`)
- Padrões arquiteturais aplicados
- Organização por features
- Arquitetura orientada a eventos
- Segurança e cache

### **3. Modelagem de Banco** (`03-modelagem-banco.md`)
- Diagrama ER completo
- Entidades e relacionamentos
- Normalização 3FN implementada
- Migrações Flyway

### **4. Regras de Negócio** (`04-regras-negocio.md`)
- Controle de acesso por roles
- Fluxo de pedidos
- Sistema de fidelidade
- Validações e eventos

### **5. Conclusão** (`05-conclusao.md`)
- Objetivos alcançados
- Métricas de qualidade
- Próximos passos
- Lições aprendidas

## 🛠️ Como Visualizar os Slides

### **Opção 1: Extensão Marp for VS Code (Recomendado)**

1. **Instalar a extensão:**
   - Abra o VS Code
   - Vá em Extensions (Ctrl+Shift+X)
   - Procure por "Marp for VS Code"
   - Instale a extensão oficial

2. **Visualizar slides:**
   - Abra qualquer arquivo `.md` dos slides
   - Pressione `Ctrl+Shift+V` para preview
   - Ou use `Ctrl+Shift+P` → "Marp: Open preview"

3. **Exportar (opcional):**
   - `Ctrl+Shift+P` → "Marp: Export slide deck"
   - Escolha o formato: PDF, PPTX, HTML

### **Opção 2: Marp CLI**

1. **Instalar Marp CLI:**
   ```bash
   npm install -g @marp-team/marp-cli
   ```

2. **Gerar apresentação completa:**
   ```bash
   # Navegar para a pasta slides
   cd slides
   
   # Gerar HTML
   marp *.md -o apresentacao-crm-pizzaria.html
   
   # Gerar PDF
   marp *.md -o apresentacao-crm-pizzaria.pdf
   
   # Gerar PPTX
   marp *.md -o apresentacao-crm-pizzaria.pptx
   ```

3. **Servidor local para apresentação:**
   ```bash
   marp --server .
   ```

### **Opção 3: Visualização Online**

1. **GitHub Pages ou Netlify:**
   - Faça push dos arquivos para um repositório Git
   - Configure GitHub Pages ou deploy no Netlify
   - Acesse via browser

## 🎨 Personalização

### **Temas e Estilos**

Os slides utilizam tema customizado com:
- **Cores:** Gradientes azul/roxo para fundo
- **Destaque:** Laranja para títulos principais
- **Boxes:** Backgrounds coloridos para organizar conteúdo
- **Tipografia:** Fontes web padrão otimizadas

### **Customizar Cores**

Para personalizar as cores, edite as variáveis CSS no cabeçalho de cada slide:

```yaml
style: |
  :root {
    --color-primary: #e74c3c;    # Cor principal
    --color-accent: #f39c12;     # Cor de destaque
    --color-success: #27ae60;    # Cor de sucesso
  }
```

## 📋 Checklist de Apresentação

### **Antes da Apresentação:**
- [ ] Testar slides no ambiente de apresentação
- [ ] Verificar funcionamento do sistema (backend + frontend)
- [ ] Preparar dados de demonstração
- [ ] Revisar notas de apresentador

### **Durante a Apresentação:**
- [ ] Mostrar arquitetura em código real
- [ ] Demonstrar funcionalidades práticas
- [ ] Explicar decisões técnicas
- [ ] Destacar pontos de qualidade

### **Recursos de Apoio:**
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **Frontend:** http://localhost:5173
- **RabbitMQ:** http://localhost:15672
- **Código fonte:** Navegação no VS Code

## 💡 Dicas de Apresentação

### **Para Professores:**
- Enfatizar aplicação prática dos conceitos teóricos
- Destacar uso de padrões de projeto e arquitetura
- Mostrar evolução das migrações de banco
- Explicar benefícios da normalização 3FN

### **Para Desenvolvedores:**
- Demonstrar código real funcionando
- Explicar choices técnicos e trade-offs
- Mostrar testes automatizados
- Discutir escalabilidade e manutenibilidade

### **Para Stakeholders:**
- Focar em valor de negócio entregue
- Demonstrar funcionalidades do usuário final
- Mostrar métricas e indicadores
- Explicar ROI e benefícios práticos

## 🚀 Execução Rápida

Para uma demonstração completa:

```bash
# 1. Iniciar o sistema
./start-dev.sh

# 2. Aguardar inicialização (30s)
# 3. Abrir slides no VS Code
code slides/

# 4. Apresentar navegando pelos arquivos .md
# 5. Demonstrar sistema funcionando nos browsers
```

---

**Developed with ❤️ for FATEC - Software Engineering**
