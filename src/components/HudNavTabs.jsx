import React from 'react';
import { 
    GraduationCap, Sparkles, Timer, BrainCircuit, 
    Users, Award, QrCode, Swords, Gamepad2 
} from 'lucide-react';

export const HudNavTabs = ({ activeTab, setActiveTab }) => {
    return (
        <section className="mb-8">
            <div className="bg-slate-950/95 border-2 border-cyan-500/40 p-4 md:p-6 rounded-3xl shadow-2xl shadow-cyan-950/60 backdrop-blur-xl space-y-4 font-orbitron">
                
                {/* HUD Header Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>HUD.SYS // 8 MÓDULOS DE APRENDIZAJE SOCRÁTICO & CONVIVENCIA</span>
                    </div>
                    <div className="hidden sm:flex items-center space-x-3 text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">SYSTEM: ACTIVE</span>
                        <span>• • • MATRIX HUD v2.6</span>
                    </div>
                </div>

                {/* 8 COLORED HUD CALLOUT BARS GRID / SCROLL */}
                <div className="flex items-center space-x-5 overflow-x-auto custom-scrollbar py-3 px-1">
                    
                    {/* ==================== 1. MI PERFIL (ORANGE HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'profile'
                                ? 'bg-slate-900 border-orange-500 text-white shadow-[0_0_25px_rgba(249,115,22,0.45)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-orange-500/40 text-slate-300 hover:border-orange-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Hash Stripes */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex space-x-1 text-orange-400 font-bold text-[10px]">
                                <span>///</span>
                                <span className="tracking-widest text-orange-300">PROFILING</span>
                            </div>
                            <span className="text-[9px] text-orange-400/80 font-mono">// 01</span>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-orange-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <GraduationCap className="w-8 h-8 text-orange-400 stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">1. Mi Perfil</h4>
                                <span className="text-[10px] text-orange-300 font-bold block mt-0.5">& Bienvenida 📄</span>
                            </div>
                        </div>

                        {/* Bottom Connector Wire Graphics */}
                        <div className="relative mt-2 pt-1 border-t border-orange-500/30 flex items-center justify-between text-[9px] text-orange-400 font-mono">
                            <span>STATE: ACTIVE</span>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-0.5 bg-orange-400" />
                                <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#f97316]" />
                            </div>
                        </div>
                    </button>

                    {/* ==================== 2. AFTER IA (CYBER LIME HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('afteria')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'afteria'
                                ? 'bg-slate-900 border-lime-500 text-white shadow-[0_0_25px_rgba(132,204,22,0.45)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-lime-500/40 text-slate-300 hover:border-lime-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Tech Slats */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center space-x-1.5 text-lime-400 font-bold text-[10px]">
                                <div className="w-1.5 h-1.5 bg-lime-400 rounded-sm" />
                                <div className="w-1.5 h-1.5 bg-lime-400 rounded-sm" />
                                <span className="tracking-widest text-lime-300 ml-1">SOVEREIGN</span>
                            </div>
                            <span className="text-[9px] text-lime-400/80 font-mono">// 02</span>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-lime-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <Sparkles className="w-8 h-8 text-lime-300 animate-pulse stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">2. AFTER IA</h4>
                                <span className="text-[10px] text-lime-300 font-bold block mt-0.5">Misiones 🌌</span>
                            </div>
                        </div>

                        {/* Bottom Connector Wire Graphics */}
                        <div className="relative mt-2 pt-1 border-t border-lime-500/30 flex items-center justify-between text-[9px] text-lime-400 font-mono">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#84cc16]" />
                                <div className="w-2 h-0.5 bg-lime-400" />
                            </div>
                            <span>LORE: READY</span>
                        </div>
                    </button>

                    {/* ==================== 3. AULA EN VIVO (ELECTRIC CYAN HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('live_classroom')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'live_classroom'
                                ? 'bg-slate-900 border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.45)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-cyan-500/40 text-slate-300 hover:border-cyan-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Hash & Tech Slats */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center space-x-1 text-cyan-400 font-bold text-[10px]">
                                <span>///</span>
                                <span className="tracking-widest text-cyan-300">LIVE CLASS</span>
                            </div>
                            <div className="flex items-center space-x-1 text-cyan-400 text-[10px]">
                                <span>⬡-⬡</span>
                                <span className="text-[9px]">// 03</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <Timer className="w-8 h-8 text-cyan-400 stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">3. Aula en Vivo</h4>
                                <span className="text-[10px] text-cyan-300 font-bold block mt-0.5">& Convivencia 📡</span>
                            </div>
                        </div>

                        {/* Bottom Connector Wire Graphics */}
                        <div className="relative mt-2 pt-1 border-t border-cyan-500/30 flex items-center justify-between text-[9px] text-cyan-400 font-mono">
                            <span>STREAM: ON</span>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-0.5 bg-cyan-400" />
                                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                            </div>
                        </div>
                    </button>

                    {/* ==================== 4. TUTORES IA (NEON PURPLE HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('tutors')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'tutors'
                                ? 'bg-slate-900 border-purple-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-purple-500/40 text-slate-300 hover:border-purple-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Bracket Notch */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center space-x-1 text-purple-400 font-bold text-[10px]">
                                <span className="border-l-2 border-purple-400 pl-1">SOCRATIC AI</span>
                            </div>
                            <span className="text-[9px] text-purple-400/80 font-mono">// 04</span>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-8 h-8 text-purple-300 stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">4. Tutores IA</h4>
                                <span className="text-[10px] text-purple-300 font-bold block mt-0.5">Por Materia 🤖</span>
                            </div>
                        </div>

                        {/* Bottom Double Node Wire */}
                        <div className="relative mt-2 pt-1 border-t border-purple-500/30 flex items-center justify-between text-[9px] text-purple-400 font-mono">
                            <div className="flex items-center space-x-1">
                                <span className="text-[10px]">⬡-○</span>
                            </div>
                            <span>GEMINI 2.5</span>
                        </div>
                    </button>

                    {/* ==================== 5. ESCUADRÓN ALFA (CYBER EMERALD HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('squad')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'squad'
                                ? 'bg-slate-900 border-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.45)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-emerald-500/40 text-slate-300 hover:border-emerald-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Double Frame Notch */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[10px]">
                                <span className="px-1 border border-emerald-400/60 rounded text-[9px]">PEER</span>
                                <span className="tracking-widest text-emerald-300">ALFA SQUAD</span>
                            </div>
                            <span className="text-[9px] text-emerald-400/80 font-mono">// 05</span>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8 text-emerald-400 stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">5. Mi Escuadrón</h4>
                                <span className="text-[10px] text-emerald-300 font-bold block mt-0.5">Alfa 👥</span>
                            </div>
                        </div>

                        {/* Bottom Hexagon Node */}
                        <div className="relative mt-2 pt-1 border-t border-emerald-500/30 flex items-center justify-between text-[9px] text-emerald-400 font-mono">
                            <span>SYNERGY: HIGH</span>
                            <div className="flex items-center space-x-1">
                                <span className="text-[10px]">⬡</span>
                            </div>
                        </div>
                    </button>

                    {/* ==================== 6. ÁGORA DE CONVIVENCIA & JUEGOS (AMBER/GOLD HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('nexus')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'nexus'
                                ? 'bg-slate-900 border-amber-400 text-white shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-amber-500/40 text-slate-300 hover:border-amber-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Trophy Tag */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center space-x-1 text-amber-400 font-bold text-[10px]">
                                <span className="px-1 border border-amber-400/60 rounded text-[9px]">NEXUS</span>
                                <span className="tracking-widest text-amber-300">ARENA DE SALA</span>
                            </div>
                            <span className="text-[9px] text-amber-400/80 font-mono">// 06</span>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <Gamepad2 className="w-8 h-8 text-amber-300 stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">6. Ágora de Juegos</h4>
                                <span className="text-[10px] text-amber-300 font-bold block mt-0.5">& Convivencia 🎮</span>
                            </div>
                        </div>

                        {/* Bottom Live Synergy Bar */}
                        <div className="relative mt-2 pt-1 border-t border-amber-500/30 flex items-center justify-between text-[9px] text-amber-400 font-mono">
                            <span>ARENA: ONLINE</span>
                            <div className="flex items-center space-x-1">
                                <span className="text-[10px]">⚔️</span>
                            </div>
                        </div>
                    </button>

                    {/* ==================== 7. DESEMPEÑO & GUÍAS (VIBRANT MAGENTA HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('academic')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'academic'
                                ? 'bg-slate-900 border-fuchsia-500 text-white shadow-[0_0_25px_rgba(236,72,153,0.45)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-fuchsia-500/40 text-slate-300 hover:border-fuchsia-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Chevron Stripes */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center space-x-1 text-fuchsia-400 font-bold text-[10px]">
                                <span>&gt;&gt;&gt;</span>
                                <span className="tracking-widest text-fuchsia-300">ANALYTICS</span>
                            </div>
                            <span className="text-[9px] text-fuchsia-400/80 font-mono">// 07</span>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-fuchsia-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <Award className="w-8 h-8 text-fuchsia-300 stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">7. Desempeño</h4>
                                <span className="text-[10px] text-fuchsia-300 font-bold block mt-0.5">& Guías 📚</span>
                            </div>
                        </div>

                        {/* Bottom Hexagon Node */}
                        <div className="relative mt-2 pt-1 border-t border-fuchsia-500/30 flex items-center justify-between text-[9px] text-fuchsia-400 font-mono">
                            <div className="flex items-center space-x-1">
                                <span className="text-[10px]">⬡</span>
                            </div>
                            <span>REPORTS: OK</span>
                        </div>
                    </button>

                    {/* ==================== 8. PASAPORTE AULOCK (MINT TEAL HUD CALLOUT) ==================== */}
                    <button
                        onClick={() => setActiveTab('passport')}
                        className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between shrink-0 select-none min-w-[240px] ${
                            activeTab === 'passport'
                                ? 'bg-slate-900 border-teal-400 text-white shadow-[0_0_25px_rgba(20,184,166,0.45)] scale-[1.03] z-10'
                                : 'bg-slate-900/80 border-teal-500/40 text-slate-300 hover:border-teal-400 hover:bg-slate-900'
                        }`}
                    >
                        {/* Top Hash & Square Dots */}
                        <div className="flex items-center justify-between w-full mb-2">
                            <div className="flex items-center space-x-1.5 text-teal-400 font-bold text-[10px]">
                                <div className="w-1.5 h-1.5 bg-teal-400" />
                                <div className="w-1.5 h-1.5 bg-teal-400" />
                                <div className="w-1.5 h-1.5 bg-teal-400" />
                                <span className="tracking-widest text-teal-300 ml-1">IDENTITY</span>
                            </div>
                            <span className="text-[9px] text-teal-400/80 font-mono">// 08</span>
                        </div>

                        {/* Content */}
                        <div className="flex items-center space-x-3 my-1">
                            <div className="p-2.5 rounded-xl bg-slate-950 border border-teal-500/50 shadow-inner group-hover:scale-110 transition-transform">
                                <QrCode className="w-8 h-8 text-teal-300 stroke-[2.2]" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">8. Pasaporte</h4>
                                <span className="text-[10px] text-teal-300 font-bold block mt-0.5">AuLock 🆔</span>
                            </div>
                        </div>

                        {/* Bottom Circle Node */}
                        <div className="relative mt-2 pt-1 border-t border-teal-500/30 flex items-center justify-between text-[9px] text-teal-400 font-mono">
                            <span>NFC VERIFIED</span>
                            <div className="flex items-center space-x-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_#14b8a6]" />
                            </div>
                        </div>
                    </button>

                </div>
            </div>
        </section>
    );
};

export default HudNavTabs;
