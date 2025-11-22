
# Plano de Implementação: Suporte Multi-Modelo (Groq & Gemini)

Este documento descreve as etapas para transformar o sistema, que hoje é exclusivo para Gemini, em um sistema agnóstico que suporta modelos Open Source (Llama 3, Mixtral) via Groq Cloud, mantendo a robustez do sistema atual.

## Estratégia Arquitetural: Padrão Facade
O arquivo `geminiService.ts` deixará de ser apenas um cliente do Google e passará a ser um **Orquestrador (Facade)**. Ele receberá as requisições do frontend e decidirá, com base no modelo selecionado (`currentModel`), se deve encaminhar para a API do Google ou para a API da Groq.

---

## Fase 1: Tipagem e Infraestrutura
**Objetivo:** Preparar o terreno para armazenar novas chaves de API e definir os tipos necessários.

- [x] **Atualizar `types.ts`:**
    - Adicionar `groqApiKey?: string` na interface `AppSettings`.
    - Isso permitirá salvar a chave da Groq no banco de dados local do usuário.

- [x] **Criar `services/groqService.ts`:**
    - Implementar uma classe/objeto isolado.
    - Deve usar `fetch` nativo (sem SDKs pesados) para bater no endpoint `https://api.groq.com/openai/v1/chat/completions`.
    - **Método `generateText`:** Implementar chamada simples de texto.
    - **Método `generateJSON`:** Implementar técnica de "JSON Mode" ou instrução via prompt system para garantir retorno JSON válido.
    - **Método `chat`:** Suporte a histórico de mensagens (`role: system | user | assistant`).

---

## Fase 2: O Orquestrador (Refatoração do GeminiService)
**Objetivo:** Transformar o `geminiService.ts` em um Hub de IA.

- [x] **Gerenciamento de Estado:**
    - Adicionar variável local `groqApiKey` no serviço.
    - Criar método `setGroqKey(key: string)`.
    - Criar helper `isGroqModel(modelName)` para detecção rápida.

- [x] **Refatorar `generateText` e `generateJSON`:**
    - Adicionar condicional: `if (isGroqModel(currentModel)) return groqService.generate...`.
    - Manter o código original do Gemini no `else` (ou em um objeto `geminiImpl` interno) para garantir que nada quebre.

- [x] **Tratamento Especial: `generateLogo`:**
    - **Desafio:** Groq (Llama) é apenas texto, não gera imagens.
    - **Solução Híbrida:** Usar Groq para gerar o *Prompt Criativo* (texto) e forçar o uso do `gemini-2.5-flash-image` para a geração da imagem final (Base64).

- [x] **Tratamento Especial: `generateCompetitors`:**
    - **Desafio:** Groq não tem ferramenta nativa de Google Search ("Grounding").
    - **Solução Fallback:** Se estiver usando Groq, o orquestrador deve usar um prompt textual pedindo para a IA usar seu "conhecimento interno" em vez de tentar chamar a ferramenta de busca.

---

## Fase 3: Interface de Configuração (UI)
**Objetivo:** Permitir que o usuário insira sua chave e escolha os novos modelos.

- [x] **Atualizar `views/Settings.tsx`:**
    - Adicionar opções no `<Select>` de modelos:
        - `llama3-70b-8192` (Groq)
        - `mixtral-8x7b-32768` (Groq)
    - Criar lógica condicional: Se um modelo Groq for selecionado, exibir um `<Input type="password">` para a **Groq API Key**.
    - Adicionar link para o console da Groq para o usuário pegar a chave grátis.
    - Atualizar a função de teste de conexão (`validateConnection`) para testar a API correta baseada na seleção.

---

## Fase 4: Inicialização e Integração
**Objetivo:** Garantir que a chave seja carregada ao abrir o app.

- [x] **Atualizar `App.tsx`:**
    - No `useEffect` de carregamento inicial, ler a `groqApiKey` do `db.getSettings()`.
    - Injetar a chave no serviço via `geminiService.setGroqKey()`.

---

## Fase 5: Testes de Validação

- [x] **Teste de Texto:** Gerar um Resumo Executivo com Llama 3.
- [x] **Teste de JSON:** Gerar um Schema de Banco de Dados com Mixtral (verificar se o JSON não vem quebrado).
- [x] **Teste de Chat:** Conversar com o Agente DBA usando Llama 3 (verificar se mantém o contexto).
- [x] **Teste de Logo:** Gerar um logo (verificar se o prompt vem do Llama mas a imagem é gerada pelo Gemini).
