# 🚀 PRD-Prompt.ai

**Plataforma SaaS para geração de PRDs e prompts de desenvolvimento através de IA**

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.84.0-3ecf8e?logo=supabase)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológico](#-stack-tecnológico)
- [Início Rápido](#-início-rápido)
- [Arquitetura](#-arquitetura)
- [Documentação](#-documentação)
- [Status do Projeto](#-status-do-projeto)

---

## 🎯 Sobre o Projeto

**PRD-Prompt.ai** é uma ferramenta completa que utiliza **Google Gemini** para automatizar a criação de documentação técnica de produtos, incluindo:

- ✅ **PRDs completos** com análise de mercado
- ✅ **Análise de concorrentes** com insights estratégicos
- ✅ **Fluxogramas de UI/UX** em SVG
- ✅ **Schemas de banco de dados** (SQL + Prisma)
- ✅ **Identidade visual** (logo + paleta de cores)
- ✅ **Prompts otimizados** para desenvolvedores

**Ideal para:** Product Managers, Desenvolvedores, Startups, Agências Digitais

---

## ✨ Funcionalidades

### 🎨 Geração de PRD (Wizard de 6 Steps)
1. **Informações Básicas** - Título, descrição, indústria, público-alvo
2. **Concorrentes** - Análise automática de 3-5 competidores
3. **Fluxo UI/UX** - Flowchart interativo + especificação de telas
4. **Banco de Dados** - Schema completo + SQL + Prisma + Diagrama
5. **Logo & Branding** - IA multimodal gera sugestões visuais
6. **Revisão Final** - Edição inline antes de salvar

### 👥 AgentHub - 5+ Agentes Especializados
- **Product Manager** - Validação de ideias, roadmaps
- **Market Analyst** - Pesquisa de mercado, tendências
- **UX Designer** - Wireframes, fluxos de usuário
- **Database Architect** - Otimização de schemas
- **Brand Director** - Identidade visual, naming

### 📊 AdminDashboard - Painel Administrativo
- **Overview** - Métricas do sistema (6 cards + status)
- **Usuários** - Gestão com busca, filtros e roles
- **Atividades** - Logs de auditoria com severidade
- **Sistema** - Export, limpeza de cache, info técnica
- **Segurança** - Eventos de login, IP tracking, recomendações

### 📁 Gestão de Documentos
- Lista de PRDs e Prompts com busca e filtros
- Visualizador com 5 tabs (Overview, Market, UI, DB, Brand)
- Export em Markdown/JSON
- Compartilhamento via URL

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 19.2.0** - Framework UI
- **TypeScript 5.8.2** - Type safety
- **Vite 6.2.0** - Build tool ultra-rápido
- **Tailwind CSS** - Utility-first CSS (via Design System)

### **Backend & Database**
- **Supabase 2.84.0** - BaaS (Backend as a Service)
- **PostgreSQL 17** - Database relacional
- **Supabase Auth** - Autenticação JWT
- **Row Level Security (RLS)** - Isolamento de dados

### **Inteligência Artificial**
- **Google Gemini** (Principal)
  - `gemini-2.5-flash` - Geração de texto/JSON
  - `gemini-pro-vision` - Análise de imagens
- **Groq** (Fallback)
  - Llama 3.1, Mixtral, DeepSeek

### **Arquitetura**
- **Modular Component Architecture (MCA)** - Componentes isolados
- **Custom Hooks** - Lógica de negócio reutilizável
- **Service Layer** - Abstração de APIs
- **Design System** - 29+ componentes padronizados

---

## 🚀 Início Rápido

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Supabase CLI (opcional para dev local)

### **1. Instalação**
```bash
# Clone o repositório
git clone [repo-url]
cd prd-prompt

# Instale dependências
npm install
```

### **2. Configuração**
```bash
# Configure .env.local com suas credenciais
GEMINI_API_KEY=sua_chave_aqui
VITE_SUPABASE_URL=http://127.0.0.1:54421
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### **3. Supabase Local (Desenvolvimento)**
```bash
# Em um terminal separado
npx supabase start

# Acesse o Supabase Studio
# http://127.0.0.1:54423
```

### **4. Desenvolvimento**
```bash
# Inicia dev server (porta 4001)
npm run dev

# Acesse a aplicação
# http://localhost:4001
```

### **5. Build para Produção**
```bash
npm run build
npm run preview
```

---

## 🏗️ Arquitetura

### **Estrutura de Pastas**
```
prd-prompt/
├── components/           # 54 componentes React
│   ├── AdminDashboard/   # Painel admin modular (15 arquivos)
│   ├── GeneratePrd/      # Wizard PRD modular (13 arquivos)
│   ├── DocumentViewer/   # Visualizador modular (12 arquivos)
│   ├── MyDocuments/      # Gestão de docs (6 arquivos)
│   ├── Chat/             # Sistema de chat
│   ├── icons/            # 50+ ícones SVG
│   └── [Design System]   # Button, Badge, Alert, Modal, etc.
├── views/                # 12 views principais
├── services/             # 5 serviços (database, gemini, groq, router, supabase)
├── contexts/             # React Context (AppContext)
├── hooks/                # Custom hooks (useRouter, etc.)
├── supabase/             # Migrations e config
├── updates/              # Changelog de atualizações
└── docs/                 # Documentação completa
```

### **Database Schema (Supabase)**

#### **profiles**
```sql
id (UUID PK) → email, name, avatar_url, role (user|admin)
```

#### **prds**
```sql
id (UUID PK) → user_id (FK), title, content (JSONB), status, timestamps
```

#### **prompts**
```sql
id (UUID PK) → user_id (FK), prd_id (FK nullable), content, meta (JSONB)
```

**Security:** Row Level Security (RLS) ativo em todas as tabelas

---

## 📚 Documentação

### **Guias Principais**

| Documento | Descrição |
|-----------|-----------|
| [**PROJECT_SPEC.md**](PROJECT_SPEC.md) | 📘 Especificação técnica completa |
| [**CLAUDE.md**](CLAUDE.md) | 🤖 Guia para desenvolvimento com Claude Code |
| [**regra.md**](regra.md) | 📏 Regras de desenvolvimento (PT-BR) |
| [**DESIGN_SYSTEM.md**](DESIGN_SYSTEM.md) | 🎨 Design System e componentes |
| [**ADMIN_DASHBOARD_GUIDE.md**](ADMIN_DASHBOARD_GUIDE.md) | 👑 Guia do AdminDashboard |

### **Changelogs**

| Arquivo | Descrição |
|---------|-----------|
| [updates/updates.md](updates/updates.md) | Histórico completo de atualizações |
| [updates/admin-dashboard-refactor.md](updates/admin-dashboard-refactor.md) | Refatoração do AdminDashboard (v9.1) |

---

## 📊 Status do Projeto

### **Versão Atual:** v9.1
### **Status:** 🟢 Em Desenvolvimento Ativo

### ✅ **Implementado (100%)**
- [x] Autenticação com Supabase
- [x] Geração de PRD (6 steps)
- [x] Análise de concorrentes
- [x] Schema de banco de dados
- [x] Logo e branding
- [x] AgentHub (5+ agentes)
- [x] AdminDashboard completo
- [x] Design System (29+ componentes)
- [x] Supabase local + Cloud hybrid

### 🔄 **Em Progresso**
- [ ] Migração 100% para Supabase Cloud
- [ ] Testes automatizados (Jest)
- [ ] Gráficos de analytics

### 📋 **Planejado (Roadmap)**
- [ ] OAuth (Google, GitHub)
- [ ] Dark mode
- [ ] Export PDF
- [ ] API pública (REST + GraphQL)
- [ ] Webhooks

---

## 🎯 Métricas

| Métrica | Valor |
|---------|-------|
| **Linhas de código** | 10,100+ |
| **Componentes** | 54 |
| **Views** | 12 |
| **Services** | 5 |
| **Hooks customizados** | 8 |
| **Build time** | ~2.90s |
| **Bundle size (gzip)** | 213 KB |
| **TypeScript coverage** | 100% |

---

## 🤝 Contribuindo

### **Workflow de Desenvolvimento**

1. **Fork** o repositório
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. Siga as **regras em regra.md**
4. Use **componentes do Design System**
5. Adicione **types** para tudo (TypeScript strict)
6. **Commit** com mensagens descritivas (`feat:`, `fix:`, `refactor:`)
7. **Push** para sua branch
8. Abra um **Pull Request**

### **Padrões de Código**

- ✅ **TypeScript Strict** - Zero `any`, interfaces para tudo
- ✅ **Design System Only** - Nunca use Tailwind direto
- ✅ **Modularidade** - Arquivos < 300 linhas
- ✅ **Custom Hooks** - Extraia lógica de negócio
- ✅ **RLS First** - Sempre use Supabase RLS

---

## 🔒 Segurança

- ✅ **Row Level Security (RLS)** em todas as tabelas
- ✅ **JWT Tokens** com expiração (1 hora)
- ✅ **Senhas hasheadas** (bcrypt via Supabase)
- ✅ **HTTPS obrigatório** em produção
- ✅ **CORS configurado** corretamente
- ✅ **Input validation** em todos os formulários
- ✅ **Activity logs** para auditoria de admins

---

## 📞 Suporte

- **Documentação:** Ver pasta raiz e `/updates`
- **Issues:** Reportar problemas via GitHub Issues

---

## 📄 Licença

**Proprietary** - Todos os direitos reservados.

---

## 🙏 Agradecimentos

- **Google Gemini** - Inteligência Artificial
- **Supabase** - Backend as a Service
- **React Team** - Framework UI
- **Vite** - Build tool

---

## 🔗 Links Úteis

- [Documentação do React 19](https://react.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">

**Desenvolvido com ❤️ usando React, TypeScript e Supabase**

**[⬆ Voltar ao topo](#-prd-promptai)**

</div>
