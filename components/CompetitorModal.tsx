
import React from 'react';
import { Modal } from './Modal';
import { Competitor } from '../../types';
import { CheckIcon, XIcon, GlobeIcon, InfoIcon, BulbIcon, TrendingUpIcon, UsersIcon, TagIcon, ExternalLinkIcon } from './icons/Icons';

interface CompetitorModalProps {
  competitor: Competitor | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export const CompetitorModal: React.FC<CompetitorModalProps> = ({ competitor, isOpen, onClose, isLoading }) => {
  if (!isOpen) return null;

  const details = competitor?.details;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
        {/* Custom Header Area */}
        <div className="relative overflow-hidden rounded-t-xl">
             <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h2 className="text-3xl font-extrabold tracking-tight text-white">
                                {competitor?.name || 'Analisando...'}
                            </h2>
                            {details && (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm">
                                    Analisado
                                </span>
                            )}
                        </div>
                         <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                             {details ? details.whatTheyDo : 'Carregando informações detalhadas sobre o modelo de negócio e posicionamento...'}
                         </p>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2.5 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Fechar
                        </button>
                        {competitor?.link && (
                            <a 
                                href={competitor.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all shadow-lg hover:shadow-primary/20 font-semibold text-sm gap-2 transform hover:-translate-y-0.5"
                            >
                                <GlobeIcon className="w-4 h-4" /> Website Oficial
                            </a>
                        )}
                    </div>
                </div>
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
             </div>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 min-h-[400px] bg-gray-50/50">
                <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75"></div>
                    <div className="relative bg-white p-6 rounded-full shadow-md border border-gray-100">
                        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Investigando o Mercado</h3>
                <p className="text-gray-500 mt-2 animate-pulse">A IA está analisando estratégias, preços e tráfego...</p>
            </div>
        ) : details ? (
            <div className="p-8 bg-gray-50/30 space-y-8">
                
                {/* 1. VISÃO GERAL DO MERCADO */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                            <InfoIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                            Visão Geral do Mercado
                        </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-base">
                        {details.overview}
                    </p>
                </section>

                {/* 2. PONTOS FORTES / FRACOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden flex flex-col h-full">
                        <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-3">
                            <div className="p-1.5 bg-green-100 rounded-md text-green-700 shadow-sm">
                                <CheckIcon className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-green-900 uppercase tracking-wide">Pontos Fortes</h4>
                        </div>
                        <div className="p-6 flex-grow">
                            <ul className="space-y-4">
                                {details.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                        <span className="text-sm text-gray-700 leading-relaxed">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Weaknesses */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden flex flex-col h-full">
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
                            <div className="p-1.5 bg-red-100 rounded-md text-red-700 shadow-sm">
                                <XIcon className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide">Pontos Fracos</h4>
                        </div>
                        <div className="p-6 flex-grow">
                            <ul className="space-y-4">
                                {details.weaknesses.map((s, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="block w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                        <span className="text-sm text-gray-700 leading-relaxed">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>

                {/* 3. DADOS DE MERCADO (Full Column Grid) */}
                <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">
                        Métricas e Dados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Popularity */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 shrink-0">
                                <TrendingUpIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Popularidade</p>
                                <p className="text-gray-900 font-bold text-sm md:text-base leading-tight">{details.marketStats.popularity}</p>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Preço / Modelo</p>
                                <p className="text-gray-900 font-bold text-sm md:text-base leading-tight">{details.pricingModel}</p>
                            </div>
                        </div>

                        {/* Presence */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                                <GlobeIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Presença Global</p>
                                <p className="text-gray-900 font-bold text-sm md:text-base leading-tight">{details.marketStats.presence || 'Global'}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. FUNCIONALIDADES CHAVE */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                             <TagIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                            Funcionalidades Chave
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {details.keyFeatures.map((feat, i) => (
                            <div key={i} className="px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-white hover:shadow-sm hover:border-indigo-200 transition-all cursor-default">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                                {feat}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. INSIGHT ESTRATÉGICO */}
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-8 shadow-sm overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-orange-300/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/80 backdrop-blur rounded-lg text-amber-600 shadow-sm border border-amber-100">
                                <BulbIcon className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Insight Estratégico da IA</h4>
                        </div>
                        <p className="text-xl text-gray-800 font-serif italic leading-relaxed pl-2 border-l-4 border-amber-300">
                            "{details.strategicInsight}"
                        </p>
                    </div>
                </div>

            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 text-red-500">
                <XIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium text-lg">Detalhes indisponíveis.</p>
                <button onClick={onClose} className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-800 underline transition-colors">
                    Fechar Janela
                </button>
            </div>
        )}
    </Modal>
  );
};
