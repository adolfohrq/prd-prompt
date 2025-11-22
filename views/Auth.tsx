
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LogoIcon } from '../components/icons/Icons';
import { db } from '../services/databaseService';
import type { User } from '../types';

interface AuthProps {
    onLoginSuccess: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let user: User;
            if (isLogin) {
                user = await db.loginUser(formData.email, formData.password);
            } else {
                if (!formData.name) throw new Error("Nome é obrigatório.");
                user = await db.registerUser(formData.name, formData.email, formData.password);
            }
            onLoginSuccess(user);
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in">
                <div className="bg-primary/5 p-8 pb-4 flex flex-col items-center">
                     <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                        <LogoIcon className="h-10 w-10 text-primary" />
                     </div>
                     <h1 className="text-2xl font-bold text-gray-800">PRD-Prompt.ai</h1>
                     <p className="text-gray-500 text-sm mt-1">
                         {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
                     </p>
                </div>

                <div className="p-8 pt-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <Input 
                                id="name" 
                                label="Nome Completo" 
                                placeholder="Ex: João Silva"
                                value={formData.name} 
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        )}
                        <Input 
                            id="email" 
                            type="email"
                            label="E-mail" 
                            placeholder="seu@email.com"
                            value={formData.email} 
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            id="password" 
                            type="password"
                            label="Senha" 
                            placeholder="******"
                            value={formData.password} 
                            onChange={handleChange}
                            required
                        />
                        
                        <Button 
                            type="submit" 
                            className="w-full shadow-lg" 
                            size="lg"
                            isLoading={isLoading}
                        >
                            {isLogin ? 'Entrar na Plataforma' : 'Criar Conta'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                            <button 
                                onClick={() => setIsLogin(!isLogin)} 
                                className="ml-1 text-primary font-bold hover:underline focus:outline-none"
                            >
                                {isLogin ? "Cadastre-se" : "Faça Login"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
