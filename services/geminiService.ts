
import { GoogleGenAI, Type } from "@google/genai";
import type { PRD, Competitor, DBTable, LogoSuggestion, UIScreen, ChatMessage, AgentPersona, CompetitorDetails } from '../types';
import { groqService } from './groqService'; // Import the new service

// --- CONFIGURATION STATE ---
let currentModel = 'gemini-2.5-flash'; 
let groqApiKey = ''; // Store locally in memory for the session

const FALLBACK_MODEL = 'gemini-2.0-flash'; 

// --- GEMINI IMPLEMENTATION (Original Logic) ---

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
  }
  return new GoogleGenAI({ apiKey: apiKey! });
};

const geminiImpl = {
    generateJSON: async <T,>(model: string, prompt: string, responseSchema: any): Promise<T | null> => {
        const executeGen = async (m: string) => {
            const ai = getAiClient();
            return await ai.models.generateContent({
                model: m,
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema },
            });
        };

        try {
            const response = await executeGen(model);
            const jsonText = response.text?.trim();
            if (!jsonText) return null;
            return JSON.parse(jsonText) as T;
        } catch (error: any) {
            // Fallback logic specific to Gemini Auth errors
            const errStr = error.toString();
            if ((errStr.includes("401") || errStr.includes("API keys")) && model !== FALLBACK_MODEL) {
                console.warn(`Gemini Auth Error on ${model}. Retrying with ${FALLBACK_MODEL}...`);
                try {
                    const response = await executeGen(FALLBACK_MODEL);
                    const jsonText = response.text?.trim();
                    if (!jsonText) return null;
                    return JSON.parse(jsonText) as T;
                } catch (fbErr) { return null; }
            }
            console.error('Gemini JSON Error:', error);
            return null;
        }
    },

    generateText: async (model: string, prompt: string, systemInstruction?: string): Promise<string> => {
        const executeGen = async (m: string) => {
            const ai = getAiClient();
            return await ai.models.generateContent({
                model: m,
                contents: prompt,
                config: { systemInstruction }
            });
        };

        try {
            const response = await executeGen(model);
            return response.text || '';
        } catch (error: any) {
             // Fallback logic
            const errStr = error.toString();
            if ((errStr.includes("401") || errStr.includes("API keys")) && model !== FALLBACK_MODEL) {
                 try {
                    const response = await executeGen(FALLBACK_MODEL);
                    return response.text || '';
                } catch (fbErr: any) { return `Error (Fallback): ${fbErr.message}`; }
            }
            console.error("Gemini Text Error:", error);
            return `Error: ${error.message}`;
        }
    },

    generateWithImage: async (prompt: string, base64Image: string, systemInstruction?: string): Promise<string> => {
        const ai = getAiClient();
        // Use Gemini 2.5 Flash Image for multimodal
        const model = 'gemini-2.5-flash-image';
        
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: 'image/png', data: base64Image } }
                    ]
                },
                config: { systemInstruction }
            });
            
            // Parse response parts (Gemini 2.5 returns mixed parts)
            if (response.candidates?.[0]?.content?.parts) {
                const textPart = response.candidates[0].content.parts.find(p => p.text);
                return textPart?.text || '';
            }
            return response.text || '';
            
        } catch (error: any) {
            console.error("Gemini Image Error:", error);
            return "Desculpe, não consegui analisar a imagem.";
        }
    }
};

// --- MAIN ORCHESTRATOR ---
// This exposes the same API as before, but routes based on model name

// Updated check to include new Groq models (DeepSeek, Gemma, newer Llama)
const isGroqModel = (model: string) => 
    model.startsWith('llama') || 
    model.startsWith('mixtral') || 
    model.startsWith('deepseek') || 
    model.startsWith('gemma');

