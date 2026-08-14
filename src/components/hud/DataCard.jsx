import React from 'react';

export default function DataCard({ title, colorBorder = 'cyan', icon, children }) {
  const isCyan = colorBorder === 'cyan';

  return (
    <div className={`relative p-6 rounded-3xl bg-slate-950/90 border-2 transition-all duration-300 shadow-2xl font-mono ${
      isCyan 
        ? 'border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]' 
        : 'border-emerald-400/80 shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:shadow-[0_0_35px_rgba(52,211,153,0.45)]'
    }`}>
      {/* Esquinas Vectoriales HUD Tech */}
      <div className="absolute top-0 left-6 w-8 h-1 bg-cyan-400 rounded-full" />
      <div className="absolute top-0 right-6 w-8 h-1 bg-cyan-400 rounded-full" />
      <div className="absolute bottom-0 left-6 w-8 h-1 bg-cyan-400 rounded-full" />

      {/* Encabezado con Icono y Título Orbitron */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          {icon ? (
            typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('/')) ? (
              <img src={icon} alt="Icon" className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-3xl">{icon}</span>
            )
          ) : (
            <span className="text-3xl">🌱</span>
          )}
          <h3 className="text-xl font-orbitron font-extrabold text-white tracking-wider uppercase drop-shadow-text-cyan">
            {title}
          </h3>
        </div>

        {/* Indicador Micro Hash */}
        <span className="text-[10px] text-cyan-500 tracking-widest font-mono">
          /// HUD.PANEL
        </span>
      </div>

      {/* Contenido */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
