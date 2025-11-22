/**
 * Logo Styles and Creative Constants
 *
 * Extracted from GeneratePrd.tsx for better organization and performance.
 * These constants define visual styles, color palettes, and typography options
 * used in the logo generation and creative direction features.
 */

import React from 'react';

// --- VISUAL STYLES DEFINITION ---
export const LOGO_STYLES = [
    {
        id: 'Minimalista',
        label: 'Minimalista',
        desc: 'Limpo e simples',
        renderVisual: () => (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-800 rounded-full"></div>
            </div>
        )
    },
    {
        id: 'Moderno',
        label: 'Moderno',
        desc: 'Geométrico e atual',
        renderVisual: () => (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-tr-xl rounded-bl-xl border border-white/50"></div>
            </div>
        )
    },
    {
        id: 'Corporativo',
        label: 'Corporativo',
        desc: 'Sóbrio e confiável',
        renderVisual: () => (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center flex-col gap-1.5">
                <div className="w-10 h-2 bg-blue-500 rounded-sm"></div>
                <div className="w-10 h-2 bg-slate-600 rounded-sm"></div>
            </div>
        )
    },
    {
        id: 'Divertido',
        label: 'Divertido',
        desc: 'Lúdico e colorido',
        renderVisual: () => (
            <div className="w-full h-full bg-yellow-50 flex items-center justify-center overflow-hidden relative">
                 <div className="absolute top-2 right-3 w-4 h-4 bg-pink-400 rounded-full animate-bounce"></div>
                 <div className="absolute bottom-3 left-3 w-6 h-6 bg-blue-400 rounded-full"></div>
                 <div className="text-2xl">🎨</div>
            </div>
        )
    },
    {
        id: 'Luxuoso',
        label: 'Luxuoso',
        desc: 'Elegante e premium',
        renderVisual: () => (
            <div className="w-full h-full bg-black flex items-center justify-center border border-amber-900/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-amber-900/20"></div>
                <div className="w-8 h-8 border-2 border-amber-400 transform rotate-45 flex items-center justify-center">
                     <div className="w-4 h-4 bg-amber-400"></div>
                </div>
            </div>
        )
    },
    {
        id: 'Futurista',
        label: 'Futurista',
        desc: 'Neon e Tech',
        renderVisual: () => (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-transparent to-transparent"></div>
                <div className="w-10 h-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                <div className="w-10 h-1 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] transform rotate-90 absolute"></div>
            </div>
        )
    },
    {
        id: 'Vintage',
        label: 'Vintage',
        desc: 'Retrô e clássico',
        renderVisual: () => (
            <div className="w-full h-full bg-[#fdf6e3] flex items-center justify-center border-4 border-double border-[#d3c6aa]">
                <span className="font-serif text-[#8d6b48] font-bold text-xl tracking-widest">A.</span>
            </div>
        )
    },
    {
        id: 'Abstrato',
        label: 'Abstrato',
        desc: 'Conceitual e artístico',
        renderVisual: () => (
            <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
                 <div className="w-12 h-12 border border-gray-900 rounded-full rounded-tr-none transform -rotate-12 flex items-center justify-center">
                     <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                 </div>
            </div>
        )
    }
];

export const COLOR_PALETTES = [
    { id: 'Vibrante', label: 'Vibrante', colors: ['#3B82F6', '#F59E0B'] },
    { id: 'Pastel', label: 'Pastel', colors: ['#FBCFE8', '#A7F3D0'] },
    { id: 'Sóbrio', label: 'Sóbrio', colors: ['#1F2937', '#9CA3AF'] },
    { id: 'Monocromático', label: 'Mono', colors: ['#4B5563', '#E5E7EB'] },
    { id: 'Quente', label: 'Quente', colors: ['#EF4444', '#FCD34D'] },
    { id: 'Frio', label: 'Frio', colors: ['#10B981', '#3B82F6'] },
    { id: 'Natureza', label: 'Natureza', colors: ['#059669', '#D97706'] },
    { id: 'Noturno', label: 'Noturno', colors: ['#111827', '#6366F1'] },
];

export const TYPOGRAPHY_OPTIONS = [
    { id: 'Sans-Serif', label: 'Sans-Serif (Moderno)', example: 'Aa' },
    { id: 'Serif', label: 'Serif (Clássico)', example: 'Aa', font: 'font-serif' },
    { id: 'Slab', label: 'Slab (Robusto)', example: 'Aa', font: 'font-mono' },
    { id: 'Script', label: 'Script (Elegante)', example: 'Aa', font: 'italic' },
    { id: 'Monospace', label: 'Tech / Code', example: '</>', font: 'font-mono' },
];

// --- CREATIVE DIRECTION OPTIONS ---
export const CREATIVE_STYLES = [
    "Minimalista", "3D", "Abstrato", "Vintage", "Futurista", "Geométrico",
    "Orgânico", "Flat", "Hand-drawn", "Luxuoso", "Tech", "Cartoon"
];

export const CREATIVE_COLORS = [
    { id: "Quente", label: "Quente", colors: ['#EF4444', '#FCD34D'] },
    { id: "Frio", label: "Frio", colors: ['#10B981', '#3B82F6'] },
    { id: "Pastel", label: "Pastel", colors: ['#FBCFE8', '#A7F3D0'] },
    { id: "Neon", label: "Neon", colors: ['#39FF14', '#FF073A'] },
    { id: "Monocromático", label: "Monocromático", colors: ['#4B5563', '#E5E7EB'] },
    { id: "Metálico", label: "Metálico", colors: ['#c0c0c0', '#ffd700'] },
    { id: "Terroso", label: "Terroso", colors: ['#a16207', '#4d7c0f'] },
    { id: "Vibrante", label: "Vibrante", colors: ['#3B82F6', '#F59E0B'] },
];
