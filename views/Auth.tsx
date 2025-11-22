
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Alert } from '../components/Alert';
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
        <div className="min-h-screen flex items-center justify-center bg-secondary-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in">
                <div className="bg-primary-50 p-8 pb-4 flex flex-col items-center">
                     <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                        <LogoIcon className="h-10 w-10 text-primary-600" />
                     </div>
                     <h1 className="text-2xl font-bold text-secondary-800">PRD-Prompt.ai</h1>
                     <p className="text-secondary-500 text-sm mt-1">
                         {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
                     </p>
                </div>

                <div className="p-8 pt-4">
                    {error && (
                        <Alert variant="error" className="mb-4" onClose={() => setError('')}>
                            {error}
                        </Alert>
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
                        <p className="text-sm text-secondary-600">
                            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-1 text-primary-600 font-bold hover:text-primary-700 hover:bg-transparent hover:underline p-0 h-auto inline-flex"
                            >
                                {isLogin ? "Cadastre-se" : "Faça Login"}
                            </Button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
