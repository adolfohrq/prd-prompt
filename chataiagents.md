
# Especificação Técnica: Agentes Especialistas Contextuais (Chat AI)

Este documento descreve o plano de implementação para adicionar um **Chatbot Contextual** em cada aba de visualização do documento (Overview, Mercado, UI, DB, Marca).

## 1. Visão Geral
O objetivo é permitir que o usuário tire dúvidas ou solicite alterações específicas sobre o conteúdo exibido na aba atual. Em vez de um chatbot genérico, teremos "Personas" especializadas.

### As Personas
*   **Aba Visão Geral:** Atua como *Product Manager Sênior*. Foca em escopo, funcionalidades e clareza do negócio.
*   **Aba Mercado:** Atua como *Analista de Mercado*. Foca em competidores, diferenciais e estratégia.
*   **Aba Interface:** Atua como *UX/UI Designer*. Foca em usabilidade, fluxo de telas e componentes.
*   **Aba Banco de Dados:** Atua como *Engenheiro de Dados*. Foca em modelagem, SQL, Prisma e relacionamentos.
*   **Aba Marca:** Atua como *Diretor Criativo*. Foca em psicologia das cores, logo e identidade visual.

---

## 2. Arquitetura da Solução

### A. Componentes UI (`src/components/AgentChat/`)

1.  **`ChatButton.tsx`**:
    *   Um botão flutuante (FAB) ou fixo no canto inferior direito da área de conteúdo da aba.
    *   Deve mudar de ícone/cor dependendo da aba (ex: Roxo para PM, Azul para DB).
    *   Texto sugerido: "Falar com Especialista".

2.  **`ChatModal.tsx`**:
    *   Modal lateral (Drawer) ou Centralizado sobrepondo o conteúdo.
    *   **Header:** Mostra o nome do Agente (ex: "🤖 Engenheiro de Dados").
    *   **Body:** Lista de mensagens (User vs AI) com scroll.
    *   **Footer:** Input de texto + Botão Enviar.

### B. Serviço de IA (`src/services/geminiService.ts`)

Precisamos de um novo método `sendMessageToAgent` que aceite:
1.  **Histórico do Chat:** Array de mensagens anteriores.
2.  **Contexto da Aba:** O conteúdo JSON ou Texto que está visível na tela (ex: o Schema do DB).
3.  **Persona:** Instrução de sistema definindo quem é o agente.

---

## 3. Plano de Implementação Passo a Passo

### Passo 1: Definir Tipos e Interfaces
No arquivo `types.ts`:

```typescript
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type AgentPersona = 'pm' | 'market' | 'ux' | 'db' | 'brand';
```

### Passo 2: Atualizar `geminiService.ts`

Adicionar a função de chat contextual.

```typescript
// Pseudocódigo para geminiService.ts

chatWithAgent: async (
    currentContext: string, // O conteúdo da aba (ex: JSON do DB)
    messages: ChatMessage[], // Histórico
    persona: AgentPersona // Qual agente está respondendo
): Promise<string> => {
    
    // 1. Definir System Instruction baseada na Persona
    let systemInstruction = "";
    switch(persona) {
        case 'db':
            systemInstruction = "Você é um Engenheiro de Dados Sênior. O usuário tirará dúvidas sobre o Schema SQL fornecido. Seja técnico e preciso.";
            break;
        // ... outros casos
    }

    // 2. Montar o Prompt
    // É crucial injetar o CONTEXTO (o que está na tela) na primeira mensagem ou como sistema
    const prompt = `
    CONTEXTO DO PROJETO ATUAL:
    ${currentContext}
    
    HISTÓRICO DA CONVERSA:
    ${messages.map(m => `${m.role}: ${m.text}`).join('\n')}
    
    Responda a última pergunta do usuário agindo como a persona definida.
    `;

    // 3. Chamar API (usar gemini-2.5-flash para rapidez e contexto longo)
    return generateText(prompt);
}
```

### Passo 3: Criar o Componente Visual (`ChatDrawer`)

Criar um componente que gerencia o estado local das mensagens.

*   **State:** `messages[]`, `isLoading`, `isOpen`.
*   **Props:** `contextData` (os dados da aba atual), `agentType`.

### Passo 4: Integrar no `DocumentViewer.tsx`

