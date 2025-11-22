import type { PRD, PromptDocument, AppSettings, User, ChatSession, UserAgentPrefs } from '../types';
import { supabase } from './supabaseClient';

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
    
    // Verifica se o Supabase está configurado
    private hasSupabase = !!supabase && !!import.meta.env.VITE_SUPABASE_URL;

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
        if (this.hasSupabase) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, avatar_url: '' }
                }
            });

            if (error) throw new Error(error.message);
            if (!data.user) throw new Error("Erro ao criar usuário.");

            const newUser: User = {
                id: data.user.id,
                name: name,
                email: email,
                role: 'user'
            };
            
            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(newUser));
            return newUser;
        }

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
            password, // In a real backend, this must be Hashed (bcrypt/argon2)
            role: 'user'
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
        if (this.hasSupabase) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw new Error("E-mail ou senha incorretos.");
            
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            const user: User = {
                id: data.user.id,
                email: data.user.email!,
                name: profile?.name || email.split('@')[0],
                role: profile?.role as 'user' | 'admin',
                avatar: profile?.avatar_url
            };

            localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
            return user;
        }

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
        if (this.hasSupabase) {
            await supabase.auth.signOut();
        }
        await delay(200);
        localStorage.removeItem(STORAGE_KEYS.SESSION);
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const sessionData = localStorage.getItem(STORAGE_KEYS.SESSION);
            if (!sessionData) return null;
            
            let sessionUser = JSON.parse(sessionData) as User;

            if (this.hasSupabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    localStorage.removeItem(STORAGE_KEYS.SESSION);
                    return null;
                }

                // Busca perfil fresco para garantir roles atualizadas
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, name, avatar_url')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) {
                    // Atualiza objeto user e cache local se houver mudança
                    if (profile.role !== sessionUser.role || profile.name !== sessionUser.name) {
                        sessionUser = { 
                            ...sessionUser, 
                            role: profile.role as 'user' | 'admin',
                            name: profile.name || sessionUser.name,
                            avatar: profile.avatar_url || sessionUser.avatar
                        };
                        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
                    }
                }

                return sessionUser;
            }
            
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
        // Settings ainda no LocalStorage por enquanto para não complicar o schema
        // mas idealmente iria para tabela profiles ou settings
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
        if (this.hasSupabase) {
            const { data, error } = await supabase
                .from('prds')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error(error);
                return [];
            }

            return data.map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                title: p.title,
                content: p.content,
                status: p.status,
                createdAt: new Date(p.created_at),
                // Campos de compatibilidade (se não existirem no JSONB, usa defaults)
                ideaDescription: p.content.ideaDescription || '', 
                industry: p.content.industry || [], 
                targetAudience: p.content.targetAudience || '', 
                complexity: p.content.complexity || 'Média'
            } as PRD));
        }

        await delay(300);
        const allPrds = this.getListFromStorage<PRD>(STORAGE_KEYS.PRDS);
        // FILTER: Only return PRDs belonging to this user
        const userPrds = allPrds.filter(p => p.userId === userId);
        
        return userPrds.map(p => ({
            ...p,
            createdAt: new Date(p.createdAt)
        })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async getPrdById(id: string, userId: string): Promise<PRD | null> {
        if (this.hasSupabase) {
            const { data, error } = await supabase
                .from('prds')
                .select('*')
                .eq('id', id)
                .eq('user_id', userId)
                .single();
            
            if (error || !data) return null;

            return {
                id: data.id,
                userId: data.user_id,
                title: data.title,
                content: data.content,
                status: data.status,
                createdAt: new Date(data.created_at),
                ideaDescription: data.content.ideaDescription || '',
                industry: data.content.industry || [],
                targetAudience: data.content.targetAudience || '',
                complexity: data.content.complexity || 'Média'
            } as PRD;
        }

        await delay(200);
        const allPrds = this.getListFromStorage<PRD>(STORAGE_KEYS.PRDS);
        const prd = allPrds.find(p => p.id === id && p.userId === userId);
        if (!prd) return null;
        return { ...prd, createdAt: new Date(prd.createdAt) };
    }

    async createPrd(prd: PRD): Promise<PRD> {
        if (this.hasSupabase) {
             // Remove ID temporário se existir para deixar o banco gerar
             // A menos que seja update, mas aqui é createPrd.
             // O ideal seria ter updatePrd separado, mas se o ID já vier, tentamos upsert ou insert
             
             // Vamos simplificar: Se tem ID e parece UUID válido, ok. Se for gerado localmente (não-UUID ou novo), deixamos o banco gerar.
             
             const { data, error } = await supabase
                .from('prds')
                .insert({
                    user_id: prd.userId,
                    title: prd.title,
                    content: prd.content, // Salva todo o objeto content + campos raiz que colocamos no content
                    status: prd.status
                })
                .select()
                .single();

            if (error) throw new Error("Erro ao salvar no Supabase: " + error.message);
            
            return {
                ...prd,
                id: data.id,
                createdAt: new Date(data.created_at)
            };
        }

        await delay(500);
        let allPrds = this.getListFromStorage<PRD>(STORAGE_KEYS.PRDS);
        
        if (!prd.id) prd.id = this.generateId();

        const existingIndex = allPrds.findIndex(p => p.id === prd.id);

        if (existingIndex >= 0) {
            // Update existing PRD (for drafts)
            allPrds[existingIndex] = { ...allPrds[existingIndex], ...prd };
        } else {
            // Add new PRD
            allPrds.unshift(prd);
        }
        
        try {
            this.saveToStorage(STORAGE_KEYS.PRDS, allPrds);
        } catch (e: any) {
            if (e.message === "STORAGE_FULL") {
                throw new Error("Armazenamento cheio! Exclua documentos antigos ou imagens para salvar novos.");
            }
            throw new Error("Erro ao salvar PRD. Tente novamente.");
        }
        return prd;
    }

    async deletePrd(id: string, userId: string): Promise<void> {
        if (this.hasSupabase) {
            const { error } = await supabase
                .from('prds')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);
            
            if (error) throw new Error(error.message);
            return;
        }

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
        if (this.hasSupabase) {
            const { data, error } = await supabase
                .from('prompts')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) return [];

            return data.map((p: any) => ({
                id: p.id,
                userId: p.user_id,
                prdId: p.prd_id || '',
                prdTitle: p.prd_title || '',
                content: p.content,
                type: p.meta?.type || 'Aplicativo',
                targetPlatform: p.meta?.targetPlatform || 'Generic',
                stack: p.meta?.stack || '',
                framework: p.meta?.framework || '',
                specialRequirements: p.meta?.specialRequirements || '',
                createdAt: new Date(p.created_at)
            } as PromptDocument));
        }

        await delay(300);
        const allPrompts = this.getListFromStorage<PromptDocument>(STORAGE_KEYS.PROMPTS);
        const userPrompts = allPrompts.filter(p => p.userId === userId);

        return userPrompts.map(p => ({
            ...p,
            createdAt: new Date(p.createdAt)
        })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async createPrompt(prompt: PromptDocument): Promise<PromptDocument> {
        if (this.hasSupabase) {
             const { data, error } = await supabase
                .from('prompts')
                .insert({
                    user_id: prompt.userId,
                    prd_id: prompt.prdId || null,
                    prd_title: prompt.prdTitle,
                    content: prompt.content,
                    meta: {
                        type: prompt.type,
                        targetPlatform: prompt.targetPlatform,
                        stack: prompt.stack,
                        framework: prompt.framework,
                        specialRequirements: prompt.specialRequirements
                    }
                })
                .select()
                .single();

            if (error) throw new Error("Erro ao salvar prompt: " + error.message);

            return {
                ...prompt,
                id: data.id,
                createdAt: new Date(data.created_at)
            };
        }

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
        if (this.hasSupabase) {
            const { error } = await supabase
                .from('prompts')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);
            if (error) throw new Error(error.message);
            return;
        }

        await delay(300);
        let allPrompts = this.getListFromStorage<PromptDocument>(STORAGE_KEYS.PROMPTS);
        allPrompts = allPrompts.filter(p => !(p.id === id && p.userId === userId));
        this.saveToStorage(STORAGE_KEYS.PROMPTS, allPrompts);
    }

    // --- Chat Session Operations (v2.0) ---

    async getChatSessions(userId: string, agentId?: string): Promise<ChatSession[]> {
        // Chat ainda local por performance/custo no MVP
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

    // --- Admin Operations ---

    async getAllUsers(): Promise<User[]> {
        if (this.hasSupabase) {
            // Admin Policy permite ler todos os profiles
            const { data, error } = await supabase.from('profiles').select('*');
            if (error) return [];
            return data.map((p: any) => ({
                id: p.id,
                email: p.email,
                name: p.name,
                role: p.role,
                avatar: p.avatar_url
            }));
        }

        await delay(300);
        return this.getListFromStorage<User>(STORAGE_KEYS.USERS);
    }

    async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
        if (this.hasSupabase) {
            const { error } = await supabase
                .from('profiles')
                .update({ role })
                .eq('id', userId);
            if (error) throw new Error(error.message);
            
            // Se for o próprio usuário, atualiza sessão local
            const sessionUser = await this.getCurrentUser();
            if (sessionUser && sessionUser.id === userId) {
                sessionUser.role = role;
                localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
            }
            return;
        }

        await delay(300);
        const users = this.getListFromStorage<User>(STORAGE_KEYS.USERS);
        const index = users.findIndex(u => u.id === userId);
        
        if (index === -1) {
            throw new Error("Usuário não encontrado.");
        }

        users[index].role = role;
        
        // Se for o usuário logado, atualiza a sessão também
        const sessionUser = await this.getCurrentUser();
        if (sessionUser && sessionUser.id === userId) {
            const updatedUser = { ...sessionUser, role };
            this.saveToStorage(STORAGE_KEYS.SESSION, updatedUser);
        }

        this.saveToStorage(STORAGE_KEYS.USERS, users);
    }

    async getSystemStats(): Promise<{
        users: number;
        prds: number;
        prompts: number;
        storageUsage: string;
    }> {
        if (this.hasSupabase) {
            const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: prds } = await supabase.from('prds').select('*', { count: 'exact', head: true });
            const { count: prompts } = await supabase.from('prompts').select('*', { count: 'exact', head: true });
            
            return {
                users: users || 0,
                prds: prds || 0,
                prompts: prompts || 0,
                storageUsage: "Cloud (Unlimited)"
            };
        }

        await delay(500);
        const users = this.getListFromStorage(STORAGE_KEYS.USERS).length;
        const prds = this.getListFromStorage(STORAGE_KEYS.PRDS).length;
        const prompts = this.getListFromStorage(STORAGE_KEYS.PROMPTS).length;
        
        // Calcula uso aproximado do LocalStorage
        let totalBytes = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalBytes += (localStorage[key].length + key.length) * 2;
            }
        }
        
        const storageUsage = totalBytes > 1024 * 1024 
            ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB` 
            : `${(totalBytes / 1024).toFixed(2)} KB`;

        return { users, prds, prompts, storageUsage };
    }

    // --- Admin / Maintenance ---

    async clearDatabase(): Promise<void> {
        if (this.hasSupabase) {
            // Perigoso: Limpar tabelas reais
            // Requer policy especial ou ser feito via dashboard
            throw new Error("Limpeza de banco via app desabilitada no modo Cloud por segurança.");
        }

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

    // --- Activity Logs ---

    async getActivityLogs(): Promise<any[]> {
        // Mock implementation - retorna logs vazios por enquanto
        // Em produção, isso viria do backend ou seria armazenado
        await delay(200);
        const logs = localStorage.getItem('activity_logs');
        if (!logs) return [];
        try {
            return JSON.parse(logs);
        } catch {
            return [];
        }
    }

    async logActivity(params: {
        action: string;
        target?: string;
        severity: 'info' | 'warning' | 'error';
        details?: string;
    }): Promise<void> {
        const currentUser = await this.getCurrentUser();
        if (!currentUser) return;

        const log = {
            id: this.generateId(),
            userId: currentUser.id,
            userName: currentUser.name,
            action: params.action,
            target: params.target,
            timestamp: new Date(),
            details: params.details,
            severity: params.severity,
        };

        const logs = await this.getActivityLogs();
        logs.unshift(log);

        // Mantém apenas últimos 500 logs
        const trimmedLogs = logs.slice(0, 500);
        localStorage.setItem('activity_logs', JSON.stringify(trimmedLogs));
    }

    // --- Export / Import ---

    async exportAllData(): Promise<any> {
        await delay(500);
        return {
            users: this.getListFromStorage(STORAGE_KEYS.USERS),
            prds: this.getListFromStorage(STORAGE_KEYS.PRDS),
            prompts: this.getListFromStorage(STORAGE_KEYS.PROMPTS),
            settings: this.getListFromStorage(STORAGE_KEYS.SETTINGS),
            chatSessions: this.getListFromStorage(STORAGE_KEYS.CHAT_SESSIONS),
            agentPrefs: this.getListFromStorage(STORAGE_KEYS.AGENT_PREFS),
            activityLogs: await this.getActivityLogs(),
            exportDate: new Date().toISOString(),
            version: '1.0.0',
        };
    }

    // --- User Management (Extended) ---

    async deleteUser(userId: string): Promise<void> {
        if (this.hasSupabase) {
            // No Supabase, usar RPC ou function específica
            throw new Error("Deletar usuário via app não implementado no modo Cloud.");
        }

        await delay(300);
        const users = this.getListFromStorage<any>(STORAGE_KEYS.USERS);
        const filteredUsers = users.filter((u: any) => u.id !== userId);

        if (filteredUsers.length === users.length) {
            throw new Error("Usuário não encontrado.");
        }

        this.saveToStorage(STORAGE_KEYS.USERS, filteredUsers);

        // Remove dados do usuário
        let prds = this.getListFromStorage<any>(STORAGE_KEYS.PRDS);
        prds = prds.filter((p: any) => p.userId !== userId);
        this.saveToStorage(STORAGE_KEYS.PRDS, prds);

        let prompts = this.getListFromStorage<any>(STORAGE_KEYS.PROMPTS);
        prompts = prompts.filter((p: any) => p.userId !== userId);
        this.saveToStorage(STORAGE_KEYS.PROMPTS, prompts);
    }

    async resetUserPassword(userId: string): Promise<void> {
        if (this.hasSupabase) {
            // Usar Supabase Auth Reset
            throw new Error("Reset de senha via app não implementado no modo Cloud.");
        }

        await delay(300);
        // Mock implementation - em produção, enviaria email
        const users = this.getListFromStorage<any>(STORAGE_KEYS.USERS);
        const user = users.find((u: any) => u.id === userId);

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        // Gera senha temporária
        user.password = 'temp123456';
        this.saveToStorage(STORAGE_KEYS.USERS, users);
    }
}

export const db = new DatabaseService();
