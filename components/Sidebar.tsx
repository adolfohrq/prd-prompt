
import React, { useContext } from 'react';
import type { View } from '../../types';
import { DashboardIcon, GeneratePrdIcon, GeneratePromptIcon, IdeaCatalogIcon, MyDocumentsIcon, LogoIcon, SettingsIcon, UserGroupIcon } from './icons/Icons';
import { AppContext } from '../contexts/AppContext';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  ideaCount: number;
  currentModel?: string;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {label}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, ideaCount, currentModel = 'gemini-2.5-flash' }) => {
  const appContext = useContext(AppContext);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4 shrink-0">
      <div className="flex items-center mb-8 px-2">
        <LogoIcon className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold text-gray-800">PRD-Prompt.ai</span>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
          icon={<DashboardIcon className="h-5 w-5" />}
          label="Dashboard"
          isActive={activeView === 'dashboard'}
          onClick={() => setActiveView('dashboard')}
        />
        <NavItem
          icon={<GeneratePrdIcon className="h-5 w-5" />}
          label="Gerar PRD"
          isActive={activeView === 'generate-prd'}
          onClick={() => setActiveView('generate-prd')}
        />
        <NavItem
          icon={<GeneratePromptIcon className="h-5 w-5" />}
          label="Gerar Prompt"
          isActive={activeView === 'generate-prompt'}
          onClick={() => setActiveView('generate-prompt')}
        />
         <NavItem
          icon={<MyDocumentsIcon className="h-5 w-5" />}
          label="Meus Documentos"
          isActive={activeView === 'my-documents' || activeView === 'document-viewer'}
          onClick={() => setActiveView('my-documents')}
        />
        
        <div className="pt-2 mt-2 border-t border-gray-100">
            <NavItem 
                icon={<UserGroupIcon className="h-5 w-5" />}
                label="Agentes de IA"
                isActive={activeView === 'ai-agents'}
                onClick={() => setActiveView('ai-agents')}
            />
        </div>

        <div className="pt-2 mt-2 border-t border-gray-200">
             <NavItem
                icon={<SettingsIcon className="h-5 w-5" />}
                label="Configurações"
                isActive={activeView === 'settings'}
                onClick={() => setActiveView('settings')}
            />
        </div>
      </nav>
      <div className="mt-auto space-y-4">
         <NavItem
          icon={<IdeaCatalogIcon className="h-5 w-5" />}
          label="Catálogo de Ideias"
          isActive={activeView === 'idea-catalog'}
          onClick={() => setActiveView('idea-catalog')}
        />
        <div className="text-xs text-center text-gray-500 bg-gray-100 p-2 rounded-md">
            {ideaCount} ideias cadastradas
        </div>

        {/* User & Model Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col gap-3">
            {/* Model Status */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Modelo</span>
                 <div className="flex items-center">
                    <span className="relative flex h-1.5 w-1.5 mr-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-semibold text-gray-700 truncate max-w-[80px]" title={currentModel}>
                        {currentModel.replace('gemini-', '').split('-')[0]}
                    </span>
                </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center justify-between">
                 <div className="flex items-center overflow-hidden">
                    <div className="h-7 w-7 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs mr-2 shrink-0">
                        {appContext?.user?.name.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-gray-800 truncate">{appContext?.user?.name}</span>
                        <span className="text-[10px] text-gray-500 truncate">{appContext?.user?.email}</span>
                    </div>
                 </div>
            </div>
            <button 
                onClick={appContext?.logout}
                className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline text-left mt-1"
            >
                Sair
            </button>
        </div>
      </div>
    </aside>
  );
};