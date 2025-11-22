import React from 'react';
import { Modal } from '../../Modal';
import { Button } from '../../Button';
import { StarsIcon, ChevronDownIcon, WandIcon, SettingsIcon } from '../../icons/Icons';
import type { MagicMatchModalProps } from '../types';

export const MagicMatchModal: React.FC<MagicMatchModalProps> = ({
  isOpen,
  onClose,
  onGenerateAuto,
  onOpenCreativeDirection
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Como você quer criar sua identidade visual?" maxWidth="4xl">
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                {/* 1. Piloto Automático - Otimizado para velocidade */}
                <button
                    onClick={onGenerateAuto}
                    className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-200 p-6 text-left transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <StarsIcon className="w-24 h-24 text-blue-600 rotate-12" />
                    </div>

                    <div className="relative z-10 mb-6 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:scale-110 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                        <StarsIcon className="w-7 h-7"/>
                    </div>

                    <div className="relative z-10 flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">Piloto Automático</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Deixe a IA surpreender você. Analisamos seu PRD e criamos o conceito ideal instantaneamente.
                        </p>
                    </div>

                    <div className="relative z-10 mt-6 pt-4 border-t border-gray-50 w-full">
                         <div className="flex items-center text-sm font-bold text-blue-600 opacity-60 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            Gerar Instantaneamente <ChevronDownIcon className="w-4 h-4 ml-2 rotate-[-90deg]" />
                         </div>
                    </div>
                </button>

                {/* 2. Direção Criativa - O Card "Hero" */}
                <div className="relative flex flex-col h-full bg-white rounded-2xl border-2 border-purple-500 shadow-2xl shadow-purple-500/10 p-1 transform md:scale-105 z-10">
                    <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold uppercase px-4 py-1.5 rounded-full shadow-lg tracking-widest flex items-center gap-2">
                            <StarsIcon className="w-3 h-3" /> Recomendado
                        </div>
                    </div>

                    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50/50 to-white rounded-xl p-5">
                        <div className="mb-5 flex items-center gap-4">
                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                                <WandIcon className="w-7 h-7"/>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">Direção Criativa</h4>
                                <span className="text-xs text-purple-600 font-medium">Colaborativo com IA</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">
                           Guie a IA com detalhes. Escolha estilos, cores e elementos para criar o logo perfeito.
                        </p>

                        <Button
                            size="lg"
                            className="w-full mt-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all transform active:scale-95"
                            onClick={onOpenCreativeDirection}
                        >
                            <SettingsIcon className="w-5 h-5 mr-2" />
                            Usar Editor Criativo
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    </Modal>
  );
};