export const geminiService = {
  // --- Settings Management ---
  setModel: (modelName: string) => {
      currentModel = modelName;
  },

  setGroqKey: (key: string) => {
      groqApiKey = key;
  },

  getModel: () => currentModel,

  validateConnection: async (modelToCheck?: string): Promise<{ isValid: boolean; message: string }> => {
      const modelToUse = modelToCheck || currentModel;
      
      // Route to Groq
      if (isGroqModel(modelToUse)) {
          try {
              await groqService.generateText(modelToUse, "Hello", groqApiKey);
              return { isValid: true, message: "Conexão com Groq bem-sucedida!" };
          } catch (e: any) {
              return { isValid: false, message: `Erro Groq: ${e.message}` };
          }
      }

      // Route to Gemini (Original Logic)
      try {
          const ai = getAiClient();
          await ai.models.generateContent({ model: modelToUse, contents: "Hello" });
          return { isValid: true, message: "Conexão Gemini bem-sucedida!" };
      } catch (error: any) {
          let msg = "Erro desconhecido.";
          if (error.toString().includes("403")) msg = "Permissão negada (403).";
          if (error.toString().includes("401")) msg = "Modelo requer autenticação avançada (401).";
          if (error.toString().includes("404")) msg = "Modelo não encontrado (404).";
          if (error.message) msg = error.message;
          return { isValid: false, message: msg };
      }
  },

  suggestPrdMetadata: async (rawIdea: string): Promise<Partial<PRD> | null> => {
      const prompt = `Analise a seguinte ideia bruta de um usuário: "${rawIdea}".
      Com base nela, extraia ou sugira informações profissionais para um PRD (Product Requirement Document).
      Retorne um JSON com:
      - title: Um nome comercial criativo e profissional para o produto.
      - industry: Um array de 3 a 5 tags de indústria/mercado (ex: ["Fintech", "Mobile Banking", "Segurança"]).
      - targetAudience: Uma descrição concisa do público-alvo.
      - complexity: A complexidade estimada ('Baixa', 'Média' ou 'Alta').
      - ideaDescription: Uma versão refinada e mais profissional da descrição da ideia (max 2 frases).`;

      const schema = {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            industry: { type: Type.ARRAY, items: { type: Type.STRING } },
            targetAudience: { type: Type.STRING },
            complexity: { type: Type.STRING, enum: ['Baixa', 'Média', 'Alta'] },
            ideaDescription: { type: Type.STRING }
        },
        required: ['title', 'industry', 'targetAudience', 'complexity', 'ideaDescription']
      };

      // ROUTING
      if (isGroqModel(currentModel)) {
          return await groqService.generateJSON<Partial<PRD>>(currentModel, prompt, schema, groqApiKey);
      }
      return await geminiImpl.generateJSON<Partial<PRD>>(currentModel, prompt, schema);
  },

  generatePrdSection: async (section: string, prdInfo: Partial<PRD>): Promise<string> => {
    const { title, ideaDescription, industry, targetAudience } = prdInfo;
    const industryText = Array.isArray(industry) ? industry.join(', ') : industry;
    const basePrompt = `Com base na seguinte ideia de produto:
    - Título: ${title}
    - Descrição: ${ideaDescription}
    - Indústria: ${industryText}
    - Público-alvo: ${targetAudience}
    
    Gere a seção "${section}" para um Documento de Requisitos do Produto (PRD). Seja claro, conciso e profissional. Use Markdown para formatação (negrito, listas).`;

    if (isGroqModel(currentModel)) {
        return await groqService.generateText(currentModel, basePrompt, groqApiKey);
    }
    return await geminiImpl.generateText(currentModel, basePrompt);
  },

  generateCompetitors: async (industry: string | string[]): Promise<Competitor[] | null> => {
    // Note: Groq models do NOT support Google Search Tooling natively yet.
    // We must use the fallback text generation logic for Groq.
    const industryText = Array.isArray(industry) ? industry.join(', ') : industry;
    const fallbackPrompt = `Liste 3 concorrentes diretos ou indiretos na indústria de "${industryText}". Forneça uma breve análise (notas) e o link para o site de cada um.`;
    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                notes: { type: Type.STRING },
                link: { type: Type.STRING },
            },
            required: ['name', 'notes', 'link'],
        },
    };

    let result: any = null;

    if (isGroqModel(currentModel)) {
        result = await groqService.generateJSON<Competitor[]>(currentModel, fallbackPrompt, schema, groqApiKey);
    } else {
        // Original Gemini Logic (supports Search Tool)
        const prompt = `
        Using Google Search, list 3 REAL competitors in the "${industryText}" industry.
        Return strict JSON array: [{"name": "Comp1", "notes": "Analysis", "link": "url"}].
        `;

        try {
            const ai = getAiClient();
            const response = await ai.models.generateContent({
                model: currentModel,
                contents: prompt,
                config: { tools: [{ googleSearch: {} }] },
            });
            let text = response.text || '';
            // Clean markdown to ensure JSON parse works
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            // Attempt to find array start/end if there's chatter
            const match = text.match(/\[[\s\S]*\]/); 
            if(match) text = match[0];
            
            result = JSON.parse(text) as Competitor[];
        } catch (e) {
            console.warn("Gemini Search Tool failed, falling back to standard generation.");
            result = await geminiImpl.generateJSON<Competitor[]>(currentModel, fallbackPrompt, schema);
        }
    }

    // SANITIZATION: Ensure result is an array
    if (result) {
        if (Array.isArray(result)) return result;
        // If model wrapped it in an object e.g. { competitors: [...] } or { data: [...] }
        const values = Object.values(result);
        for (const val of values) {
            if (Array.isArray(val)) return val as Competitor[];
        }
    }
    return [];
  },

  analyzeCompetitorDeeply: async (competitorName: string, industry: string | string[], briefContext: string): Promise<CompetitorDetails | null> => {
    const industryText = Array.isArray(industry) ? industry.join(', ') : industry;
    const prompt = `Aja como um Analista de Mercado Sênior.
    Analise profundamente o concorrente "${competitorName}" do setor de "${industryText}".
    Contexto breve que já temos: "${briefContext}".

    Retorne um JSON estrito com:
    - overview: Visão geral expandida sobre posicionamento e modelo de negócio.
    - whatTheyDo: Descrição objetiva da proposta de valor.
    - keyFeatures: Lista de 3-5 funcionalidades principais.
    - strengths: Lista de pontos fortes.
    - weaknesses: Lista de pontos fracos.
    - strategicInsight: Uma frase objetiva e estratégica sobre o diferencial deles e o que pode ser aprendido.
    - marketStats: Objeto com "popularity" (estimativa de tráfego/alcance), "userBase" (estimativa, se houver), "presence" (onde atuam).
    - pricingModel: Resumo dos planos e faixa de preço (ex: Freemium, Enterprise, $10-$50/mês).
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            overview: { type: Type.STRING },
            whatTheyDo: { type: Type.STRING },
            keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            strategicInsight: { type: Type.STRING },
            marketStats: {
                type: Type.OBJECT,
                properties: {
                    popularity: { type: Type.STRING },
                    userBase: { type: Type.STRING },
                    presence: { type: Type.STRING }
                }
            },
            pricingModel: { type: Type.STRING }
        },
        required: ['overview', 'whatTheyDo', 'keyFeatures', 'strengths', 'weaknesses', 'strategicInsight', 'pricingModel', 'marketStats']
    };

    if (isGroqModel(currentModel)) {
        return await groqService.generateJSON<CompetitorDetails>(currentModel, prompt, schema, groqApiKey);
    }
    return await geminiImpl.generateJSON<CompetitorDetails>(currentModel, prompt, schema);
  },

  generateUiPlan: async (ideaDescription: string): Promise<{ flowchartSvg: string, screens: UIScreen[] } | null> => {
    const prompt = `
    Atue como um Arquiteto de UI/UX Sênior. Para a ideia: "${ideaDescription}".
    Retorne um JSON com:
    1. 'screens': Lista de 4-6 telas (name, description, components).
    2. 'flowchartSvg': Um código SVG string completo do fluxo. Use retângulos arredondados, fundo branco, texto escuro, linhas indigo.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            screens: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        components: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['name', 'description', 'components']
                }
            },
            flowchartSvg: { type: Type.STRING }
        },
        required: ['screens', 'flowchartSvg']
    };

    let result: any;
    if (isGroqModel(currentModel)) {
        result = await groqService.generateJSON(currentModel, prompt, schema, groqApiKey);
    } else {
        result = await geminiImpl.generateJSON(currentModel, prompt, schema);
    }

    if (result) {
        // SANITIZATION: Ensure screens is an array
        if (!Array.isArray(result.screens)) {
             // Attempt to find screens in nested keys if structure is wrong
             const values = Object.values(result);
             const foundArr = values.find(v => Array.isArray(v));
             if (foundArr) result.screens = foundArr;
             else result.screens = [];
        }

        // SANITIZATION: Ensure components is an array within screens
        result.screens = result.screens.map((s: any) => ({
            ...s,
            components: Array.isArray(s.components) ? s.components : []
        }));
    }
    return result;
  },

  generateDbSchema: async (ideaDescription: string): Promise<DBTable[] | null> => {
    const prompt = `Modele um esquema de banco de dados relacional para: "${ideaDescription}". Sugira tabelas, colunas e relacionamentos.`;
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          columns: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING } },
              required: ['name', 'type', 'description'],
            },
          },
          relations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { toTable: { type: Type.STRING }, type: { type: Type.STRING } },
              required: ['toTable', 'type'],
            },
          },
        },
        required: ['name', 'columns', 'relations'],
      },
    };

    let result: any;
    if (isGroqModel(currentModel)) {
        result = await groqService.generateJSON(currentModel, prompt, schema, groqApiKey);
    } else {
        result = await geminiImpl.generateJSON(currentModel, prompt, schema);
    }

    // SANITIZATION: Ensure result is an array
    let tables: any[] = [];

    if (Array.isArray(result)) {
        tables = result;
    } else if (result && typeof result === 'object') {
        // Try to find the array if wrapped
        const values = Object.values(result);
        const found = values.find(v => Array.isArray(v));
        if (found) tables = found as any[];
    }

    // Map and sanitize internals
    return tables.map((t: any) => ({
        ...t,
        columns: Array.isArray(t.columns) ? t.columns : [],
        relations: Array.isArray(t.relations) ? t.relations : []
    }));
  },

  generateTechnicalSchema: async (dbSchema: DBTable[], format: 'sql' | 'prisma'): Promise<string> => {
      const prompt = `
      Atue como um DBA. Converta este JSON Schema em código ${format === 'sql' ? 'SQL (PostgreSQL)' : 'Prisma Schema'}.
      JSON: ${JSON.stringify(dbSchema)}
      Retorne APENAS o código.
      `;
      
      if (isGroqModel(currentModel)) {
          return await groqService.generateText(currentModel, prompt, groqApiKey);
      }
      return await geminiImpl.generateText(currentModel, prompt);
  },

  generateLogo: async (
    title: string, 
    industry: string | string[], 
    options: { 
        style?: string; 
        color?: string; 
        typography?: string;
        customPrompt?: string;
    }
  ): Promise<LogoSuggestion | null> => {
    // LOGO GENERATION IS SPECIAL
    // Groq models are TEXT ONLY. They cannot generate images.
    // We will use Groq for the CONCEPT (text), but we must force Gemini for the IMAGE generation.
    const industryText = Array.isArray(industry) ? industry.join(', ') : industry;
    let promptInstruction = `Atue como Designer. Crie conceito de marca para: Produto "${title}", Indústria "${industryText}".`;
    
    // Injeção de opções avançadas
    if (options.customPrompt) {
        promptInstruction += `\nINSTRUÇÕES ADICIONAIS E PRIORITÁRIAS DO USUÁRIO: ${options.customPrompt}`;
    } else {
        if (options.style) promptInstruction += ` Estilo visual desejado: ${options.style}.`;
        if (options.color) promptInstruction += ` Paleta de cores desejada: ${options.color}.`;
        if (options.typography) promptInstruction += ` Tipografia sugerida: ${options.typography}.`;
    }
    
    promptInstruction += ` Retorne JSON com: description, imagePrompt (in English, minimalist vector logo, white background), palette (hex, name).`;

    const conceptSchema = {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING },
        imagePrompt: { type: Type.STRING },
        palette: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { hex: { type: Type.STRING }, name: { type: Type.STRING } },
            required: ['hex', 'name'],
          }
        }
      },
      required: ['description', 'palette', 'imagePrompt'],
    };

    let concept: any;

    if (isGroqModel(currentModel)) {
        concept = await groqService.generateJSON(currentModel, promptInstruction, conceptSchema, groqApiKey);
    } else {
        concept = await geminiImpl.generateJSON(currentModel, promptInstruction, conceptSchema);
    }

    if (!concept) return null;

    // IMAGE GENERATION STEP (ALWAYS GEMINI)
    // Even if Llama 3 is selected, we use Gemini Flash Image for the visual part
    let base64Image = '';
    try {
        const ai = getAiClient();
        // Add specific style instruction to the image prompt as well if not present in the generated concept
        let finalImagePrompt = concept.imagePrompt;
        if (!finalImagePrompt.toLowerCase().includes('vector')) finalImagePrompt += ", vector logo";
        if (!finalImagePrompt.toLowerCase().includes('white background')) finalImagePrompt += ", white background";
        if (options.style && !finalImagePrompt.includes(options.style)) finalImagePrompt += `, style ${options.style}`;
        if (options.customPrompt) finalImagePrompt += `, ${options.customPrompt}`;
        
        const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: { parts: [{ text: finalImagePrompt }] },
        });
        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) { base64Image = part.inlineData.data; break; }
        }
    } catch (imgError) { console.error("Error generating logo image:", imgError); }

    return {
        description: concept.description,
        imagePrompt: concept.imagePrompt,
        palette: Array.isArray(concept.palette) ? concept.palette : [], // SANITIZATION
        base64Image: base64Image
    };
  },

  generateAiPrompt: async (prd: PRD, options: any): Promise<string> => {
    // Simplified prompt construction for brevity, same logic as before
    const prompt = `
    Act as Prompt Engineer. Generate a system prompt for ${options.targetPlatform}.
    Project: ${prd.title} (${prd.ideaDescription}).
    Stack: ${options.stack}.
    
    Generate ONLY the Markdown prompt.
    `;

    if (isGroqModel(currentModel)) {
        return await groqService.generateText(currentModel, prompt, groqApiKey);
    }
    return await geminiImpl.generateText(currentModel, prompt);
  },

  chatWithAgent: async (
    currentContext: string,
    messages: ChatMessage[],
    persona: AgentPersona
  ): Promise<string> => {
    const personaInstructions: Record<AgentPersona, string> = {
        pm: "Você é um Product Manager Sênior. Ajude a refinar o escopo. Termine com '{{REGENERATE_ACTION}}' se precisar alterar o doc.",
        market: "Você é um Analista de Mercado.",
        ux: "Você é um UX/UI Designer.",
        db: "Você é um DBA.",
        brand: "Você é um Diretor Criativo."
    };
    const systemInstruction = personaInstructions[persona] + "\nSe precisar alterar dados, use a tag {{REGENERATE_ACTION}} no final.";

    if (isGroqModel(currentModel)) {
        // Groq supports chat history natively
        return await groqService.chat(currentModel, currentContext, messages, systemInstruction, groqApiKey);
    }

    // Gemini Logic
    const historyText = messages.map(m => `${m.role === 'user' ? 'User' : 'Agent'}: ${m.text}`).join('\n');
    const prompt = `CONTEXTO: ${currentContext}\nHISTÓRICO:\n${historyText}\nResponda a última mensagem.`;
    return await geminiImpl.generateText(currentModel, prompt, systemInstruction);
  },

  // --- CUSTOM SPECIALIST CHAT (Updated for v2.0) ---
  chatWithSpecialist: async (
      messages: ChatMessage[], 
      systemInstruction: string,
      contextData?: string // attached PRD
  ): Promise<string> => {
      
      const lastMsg = messages[messages.length - 1];
      
      // 1. IMAGE HANDLING
      // If last message has image, we MUST use Gemini-Image
      if (lastMsg.image) {
          const fullPrompt = `${systemInstruction}\n\nCONTEXTO ADICIONAL: ${contextData || 'Nenhum'}\n\nUsuário: ${lastMsg.text}`;
          return await geminiImpl.generateWithImage(fullPrompt, lastMsg.image, systemInstruction);
      }

      // 2. DOCUMENT CONTEXT INJECTION
      let finalSystem = systemInstruction;
      if (contextData) {
          finalSystem += `\n\n[CONTEXTO ANEXADO DO DOCUMENTO]:\n${contextData}\nUse este contexto para responder as perguntas do usuário.`;
      }

      // 3. NORMAL CHAT FLOW
      if (isGroqModel(currentModel)) {
          return await groqService.chat(currentModel, "", messages, finalSystem, groqApiKey);
      }

      // Gemini
      const historyText = messages.map(m => `${m.role === 'user' ? 'User' : 'Agent'}: ${m.text}`).join('\n');
      const prompt = `HISTÓRICO:\n${historyText}\nResponda a última mensagem.`;
      
      return await geminiImpl.generateText(currentModel, prompt, finalSystem);
  },

  // --- MAGIC MATCH (Classification) ---
  classifyAgent: async (userInput: string, agentsList: {id: string, desc: string}[]): Promise<string | null> => {
      const prompt = `
      Aja como um classificador de intenção.
      Lista de Agentes Disponíveis:
      ${agentsList.map(a => `- ID: ${a.id} (${a.desc})`).join('\n')}

      Usuário: "${userInput}"

      Tarefa: Qual o ID do agente mais indicado para resolver este pedido?
      Responda estritamente com o ID do agente (ex: 'seo-expert') e nada mais. Se nenhum servir, responda 'none'.
      `;

      try {
          // Force cheap/fast model for classification if possible, otherwise current
          let response = "";
          if (isGroqModel(currentModel)) {
               response = await groqService.generateText(currentModel, prompt, groqApiKey);
          } else {
               response = await geminiImpl.generateText('gemini-2.5-flash', prompt);
          }
          
          const cleaned = response.trim().replace(/['"]/g, '');
          return agentsList.find(a => a.id === cleaned) ? cleaned : null;
      } catch (e) {
          console.error("Classification error", e);
          return null;
      }
  },

  refineSection: async (
      persona: AgentPersona, 
      currentContext: string, 
      history: ChatMessage[]
  ): Promise<any | null> => {
      const historyText = history.map(m => `${m.role}: ${m.text}`).join('\n');
      const prompt = `Aja como ${persona}. Com base na conversa:\n${historyText}\n\nGere a NOVA VERSÃO do contexto: ${currentContext}`;
      
      // Schemas
      let schema: any = null;
      if (persona === 'pm') schema = { type: Type.OBJECT, properties: { executiveSummary: {type:Type.STRING}, productOverview: {type:Type.STRING}, functionalRequirements: {type:Type.ARRAY, items:{type:Type.STRING}}}, required:['executiveSummary'] };
      if (persona === 'market') schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type:Type.STRING}, notes: {type:Type.STRING}, link: {type:Type.STRING} } } };
      if (persona === 'ux') schema = { type: Type.OBJECT, properties: { screens: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type:Type.STRING}, description: {type:Type.STRING}, components: {type:Type.ARRAY, items:{type:Type.STRING}} } } }, flowchartSvg: {type:Type.STRING} } };
      if (persona === 'db') schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: {type:Type.STRING}, columns: {type:Type.ARRAY, items:{type:Type.OBJECT, properties:{name:{type:Type.STRING}, type:{type:Type.STRING}, description:{type:Type.STRING}}}}, relations: {type:Type.ARRAY, items:{type:Type.OBJECT, properties:{toTable:{type:Type.STRING}, type:{type:Type.STRING}}}} } } };
      if (persona === 'brand') schema = { type: Type.OBJECT, properties: { description: {type:Type.STRING}, imagePrompt: {type:Type.STRING}, palette: {type:Type.ARRAY, items:{type:Type.OBJECT, properties:{hex:{type:Type.STRING}, name:{type:Type.STRING}}}} } };

      let result: any;
      if (schema) {
          if (isGroqModel(currentModel)) {
              result = await groqService.generateJSON(currentModel, prompt, schema, groqApiKey);
          } else {
              result = await geminiImpl.generateJSON(currentModel, prompt, schema);
          }
      }

      // SANITIZATION
      if (persona === 'market') {
          if (Array.isArray(result)) return result;
          if (result && result.competitors && Array.isArray(result.competitors)) return result.competitors;
          if (result && result.data && Array.isArray(result.data)) return result.data;
      }
      
      if (persona === 'db' && result) {
           if (Array.isArray(result)) return result;
           // Handle wrapped array
           const values = Object.values(result);
           const found = values.find(v => Array.isArray(v));
           if(found) return found;
      }

      if (persona === 'ux' && result && result.screens) {
           if (!Array.isArray(result.screens)) result.screens = [];
           result.screens = result.screens.map((s:any) => ({ ...s, components: Array.isArray(s.components) ? s.components : []}));
      }

      return result;
  }
};
