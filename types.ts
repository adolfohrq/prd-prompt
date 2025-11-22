
export type View = 'dashboard' | 'generate-prd' | 'generate-prompt' | 'my-documents' | 'idea-catalog' | 'document-viewer' | 'settings' | 'ai-agents';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In a real app, never store plain text. Here it's a simulation.
  avatar?: string;
}

export interface AppSettings {
  userId: string; // Settings are now per user
  selectedModel: string;
  groqApiKey?: string; // Support for Groq/Llama
  theme?: 'light' | 'dark'; 
}

export interface PRD {
  id: string;
  userId: string; // Foreign Key
  title: string;
  ideaDescription: string;
  industry: string[];
  targetAudience: string;
  complexity: 'Baixa' | 'Média' | 'Alta';
  createdAt: Date;
  status: 'draft' | 'completed';
  content: {
    executiveSummary?: string;
    productOverview?: string;
    functionalRequirements?: string[];
    nonFunctionalRequirements?: string[];
    userPersonas?: string;
    competitors?: Competitor[];
    uiPlan?: {
        flowchartSvg: string;
        screens: UIScreen[];
    };
    // Legacy support
    uiFlowchartSvg?: string; 
    dbSchema?: DBTable[];
    dbSql?: string; 
    dbPrisma?: string; 
    dbDiagramSvg?: string;
    logoSuggestion?: LogoSuggestion;
  };
}

export interface UIScreen {
    name: string;
    description: string;
    components: string[];
}

export interface CompetitorDetails {
    overview: string;
    whatTheyDo: string;
    keyFeatures: string[];
    strengths: string[];
    weaknesses: string[];
    strategicInsight: string;
    marketStats: {
        popularity: string;
        userBase?: string;
        presence?: string;
    };
    pricingModel: string;
}

export interface Competitor {
  name: string;
  notes: string;
  link: string;
  details?: CompetitorDetails;
}

export interface DBTable {
    name: string;
    columns: {
        name: string;
        type: string;
        description: string;
    }[];
    relations: {
        toTable: string;
        type: string;
    }[];
}

export interface LogoSuggestion {
  description: string;
  base64Image: string; 
  imagePrompt: string; 
  palette: { hex: string, name: string }[];
  svgCode?: string; 
}


export interface PromptDocument {
  id: string;
  userId: string; // Foreign Key
  prdId: string;
  prdTitle: string;
  
  // Configuration Metadata
  type: 'Aplicativo' | 'Landing Page' | 'Script/Tool';
  targetPlatform: 'Generic' | 'Bolt.new' | 'Cursor' | 'ChatGPT' | 'v0.dev';
  stack: string;
  framework: string;
  
  // Content
  specialRequirements: string;
  content: string; // The actual generated markdown
  
  createdAt: Date;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface IdeaAnalysis {
  quality: 'Baixa' | 'Média' | 'Alta';
  complexity: 'Baixa' | 'Média' | 'Alta';
  feedback: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

// --- Chat Types ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  image?: string; // Base64 image attached to message
}

export type AgentPersona = 'pm' | 'market' | 'ux' | 'db' | 'brand';

// --- Specialist Agents (New Feature) ---
export interface SpecialistAgent {
    id: string;
    name: string;
    role: string;
    category: 'Marketing' | 'Dev' | 'Design' | 'Data' | 'Product' | 'Content';
    shortDescription: string;
    fullDescription: {
        whatIDo: string[];
        whatIDontDo: string[];
        howIWork: string[];
    };
    systemInstruction: string;
    initialMessage: string;
}

// --- Chat Persistence & Prefs (v2.0) ---

export interface ChatSession {
  id: string;
  userId: string;
  agentId: string;
  title: string; 
  messages: ChatMessage[];
  lastUpdated: Date;
  attachedContextId?: string; // ID of attached PRD
}

export interface UserAgentPrefs {
  userId: string;
  favorites: string[]; // Agent IDs
  recents: string[];   // Agent IDs
}