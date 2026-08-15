import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TeacherHeaderNav({ activeTab = 'live', setActiveTab }) {
  const navigate = useNavigate();

  const tabs = [
    { id: 1, key: 'live', name: '1. LIVE CLASSROOM', color: 'cyan', border: 'border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-cyan-950/80' },
    { id: 2, key: 'evaluations', name: '2. EVALUATIONS', color: 'magenta', border: 'border-fuchsia-500 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.5)] bg-fuchsia-950/80' },
    { id: 3, key: 'squads', name: '3. SQUADS & TEAMS', color: 'indigo', border: 'border-indigo-400 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.5)] bg-indigo-950/80' },
    { id: 4, key: 'reports', name: '4. REPORTS', color: 'green', border: 'border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)] bg-emerald-950/80' },
    { id: 5, key: 'nexo', name: '5. COEXISTENCE NEXUS', color: 'blue', border: 'border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.5)] bg-sky-950/80' },
    { id: 6, key: 'settings', name: '6. SETTINGS', color: 'orange', border: 'border-amber-500 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)] bg-amber-950/80' },
  ];

  return (
    <nav className="w-full bg-slate-950/95 border-2 border-cyan-500/40 p-4 md:p-6 rounded-3xl shadow-2xl shadow-cyan-950/80 backdrop-blur-xl space-y-4 font-mono mb-6 select-none">
      
      {/* TEACHER RBAC HEADER LINE */}
      <div className="flex flex-wrap items-center justify-between border-b border-cyan-900/60 pb-3 gap-3">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 bg-cyan-500 text-slate-950 font-black text-xs rounded-xl shadow font-mono">
            TCH
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-wider">
              Prof. María González
            </h1>
            <p className="text-xs text-cyan-400 font-mono">
              Subjects: Advanced Math & Calculus • Senior High A & Junior B
            </p>
          </div>
        </div>

        {/* Top Control Action Buttons */}
        <div className="flex items-center space-x-2 text-xs font-bold font-mono">
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 hover:bg-cyan-900 transition flex items-center gap-1.5"
          >
            🎓 Switch to Student Role
          </button>
          <button 
            onClick={() => navigate('/school-dashboard')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition flex items-center gap-1.5"
          >
            🏫 School 360° Role
          </button>
          <span className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/60 flex items-center justify-center text-cyan-300 shadow">
            👤
          </span>
          <span className="w-8 h-8 rounded-full bg-slate-900 border border-cyan-500/60 flex items-center justify-center text-rose-400 shadow cursor-pointer hover:bg-rose-950">
            ⚡
          </span>
        </div>
      </div>

      {/* 6 NEON HUD TAB BUTTONS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab && setActiveTab(tab.key)}
              className={`p-3.5 rounded-2xl border-2 font-orbitron font-extrabold text-xs md:text-sm tracking-wider uppercase transition-all duration-300 text-center select-none ${
                isActive
                  ? `${tab.border} scale-[1.03] z-10`
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
