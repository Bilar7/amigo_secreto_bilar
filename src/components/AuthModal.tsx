import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, X, User as UserIcon, ArrowRight } from 'lucide-react';
import { BrandLogo } from './FestiveIcons';
import { User, ThemeMode } from '../types';
import { firebaseAuthService } from '../services/firebaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  theme: ThemeMode;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  theme,
  initialMode = 'login',
  onClose,
  onLoginSuccess
}) => {
  const isDark = theme === 'dark';
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg('');
    setIsLoading(true);
    try {
      const user = isSignUp
        ? await firebaseAuthService.signUp(email, password, name)
        : await firebaseAuthService.signIn(email, password);
      onLoginSuccess(user);
      onClose();
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-lg my-auto rounded-3xl border p-6 sm:p-8 text-center transition-all shadow-2xl max-h-[90vh] overflow-y-auto ${
          isDark 
            ? 'bg-[#091510] border-emerald-800/70 text-white' 
            : 'bg-white border-slate-300 text-slate-900 shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isDark ? 'text-emerald-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60' : 'text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center space-y-2 mb-6 pt-1">
          <BrandLogo size="lg" theme={theme} />
          <p className={`text-xs sm:text-sm max-w-sm mt-1.5 font-medium ${isDark ? 'text-emerald-200/80' : 'text-slate-600'}`}>
            {isSignUp 
              ? 'Crie a sua conta real para organizar e participar de sorteios.' 
              : 'Aceda à sua conta para gerir os seus grupos e listas de desejos.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs sm:text-sm">
          {/* Nome completo (obrigatório se for registo, opcional se for login) */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-emerald-200' : 'text-slate-700'}`}>
              {isSignUp ? 'Seu Nome Completo *' : 'Email da conta'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Manuel Bilar"
                required={isSignUp}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all ${
                  isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          {/* Email input */}
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-emerald-200' : 'text-slate-700'}`}>
              Endereço de Email {isSignUp && '*'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: seuemail@exemplo.com"
                required={isSignUp}
                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all ${
                  isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-600'
                }`}
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`font-semibold ${isDark ? 'text-emerald-200' : 'text-slate-700'}`}>
                Palavra-passe
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  Recuperar palavra-passe
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a sua palavra-passe"
                className={`w-full pl-10 pr-11 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none transition-all ${
                  isDark ? 'bg-emerald-950/50 border-emerald-800/70 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-800 focus:border-emerald-600'
                }`}
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

          {/* Remember me */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className={isDark ? 'text-emerald-300' : 'text-slate-600'}>
                Lembrar neste dispositivo
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <span>A iniciar sessão...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Criar Minha Conta Real' : 'Entrar no Sistema'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        {feedbackMsg && (
          <div role="status" aria-live="polite" className={`mt-3 rounded-xl border px-3 py-2 text-left text-xs font-medium ${isDark ? 'border-emerald-800 bg-emerald-950/70 text-emerald-100' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
            {feedbackMsg}
          </div>
        )}



        {/* Toggle sign up / sign in */}
        <div className="mt-5 text-xs text-center">
          <span className={isDark ? 'text-emerald-300/70' : 'text-slate-500'}>
            {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
          </span>{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-700 font-bold hover:underline ml-1 cursor-pointer"
          >
            {isSignUp ? 'Entrar agora' : 'Cadastre-se grátis'}
          </button>
        </div>
      </div>
    </div>
  );
};
