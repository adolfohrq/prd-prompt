# 📖 Guia do AdminDashboard - PRD-Prompt.ai

## 🎯 Visão Geral

O **AdminDashboard** é o painel de controle administrativo completo da plataforma PRD-Prompt.ai. Construído com arquitetura modular, oferece gestão de usuários, monitoramento de atividades, ferramentas de sistema e auditoria de segurança.

---

## 🗂️ Estrutura de Tabs

### 1️⃣ Visão Geral (Overview)
**O que faz:** Dashboard principal com métricas do sistema

**Métricas exibidas:**
- 📊 Total de Usuários
- ✅ Usuários Ativos
- 📄 PRDs Gerados
- ✨ Prompts Criados
- 📁 Total de Documentos
- 💾 Armazenamento Usado

**Painéis adicionais:**
- **Atividade Recente:** Médias de documentos por usuário
- **Status do Sistema:** Status operacional de BD, Storage e API

**Quando usar:** Para ter uma visão rápida da saúde do sistema

---

### 2️⃣ Usuários (Users)
**O que faz:** Gestão completa de usuários da plataforma

**Funcionalidades:**
- 🔍 **Busca** - Pesquisa por nome ou email
- 🎯 **Filtro** - Filtrar por role (Admin/Usuário)
- 📊 **Ordenação** - Por nome, email ou função
- ⬆️ **Promover** - Transformar usuário em Admin
- ⬇️ **Rebaixar** - Remover privilégios de Admin

**Como usar:**
1. Digite no campo de busca para filtrar
2. Use os dropdowns para filtrar por role ou ordenar
3. Clique em "Promover" ou "Rebaixar"
4. Confirme no modal que aparece

**Quando usar:** Para gerenciar permissões e encontrar usuários específicos

---

### 3️⃣ Atividades (Activity)
**O que faz:** Log completo de todas as ações realizadas no sistema

**Tipos de atividade:**
- 🔵 **INFO** - Ações normais (promover usuário, exportar dados)
- 🟡 **WARNING** - Ações sensíveis (deletar usuário, resetar senha)
- 🔴 **ERROR** - Erros e ações críticas (limpar banco)

**Funcionalidades:**
- Filtro por severidade (All, Info, Warning, Error)
- Limite de registros (25, 50, 100, 500)
- Timestamps relativos ("5min atrás", "2h atrás")
- Stats cards com contadores

**Quando usar:** Para auditar ações de admins ou investigar problemas

---

### 4️⃣ Sistema (System)
**O que faz:** Manutenção, backup e informações técnicas

**Operações disponíveis:**

#### 🗑️ Limpar Banco de Dados
- **O que faz:** Apaga TODOS os PRDs, Prompts, Chats e Configurações
- **O que NÃO apaga:** Contas de usuário
- **Segurança:** Requer digitar "CONFIRMAR" em caixa alta
- **Quando usar:** Reset completo do sistema (cuidado!)

#### 📥 Exportar Dados
- **O que faz:** Cria backup completo em JSON ou CSV
- **O que exporta:** Usuários, PRDs, Prompts, Settings, Chats, Logs
- **Download:** Automático no navegador
- **Quando usar:** Antes de limpar o banco ou para migração

#### 🔄 Limpar Cache
- **O que faz:** Remove dados temporários de sessão
- **Seguro:** Não afeta dados principais
- **Quando usar:** Para resolver problemas de performance

#### 📊 Informações Técnicas
- Versão da aplicação
- Engine de armazenamento
- User Agent do navegador
- Timestamp atual
- Resolução de tela

---

### 5️⃣ Segurança (Security)
**O que faz:** Monitoramento de segurança e auditoria

**Cards de Métricas:**
- 🛡️ **Status de Segurança** - Status geral (Protegido/Em risco)
- 🔐 **Sessões Ativas** - Usuários conectados agora
- ⚠️ **Logins Falhados** - Tentativas de acesso negadas (24h)

**Eventos de Segurança:**
- Login bem-sucedido
- Logout
- Login falhado
- Mudança de role (promover/rebaixar)
- Acesso a dados sensíveis

**Recomendações:**
- ✅ Ativo - Implementado
- ⭕ Pendente - A implementar

**Quando usar:** Para detectar acessos suspeitos ou auditar mudanças de permissão

---

## 🎨 Componentes Reutilizáveis

### StatCard
Usado na tab Overview para exibir métricas

```tsx
<StatCard
  label="Total de Usuários"
  value={42}
  icon={<UserIcon />}
  color="bg-blue-50"
/>
```

### ActivityLogItem
Usado na tab Activity para exibir cada log

```tsx
<ActivityLogItem log={activityLog} />
```

---

## 🔧 Hooks Customizados

### useAdminData
Carrega todos os dados necessários para o dashboard

```tsx
const { loading, users, stats, activityLogs, refresh } = useAdminData();
```

**Retorna:**
- `loading` - Estado de carregamento
- `users` - Lista de usuários
- `stats` - Métricas do sistema
- `activityLogs` - Logs de atividade
- `refresh` - Função para recarregar dados

### useUserManagement
Gerencia operações de usuários

```tsx
const { actionLoading, updateUserRole } = useUserManagement(onSuccess);
```

**Funções:**
- `updateUserRole(userId, 'admin' | 'user')` - Promover/rebaixar
- `deleteUser(userId, userName)` - Deletar usuário
- `resetUserPassword(userId, userName)` - Reset de senha

### useSystemOps
Operações de sistema

```tsx
const { loading, clearDatabase, exportData, clearCache } = useSystemOps(onSuccess);
```

**Funções:**
- `clearDatabase()` - Limpa banco de dados
- `exportData('json' | 'csv')` - Exporta backup
- `clearCache()` - Limpa cache temporário

