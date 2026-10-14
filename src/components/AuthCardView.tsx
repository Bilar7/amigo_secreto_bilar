import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User as UserIcon } from 'lucide-react';
import { BrandLogo } from './FestiveIcons';
import { User } from '../types';
import { firebaseAuthService } from '../services/firebaseAuth';

interface AuthCardViewProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToHome?: () => void;
}

export const AuthCardView: React.FC<AuthCardViewProps> = ({
  onLoginSuccess,
  onNavigateToHome
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg('');
    setIsLoading(true);
    try {
      const user = isSignUp
        ? await firebaseAuthService.signUp(email, password, name)
        : await firebaseAuthService.signIn(email, password);
      onLoginSuccess(user);
    } catch (error) {
      setFeedbackMsg(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      setFeedbackMsg('Introduza primeiro o seu email para receber o link de recuperação.');
      return;
    }
    setIsLoading(true);
    setFeedbackMsg('');
    try {
      await firebaseAuthService.sendPasswordReset(email);
      setFeedbackMsg('Se existir uma conta com este email, receberá uma mensagem com o link para redefinir a palavra-passe.');
    } catch (error) {
      setFeedbackMsg(error instanceof Error ? error.message : 'Não foi possível enviar o email de recuperação.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center py-4 sm:py-6 px-2 sm:px-4">
      <div className="w-full max-w-md bg-white text-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-300 text-center relative select-none">
        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center space-y-1.5 mb-4">
          <BrandLogo size="lg" theme="light" />
          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-xs break-words font-medium">
            {isSignUp 
              ? 'Crie a sua conta para organizar um novo grupo de Amigo Secreto.' 
              : 'Entre na sua conta para aceder aos seus grupos reais.'}
          </p>
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {isSignUp ? 'Nome completo *' : 'Email da conta'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required={isSignUp}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Manuel Bilar"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Email {isSignUp && '*'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required={isSignUp}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50"
              />
            </div>
          </div>

          {/* Palavra-passe */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Palavra-passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Palavra-passe"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 bg-slate-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Lembrar-me */}
          <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-0 w-3.5 h-3.5"
              />
              <span>Lembrar neste dispositivo</span>
            </label>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-emerald-700 hover:underline cursor-pointer"
            >
              Recuperar palavra-passe
            </button>
          </div>

          {feedbackMsg && (
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] text-center font-medium">
              {feedbackMsg}
            </div>
          )}

          {/* Button Entrar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer mt-1"
          >
            {isLoading ? 'A processar...' : isSignUp ? 'Criar Minha Conta Real' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Alternar Criar conta / Entrar */}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
        >
          {isSignUp ? 'Já tem conta? Entrar' : 'Criar nova conta grátis'}
        </button>

        {/* Footer text */}
        <p className="text-[10px] text-slate-500 mt-5 font-medium leading-tight">
          Bilar Amigo Secreto • Bilar DigitalTech Solutions
        </p>
      </div>
    </div>
  );
};
