# CRM Pizzaria Frontend

Este diretório contém a aplicação React escrita em TypeScript utilizando Material-UI e Redux Toolkit.

## 🚀 Funcionalidades Implementadas

### Autenticação e Autorização
- Login/logout de usuários
- Controle de acesso baseado em roles (ADMIN, ASSISTENTE, CLIENTE)
- Proteção de rotas com PrivateRoute

### Dashboard
- Visão geral com métricas do sistema
- Cards informativos sobre clientes, produtos, pedidos e motoboys
- Indicadores de performance (taxa de aprovação, ticket médio, etc.)

### Gerenciamento de Clientes (ADMIN)
- Listagem de clientes
- Cadastro de novos clientes
- Edição de clientes existentes
- Exclusão de clientes

### Gerenciamento de Produtos (ADMIN/ASSISTENTE)
- Listagem de produtos do cardápio
- Cadastro de novos produtos
- Edição de produtos existentes
- Exclusão de produtos

### Gerenciamento de Pedidos (ADMIN/ASSISTENTE)
- Visualização de todos os pedidos
- Detalhamento dos itens de cada pedido
- Status de pedidos e pagamentos
- Accordion expansível para detalhes

### Gerenciamento de Motoboys (ADMIN/ASSISTENTE)
- Listagem de motoboys
- Cadastro de novos motoboys
- Edição de informações dos motoboys
- Exclusão de motoboys

### Programa de Fidelidade
- Ranking de clientes por pontos
- Visualização de pontos totais
- Estatísticas do programa de fidelidade

### Gerenciamento de Usuários (ADMIN)
- Criação de novos usuários do sistema
- Definição de roles (ADMIN, ASSISTENTE, CLIENTE)
- Interface para cadastro com validação

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/           # Atomic Design
│   ├── atoms/           # Componentes básicos (Button)
│   ├── molecules/       # Componentes compostos (SearchField)
│   └── organisms/       # Componentes complexos (Header)
├── features/            # Páginas/funcionalidades
│   ├── Dashboard/       # Dashboard principal
│   ├── Clientes/        # Gerenciamento de clientes
│   ├── Produtos/        # Gerenciamento de produtos
│   ├── Pedidos/         # Gerenciamento de pedidos
│   ├── Motoboys/        # Gerenciamento de motoboys
│   ├── Fidelidade/      # Programa de fidelidade
│   ├── Usuarios/        # Gerenciamento de usuários
│   ├── Home/            # Página inicial
│   └── Profile/         # Login/perfil
├── hooks/               # Custom hooks
├── layouts/             # Layouts da aplicação
├── routes/              # Configuração de rotas
├── services/            # Serviços de API
├── state/               # Gerenciamento de estado
├── theme/               # Tema Material-UI
├── types/               # TypeScript interfaces
└── utils/               # Utilitários
```

### Tecnologias Utilizadas
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes
- **Redux Toolkit** - Gerenciamento de estado
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool

### Padrões Implementados
- **Atomic Design** - Organização de componentes
- **Custom Hooks** - Lógica reutilizável
- **PrivateRoute** - Proteção de rotas
- **Redux Slices** - Estado modular
- **TypeScript Interfaces** - Tipagem de dados

## 🔐 Controle de Acesso

### Roles e Permissões

| Funcionalidade | ADMIN | ASSISTENTE | CLIENTE |
|---------------|-------|------------|---------|
| Dashboard     | ✅    | ✅         | ❌      |
| Clientes      | ✅    | ❌         | ❌      |
| Produtos      | ✅    | ✅         | ❌      |
| Pedidos       | ✅    | ✅         | ❌      |
| Motoboys      | ✅    | ✅         | ❌      |
| Fidelidade    | ✅    | ✅         | ❌      |
| Usuários      | ✅    | ❌         | ❌      |

## 🛠️ Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento via Vite
- `npm run build` - Gera a versão de produção
- `npm run lint` - Executa o ESLint
- `npm run preview` - Preview da build de produção

## ⚙️ Configuração

### Variáveis de Ambiente
A base da API pode ser configurada pela variável `VITE_API_BASE_URL`.
Por padrão ela usa `http://localhost:8080/v1`.

### Autenticação
O token JWT é armazenado no `sessionStorage` e automaticamente incluído nas requisições via interceptor do Axios.

## 🚀 Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse http://localhost:3000

### Credenciais Padrão
- **Usuário:** admin
- **Senha:** admin123
- **Role:** ADMIN

## 📱 Responsividade

A aplicação é totalmente responsiva, utilizando o sistema de grid do Material-UI e breakpoints adequados para diferentes tamanhos de tela.

## 🔄 Estado da Aplicação

O estado é gerenciado com Redux Toolkit, incluindo:
- **authSlice** - Autenticação e informações do usuário
- **sampleSlice** - Exemplo de contador

## 🌐 API Integration

Todas as funcionalidades estão integradas com o backend Spring Boot:
- Autenticação JWT
- CRUD completo para todas as entidades
- Tratamento de erros
- Loading states
- Validação de permissões