---

## 📊 DatabaseService - Novas Funções

### Activity Logs
```typescript
// Buscar logs
await db.getActivityLogs();

// Registrar nova atividade
await db.logActivity({
  action: 'promoveu usuário a Admin',
  target: 'user-id-123',
  severity: 'info',
  details: 'Detalhes opcionais'
});
```

### Export / Import
```typescript
// Exportar todos os dados
const backup = await db.exportAllData();
// Retorna: { users, prds, prompts, settings, logs, exportDate, version }
```

### User Management
```typescript
// Deletar usuário e seus dados
await db.deleteUser('user-id-123');

// Reset de senha (gera temp123456)
await db.resetUserPassword('user-id-123');
```

---

## 🎯 Casos de Uso Comuns

### Promover um usuário a Admin
1. Ir para tab **Usuários**
2. Buscar ou filtrar o usuário
3. Clicar em "Promover"
4. Confirmar no modal
5. ✅ Ação registrada nos logs

### Investigar atividade suspeita
1. Ir para tab **Atividades**
2. Filtrar por "Error" ou "Warning"
3. Procurar por logins falhados ou mudanças não autorizadas
4. Verificar timestamps e usuários envolvidos

### Fazer backup antes de manutenção
1. Ir para tab **Sistema**
2. Clicar em "Exportar JSON"
3. Aguardar download automático
4. Guardar arquivo em local seguro
5. Prosseguir com manutenção

### Reset completo do sistema
1. Ir para tab **Sistema**
2. ⚠️ **IMPORTANTE:** Exportar dados primeiro!
3. Clicar em "Confirmar Limpeza"
4. Ler aviso atentamente
5. Digitar "CONFIRMAR" (caixa alta)
6. Confirmar ação
7. Sistema limpo (usuários mantidos)

---

## 🔐 Segurança

### Controle de Acesso
- ✅ Apenas usuários com `role: 'admin'` podem acessar
- ✅ Verificação em App.tsx redireciona não-admins
- ✅ Todas as operações requerem confirmação

### Auditoria
- ✅ Todas as ações são logadas automaticamente
- ✅ Logs incluem userId, userName, timestamp
- ✅ Severidade por tipo de ação (info, warning, error)
- ✅ Logs mantidos (últimos 500 registros)

### Confirmações
- ✅ Modal de confirmação para promover/rebaixar
- ✅ Confirmação dupla para limpar banco (digitar texto)
- ✅ Alerts de aviso antes de ações destrutivas

---

## 🎨 Design System

### Cores Utilizadas
- **Primary** (Violeta) - Ações principais, tabs ativas
- **Success** (Verde) - Métricas positivas, status OK
- **Error** (Vermelho) - Ações destrutivas, alertas críticos
- **Warning** (Laranja) - Avisos, ações sensíveis
- **Info** (Azul) - Informações, status neutros
- **Secondary** (Cinza) - Texto, bordas, backgrounds

### Componentes do Design System
- `Button` - Botões com 4 variantes
- `Badge` - Tags coloridas por severidade
- `Alert` - Avisos e notificações
- `Modal` - Diálogos de confirmação
- `Input` - Campos de busca
- `Card` - Containers de conteúdo
- `Skeleton` - Loading states

---

## 📱 Responsividade

### Mobile (< 768px)
- Navigation em scroll horizontal
- Cards empilhados (1 coluna)
- Tabela com scroll horizontal
- Filtros verticais

### Tablet (768px - 1024px)
- Grid 2 colunas para stats
- Navigation compacto
- Sidebar opcional

### Desktop (> 1024px)
- Grid 3 colunas para stats
- Navigation espaçado
- Sidebar sempre visível
- Hover states completos

---

## 🚀 Performance

### Otimizações
- ✅ Memoização de filtros com `useMemo`
- ✅ Loading states granulares (por ação)
- ✅ Skeleton screens durante carregamento
- ✅ Lazy evaluation de logs (paginação)
- ✅ Build size: 849KB (gzip: 213KB)

### Best Practices
- ✅ Evita re-renders desnecessários
- ✅ Hooks customizados para lógica pesada
- ✅ Estado centralizado no orchestrator
- ✅ Props drilling controlado

---

## 🐛 Troubleshooting

### Problema: Tab não carrega
**Solução:** Verificar se usuário tem `role: 'admin'` em localStorage

### Problema: Logs não aparecem
**Solução:** Criar alguma ação (promover/rebaixar) para gerar logs

### Problema: Export não funciona
**Solução:** Verificar permissões do navegador para downloads

### Problema: Build falha
**Solução:** Verificar se todos os imports estão corretos

---

## 📚 Referências

- [Design System](./DESIGN_SYSTEM.md)
- [Changelog da Refatoração](./updates/admin-dashboard-refactor.md)
- [Arquitetura Modular](./CLAUDE.md)
- [Regras de Desenvolvimento](./regra.md)

---

## ✅ Checklist de Testes

- [ ] Todas as tabs renderizam corretamente
- [ ] Busca de usuários funciona
- [ ] Filtros aplicam corretamente
- [ ] Promover/Rebaixar funciona com modal
- [ ] Logs são registrados automaticamente
- [ ] Export gera arquivo de backup
- [ ] Limpar cache funciona
- [ ] Confirmação de limpeza de banco requer texto
- [ ] Loading states aparecem durante ações
- [ ] Empty states aparecem quando não há dados
- [ ] Responsividade funciona em mobile/tablet/desktop
- [ ] Build passa sem erros

---

**Última atualização:** 22/11/2025
**Versão:** 9.1
**Desenvolvido por:** Claude Code
