# 🎨 Design System - PRD-Prompt.ai

**Versão:** 1.0.0
**Última atualização:** 22 de Novembro de 2025

Este documento descreve o Design System completo do PRD-Prompt.ai, garantindo consistência visual e padrões de desenvolvimento em toda a aplicação.

---

## 📋 Índice

1. [Introdução](#introdução)
2. [Tokens de Design](#tokens-de-design)
3. [Componentes](#componentes)
4. [Regras de Uso](#regras-de-uso)
5. [Exemplos de Código](#exemplos-de-código)

---

## 🎯 Introdução

O Design System do PRD-Prompt.ai foi criado para:

- ✅ Garantir **consistência visual** em toda a aplicação
- ✅ Acelerar o **desenvolvimento** com componentes reutilizáveis
- ✅ Facilitar a **manutenção** e evolução do código
- ✅ Melhorar a **acessibilidade** e experiência do usuário

### Arquitetura

```
designSystem.ts          → Tokens centralizados (cores, espaçamento, etc.)
├── Tailwind Config      → Configuração do Tailwind com os tokens
└── Componentes          → Implementação visual dos padrões
```

---

## 🎨 Tokens de Design

Todos os tokens estão definidos em `designSystem.ts` e configurados no Tailwind (`index.html`).

### 1. Cores

#### Cores Primárias (Roxo)

```typescript
primary-50   → #F5F3FF  (fundos muito claros)
primary-100  → #EDE9FE  (fundos claros, badges)
primary-600  → #6D28D9  (padrão - botões, links)
primary-700  → #5B21B6  (hover states)
```

**Uso:**
- `bg-primary-600` → Botões principais
- `text-primary-600` → Links, ícones de destaque
- `bg-primary-100` → Fundos de badges, cards de destaque

#### Cores Secundárias (Cinza)

```typescript
secondary-50   → #F9FAFB  (fundos de página)
secondary-100  → #F3F4F6  (backgrounds secundários)
secondary-500  → #6B7280  (textos auxiliares)
secondary-800  → #1F2937  (títulos, textos principais)
secondary-900  → #111827  (headings, textos importantes)
```

**Uso:**
- `text-secondary-900` → Títulos principais
- `text-secondary-600` → Textos descritivos
- `bg-secondary-100` → Fundo da aplicação

#### Cores Semânticas

| Tipo | Uso | Classes |
|------|-----|---------|
| **Success** (Verde) | Feedback positivo, status de sucesso | `bg-success-50`, `text-success-700` |
| **Error** (Vermelho) | Erros, alertas críticos | `bg-error-50`, `text-error-700` |
| **Warning** (Amarelo) | Avisos, atenção necessária | `bg-warning-50`, `text-warning-700` |
| **Info** (Azul) | Informações, dicas | `bg-info-50`, `text-info-700` |

### 2. Espaçamento

```typescript
xs   → 8px   (0.5rem)
sm   → 12px  (0.75rem)
md   → 16px  (1rem)
lg   → 24px  (1.5rem)
xl   → 32px  (2rem)
2xl  → 40px  (2.5rem)
3xl  → 48px  (3rem)
```

**Uso no Tailwind:**
```jsx
<div className="p-4">      {/* padding: 16px */}
<div className="space-y-6"> {/* gap vertical: 24px */}
```

### 3. Tipografia

```typescript
text-xs   → 12px
text-sm   → 14px
text-base → 16px  (padrão para corpo de texto)
text-lg   → 18px
text-xl   → 20px
text-2xl  → 24px
text-3xl  → 30px
```

**Pesos de Fonte:**
- `font-normal` → 400 (corpo de texto)
- `font-medium` → 500 (labels)
- `font-semibold` → 600 (subtítulos)
- `font-bold` → 700 (títulos)

### 4. Border Radius

```typescript
rounded-sm   → 6px   (inputs pequenos)
rounded-md   → 8px   (padrão - badges, inputs)
rounded-lg   → 12px  (cards, botões)
rounded-xl   → 16px  (modais, containers grandes)
rounded-2xl  → 24px  (cards especiais)
rounded-full → 100%  (avatares, badges redondos)
```

### 5. Sombras

```typescript
shadow-sm  → Sutil (cards em estado normal)
shadow-md  → Média (cards hover, dropdowns)
shadow-lg  → Grande (modais, overlays)
shadow-xl  → Extra grande (elementos flutuantes)
```

---

## 🧩 Componentes

### Button

Botão padrão com 4 variantes e 3 tamanhos.

**Props:**
```typescript
variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
size?: 'sm' | 'md' | 'lg'
isLoading?: boolean
```

**Exemplo:**
```jsx
import { Button } from '../components/Button';

<Button variant="primary" size="md">Salvar</Button>
<Button variant="danger" isLoading>Deletar</Button>
<Button variant="ghost" size="sm">Cancelar</Button>
```

**Variantes:**
- `primary` → Ação principal (roxo)
- `secondary` → Ação secundária (cinza)
- `danger` → Ação destrutiva (vermelho)
- `ghost` → Ação terciária (transparente)

---

### Badge

Componente para tags, labels e status.

**Props:**
```typescript
variant?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'gray'
size?: 'sm' | 'md' | 'lg'
rounded?: 'md' | 'lg' | 'full'
```

**Exemplo:**
```jsx
import { Badge } from '../components/Badge';

<Badge variant="success" rounded="full">Novo</Badge>
<Badge variant="gray">3 PRDs</Badge>
<Badge variant="error">Erro</Badge>
```

---

### Alert

Componente para mensagens de feedback ao usuário.

**Props:**
```typescript
variant?: 'success' | 'error' | 'warning' | 'info'
title?: string
onClose?: () => void
```

**Exemplo:**
```jsx
import { Alert } from '../components/Alert';

<Alert variant="error" onClose={() => setError('')}>
  Ocorreu um erro ao salvar o documento.
</Alert>

<Alert variant="success" title="Sucesso!">
  Documento salvo com sucesso.
</Alert>
```

---

### Avatar

Componente de avatar com fallback para iniciais.

**Props:**
```typescript
name: string          // Nome completo (obrigatório)
src?: string          // URL da imagem (opcional)
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
```

**Exemplo:**
```jsx
import { Avatar } from '../components/Avatar';

<Avatar name="João Silva" size="md" />
<Avatar name="Maria Santos" src="/avatar.jpg" size="lg" />
```

**Recursos:**
- Gera iniciais automaticamente (ex: "João Silva" → "JS")
- Cor de fundo consistente baseada no nome
- Suporte a imagens

---

### IconButton

Botão apenas com ícone (sem texto).

**Props:**
```typescript
icon: React.ReactNode
ariaLabel: string     // Obrigatório para acessibilidade
variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
size?: 'sm' | 'md' | 'lg'
```

**Exemplo:**
```jsx
import { IconButton } from '../components/IconButton';
import { TrashIcon } from '../components/icons/Icons';

<IconButton
  icon={<TrashIcon />}
  ariaLabel="Deletar documento"
  variant="danger"
  size="sm"
/>
```

---

### Skeleton

Componente de loading state.

**Props:**
```typescript
variant?: 'text' | 'circular' | 'rectangular'
width?: string
height?: string
animation?: 'pulse' | 'wave' | 'none'
```

**Exemplo:**
```jsx
import { Skeleton, SkeletonCard, SkeletonAvatar } from '../components/Skeleton';

{/* Loading individual */}
<Skeleton variant="text" width="60%" />
<Skeleton variant="rectangular" height="200px" />

{/* Loading de avatar */}
<SkeletonAvatar size="md" />

{/* Loading de card completo */}
<SkeletonCard />
```

---

### Input

Campo de entrada de texto com suporte a tooltip.

**Props:**
```typescript
label?: string
isMagicFilling?: boolean  // Animação de preenchimento automático
tooltipText?: string
```

**Exemplo:**
```jsx
import { Input } from '../components/Input';

<Input
  id="email"
  label="E-mail"
  type="email"
  placeholder="seu@email.com"
  tooltipText="Digite um e-mail válido"
/>
```

---

### Select

Campo de seleção com suporte a tooltip.

**Props:**
```typescript
label: string
tooltipText?: string
```

**Exemplo:**
```jsx
import { Select } from '../components/Select';

<Select
  id="model"
  label="Modelo de IA"
  tooltipText="Escolha o modelo de IA para geração"
>
  <option value="gemini">Google Gemini</option>
  <option value="groq">Groq</option>
</Select>
```

---

### Textarea

Campo de texto multilinha com contador de caracteres.

**Props:**
```typescript
label?: string
isMagicFilling?: boolean
maxLength?: number
showCounter?: boolean
tooltipText?: string
```

**Exemplo:**
```jsx
import { Textarea } from '../components/Textarea';

<Textarea
  id="description"
  label="Descrição do Projeto"
  maxLength={500}
  showCounter
  tooltipText="Descreva seu projeto em até 500 caracteres"
/>
```

---

### Card

Container reutilizável para conteúdo.

**Props:**
```typescript
title?: string
headerAction?: React.ReactNode
onClick?: () => void
```

**Exemplo:**
```jsx
import { Card } from '../components/Card';

<Card title="Meus Documentos" headerAction={<Button>Ver Todos</Button>}>
  <p>Conteúdo do card...</p>
</Card>
```

---

### Modal

Componente de modal/dialog.

**Props:**
```typescript
isOpen: boolean
onClose: () => void
title?: string
maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
```

**Exemplo:**
```jsx
import { Modal } from '../components/Modal';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Confirmar Exclusão"
  maxWidth="md"
>
  <p>Tem certeza que deseja excluir este documento?</p>
</Modal>
```

---

### EmptyState

Componente para estados vazios com layout consistente.

**Props:**
```typescript
icon?: React.ReactNode
title: string
description: string
action?: {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
}
size?: 'sm' | 'md' | 'lg'
className?: string
```

**Exemplo:**
```jsx
import { EmptyState } from '../components/EmptyState';
import { DocumentIcon } from '../components/icons/Icons';

<EmptyState
  icon={<DocumentIcon className="w-8 h-8" />}
  title="Nenhum documento encontrado"
  description="Comece criando seu primeiro PRD para transformar suas ideias em produtos."
  action={{
    label: 'Criar PRD',
    onClick: () => navigate('generate-prd'),
    variant: 'primary'
  }}
  size="md"
/>
```

**Recursos:**
- 3 tamanhos (sm, md, lg) com espaçamento proporcional
- Ícone opcional com fundo colorido
- Botão de ação opcional
- Customização via className

---

### Divider

Componente para separação visual entre seções.

**Props:**
```typescript
orientation?: 'horizontal' | 'vertical'
variant?: 'solid' | 'dashed' | 'dotted'
thickness?: 'thin' | 'medium' | 'thick'
label?: string
className?: string
```

**Exemplo:**
```jsx
import { Divider } from '../components/Divider';

{/* Divisor horizontal simples */}
<Divider />

{/* Divisor com label */}
<Divider label="ou" />

{/* Divisor vertical */}
<Divider orientation="vertical" className="h-32" />

{/* Divisor tracejado */}
<Divider variant="dashed" thickness="medium" />
```

**Recursos:**
- Suporte para orientação horizontal e vertical
- 3 variantes de estilo (solid, dashed, dotted)
- 3 espessuras (thin, medium, thick)
- Label opcional no centro (apenas horizontal)
- Usa cores do design system (secondary-200)

---

## ⚠️ Regras de Uso

### ✅ SEMPRE FAZER

1. **Use componentes ao invés de Tailwind direto:**
   ```jsx
   ✅ CORRETO
   <Button variant="primary">Salvar</Button>

   ❌ ERRADO
   <button className="bg-purple-600 text-white px-4 py-2 rounded">Salvar</button>
   ```

2. **Use cores do Design System:**
   ```jsx
   ✅ CORRETO
   <div className="bg-primary-100 text-primary-700">

   ❌ ERRADO
   <div className="bg-purple-100 text-purple-700">
   ```

3. **Use tokens semânticos:**
   ```jsx
   ✅ CORRETO
   <Alert variant="error">Erro ao salvar</Alert>

   ❌ ERRADO
   <div className="bg-red-50 text-red-700">Erro ao salvar</div>
   ```

4. **Prefira componentes para estados de UI:**
   ```jsx
   ✅ CORRETO
   <Badge variant="success">Novo</Badge>

   ❌ ERRADO
   <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Novo</span>
   ```

### ❌ NUNCA FAZER

1. ❌ Usar cores Tailwind diretas (`bg-red-600`, `text-blue-500`)
2. ❌ Criar estilos inline customizados sem usar tokens
3. ❌ Duplicar código de componentes em views
4. ❌ Usar valores arbitrários (`w-[342px]`, `text-[#FF5733]`)

---

## 📚 Exemplos de Código

### Exemplo 1: Formulário de Login

```jsx
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';

function LoginForm() {
  const [error, setError] = useState('');

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Input
        id="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
      />

      <Input
        id="password"
        label="Senha"
        type="password"
        placeholder="******"
      />

      <Button variant="primary" size="lg" className="w-full">
        Entrar
      </Button>
    </div>
  );
}
```

### Exemplo 2: Card de Documento

```jsx
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { IconButton } from '../components/IconButton';
import { TrashIcon } from '../components/icons/Icons';

function DocumentCard({ document, onDelete }) {
  return (
    <Card
      title={document.title}
      headerAction={
        <IconButton
          icon={<TrashIcon />}
          ariaLabel="Deletar documento"
          variant="ghost"
          onClick={onDelete}
        />
      }
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar name={document.author} size="sm" />
        <div>
          <p className="text-sm font-semibold text-secondary-800">
            {document.author}
          </p>
          <p className="text-xs text-secondary-500">
            {document.date}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Badge variant="primary">{document.category}</Badge>
        <Badge variant="gray">{document.status}</Badge>
      </div>
    </Card>
  );
}
```

### Exemplo 3: Estado de Loading

```jsx
import { SkeletonCard } from '../components/Skeleton';

function DocumentsList({ isLoading, documents }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {documents.map(doc => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
}
```

---

## 🔄 Changelog

### v1.1.0 (22 de Novembro de 2025)

**Componentes adicionais e melhorias de UX:**
- ✅ Criado componente `EmptyState` para estados vazios consistentes
- ✅ Criado componente `Divider` para separação visual
- ✅ Aplicado EmptyState em MyDocuments.tsx (PRDs e Prompts)
- ✅ Aplicado EmptyState em AgentHub.tsx (busca sem resultados)
- ✅ Atualizada documentação com novos componentes

### v1.0.0 (22 de Novembro de 2025)

**Criação inicial do Design System:**
- ✅ Criado arquivo `designSystem.ts` com todos os tokens
- ✅ Configurado Tailwind com cores semânticas
- ✅ Criados 7 novos componentes (Badge, Alert, Avatar, IconButton, Skeleton, etc.)
- ✅ Refatorados componentes existentes (Button, Input, Select, Textarea)
- ✅ Refatoradas views (Auth, Dashboard) para usar o novo sistema
- ✅ Documentação completa criada

---

## 📞 Suporte

Para dúvidas ou sugestões sobre o Design System:

1. Consulte `designSystem.ts` para ver todos os tokens disponíveis
2. Consulte `CLAUDE.md` para regras de desenvolvimento
3. Consulte `regra.md` para padrões arquiteturais

---

**Última atualização:** 22 de Novembro de 2025
**Autor:** PRD-Prompt.ai Team
