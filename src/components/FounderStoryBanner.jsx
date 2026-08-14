import React from 'react';

export default function FounderStoryBanner() {
  return (
    <div className="w-full my-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-gray-950 via-blue-950/80 to-gray-950 border-2 border-cyan-500/60 shadow-[0_0_35px_rgba(56,235,203,0.2)] font-mono text-cyan-100 relative overflow-hidden">
      
      {/* Fondo con retícula tecnológica */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38EBCB_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Banner de Participación en XPRIZE */}
        <div className="inline-block mb-4 px-3.5 py-1 bg-fuchsia-950/90 border border-fuchsia-500 rounded-lg text-fuchsia-300 text-[10px] md:text-xs font-orbitron font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(217,70,239,0.3)]">
          🚀 PARTICIPANDO EN XPRIZE // BUILD WITH GEMINI
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold font-orbitron text-white mb-4 leading-tight">
          De un concepto físico a una app de élite en tiempo récord.
        </h2>

        <p className="text-xs md:text-sm text-cyan-200/90 leading-relaxed font-sans mb-4">
          AuLock nació hace 7 meses puramente como un concepto de hardware físico (el estuche inteligente). Sin los recursos ni un computador propio, el proyecto tecnológico quedó inicialmente paralizado, sin intenciones originales de lanzar una aplicación móvil.
        </p>

        <p className="text-xs md:text-sm text-cyan-200/90 leading-relaxed font-sans mb-6">
          Sin embargo, al conocer la convocatoria, decidimos asumir el reto absoluto. Hace apenas <strong className="text-emerald-400 font-bold">dos semanas</strong> logramos comprar un PC usado y, con pura determinación contrarreloj, construimos desde cero toda la app móvil y la arquitectura socrática que ves hoy funcionando.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-cyan-900/60 text-[10px] md:text-xs text-cyan-400 font-mono font-bold">
          <span>STATUS: DESARROLLO TÉCNICO // ACTIVO</span>
          <span className="text-white font-orbitron bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-700">
            ⚡ IMPULSADO POR GEMINI API
          </span>
        </div>
      </div>

    </div>
  );
}
