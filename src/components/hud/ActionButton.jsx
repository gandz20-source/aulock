import React from 'react';

export default function ActionButton({ icon, text, color = 'blue', onClick }) {
  const colorStyles = {
    yellow: 'border-cyan-400 text-cyan-200 bg-slate-950/90 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-950 hover:border-cyan-300',
    blue: 'border-sky-400 text-sky-200 bg-slate-950/90 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:bg-sky-950 hover:border-sky-300',
    green: 'border-emerald-400 text-emerald-200 bg-slate-950/90 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:bg-emerald-950 hover:border-emerald-300',
    red: 'border-rose-500 text-rose-200 bg-slate-950/90 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:bg-rose-950 hover:border-rose-400',
    purple: 'border-amber-500 text-amber-200 bg-slate-950/90 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-amber-950 hover:border-amber-400',
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-2xl border-2 transition-all duration-300 flex items-center space-x-3 text-xs md:text-sm font-bold font-mono uppercase tracking-wider shadow-lg hover:scale-105 select-none ${
        colorStyles[color] || colorStyles.blue
      }`}
    >
      <span className="text-xl p-1 bg-slate-900 rounded-xl border border-white/10 shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </button>
  );
}
