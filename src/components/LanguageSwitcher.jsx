import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = '', variant = 'hud' }) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'simple') {
    return (
      <div className={`inline-flex items-center gap-1 bg-slate-900/80 border border-slate-700 p-1 rounded-xl text-xs font-mono select-none ${className}`}>
        <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1 shrink-0" />
        <button
          type="button"
          onClick={() => setLanguage('es')}
          className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
            language === 'es'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Cambiar a Español"
        >
          ES
        </button>
        <span className="text-slate-600">|</span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-cyan-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Switch to English"
        >
          EN
        </button>
      </div>
    );
  }

  // Cyberpunk HUD pill variant (default)
  return (
    <div className={`inline-flex items-center gap-1.5 bg-slate-950/90 border border-cyan-500/40 px-2 py-1 rounded-xl font-mono text-[11px] shadow-[0_0_15px_rgba(6,182,212,0.15)] select-none ${className}`}>
      <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setLanguage('es')}
          className={`px-2 py-0.5 rounded-lg font-orbitron font-extrabold text-[10px] transition-all cursor-pointer ${
            language === 'es'
              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-105'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
          }`}
          title="Español"
        >
          ES
        </button>
        <span className="text-cyan-900 font-bold">/</span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-0.5 rounded-lg font-orbitron font-extrabold text-[10px] transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-105'
              : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-900'
          }`}
          title="English"
        >
          EN
        </button>
      </div>
    </div>
  );
}
