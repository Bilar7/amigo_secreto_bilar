import React, { useState } from 'react';
import { User, Shield, Moon, Sun, Save, Check, Camera, Globe, Database, Sparkles } from 'lucide-react';
import { User as UserType, ThemeMode } from '../types';

interface SettingsViewProps {
  currentUser: UserType;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onUpdateUser: (updated: Partial<UserType>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  theme,
  onToggleTheme,
  onUpdateUser
}) => {
  const isDark = theme === 'dark';
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [anonymousDefault, setAnonymousDefault] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
  const [photoError, setPhotoError] = useState('');

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError('Escolha um ficheiro de imagem.'); return; }
    if (file.size > 3 * 1024 * 1024) { setPhotoError('A imagem deve ter no máximo 3 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { const result = String(reader.result || ''); setAvatarPreview(result); onUpdateUser({ avatar: result }); };
    reader.onerror = () => setPhotoError('Não foi possível abrir a imagem. Tente novamente.');
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left pb-10">
      <div className={`pb-4 border-b ${isDark ? 'border-emerald-950' : 'border-slate-300'}`}>
        <h2 className={`text-xl sm:text-2xl font-black font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Definições da Conta
        </h2>
        <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Gerencie o seu perfil, preferências visuais, idioma e dados do sistema.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Card */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#0a1813] border-emerald-900/60' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
            Informações do Perfil
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={avatarPreview || currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-500 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <span className={`text-sm font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser.name}</span>
              <span className={`text-xs break-all ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{currentUser.email}</span>
              <label className="bilar-profile-upload mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold cursor-pointer hover:bg-emerald-200 transition-colors">
                <Camera className="w-3.5 h-3.5" /> Alterar fotografia
                <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
              </label>
              {photoError && <p role="alert" className="text-xs text-rose-600 mt-1">{photoError}</p>}
              <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>JPG, PNG ou WebP · máximo 3 MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none transition-all ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 shadow-xs'
                }`}
              />
            </div>

            <div>
              <label className={`block font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none transition-all ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-600 shadow-xs'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Visual Appearance & Theme */}
        <div className={`p-5 rounded-2xl border space-y-3.5 text-xs ${
          isDark ? 'bg-[#0a1813] border-emerald-900/60' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <h3 className={`font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
            Aparência & Modo de Cor
          </h3>

          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tema Visual: {isDark ? 'Modo Escuro' : 'Modo Claro'}
              </span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Alterne entre modo claro suave sem ofuscamento ou modo escuro
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
          </div>
        </div>

        {/* Idioma do Sistema (Transferido do Cabeçalho conforme Solicitado) */}
        <div className={`p-5 rounded-2xl border space-y-3.5 text-xs ${
          isDark ? 'bg-[#0a1813] border-emerald-900/60' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <h3 className={`font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
            Idioma do Sistema
          </h3>

          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Língua da Aplicação
                </span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Selecione o idioma das notificações e interface
                </span>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className={`px-3 py-1.5 rounded-xl border font-bold text-xs focus:outline-none cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800 shadow-xs'
              }`}
            >
              <option value="pt">🇵🇹 Português (PT)</option>
              <option value="en">🇬🇧 English (US)</option>
            </select>
          </div>
        </div>

        {/* Firebase & Integração do Sistema */}
        <div className={`p-5 rounded-2xl border space-y-3.5 text-xs ${
          isDark ? 'bg-[#0a1813] border-emerald-900/60' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              Backend & Conexão em Tempo Real
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Firebase Conectado</span>
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border space-y-1.5 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Projeto: jfb-amigo-secreto-pro-2026</strong>
            </div>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Cloud Firestore configurado com regras para o Plano Gratuito (Spark). Seus dados e grupos criados são sincronizados em nuvem e salvos com persistência local.
            </p>
          </div>
        </div>

        {/* Privacy */}
        <div className={`p-5 rounded-2xl border space-y-3 text-xs ${
          isDark ? 'bg-[#0a1813] border-emerald-900/60' : 'bg-white border-slate-300 shadow-sm'
        }`}>
          <h3 className={`font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
            Privacidade & Chat
          </h3>

          <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Alertas de Notificação</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Avisar quando houver novos sorteios ou mensagens</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Chat Anônimo por Padrão</span>
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Ocultar o nome de utilizador ao iniciar conversas com o sorteado</span>
            </div>
            <input
              type="checkbox"
              checked={anonymousDefault}
              onChange={(e) => setAnonymousDefault(e.target.checked)}
              className="rounded text-emerald-700 focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvo com sucesso!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
