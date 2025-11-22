
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { GeneratePrd } from './views/GeneratePrd';
import { GeneratePrompt } from './views/GeneratePrompt';
import { MyDocuments } from './views/MyDocuments';
import { IdeaCatalog } from './views/IdeaCatalog';
import { DocumentViewer } from './views/DocumentViewer';
import { Settings } from './views/Settings';
import { AgentHub } from './views/AgentHub';
import { Auth } from './views/Auth';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppContext } from './contexts/AppContext';
import { geminiService } from './services/geminiService';
import { db } from './services/databaseService';
import type { View, PRD, PromptDocument, ToastMessage, User } from './types';
import { initialIdeas } from './constants';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Model State Management
  const [currentModel, setCurrentModel] = useState<string>('gemini-2.5-flash');

  // Data State
  const [prds, setPrds] = useState<PRD[]>([]);
  const [prompts, setPrompts] = useState<PromptDocument[]>([]);

  const [ideas] = useState(initialIdeas);
  const [selectedDocument, setSelectedDocument] = useState<PRD | PromptDocument | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // 1. Check Auth Session on Mount
  useEffect(() => {
      const checkSession = async () => {
          const currentUser = await db.getCurrentUser();
          if (currentUser) {
              setUser(currentUser);
          }
          setIsAuthChecking(false);
      };
      checkSession();
  }, []);

  // 2. Load Data ONLY when User Changes (and is logged in)
  useEffect(() => {
      if (!user) {
          // Clear sensitive data on logout
          setPrds([]);
          setPrompts([]);
          return;
      }

      const loadUserData = async () => {
        setIsLoadingData(true);
        try {
            const [loadedSettings, loadedPrds, loadedPrompts] = await Promise.all([
                db.getSettings(user.id),
                db.getPrds(user.id),
                db.getPrompts(user.id)
            ]);

            // Apply Settings
            if (loadedSettings.selectedModel) {
                setCurrentModel(loadedSettings.selectedModel);
                geminiService.setModel(loadedSettings.selectedModel);
            }
            // Initialize Groq Key if present
            if (loadedSettings.groqApiKey) {
                geminiService.setGroqKey(loadedSettings.groqApiKey);
            }
            
            setPrds(loadedPrds);
            setPrompts(loadedPrompts);

        } catch (error) {
            console.error("Failed to initialize app data", error);
            showToast("Erro ao carregar dados do usuário.", "error");
        } finally {
            setIsLoadingData(false);
        }
      };

      loadUserData();
      // showToast is wrapped in useCallback with empty deps, so it's stable
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLoginSuccess = (loggedInUser: User) => {
      setUser(loggedInUser);
      showToast(`Bem-vindo, ${loggedInUser.name}!`);
  };

  const handleLogout = async () => {
      await db.logoutUser();
      setUser(null);
      setActiveView('dashboard');
  };

  // Function to update model across the app and Persist to DB
  const updateModel = useCallback((newModel: string) => {
      setCurrentModel(newModel);
      geminiService.setModel(newModel);
      // Only persist the model here. The key is persisted in the Settings component directly.
      if (user) {
          db.saveSettings(user.id, { selectedModel: newModel }).catch(err => {
              console.error("Failed to save settings", err);
              if (err.message.includes("Armazenamento cheio")) {
                  showToast("Não foi possível salvar config: Armazenamento cheio.", "error");
              }
          });
      }
  }, [user, showToast]);


  const addPrd = async (prd: PRD) => {
    if (!user) return;
    try {
        // Attach User ID
        prd.userId = user.id;
        const savedPrd = await db.createPrd(prd);
        setPrds(prev => [savedPrd, ...prev]);
        showToast('PRD salvo no banco de dados!');
        setActiveView('my-documents');
    } catch (e) {
        console.error(e);
        const message = e instanceof Error ? e.message : 'Erro ao salvar PRD.';
        showToast(message, 'error');
    }
  };

  const addPrompt = async (prompt: PromptDocument) => {
    if (!user) return;
    try {
        prompt.userId = user.id;
        const savedPrompt = await db.createPrompt(prompt);
        setPrompts(prev => [savedPrompt, ...prev]);
        showToast('Prompt salvo no banco de dados!');
        setActiveView('my-documents');
    } catch (e) {
        console.error(e);
        const message = e instanceof Error ? e.message : 'Erro ao salvar Prompt.';
        showToast(message, 'error');
    }
  };

  const deletePrd = async (id: string) => {
    if (!user) return;
    try {
        await db.deletePrd(id, user.id);
        setPrds(prev => prev.filter(p => p.id !== id));
        showToast('PRD excluído.', 'error');
        if (selectedDocument && 'ideaDescription' in selectedDocument && selectedDocument.id === id) {
            setActiveView('my-documents');
            setSelectedDocument(null);
        }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Erro ao excluir PRD.';
        showToast(message, 'error');
    }
  };

  const deletePrompt = async (id: string) => {
    if (!user) return;
    try {
        await db.deletePrompt(id, user.id);
        setPrompts(prev => prev.filter(p => p.id !== id));
        showToast('Prompt excluído.', 'error');
        if (selectedDocument && !('ideaDescription' in selectedDocument) && selectedDocument.id === id) {
            setActiveView('my-documents');
            setSelectedDocument(null);
        }
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Erro ao excluir Prompt.';
        showToast(message, 'error');
    }
  };

  const viewDocument = (doc: PRD | PromptDocument) => {
    setSelectedDocument(doc);
    setActiveView('document-viewer');
  };

  const renderView = () => {
    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Carregando dados de {user?.name}...</p>
            </div>
        );
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} prdCount={prds.length} promptCount={prompts.length} />;
      case 'generate-prd':
        return <GeneratePrd onSavePrd={addPrd} />;
      case 'generate-prompt':
        return <GeneratePrompt prds={prds} onSavePrompt={addPrompt} />;
      case 'my-documents':
        return <MyDocuments prds={prds} prompts={prompts} onDeletePrd={deletePrd} onDeletePrompt={deletePrompt} onViewDocument={viewDocument} />;
      case 'idea-catalog':
        return <IdeaCatalog ideas={ideas} />;
      case 'ai-agents':
        return <AgentHub />;
      case 'document-viewer':
        return selectedDocument ? 
            <DocumentViewer document={selectedDocument} onBack={() => setActiveView('my-documents')} /> 
            : <MyDocuments prds={prds} prompts={prompts} onDeletePrd={deletePrd} onDeletePrompt={deletePrompt} onViewDocument={viewDocument} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveView={setActiveView} prdCount={prds.length} promptCount={prompts.length} />;
    }
  };

  // Main Render Logic
  if (isAuthChecking) {
      return <div className="min-h-screen flex items-center justify-center bg-secondary"><div className="animate-pulse text-primary">Inicializando sistema...</div></div>;
  }

  if (!user) {
      return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <ErrorBoundary>
      <AppContext.Provider value={{ showToast, currentModel, updateModel, user, logout: handleLogout }}>
        <div className="flex h-screen bg-gray-100 font-sans">
          <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
              ideaCount={ideas.length}
              currentModel={currentModel}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto print:p-0 print:overflow-visible">
            {renderView()}
          </main>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
      </AppContext.Provider>
    </ErrorBoundary>
  );
};

export default App;