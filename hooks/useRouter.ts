/**
 * useRouter Hook - Custom Hook para Navegação
 *
 * Fornece acesso ao sistema de roteamento em componentes React
 * Sincroniza automaticamente com mudanças na URL
 */

import { useEffect, useState, useCallback } from 'react';
import { router, type RouteParams } from '../services/routerService';
import type { View } from '../types';

export interface UseRouterReturn {
  currentView: View;
  params: RouteParams;
  navigate: (view: View, params?: RouteParams) => void;
  replace: (view: View, params?: RouteParams) => void;
  back: () => void;
  forward: () => void;
  getUrl: (view: View, params?: RouteParams) => string;
}

/**
 * Hook para navegação baseada em URL
 *
 * @example
 * const { currentView, navigate, params } = useRouter();
 *
 * // Navegar para uma view
 * navigate('generate-prd');
 *
 * // Navegar com parâmetros
 * navigate('document-viewer', { documentId: 'abc123' });
 *
 * // Voltar
 * back();
 */
export const useRouter = (): UseRouterReturn => {
  const [currentView, setCurrentView] = useState<View>(() => router.getCurrentView());
  const [params, setParams] = useState<RouteParams>(() => router.getParams());

  useEffect(() => {
    // Atualiza estado quando a URL muda
    const handleRouteChange = () => {
      setCurrentView(router.getCurrentView());
      setParams(router.getParams());
    };

    // Inscreve no router
    const unsubscribe = router.subscribe(handleRouteChange);

    // Cleanup
    return unsubscribe;
  }, []);

  const navigate = useCallback((view: View, routeParams?: RouteParams) => {
    router.navigate(view, routeParams);
  }, []);

  const replace = useCallback((view: View, routeParams?: RouteParams) => {
    router.replace(view, routeParams);
  }, []);

  const back = useCallback(() => {
    router.back();
  }, []);

  const forward = useCallback(() => {
    router.forward();
  }, []);

  const getUrl = useCallback((view: View, routeParams?: RouteParams): string => {
    return router.getUrl(view, routeParams);
  }, []);

  return {
    currentView,
    params,
    navigate,
    replace,
    back,
    forward,
    getUrl,
  };
};
