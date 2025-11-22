# Sistema de Roteamento - PRD-Prompt.ai

Este documento explica como usar o sistema de roteamento baseado em slugs implementado no projeto.

## 🎯 Visão Geral

O projeto agora utiliza URLs amigáveis que refletem o estado da aplicação. Isso permite:

- ✅ Compartilhar links específicos
- ✅ Usar botões voltar/avançar do navegador
- ✅ Salvar páginas nos favoritos
- ✅ Deep linking direto para documentos

## 🗺️ Rotas Disponíveis

### Rotas Estáticas

| View | URL | Descrição |
|------|-----|-----------|
| `dashboard` | `/` | Página inicial |
| `generate-prd` | `/criar-prd` | Criar novo PRD |
| `generate-prompt` | `/criar-prompt` | Gerar prompt de desenvolvimento |
| `my-documents` | `/meus-documentos` | Lista de documentos salvos |
| `idea-catalog` | `/catalogo-ideias` | Catálogo de ideias pré-definidas |
| `ai-agents` | `/agentes-ia` | Hub de agentes especializados |
| `settings` | `/configuracoes` | Configurações do sistema |

### Rotas Dinâmicas

| Padrão | Exemplo | Descrição |
|--------|---------|-----------|
| `/documento/{id}` | `/documento/abc123` | Visualizar documento específico |
| `?action=edit` | `/criar-prd?action=edit` | Query params opcionais |

## 📝 Como Usar

### Em Componentes React

```typescript
import { useRouter } from '../hooks/useRouter';

const MyComponent = () => {
  const { currentView, params, navigate, back } = useRouter();

  // Navegação simples
  const goToPrd = () => {
    navigate('generate-prd');
  };

  // Navegação com parâmetros
  const viewDocument = (docId: string) => {
    navigate('document-viewer', { documentId: docId });
  };

  // Voltar página
  const goBack = () => {
    back();
  };

  // Acessar view atual
  console.log(currentView); // 'dashboard', 'generate-prd', etc.

  // Acessar parâmetros da URL
  if (params.documentId) {
    console.log(`Viewing document: ${params.documentId}`);
  }

  return (
    <div>
      <button onClick={goToPrd}>Criar PRD</button>
      <button onClick={goBack}>Voltar</button>
    </div>
  );
};
```

### API do useRouter Hook

```typescript
interface UseRouterReturn {
  // Estado atual
  currentView: View;           // View atual baseada na URL
  params: RouteParams;          // Parâmetros extraídos da URL

  // Navegação
  navigate: (view, params?) => void;   // Navega e adiciona ao histórico
  replace: (view, params?) => void;    // Substitui entrada do histórico
  back: () => void;                     // Volta uma página
  forward: () => void;                  // Avança uma página

  // Utilitários
  getUrl: (view, params?) => string;   // Gera URL para uma view
}
```

## 🔧 Sincronização de Estado com URL

Quando o estado da aplicação depende de parâmetros na URL, sincronize com `useEffect`:

```typescript
import { useRouter } from '../hooks/useRouter';
import { useEffect, useState } from 'react';

const DocumentViewer = () => {
  const { currentView, params, navigate } = useRouter();
  const [document, setDocument] = useState(null);

  // Sincronizar com URL
  useEffect(() => {
    if (currentView === 'document-viewer' && params.documentId) {
      // Buscar documento pelo ID
      const doc = findDocument(params.documentId);

      if (doc) {
        setDocument(doc);
      } else {
        // Se não encontrado, redireciona
        navigate('my-documents');
      }
    }
  }, [currentView, params.documentId, navigate]);

  return <div>{/* Renderizar documento */}</div>;
};
```

## ⚠️ Regras Importantes

### ✅ SEMPRE:

1. Use o hook `useRouter` para navegação
2. Sincronize estado com parâmetros da URL quando relevante
3. Use `navigate()` para adicionar entradas ao histórico
4. Use `replace()` quando quiser substituir a entrada atual

### ❌ NUNCA:

1. Manipule `window.location` diretamente
2. Use `window.history.pushState()` manualmente
3. Ignore parâmetros da URL em views dinâmicas
4. Esqueça de sincronizar estado crítico com a URL

## 🏗️ Adicionando Novas Rotas

Para adicionar uma nova rota ao sistema:

### 1. Atualizar `types.ts`

```typescript
export type View =
  | 'dashboard'
  | 'generate-prd'
  // ... views existentes
  | 'nova-view';  // ← Adicionar aqui
```

### 2. Atualizar `routerService.ts`

```typescript
export const ROUTES = {
  // ... rotas existentes
  'nova-view': '/novo-slug',
} as const;

const SLUG_TO_VIEW: Record<string, View> = {
  // ... mapeamentos existentes
  '/novo-slug': 'nova-view',
};
```

### 3. Atualizar `App.tsx`

```typescript
const renderView = () => {
  switch (currentView) {
    // ... cases existentes
    case 'nova-view':
      return <NovaView />;
    // ...
  }
};
```

### 4. Adicionar Link no Sidebar (opcional)

```typescript
<NavItem
  icon={<IconComponent />}
  label="Nova View"
  isActive={activeView === 'nova-view'}
  onClick={() => setActiveView('nova-view')}
/>
```

## 🧪 Testando

```bash
# Build do projeto
npm run build

# Servidor de desenvolvimento
npm run dev

# Navegue para http://localhost:3000
# Teste as diferentes URLs:
# - http://localhost:3000/
# - http://localhost:3000/criar-prd
# - http://localhost:3000/meus-documentos
# - Use os botões voltar/avançar do navegador
```

## 📚 Documentação Adicional

- **Regras técnicas detalhadas:** Ver `regra.md` - Seção 5.1
- **Arquitetura geral:** Ver `CLAUDE.md` - Services Layer
- **Changelog:** Ver `updates/updates.md`

## 🐛 Troubleshooting

**Problema:** URL não atualiza ao navegar

```typescript
// ✅ Correto
const { navigate } = useRouter();
navigate('generate-prd');

// ❌ Incorreto
window.location.href = '/criar-prd';
```

**Problema:** Botão voltar não funciona

Certifique-se de usar `navigate()` ao invés de `replace()` quando quiser adicionar ao histórico.

**Problema:** Documento não carrega ao acessar URL diretamente

Verifique se você tem um `useEffect` sincronizando `params.documentId` com o estado local.

---

**Última atualização:** 22/11/2025
**Versão:** 1.0.0
