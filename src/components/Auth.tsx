import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { LightningBoltIcon } from '@radix-ui/react-icons';
import { Mail, Lock, Loader2, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        
        if (error) throw error;
        
        if (data?.user && data?.session) {
          toast.success('Conta criada e logado com sucesso!');
        } else {
          toast.success('Cadastro realizado! Verifique seu e-mail para confirmar.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Bem-vindo de volta!');
      }
    } catch (error: any) {
      console.error('Erro de autenticação:', error);
      toast.error(error.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="bg-primary p-3 rounded-2xl text-primary-foreground shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
            <LightningBoltIcon className="h-8 w-8" />
          </div>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Daily Habit Tracker
            </CardTitle>
            <CardDescription className="text-zinc-400 text-base">
              {isSignUp 
                ? 'Crie sua conta para começar sua jornada' 
                : 'Entre para gerenciar sua rotina diária'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300 ml-1 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  E-mail
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-800/50 border-zinc-700 focus:border-primary focus:ring-primary/20 transition-all pl-3"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-zinc-300 flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" />
                    Senha
                  </Label>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-800/50 border-zinc-700 focus:border-primary focus:ring-primary/20 transition-all pl-3"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                className="w-full h-11 text-base font-semibold transition-all active:scale-[0.98] group" 
                type="submit" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isSignUp ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                    {isSignUp ? 'Criar Conta Agora' : 'Acessar Minha Conta'}
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-zinc-800/30 border-t border-zinc-800/50 px-8 py-4 flex justify-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {isSignUp ? (
                <>Já possui uma conta? <span className="text-primary hover:underline font-bold">Entre aqui</span></>
              ) : (
                <>Não tem uma conta? <span className="text-primary hover:underline font-bold">Cadastre-se grátis</span></>
              )}
            </button>
          </CardFooter>
        </Card>

        <p className="mt-8 text-center text-zinc-500 text-xs">
          Ao continuar, você concorda com nossos <br />
          <span className="underline hover:text-zinc-400 cursor-pointer">Termos de Serviço</span> e <span className="underline hover:text-zinc-400 cursor-pointer">Política de Privacidade</span>.
        </p>
      </motion.div>
    </div>
  );
};
