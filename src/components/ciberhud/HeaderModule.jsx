import React from 'react';

export const HeaderModule = ({ id, title, status, color, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`relative p-4 rounded-lg bg-slate-900 border-t-4 ${color} shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-950/50 cursor-pointer select-none ${
        isActive ? 'ring-2 ring-cyan-400/50 bg-slate-900 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : ''
      }`}
    >
        {/* Identificador de Teclado (ej. '1') */}
        <span className={`absolute -top-3 -left-2 z-10 px-2.5 py-0.5 text-xs font-black font-mono text-slate-950 rounded shadow-md ${
            isActive ? 'bg-cyan-400' : 'bg-slate-500'
        }`}>
            {id}
        </span>

        {/* Contenido del Módulo */}
        <div className='flex flex-col h-full justify-between'>
            <div className="flex items-center gap-2">
                <h4 className="text-xs md:text-sm font-orbitron font-bold text-white tracking-tight leading-tight uppercase">{title}</h4>
            </div>
            <p className={`mt-2 text-[10px] ciber-text uppercase tracking-widest ${isActive ? 'text-cyan-300' : 'text-cyan-700'}`}>{status}</p>
        </div>

        {/* Efecto de luz sutil */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default HeaderModule;
