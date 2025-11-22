# Plano de Implementação: Admin Dashboard (PRD-Prompt.ai)

## ⚠️ Regras Mandatórias para Implementação
1.  **Atualização Constante**: Este documento DEVE ser atualizado a cada tarefa concluída. Marque com [x] os itens finalizados.
2.  **Testes Obrigatórios**: Após cada implementação de código, execute testes manuais (navegação, console log, inspeção visual) antes de prosseguir.
3.  **Segurança**: Nenhuma lógica de admin deve quebrar o fluxo de usuários comuns. O isolamento deve ser garantido via verificação de `role`.

## 1. Visão Geral
Este documento guia a implementação de um painel administrativo para o sistema SaaS PRD-Prompt.ai. O objetivo é fornecer controle sobre usuários e métricas sem backend complexo, usando a arquitetura existente de `localStorage`.

## 2. Arquitetura

### 2.1 Nova Rota
- **Rota:** `/admin`
- **Slug:** `admin-dashboard`
- **Controle de Acesso:** Acessível apenas se `user.role === 'admin'`.

### 2.2 Estrutura de Dados
Alteração na interface `User` em `types.ts`:
```typescript
export interface User {
  // ... campos existentes
  role?: 'user' | 'admin'; // Novo campo opcional, padrão 'user'
}
```

## 3. Componentes do Dashboard

O painel terá 3 abas principais gerenciadas por estado local:

1.  **Visão Geral (Overview)**
    *   Cards com totais: Usuários, PRDs, Prompts.
    *   Uso de armazenamento (estimado em KB/MB).
2.  **Usuários (Users)**
    *   Tabela listando todos os usuários cadastrados.
    *   Ações: "Promover a Admin", "Rebaixar para User", "Excluir".
3.  **Sistema (System)**
    *   Status de conexão (Health Check).
    *   Visualizador de dados brutos (opcional).

## 4. Checklist de Execução

### Fase 1: Camada de Dados (Backend Simulado)
- [x] **1.1 Atualizar Tipagem (`types.ts`)**
    - Adicionar `role` à interface `User`.
- [x] **1.2 Atualizar `databaseService.ts`**
    - Atualizar `registerUser` para salvar `role: 'user'` por padrão.
    - Implementar `getAllUsers()`: Listar todos usuários (atualmente restrito).
    - Implementar `updateUserRole(userId, role)`: Permitir alteração de permissão.
    - Implementar `getStorageStats()`: Calcular uso do localStorage.

### Fase 2: Roteamento e Segurança
- [x] **2.1 Configurar Rotas (`routerService.ts`)**
    - Registrar chave `admin` e slug `/admin`.
- [x] **2.2 Proteção de Rota (`App.tsx`)**
    - Adicionar verificação `user?.role === 'admin'` no `renderView`.
    - Redirecionar acessos não autorizados.

### Fase 3: Interface de Usuário (UI)
- [x] **3.1 Menu Lateral (`Sidebar.tsx`)**
    - Adicionar ícone "Admin" visível apenas para admins.
- [x] **3.2 View do Dashboard (`views/AdminDashboard.tsx`)**
    - Implementar layout com abas.
    - Conectar com `databaseService` para exibir dados reais.

### Fase 4: Validação
- [x] **4.1 Testes Manuais**
    - Login como usuário comum (não deve ver admin).
    - Login como admin (deve ver menu e acessar rota).
    - Promoção de usuário via painel.

## 5. Como Testar (Seed Admin)
Para testar, abra o console do navegador e execute:
```javascript
// Substitua pelo seu email
await db.updateUserRole('seu-email@exemplo.com', 'admin');
window.location.reload();
```
(Você precisará expor `db` no window ou usar o inspector do React, ou simplesmente editar no Application Tab do DevTools > Local Storage > users).


