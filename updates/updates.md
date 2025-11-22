
# Log de Atualizações e Mudanças

Este arquivo rastreia todas as modificações, implementações de funcionalidades e correções realizadas no projeto PRD-Prompt.ai.

## Formato do Registro
- **Data e Hora:** (DD/MM/AAAA HH:mm)
- **Tipo:** [Feature], [Fix], [Refactor], [Docs], [Chore]
- **Descrição:** Resumo objetivo do que foi feito.

---

## Histórico

### 28/10/2025 17:30
**[Fix] Atualização de Modelos Groq (Deprecation)**
- **Settings:** Remoção do modelo descontinuado `llama3-70b` e substituição por `llama-3.3-70b-versatile` (novo padrão) e `llama-3.1-8b-instant`.
- **Feature:** Adicionado suporte ao modelo **DeepSeek R1** (via Groq), incluindo lógica de limpeza de tags `<think>` para evitar quebra no parsing de JSON.
- **Feature:** Adicionado suporte ao modelo **Google Gemma 2 9B** (via Groq).
- **Core:** Atualização do `isGroqModel` no orquestrador para suportar prefixos `deepseek` e `gemma`.

### 28/10/2025 16:00
**[Feature] Suporte Multi-Modelo (Gemini + Groq/Llama)**
- **Core:** Refatoração do `geminiService.ts` para o padrão *Facade*, atuando como orquestrador de múltiplos provedores de IA.
- **Integration:** Implementação do `groqService.ts` para suporte a modelos Open Source via Groq Cloud (`llama3-70b`, `mixtral-8x7b`).
- **Settings:** Atualização da interface de configurações para permitir seleção de modelos Llama e inserção de chave de API Groq.
- **Robustez:** O sistema agora extrai JSON de forma resiliente mesmo de modelos "conversadores" (Llama) e usa fallback híbrido (Gemini para imagens, Llama para texto) na geração de logos.

### 28/10/2025 14:00
**[Refactor] Chat Modal & UI Premium**
- **UI:** Substituição completa do `ChatDrawer` (lateral) por um `ChatModal` (centralizado) com design "Glassmorphic" e animações de entrada.
- **UX:** Adição de "Sugestões Rápidas" (Chips) inteligentes que aparecem quando o chat está vazio, específicas para cada Persona (PM, DB, etc.).
- **Visual:** Cabeçalhos com gradientes ricos baseados na persona ativa e bolhas de chat refinadas para melhor legibilidade.
- **Acessibilidade:** Foco automático no input ao abrir o modal e fechamento ao clicar no backdrop.

### 28/10/2025 13:00
**[Fix] UX & Rendering Corrections**
- **UI:** Correção do `z-index` do componente `Toast` para garantir que notificações flutuantes apareçam acima de modais e do novo Chat Drawer.
- **Rendering:** Implementação do `MarkdownRenderer` no `DocumentViewer` para formatar corretamente textos gerados pela IA que contêm negrito (`**`) ou blocos de código, substituindo a renderização de texto puro.
- **Bugfix:** Remoção de imports duplicados ou caminhos incorretos detectados na análise de código.

