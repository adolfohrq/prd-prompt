/**
 * Router Service - URL-based Navigation System
 *
 * Gerencia roteamento baseado em slugs na URL usando History API
 * Mantém sincronização entre estado da aplicação e URL do navegador
 */

import type { View } from '../types';

// Mapeamento bidirecional: View <-> Slug
export const ROUTES = {
  'dashboard': '/dashboard',
  'generate-prd': '/criar-prd',
  'generate-prompt': '/criar-prompt',
  'my-documents': '/meus-documentos',
  'idea-catalog': '/catalogo-ideias',
  'ai-agents': '/agentes-ia',
  'document-viewer': '/documento',
  'settings': '/configuracoes',
  'admin': '/admin',
} as const;

// Reverse mapping: Slug -> View
const SLUG_TO_VIEW: Record<string, View> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/criar-prd': 'generate-prd',
  '/criar-prompt': 'generate-prompt',
  '/meus-documentos': 'my-documents',
  '/catalogo-ideias': 'idea-catalog',
  '/agentes-ia': 'ai-agents',
  '/documento': 'document-viewer',
  '/configuracoes': 'settings',
  '/admin': 'admin',
};

export type RouteParams = {
  documentId?: string;
  action?: string;
};

export class RouterService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Escuta mudanças no histórico (botões voltar/avançar)
    window.addEventListener('popstate', () => {
      this.notifyListeners();
    });
  }

  /**
   * Obtém a view atual baseada na URL
   */
  getCurrentView(): View {
    const pathname = window.location.pathname;

    // Tenta match direto
    if (SLUG_TO_VIEW[pathname]) {
      return SLUG_TO_VIEW[pathname];
    }

    // Trata rotas dinâmicas (ex: /documento/abc123)
    if (pathname.startsWith('/documento/')) {
      return 'document-viewer';
    }

    // Fallback para dashboard
    return 'dashboard';
  }

  /**
   * Obtém parâmetros da URL (ex: ID do documento)
   */
  getParams(): RouteParams {
    const pathname = window.location.pathname;
    const params: RouteParams = {};

    // Extrai ID do documento se presente
    const docMatch = pathname.match(/^\/documento\/([a-zA-Z0-9-]+)/);
    if (docMatch) {
      params.documentId = docMatch[1];
    }

    // Extrai action dos query params se presente
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    if (action) {
      params.action = action;
    }

    return params;
  }

  /**
   * Navega para uma view específica
   */
  navigate(view: View, params?: RouteParams): void {
    let path = ROUTES[view] || '/';

    // Adiciona parâmetros dinâmicos à URL
    if (params?.documentId && view === 'document-viewer') {
      path = `/documento/${params.documentId}`;
    }

    // Adiciona query params se necessário
    if (params?.action) {
      path += `?action=${params.action}`;
    }

    // Atualiza URL sem recarregar a página
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      this.notifyListeners();
    }
  }

  /**
   * Substitui a entrada atual do histórico (não adiciona nova entrada)
   */
  replace(view: View, params?: RouteParams): void {
    let path = ROUTES[view] || '/';

    if (params?.documentId && view === 'document-viewer') {
      path = `/documento/${params.documentId}`;
    }

    if (params?.action) {
      path += `?action=${params.action}`;
    }

    if (window.location.pathname !== path) {
      window.history.replaceState(null, '', path);
      this.notifyListeners();
    }
  }

  /**
   * Volta para a página anterior
   */
  back(): void {
    window.history.back();
  }

  /**
   * Avança para a próxima página
   */
  forward(): void {
    window.history.forward();
  }

  /**
   * Registra um listener para mudanças de rota
   */
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback);

    // Retorna função de cleanup
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notifica todos os listeners sobre mudança de rota
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  /**
   * Obtém o slug atual da URL
   */
  getCurrentSlug(): string {
    return window.location.pathname;
  }

  /**
   * Gera URL completa para uma view
   */
  getUrl(view: View, params?: RouteParams): string {
    let path = ROUTES[view] || '/';

    if (params?.documentId && view === 'document-viewer') {
      path = `/documento/${params.documentId}`;
    }

    if (params?.action) {
      path += `?action=${params.action}`;
    }

    return path;
  }
}

// Singleton instance
export const router = new RouterService();