Dentro de cada condicional de aba (`activeTab === 'db'`, etc), adicionar o botão que abre o chat, passando os dados corretos.

Exemplo na Aba de Banco de Dados:
```tsx
{activeTab === 'db' && (
    <>
        {/* ... Conteúdo existente do DB ... */}
        
        <ChatFloatingButton 
            onClick={() => openChat('db', JSON.stringify(document.content.dbSchema))}
            label="Ajuda com Banco de Dados"
        />
    </>
)}
```

---

## 4. Prompt Engineering das Personas (Detalhado)

Para garantir qualidade, use estes templates ao chamar a API:

**1. Product Manager (Overview)**
> "Você é um PM experiente. O usuário está vendo o Resumo Executivo e Requisitos. Ajude a refinar o escopo, identificar buracos na lógica de negócio ou sugerir novas features. Se o usuário pedir para reescrever, forneça o texto pronto em Markdown."

**2. Market Analyst (Mercado)**
> "Você é um Analista de Mercado. O contexto são os concorrentes listados. Ajude o usuário a encontrar diferenciais competitivos ou critique a análise atual. Sugira estratégias de posicionamento."

**3. UX Designer (Interface)**
> "Você é um UX Designer. O contexto é a lista de telas e componentes. Sugira melhorias de fluxo, acessibilidade ou novos componentes que faltam para a funcionalidade descrita."

**4. DB Architect (Banco de Dados)**
> "Você é um DBA. O contexto é o esquema das tabelas. Verifique se há relacionamentos faltantes, sugira índices, tipos de dados mais adequados ou queries SQL para relatórios específicos."

**5. Creative Director (Marca)**
> "Você é um Diretor de Arte. O contexto é a paleta de cores e descrição do logo. Discuta a psicologia das cores, sugira variações de tons ou novos prompts para gerar imagens de logo."

---

## 5. Funcionalidade "Pedir Alterações"

Para permitir que o usuário peça alterações (ex: "Adicione uma tabela de Comentários"), o fluxo deve ser:

1.  O Usuário pede no chat.
2.  O Agente responde com o código/texto atualizado em um bloco de código (Markdown).
3.  O Agente instrui: "Aqui está a versão atualizada, copie e cole no seu editor ou gere o PRD novamente com essas instruções."

*(Nota: Atualização automática do estado do PRD via chat é complexa para uma primeira versão. Focar em o Agente fornecer o "snippet" correto para o usuário copiar é mais seguro e rápido de implementar).*

---

## 6. Plano de Implementação (TODO List)

### Fase 1: Infraestrutura e Serviço
- [ ] **Definição de Tipos:** Atualizar `types.ts` com interfaces `ChatMessage`, `AgentPersona`.
- [ ] **Service Update:** Implementar `geminiService.chatWithAgent` com lógica de injeção de contexto dinâmico.
- [ ] **Prompt Templates:** Definir constantes de sistema para cada Persona (PM, UX, DBA, etc.) no serviço.

### Fase 2: Componentes de UI
- [ ] **ChatInterface:** Criar componente `ChatDrawer.tsx` (Sidebar direita deslizante).
- [ ] **MessageList:** Componente para renderizar bolhas de chat com distinção visual (User = direita/azul, AI = esquerda/cinza).
- [ ] **Markdown Support:** Garantir que blocos de código sugeridos pela IA sejam renderizados e legíveis.
- [ ] **Trigger Button:** Criar componente `ChatButton` que muda de cor/ícone baseado na persona ativa.

### Fase 3: Integração no DocumentViewer
- [ ] **State Lift:** Gerenciar o estado do chat (histórico `messages`) no componente pai `DocumentViewer` para persistência ao trocar de abas.
- [ ] **Context Wiring:** Conectar cada aba (Overview, Market, UI, DB, Brand) ao botão de chat, serializando e passando o JSON específico daquela seção como payload.

### Fase 4: Testes e Refinamento
- [ ] **Teste de Contexto:** Verificar se o Agente de DB realmente "enxerga" as tabelas atuais e se o Agente de Mercado "enxerga" os concorrentes.
- [ ] **UX Polish:** Adicionar estados de loading (typing indicator), animações de entrada do drawer e auto-scroll para nova mensagem.
- [ ] **Mobile Responsiveness:** Garantir que o Chat Drawer funcione bem em telas pequenas (overlay total ou parcial).
