import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeaderNav({ activeTab = 'profile', setActiveTab }) {
  const navigate = useNavigate();

  const tabs = [
    {
      id: 1,
      key: 'profile',
      title: '1. MY PROFILE',
      subtitle: '& Welcome',
      color: 'cyan',
      borderClass: 'border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      bgActive: 'bg-slate-900/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)]',
      icon: '📄'
    },
    {
      id: 2,
      key: 'afteria',
      title: '2. AFTER AI',
      subtitle: 'Missions',
      color: 'magenta',
      borderClass: 'border-fuchsia-500 text-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.35)]',
      bgActive: 'bg-slate-900/90 border-fuchsia-500 shadow-[0_0_25px_rgba(217,70,239,0.5)]',
      icon: '🌌'
    },
    {
      id: 3,
      key: 'live_classroom',
      title: '3. LIVE CLASSROOM',
      subtitle: 'Focus & Live',
      color: 'green',
      borderClass: 'border-lime-400 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.35)]',
      bgActive: 'bg-slate-900/90 border-lime-400 shadow-[0_0_25px_rgba(163,230,53,0.5)]',
      icon: '📡'
    },
    {
      id: 4,
      key: 'tutors',
      title: '4. AI TUTORS',
      subtitle: 'by Subject',
      color: 'blue',
      borderClass: 'border-sky-400 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)]',
      bgActive: 'bg-slate-900/90 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.5)]',
      icon: '🤖'
    },
    {
      id: 5,
      key: 'squad',
      title: '5. ALPHA SQUAD',
      subtitle: 'Peer Guides',
      color: 'orange',
      borderClass: 'border-orange-500 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.35)]',
      bgActive: 'bg-slate-900/90 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.5)]',
      icon: '👥'
    },
    {
      id: 6,
      key: 'academic',
      title: '6. PERFORMANCE',
      subtitle: 'Analytics',
      color: 'amber',
      borderClass: 'border-amber-500 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      bgActive: 'bg-slate-900/90 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)]',
      icon: '📊'
    },
    {
      id: 7,
      key: 'passport',
      title: '7. AuLock PASSPORT',
      subtitle: 'AuLock NFC',
      color: 'purple',
      borderClass: 'border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]',
      bgActive: 'bg-slate-900/90 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.5)]',
      icon: '🆔'
    }
  ];

  return (
    <div className="w-full font-mono select-none space-y-4 mb-6">
      {/* 🔴 LÍNEA DE ESTADO RBAC SUPERIOR */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-cyan-400 border-b border-cyan-900/80 pb-2 px-1 font-mono gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>
            AuLock Mobile RBAC Architecture | User: <strong className="text-white font-semibold">Juan Carlos Pérez</strong> | Active Role: <strong className="text-cyan-300">[ STUDENT ]</strong>
          </span>
        </div>

        {/* Links a Roles */}
        <div className="flex flex-wrap items-center gap-2 text-[9.5px] font-bold">
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 transition flex items-center gap-1"
          >
            🎓 Student Role ✓
          </button>
          <button 
            onClick={() => navigate('/teacher-dashboard')}
            className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
          >
            👨‍🏫 Rol Profesor
          </button>
          <button 
            onClick={() => navigate('/teacher-dashboard')}
            className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
          >
            🧠 Rol Profesor (Sec. AI)
          </button>
          <button 
            onClick={() => navigate('/school-dashboard')}
            className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
          >
            🏫 Rol Colegio 360°
          </button>
        </div>
      </div>

      {/* 🔴 MICRO-CÓDIGO DE SISTEMA */}
      <div className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase flex items-center justify-between px-1">
        <span>HUD.SYS // 7 MÓDULOS DE APRENDIZAJE SOCRÁTICO</span>
        <span className="hidden sm:inline text-slate-500">• • • MATRIX HUD v2.5</span>
      </div>

      {/* 🔴 LAS 7 PESTAÑAS HUD CALLOUT BARS (Distribución exacta) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab && setActiveTab(tab.key)}
              className={`group relative p-3.5 rounded-2xl border-2 transition-all duration-300 text-left flex flex-col justify-between min-h-[92px] ${
                isActive
                  ? `${tab.bgActive} scale-[1.03] z-10`
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Insignia de Índice Flotante en Vértice */}
              <span
                className={`absolute -bottom-2.5 left-3 px-2 py-0.5 text-[9px] font-black font-mono rounded border shadow-md ${
                  isActive
                    ? 'bg-slate-900 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 group-hover:border-slate-500'
                }`}
              >
                0{tab.id}
              </span>

              {/* Encabezado Hash & Título */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold tracking-widest uppercase">
                  <span className={isActive ? tab.borderClass.split(' ')[1] : 'text-slate-500'}>
                    /// 0{tab.id}
                  </span>
                  <span className="text-base">{tab.icon}</span>
                </div>
                <h3 className="text-xs font-orbitron font-extrabold text-white tracking-tight uppercase leading-snug">
                  {tab.title}
                </h3>
              </div>

              {/* Subtítulo */}
              <p className={`text-[10px] font-mono font-semibold uppercase tracking-wider mt-1 ${
                isActive ? tab.borderClass.split(' ')[1] : 'text-slate-400 group-hover:text-slate-300'
              }`}>
                {tab.subtitle}
              </p>

              {/* Línea de Acento Superior */}
              <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full transition-all ${
                isActive ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-transparent group-hover:bg-slate-700'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
