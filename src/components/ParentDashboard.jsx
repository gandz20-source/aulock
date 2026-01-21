import React from 'react';
import { Shield, Brain, Zap, MessageCircle, Trophy, Activity, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ParentDashboard = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-10 font-sans selection:bg-amber-500/30">
            {/* Header Executive */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white mb-1">
                        Nexus <span className="font-bold text-amber-500">Family</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Panel de Supervisión Académica</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white">Gonzalo (Padre)</p>
                        <p className="text-xs text-slate-500">Plan: Premium Tutoring</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-900/40">
                        G
                    </div>
                </div>
            </header>

            {/* Guardian Feed Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 mb-8 flex items-center gap-4 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <Shield className="text-emerald-500 shrink-0" size={24} />
                <div className="flex-1">
                    <h4 className="text-emerald-400 font-medium text-sm flex items-center gap-2">
                        Escudo de Seguridad Activo
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    </h4>
                    <p className="text-emerald-600/80 text-xs">No se han detectado anomalías en el entorno digital de su hijo hoy.</p>
                </div>
                <span className="text-emerald-900/50 hidden md:block"><Lock size={40} /></span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Mind AI Pulse (Emotional Well-being) */}
                <div className="md:col-span-4 bg-slate-900/50 rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <Brain size={18} className="text-purple-400" />
                            Bienestar Mental
                        </h3>
                        <Activity size={16} className="text-slate-600" />
                    </div>

                    <div className="relative h-48 flex items-center justify-center">
                        {/* Pulse Effect */}
                        <div className="absolute w-32 h-32 bg-purple-500/10 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute w-24 h-24 bg-purple-500/20 rounded-full animate-pulse"></div>

                        <div className="z-10 text-center">
                            <span className="block text-3xl font-light text-white mb-1">Enfocado</span>
                            <span className="text-xs text-purple-400 tracking-wider uppercase">Estado Actual</span>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-xs text-slate-400 leading-relaxed">
                            <span className="text-purple-400 font-bold">Mind AI:</span> "Ha mantenido periodos de concentración de 45m. Sugiero una pausa activa a las 16:00."
                        </p>
                    </div>
                </div>

                {/* Human Core Viewer (Soft Skills) */}
                <div className="md:col-span-5 bg-slate-900/50 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            <Zap size={18} className="text-amber-400" />
                            Human Core <span className="text-[10px] text-amber-500/50 border border-amber-500/20 px-1 rounded">BETA</span>
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <SkillBar label="Pensamiento Crítico" value={78} color="bg-cyan-400" />
                        <SkillBar label="Resolución de Problemas" value={65} color="bg-pink-500" />
                        <SkillBar label="Colaboración" value={82} color="bg-amber-400" />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-end">
                        <div className="text-xs text-slate-500">
                            Próxima actualización en 2 días
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">Lvl. 4</div>
                            <div className="text-[10px] text-slate-400 uppercase">Nivel Global</div>
                        </div>
                    </div>
                </div>

                {/* Tutor Control & Achievements */}
                <div className="md:col-span-3 flex flex-col gap-6">

                    {/* Tutor Action */}
                    <div className="flex-1 bg-gradient-to-br from-indigo-900/40 to-slate-900/50 rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all group cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                            <MessageCircle size={24} />
                        </div>
                        <h3 className="text-indigo-100 font-medium mb-1">Tutoría Pro</h3>
                        <p className="text-xs text-indigo-300/60 mb-6">Contactar mentor asignado.</p>
                        <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20">
                            Abrir Chat
                        </button>
                    </div>

                    {/* Weekly Achievement */}
                    <div className="flex-1 bg-slate-900/50 rounded-2xl p-6 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy size={60} />
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-4">Logro Semanal</h3>
                        <div className="text-3xl font-bold text-white mb-1">920 pts</div>
                        <p className="text-xs text-emerald-400 mb-4 flex items-center gap-1">
                            <ChevronRight size={12} /> Mejor puntaje (Matemáticas)
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

const SkillBar = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between mb-2">
            <span className="text-xs text-slate-300 font-medium">{label}</span>
            <span className="text-xs text-white font-bold">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
            ></motion.div>
        </div>
    </div>
);

export default ParentDashboard;