### 28/10/2025 12:30
**[Refactor] Polimento do Chat e Renderização Markdown**
- **UX:** O botão de chat no `DocumentViewer` agora muda de cor e label dinamicamente de acordo com a Persona ativa (ex: "Falar com PM", "Falar com DBA").
- **UI:** Implementação de renderizador Markdown leve no `ChatBubble` para suportar **negrito** e blocos de código (```) nas respostas dos agentes.
- **AI:** Otimização do serviço `chatWithAgent` para usar o parâmetro nativo `systemInstruction` da API Gemini, garantindo melhor aderência à persona.

### 28/10/2025 11:45
**[Feature] Agentes Especialistas Contextuais (Chat)**
- **Core:** Implementação da arquitetura de chat com personas especializadas (PM, Mercado, UX, DB, Branding) no `geminiService`.
- **UI:** Criação dos componentes `ChatDrawer`, `ChatBubble` e `ChatButton`.
- **Integração:** Adição do chat contextual no `DocumentViewer`. Cada aba agora possui um assistente de IA que "vê" os dados daquela aba específica e responde dúvidas ou sugere melhorias.
- **Estado:** O histórico do chat é persistido por sessão de visualização, separado por aba/persona.

### 28/10/2025 10:30
**[Feature] Engenharia de Prompt Avançada (v2.0)**
- **UI:** Reformulação completa da tela "Gerar Prompt" com layout de duas colunas e experiência visual aprimorada.
- **Target Platform:** Adicionado suporte para otimização de prompts específicos para **Bolt.new**, **Cursor (.cursorrules)**, **v0.dev** e ChatGPT genérico.
- **Templates:** Inclusão de botões "Quick Stack" para preenchimento rápido de tecnologias (T3 Stack, Modern Web, etc.).
- **Contexto Granular:** Usuário agora pode escolher incluir ou excluir seções específicas do PRD (UI, DB, Concorrentes) no prompt final.
- **Docs:** Criação do arquivo `melhorargerarprompt.md` com 10 sugestões estratégicas de evolução do produto.

### 28/10/2025 09:00
**[Feature] Autenticação e Segregação de Dados por Usuário**
- **Backend:** Refatoração do `databaseService.ts` para incluir métodos de `login`, `register` e filtragem de documentos por `userId`.
- **Frontend:** Criação da nova tela `Auth.tsx` para Login/Cadastro e atualização do `App.tsx` para bloquear acesso não autorizado.
- **Contexto:** Atualização do `Sidebar` para exibir o perfil do usuário logado e opção de Logout.
- **Dados:** Cada usuário agora possui seu próprio ambiente isolado; PRDs criados por um usuário não são visíveis para outros.

### 27/10/2025 23:00
**[Fix] Correção de Erro 401 (API Keys not Supported)**
- **Gemini Service:** Implementado mecanismo de Fallback Automático nas funções `generateJSON` e `generateText`.
- **Comportamento:** Se o modelo selecionado (ex: Gemini 2.5 Flash ou Pro) falhar com erro de autenticação (401) por exigir credenciais avançadas, o sistema automaticamente refaz a requisição usando o modelo seguro `gemini-2.0-flash`, garantindo que a aplicação não quebre para usuários com API Keys padrão.

### 27/10/2025 22:30
**[Feature] Robustez e Manutenção de Dados**
- **Backend (Simulado):** Adicionado método `clearDatabase` e validação de tipo Array na leitura de dados para evitar falhas críticas se o armazenamento for corrompido.
- **Settings:** Implementada "Zona de Perigo" permitindo ao usuário resetar completamente o banco de dados local e reiniciar a aplicação.

### 27/10/2025 22:00
**[Refactor] Centralização de Persistência (Configurações)**
- **Backend:** O `databaseService.ts` agora gerencia também as configurações do usuário (`AppSettings`), eliminando o uso direto de `localStorage` no código da aplicação.
- **App:** `App.tsx` atualizado para carregar configurações, PRDs e Prompts em paralelo na inicialização.
- **Consistência:** Toda a persistência de dados agora passa por uma única camada de serviço, facilitando a migração futura para um banco de dados remoto.

### 27/10/2025 21:30
**[Feature] Backend Simulado (Database Service)**
- **Arquitetura:** Criação do `services/databaseService.ts` para abstrair a persistência de dados.
- **Funcionalidade:** O sistema agora simula um banco de dados real com operações assíncronas (Promises) e delay de rede artificial, substituindo o uso direto e síncrono do `localStorage` no frontend.
- **Refactor:** Atualização completa do `App.tsx` para carregar dados via `async/await` no mount e gerenciar estados de carregamento (`isLoading`).

### 27/10/2025 20:00
**[Refactor] Novo Visualizador de Documentos**
- **UI/UX:** Redesign completo da tela "Visualizar Documento" (`DocumentViewer`).
- **Feature:** Implementação de navegação por Abas (Visão Geral, Mercado, Interface, Banco de Dados, Marca) para facilitar a leitura de PRDs complexos.
- **Funcionalidade:** Lógica de "Print Friendly" que expande automaticamente todas as abas ocultas ao gerar um PDF ou imprimir, garantindo que o documento saia completo.

### 27/10/2025 19:15
**[Feature] Navegação por Abas de Etapas**
- **UX:** Substituição do indicador de progresso simples por uma barra de navegação completa em abas (Stepper) no topo do Gerador de PRD.
- **Funcionalidade:** Usuários agora podem clicar nas abas para navegar livremente entre os passos já desbloqueados ou revisar passos anteriores sem perder o contexto.
- **State:** Implementação de controle de `maxStepReached` para gerenciar o desbloqueio progressivo das abas.

### 27/10/2025 19:00
**[Refactor] Remoção da Tela de Bloqueio de API**
- **UX:** Removida a tela inicial de seleção de API Key.
- **Motivo:** O gerenciamento de chave de API foi centralizado na página de Configurações, permitindo que o usuário acesse o Dashboard imediatamente.

### 27/10/2025 18:30
**[Refactor] UI de Revisão Final em Abas**
- **UX:** Alterado o layout da etapa de "Revisão Final" de Accordions para Abas (Tabs).
- **Motivo:** Melhorar a usabilidade e organização visual, permitindo acesso rápido às seções sem expansão vertical excessiva.

### 27/10/2025 18:00
**[Feature] Revisão Final em Acordeão**
- **UX:** A etapa de "Revisão Final" no Gerador de PRD foi completamente redesenhada.
- **Funcionalidade:** Agora exibe todos os passos anteriores (Concorrentes, UI, DB, Logo) em seções expansíveis (Accordions), permitindo a revisão completa do documento em uma única tela antes de salvar.
- **Refactor:** Extração da lógica de renderização dos módulos de PRD para reutilização.

### 27/10/2025 17:15
**[Fix] Geração de Imagens de Logo**
- **Fix:** Alteração do modelo de geração de logo para `gemini-2.5-flash-image`, que é o recomendado para tarefas gerais de imagem.
- **Resiliência:** Adicionado tratamento de erro específico para a geração da imagem. Se a imagem falhar, o sistema agora retorna o conceito textual (Paleta, Descrição) em vez de falhar todo o processo, permitindo que o usuário avance no fluxo.

### 27/10/2025 17:00
**[Feature] Indicador Visual de Modelo Ativo**
- **UX:** Adicionado um "crachá" visual no rodapé da barra lateral (Sidebar) que mostra qual modelo de IA está ativo no momento.
- **Funcionalidade:** O indicador sincroniza com as Configurações e exibe um sinal de "online" verde.
- **Tech:** Refatoração do `AppContext` e `App.tsx` para gerenciar o estado do modelo globalmente e passá-lo via props/contexto.

### 27/10/2025 16:45
**[Feature] Salvar Configurações com Validação**
- **UX:** Alterado fluxo da página de Configurações para exigir validação explícita.
- **Funcionalidade:** As alterações de modelo de IA agora ficam em estado de "rascunho" até que o usuário clique em "Testar Compatibilidade". O botão "Salvar e Aplicar" só é exibido após a validação ser bem-sucedida, prevenindo configurações inválidas.

### 27/10/2025 16:30
**[Feature] Página de Configurações e Validação Inteligente**
- **Feature:** Nova tela de "Configurações" acessível pela Sidebar.
- **Funcionalidade:** Usuário pode alternar entre modelos `gemini-2.5-flash` (recomendado), `gemini-2.0-flash` (estável) e `gemini-3-pro-preview` (avançado).
- **Segurança:** Sistema de validação de conexão que testa se a chave de API selecionada é compatível com o modelo escolhido, prevenindo erros em tempo de geração.

### 27/10/2025 16:15
**[Fix] Rollback de Modelos de IA**
- **Fix:** Reversão dos modelos para `gemini-2.0-flash` (texto) e `gemini-2.0-flash-exp` (imagem).
- **Motivo:** Os modelos `gemini-3-pro` apresentaram erro 401 (API keys not supported) no ambiente de produção via API Key pública. O modelo 2.0 Flash mantém alta qualidade com suporte estável a autenticação.
- **Melhoria:** Adição de fallback automático na geração de concorrentes: se a ferramenta `googleSearch` falhar por autenticação, o sistema tenta gerar os dados de forma estática.

### 27/10/2025 16:00
**[Feature] Google Search Grounding**
- **IA:** Atualização do serviço de análise de concorrentes (`generateCompetitors`) para utilizar a ferramenta `googleSearch`.
- **Benefício:** Agora a análise de mercado retorna concorrentes reais com links validados e informações atualizadas.

### 27/10/2025 15:30
**[Fix] Permissão Negada e Seleção de API Key**
- **Fix:** Resolução do erro `PERMISSION_DENIED` (403) na geração de logos.
- **Feature:** Implementação da tela de bloqueio obrigatória para Seleção de API Key.
- **Refactor:** Instanciação dinâmica do cliente `GoogleGenAI`.

### 27/10/2025 15:00
**[Feature] Feedback Visual no Modo Turbo**
- **UX:** Implementação de um checklist visual (Modal) durante a geração "Turbo".
- **Funcionalidade:** O usuário agora vê o progresso individual de cada etapa (Resumo, UI, DB, Logo) sendo marcada como concluída em tempo real.

### 27/10/2025 14:30
**[Feature] Geração de Código Técnico e Upgrade de Modelos**
- **IA:** Upgrade inicial para Gemini 3 Pro (posteriormente revertido por questões de Auth).
- **Banco de Dados:** Implementação da funcionalidade de gerar e baixar código **SQL (PostgreSQL)** e **Prisma Schema**.
- **UI:** Adição de botões de ação "Gerar & Baixar".
- **Docs:** Criação dos arquivos `regra.md` e `melhorargerador.md`.

### 27/10/2025 14:00
**[Refactor] Persistência e Correções de UI**
- **Core:** Implementação de `localStorage` robusto.
- **Fix:** Correção de erros de "undefined".
- **Feature:** Adição do "Modo Turbo" e "Preenchimento Mágico".

### 27/10/2025 13:30
**[Feature] Identidade Visual e UI Plan**
- **Logo:** Implementação de geração de logo real (JPG).
- **UI Plan:** Melhoria na geração do plano de interface (SVG + Telas).
- **Viewer:** Atualização do visualizador de documentos.
