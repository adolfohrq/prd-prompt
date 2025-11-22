
import type { PRD, PromptDocument, AppSettings, User, ChatSession, UserAgentPrefs } from '../types';

// Simulates network delay (200ms - 500ms) to feel like a real backend
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
    USERS: 'users',
    SESSION: 'current_session_user', // Stores the ID of logged user
    PRDS: 'prds',
    PROMPTS: 'prompts',
    SETTINGS: 'app_settings', // Now an array of settings per user
    CHAT_SESSIONS: 'chat_sessions',
    AGENT_PREFS: 'agent_prefs'
};

class DatabaseService {
    
    // --- Generic Storage Helpers ---

    private getListFromStorage<T>(key: string): T[] {
        try {
            const data = localStorage.getItem(key);
            if (!data || data === "undefined" || data === "null") return [];
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error(`Error parsing list from storage key ${key}:`, error);
            // If data is corrupted, return empty to prevent app crash, but log it.
            return [];
        }
    }

    private saveToStorage(key: string, data: any) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error: any) {
            console.error(`Error saving to storage key ${key}:`, error);
            if (error.name === 'QuotaExceededError' || error.code === 22 || error.storageArea === localStorage) {
                // Throw specific error for UI to handle
                throw new Error("STORAGE_FULL");
            }
            throw new Error("STORAGE_WRITE_ERROR");
        }
    }

    private generateId(): string {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        // Fallback for older environments
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // --- AUTHENTICATION API ---

    async registerUser(name: string, email: string, password: string): Promise<User> {
        await delay(600);
        const users = this.getListFromStorage<User>(STORAGE_KEYS.USERS);
        
        const normalizedEmail = email.toLowerCase().trim();
        if (users.find(u => u.email.toLowerCase() === normalizedEmail)) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const newUser: User = {
            id: this.generateId(),
            name: name.trim(),
            email: normalizedEmail,
            password // In a real backend, this must be Hashed (bcrypt/argon2)
        };

        users.push(newUser);
        try {
            this.saveToStorage(STORAGE_KEYS.USERS, users);
        } catch (e: any) {
            if (e.message === "STORAGE_FULL") throw new Error("Memória cheia. Não foi possível registrar.");
            throw e;
        }
        
        // Auto Login
        this.saveToStorage(STORAGE_KEYS.SESSION, newUser);
        return newUser;
    }

    async loginUser(email: string, password: string): Promise<User> {
        await delay(600);
        const users = this.getListFromStorage<User>(STORAGE_KEYS.USERS);
        const normalizedEmail = email.toLowerCase().trim();
        const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);

        if (!user) {
            throw new Error("E-mail ou senha incorretos.");
        }

        this.saveToStorage(STORAGE_KEYS.SESSION, user);
        return user;
    }

    async logoutUser(): Promise<void> {
        await delay(200);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
            if (!sessionData) return null;
            
            const sessionUser = JSON.parse(sessionData) as User;
            
            // Integrity Check: Ensure the user actually exists in the main DB
            // This handles cases where users were wiped but session remained
            const users = this.getListFromStorage<User>(STORAGE_KEYS.USERS);
            const isValidUser = users.find(u => u.id === sessionUser.id);

            if (!isValidUser) {
                // Invalid session, clear it
                localStorage.removeItem(STORAGE_KEYS.SESSION);
                return null;
            }

            return isValidUser;
        } catch (e) {
            return null;
        }
    }

    // --- Settings Operations (Per User) ---

    async getSettings(userId: string): Promise<AppSettings> {
        await delay(100);
        const allSettings = this.getListFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS);
        const userSettings = allSettings.find(s => s.userId === userId);
        
        if (!userSettings) {
            return { userId, selectedModel: 'gemini-2.5-flash' };
        }
        return userSettings;
    }

    async saveSettings(userId: string, settings: Partial<AppSettings>): Promise<void> {
        await delay(100);
        let allSettings = this.getListFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS);
        const index = allSettings.findIndex(s => s.userId === userId);

        if (index >= 0) {
            allSettings[index] = { ...allSettings[index], ...settings };
        } else {
            allSettings.push({ userId, selectedModel: 'gemini-2.5-flash', ...settings });
        }
        
        this.saveToStorage(STORAGE_KEYS.SETTINGS, allSettings);
    }

    // --- PRD Operations (Segregated by User) ---

    async getPrds(userId: string): Promise<PRD[]> {
        await delay(300);
        const allPrds = this.getListFromStorage<PRD>(STORAGE_KEYS.PRDS);
        // FILTER: Only return PRDs belonging to this user
        const userPrds = allPrds.filter(p => p.userId === userId);
        
        return userPrds.map(p => ({
            ...p,
            createdAt: new Date(p.createdAt)
        })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async createPrd(prd: PRD): Promise<PRD> {
        await delay(500);
        const allPrds = this.getListFromStorage<PRD>(STORAGE_KEYS.PRDS);
        
        // Ensure ID uniqueness if passed from UI, or generate new one
        if (!prd.id) prd.id = this.generateId();

        const newPrds = [prd, ...allPrds]; // Add to global list
        
        try {
            this.saveToStorage(STORAGE_KEYS.PRDS, newPrds);
        } catch (e: any) {
            if (e.message === "STORAGE_FULL") {
                throw new Error("Armazenamento cheio! Exclua documentos antigos ou imagens para salvar novos.");
            }
            throw new Error("Erro ao salvar PRD. Tente novamente.");
        }
        return prd;
    }

    async deletePrd(id: string, userId: string): Promise<void> {
        await delay(300);
        let allPrds = this.getListFromStorage<PRD>(STORAGE_KEYS.PRDS);
        // Only delete if it matches ID AND UserID (Security)
        const initialLength = allPrds.length;
        allPrds = allPrds.filter(p => !(p.id === id && p.userId === userId));
        
        if (allPrds.length === initialLength) {
             throw new Error("Documento não encontrado ou permissão negada.");
        }

        this.saveToStorage(STORAGE_KEYS.PRDS, allPrds);
    }

    // --- Prompt Operations (Segregated by User) ---

    async getPrompts(userId: string): Promise<PromptDocument[]> {
        await delay(300);
        const allPrompts = this.getListFromStorage<PromptDocument>(STORAGE_KEYS.PROMPTS);
        const userPrompts = allPrompts.filter(p => p.userId === userId);

        return userPrompts.map(p => ({
            ...p,
            createdAt: new Date(p.createdAt)
        })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async createPrompt(prompt: PromptDocument): Promise<PromptDocument> {
        await delay(500);
        const allPrompts = this.getListFromStorage<PromptDocument>(STORAGE_KEYS.PROMPTS);
        
        if (!prompt.id) prompt.id = this.generateId();

        const newPrompts = [prompt, ...allPrompts];
        try {
            this.saveToStorage(STORAGE_KEYS.PROMPTS, newPrompts);
        } catch (e: any) {
             if (e.message === "STORAGE_FULL") {
                throw new Error("Armazenamento cheio! Não é possível salvar o prompt.");
            }
            throw e;
        }
        return prompt;
    }

    async deletePrompt(id: string, userId: string): Promise<void> {
        await delay(300);
        let allPrompts = this.getListFromStorage<PromptDocument>(STORAGE_KEYS.PROMPTS);
        allPrompts = allPrompts.filter(p => !(p.id === id && p.userId === userId));
        this.saveToStorage(STORAGE_KEYS.PROMPTS, allPrompts);
    }

    // --- Chat Session Operations (v2.0) ---

    async getChatSessions(userId: string, agentId?: string): Promise<ChatSession[]> {
        await delay(200);
        const allSessions = this.getListFromStorage<ChatSession>(STORAGE_KEYS.CHAT_SESSIONS);
        
        let userSessions = allSessions.filter(s => s.userId === userId);
        if (agentId) {
            userSessions = userSessions.filter(s => s.agentId === agentId);
        }

        return userSessions.map(s => ({
            ...s,
            lastUpdated: new Date(s.lastUpdated),
            messages: s.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
        })).sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
    }

    async saveChatSession(session: ChatSession): Promise<void> {
        // No delay for chat to feel snappy
        let allSessions = this.getListFromStorage<ChatSession>(STORAGE_KEYS.CHAT_SESSIONS);
        const index = allSessions.findIndex(s => s.id === session.id);

        if (index >= 0) {
            allSessions[index] = session;
        } else {
            allSessions.push(session);
        }

        // Update recents automatically
        await this.updateRecentAgent(session.userId, session.agentId);

        this.saveToStorage(STORAGE_KEYS.CHAT_SESSIONS, allSessions);
    }

    // --- Agent Preferences (Favorites/Recents) ---

    async getAgentPrefs(userId: string): Promise<UserAgentPrefs> {
        await delay(100);
        const allPrefs = this.getListFromStorage<UserAgentPrefs>(STORAGE_KEYS.AGENT_PREFS);
        const userPrefs = allPrefs.find(p => p.userId === userId);
        return userPrefs || { userId, favorites: [], recents: [] };
    }

    async toggleFavoriteAgent(userId: string, agentId: string): Promise<void> {
        await delay(100);
        let allPrefs = this.getListFromStorage<UserAgentPrefs>(STORAGE_KEYS.AGENT_PREFS);
        let userPrefs = allPrefs.find(p => p.userId === userId);

        if (!userPrefs) {
            userPrefs = { userId, favorites: [agentId], recents: [] };
            allPrefs.push(userPrefs);
        } else {
            if (userPrefs.favorites.includes(agentId)) {
                userPrefs.favorites = userPrefs.favorites.filter(id => id !== agentId);
            } else {
                userPrefs.favorites.push(agentId);
            }
        }
        this.saveToStorage(STORAGE_KEYS.AGENT_PREFS, allPrefs);
    }

    private async updateRecentAgent(userId: string, agentId: string): Promise<void> {
        let allPrefs = this.getListFromStorage<UserAgentPrefs>(STORAGE_KEYS.AGENT_PREFS);
        let userPrefs = allPrefs.find(p => p.userId === userId);

        if (!userPrefs) {
            userPrefs = { userId, favorites: [], recents: [agentId] };
            allPrefs.push(userPrefs);
        } else {
            // Remove if exists, add to top
            userPrefs.recents = [agentId, ...userPrefs.recents.filter(id => id !== agentId)].slice(0, 5); // Keep top 5
        }
        this.saveToStorage(STORAGE_KEYS.AGENT_PREFS, allPrefs);
    }

    // --- Admin / Maintenance ---
    
    async clearDatabase(): Promise<void> {
        await delay(800);
        localStorage.removeItem(STORAGE_KEYS.PRDS);
        localStorage.removeItem(STORAGE_KEYS.PROMPTS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.CHAT_SESSIONS);
        localStorage.removeItem(STORAGE_KEYS.AGENT_PREFS);
        // Optional: Keep users? For this "Reset" feature, we usually clear everything.
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
}

export const db = new DatabaseService();