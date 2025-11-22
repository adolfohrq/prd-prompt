
import type { ChatMessage } from '../types';

// Generic interface for the AI response
interface GroqCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

export const groqService = {
  // Helper to strip DeepSeek's <think> tags which can break JSON parsing
  cleanResponse(text: string): string {
      return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  },

  async generateText(model: string, prompt: string, apiKey: string, systemInstruction?: string): Promise<string> {
    if (!apiKey) throw new Error("Chave da API Groq não configurada. Vá em Configurações.");

    const messages = [];
    if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
    }
    messages.push({ role: "user", content: prompt });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: messages,
        model: model,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Groq API Error: ${response.statusText}`);
    }

    const data: GroqCompletionResponse = await response.json();
    const content = data.choices[0]?.message?.content || "";
    
    // Remove thinking process from final text output for user clarity
    return this.cleanResponse(content);
  },

  async generateJSON<T>(model: string, prompt: string, schema: any, apiKey: string): Promise<T | null> {
    if (!apiKey) throw new Error("Chave da API Groq não configurada.");

    // Groq handles JSON mode, but we must enforce the schema via Prompt Engineering
    // since it doesn't support strict schema objects like Gemini SDK yet in the same way.
    const jsonPrompt = `
    ${prompt}
    
    IMPORTANT: Output strictly in valid JSON format.
    Ensure the JSON matches this structure description:
    ${JSON.stringify(schema, null, 2)}
    
    Do not output markdown code blocks (like \`\`\`json). Just the raw JSON string.
    `;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful assistant that speaks only JSON." },
            { role: "user", content: jsonPrompt }
          ],
          model: model,
          temperature: 0.2, // Low temp for consistent JSON
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error("Groq API failed");

      const data: GroqCompletionResponse = await response.json();
      let content = data.choices[0]?.message?.content || "{}";
      
      // 1. Remove DeepSeek Thinking tags FIRST
      content = this.cleanResponse(content);

      // 2. Clean up markdown blocks
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // 3. Heuristic: If content doesn't start with { or [, try to find them
      if (!content.startsWith('{') && !content.startsWith('[')) {
          const match = content.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
          if (match) {
              content = match[0];
          }
      }
      
      return JSON.parse(content) as T;
    } catch (e) {
      console.error("Groq JSON Generation Error:", e);
      return null;
    }
  },

  async chat(model: string, context: string, history: ChatMessage[], systemInstruction: string, apiKey: string): Promise<string> {
    if (!apiKey) throw new Error("Chave da API Groq não configurada.");

    // Convert App ChatMessage to Groq/OpenAI format
    const messages = [
        { role: "system", content: systemInstruction + `\n\nCONTEXTO ATUAL:\n${context}` },
        ...history.map(m => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.text
        }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: messages,
            model: model,
            temperature: 0.7
        })
    });

    if (!response.ok) throw new Error("Groq API Chat Error");

    const data: GroqCompletionResponse = await response.json();
    const content = data.choices[0]?.message?.content || "";

    // For chat, we remove the thinking process to keep the UI clean
    return this.cleanResponse(content);
  }
};
