# Análise Funcional e Diagnóstico do Sistema

## Status Geral
O sistema apresenta uma arquitetura robusta baseada no padrão **Facade** (`geminiService.ts`), roteando corretamente entre **Google Gemini** e **Groq (Llama/Mixtral)** com base nas configurações do usuário.

No entanto, a **estabilidade da renderização** e o **processamento de JSON** das IAs Open Source (Llama 3, DeepSeek) apresentaram fragilidades intermitentes, causando erros de "Tela Branca" (Crash) quando a estrutura do JSON não é exatamente a esperada.

---

## Diagnóstico por Módulo

### 1. Configuração e Roteamento (`Settings` & `App`)
*   **Status:** ✅ Funcional.
*   **Análise:** O estado `selectedModel` e `groqApiKey` são persistidos e carregados corretamente. A função `isGroqModel` identifica corretamente todos os variantes (llama, deepseek, gemma).

### 2. Geração de PRD (`GeneratePrd`)
*   **Passo 1 (Texto):** ✅ Estável. Retorna texto puro.
*   **Passo 2 (Concorrentes):** ⚠️ **Risco Detectado.**
    *   *Problema:* Modelos Llama às vezes retornam objetos `{ competitors: [...] }` ou `{ data: [...] }` em vez de um Array direto, ou falham ao gerar JSON válido, retornando `null`.
    *   *Erro:* `TypeError: map is not a function`.
*   **Passo 3 (UI Plan):** ⚠️ **Risco Crítico.**
    *   *Problema:* A propriedade `screens` pode vir como `undefined` ou não ser um array se a IA alucinar a estrutura. O código tentava fazer `.map` sem validar `Array.isArray`.
*   **Passo 4 (DB Schema):** ⚠️ **Risco Moderado.**
    *   *Problema:* Tabelas podem vir sem colunas (`columns` undefined), quebrando a renderização.
*   **Passo 5 (Logo):** ✅ Estável (Híbrido). O texto vem do Groq, a imagem vem do Gemini.

### 3. Visualização (`DocumentViewer`)
*   **Status:** ⚠️ Risco de Regressão.
*   **Análise:** Se um PRD for salvo com dados corrompidos (ex: `competitors` sendo um objeto em vez de array), o Viewer quebrava ao tentar abrir o documento.

---

## Plano de Correção (Hardening)

### A. Sanitização no Service Layer (`geminiService.ts`)
O serviço deve ser a barreira final contra dados sujos.
1.  **Validar Arrays:** Nunca confiar que a IA retornou um Array. Usar `Array.isArray()` antes de qualquer `.map()`.
2.  **Normalização:** Se a IA retornar `{ screens: [...] }` mas esperávamos `[...]`, o serviço deve extrair o array automaticamente.
3.  **Preenchimento de Vazios:** Se `components` ou `columns` vierem vazios, injetar `[]` para evitar erros de undefined na UI.

### B. Defensiva na UI Layer (`GeneratePrd.tsx`, `DocumentViewer.tsx`)
A interface não pode confiar cegamente no `geminiService`.
1.  **Optional Chaining:** Substituir `x.map()` por `x?.map()`.
2.  **Guard Clauses:** Verificar existência de objetos aninhados (ex: `uiPlan.screens`) antes de renderizar o bloco.

### C. Turbo Mode
1.  Garantir que falhas em promessas individuais (ex: Logo falhou) não cancelem o resto da geração (ex: Texto e DB).

---

## Conclusão
As correções aplicadas nos arquivos garantem que o sistema funcione fluidamente com modelos menos determinísticos (como Llama 3 via Groq) e protegem a aplicação contra crashes de JavaScript (Tela Branca).