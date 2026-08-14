import React from 'react';

export default function ProfileFrame({ 
  imgSrc = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  name = "Juan Carlos Pérez",
  carrera = "4° medio // COLEGIO SAN AGUSTÍN, STEM Specializ / ALFA STEM",
  badges = [
    { text: '★ 7.0 Lógica', color: 'purple' },
    { text: '🌟 Equipo de tutores Alfa', color: 'yellow' },
    { text: '🛡️ Formación Ciudadana', color: 'blue' }
  ]
}) {
  return (
    <div className="flex flex-col items-center justify-center relative w-full my-4 font-mono select-none">
      
      {/* 🔴 LÍNEAS VECTORIALES DE CIRCUITO PCB CONECTANDO PANELES LATERALES */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-60 pointer-events-none hidden md:block" 
        viewBox="0 0 800 350"
        fill="none" 
        stroke="#06b6d4" 
        strokeWidth="1.5"
      >
        {/* Trazo Izquierdo (Conecta con Seamos Comunidad) */}
        <path d="M120 100 H260 L300 140 H380" strokeDasharray="4 2" />
        <path d="M100 175 H280 L320 175 H380" />
        <path d="M140 250 H240 L300 200 H380" strokeDasharray="4 2" />
        <circle cx="100" cy="175" r="4" fill="#06b6d4" />
        <circle cx="120" cy="100" r="3" fill="#06b6d4" />

        {/* Trazo Derecho (Conecta con Analítica Académica) */}
        <path d="M680 100 H540 L500 140 H420" strokeDasharray="4 2" />
        <path d="M700 175 H520 L480 175 H420" />
        <path d="M660 250 H560 L500 200 H420" strokeDasharray="4 2" />
        <circle cx="700" cy="175" r="4" fill="#06b6d4" />
        <circle cx="680" cy="100" r="3" fill="#06b6d4" />
      </svg>

      {/* 🔴 MARCO CIBERNÉTICO PORTRAIT RECTANGULAR ALTO IMPACTO */}
      <div className="relative group z-10">
        
        {/* Resplandor Neón Cian Difuminado Posterior */}
        <div className="absolute -inset-4 bg-cyan-500/30 blur-2xl rounded-3xl pointer-events-none group-hover:bg-cyan-500/50 transition duration-500" />

        {/* Contenedor del Marco con Muescas HUD Vectorial */}
        <div className="relative p-2.5 bg-slate-950 border-2 border-cyan-400 rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.6)] flex items-center justify-center">
          
          {/* Muescas de Esquina HUD Tech */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />

          {/* Foto de Perfil */}
          <img
            src={imgSrc}
            alt={name}
            className="w-56 h-72 md:w-64 md:h-80 object-cover rounded-2xl border border-cyan-500/50 shadow-inner"
          />

          {/* Insignia Check de Verificación NFC */}
          <span className="absolute -bottom-3 right-4 bg-cyan-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl border-2 border-slate-950 shadow-lg flex items-center gap-1 font-mono">
            ✓ VERIFIED
          </span>
        </div>
      </div>

      {/* 🔴 DATOS DEL ALUMNO (Exacto a la referencia visual) */}
      <div className="text-center mt-6 z-10 space-y-2 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-orbitron font-extrabold text-white tracking-wider drop-shadow-text-cyan">
          {name}
        </h1>

        <p className="text-xs text-cyan-300 font-mono tracking-wide uppercase px-3 py-1 bg-slate-950/80 rounded-full border border-cyan-900/80 inline-block shadow-sm">
          {carrera}
        </p>

        {/* Badges de Reconocimiento Socrático */}
        <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono">
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-xl text-xs font-bold border shadow-sm ${
                badge.color === 'purple'
                  ? 'bg-purple-950/90 text-purple-200 border-purple-600'
                  : badge.color === 'yellow'
                  ? 'bg-amber-950/90 text-amber-200 border-amber-500'
                  : 'bg-sky-950/90 text-sky-200 border-sky-600'
              }`}
            >
              {badge.text}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
