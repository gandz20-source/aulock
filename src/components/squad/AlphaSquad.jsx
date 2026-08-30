import React, { useState, useRef, useEffect } from 'react';
import { 
    Users, Send, AlertTriangle, ShieldCheck, Zap, Award, 
    Crown, Sparkles, MessageSquare, ChevronRight, Activity, 
    Target, Flame, CheckCircle2, BookOpen, Star, HelpCircle,
    Share2, Compass
} from 'lucide-react';
import { getActiveSquadForStudent } from '../../services/SquadService';

export default function AlphaSquad({ profile, onSendMessage }) {
    const studentName = profile?.full_name || profile?.name || 'Juan Carlos Pérez';
    const currentSquad = getActiveSquadForStudent(studentName);

    // Initial Chat State
    const [squadMessages, setSquadMessages] = useState(() => {
        const saved = localStorage.getItem('aulock_squad_chat_messages');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return [
            {
                id: 'msg-1',
                sender: 'Mateo Rojas',
                role: 'Mentor de Pares (Ciencias)',
                text: '¡Hola equipo! Ya subí el resumen del ciclo celular y fotosíntesis para la actividad grupal.',
                time: '14:20',
                isCurrentUser: false
            },
            {
                id: 'msg-2',
                sender: 'Diego Morales',
                role: 'Coordinador Algorítmico',
                text: 'Excelente Mateo. Yo tengo listo el esquema de flujo para el modelo computacional.',
                time: '14:23',
                isCurrentUser: false
            },
            {
                id: 'msg-3',
                sender: studentName,
                role: 'Líder Lógico',
                text: 'Perfecto. Yo me encargo de resolver las ecuaciones de tasa de crecimiento poblacional y verificar los datos.',
                time: '14:25',
                isCurrentUser: true
            }
        ];
    });

    const [squadInput, setSquadInput] = useState('');
    const [sosAlertSent, setSosAlertSent] = useState(false);
    const [activeMissionProgress, setActiveMissionProgress] = useState(75);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [squadMessages]);

    const handleSendSquadMessage = (e) => {
        if (e) e.preventDefault();
        if (!squadInput.trim()) return;

        const newMessage = {
            id: 'msg-' + Date.now(),
            sender: studentName,
            role: 'Líder Lógico',
            text: squadInput.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCurrentUser: true
        };

        const updated = [...squadMessages, newMessage];
        setSquadMessages(updated);
        localStorage.setItem('aulock_squad_chat_messages', JSON.stringify(updated));
        setSquadInput('');

        if (onSendMessage) {
            onSendMessage(newMessage);
        }
    };

    const handleTriggerSos = () => {
        setSosAlertSent(true);
        const sosMsg = {
            id: 'msg-sos-' + Date.now(),
            sender: 'SISTEMA AULOCK // ALERTA SOS',
            role: 'Protocolo de Cuidado',
            text: `🚨 ${studentName} ha solicitado apoyo cooperativo urgente en la misión activa. ¡El Cuidador IA y los mentores han sido notificados!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: true
        };

        const updated = [...squadMessages, sosMsg];
        setSquadMessages(updated);
        localStorage.setItem('aulock_squad_chat_messages', JSON.stringify(updated));
        setTimeout(() => setSosAlertSent(false), 6000);
    };

    const handleQuickActionPrompt = (text) => {
        setSquadInput(text);
    };

    return (
        <div className="space-y-6 font-mono selection:bg-indigo-900 animate-in fade-in duration-300">
            
            {/* =========================================================================
                1. GAMIFIED SQUAD DASHBOARD (TOP PARTY HUD BANNER)
               ========================================================================= */}
            <section className="bg-slate-950/95 border-2 border-indigo-500/60 p-5 md:p-6 rounded-3xl shadow-[0_0_35px_rgba(99,102,241,0.25)] space-y-4">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-900/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-xl text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] shrink-0">
                            ⚡
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm md:text-base font-orbitron font-extrabold text-white tracking-wider uppercase">
                                    {currentSquad?.name || 'SQUAD ALFA STEM'}
                                </h2>
                                <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/60 px-2.5 py-0.5 rounded-full uppercase">
                                    {currentSquad?.course || '4° Medio A'}
                                </span>
                                <span className="text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Crown className="w-3 h-3 text-amber-400" /> TIER IV
                                </span>
                            </div>
                            <p className="text-xs text-indigo-300/80 font-sans mt-0.5">
                                {currentSquad?.specialty || 'Ciencias Exactas & Tecnología Aplicada'} • {currentSquad?.members?.length || 4} Integrantes Activos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold rounded-full flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            SINERGIA IA ACTIVA
                        </span>
                    </div>
                </div>

                {/* Gamified Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Synergy Points */}
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/40 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-indigo-400 font-bold uppercase block mb-0.5">
                                PUNTOS DE SINERGIA (PS)
                            </span>
                            <strong className="text-2xl font-orbitron font-black text-amber-300 tracking-wider">
                                4,850 PS
                            </strong>
                            <span className="text-[10px] text-emerald-400 block font-sans mt-0.5">
                                ↑ +180 PS en esta sesión
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-300 text-lg shadow-md">
                            💎
                        </div>
                    </div>

                    {/* Active Cooperative Mission */}
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/40 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-indigo-400 font-bold uppercase">MISIÓN COOPERATIVA</span>
                                <span className="text-[10px] text-cyan-300 font-bold font-orbitron">FASE 3/4</span>
                            </div>
                            <h4 className="text-xs font-bold text-white truncate font-sans">
                                Ecuaciones Cuadráticas & Biología Celular
                            </h4>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 border border-indigo-950 overflow-hidden mt-2">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500" 
                                style={{ width: `${activeMissionProgress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Average Squad Focus */}
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/40 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-indigo-400 font-bold uppercase block mb-0.5">
                                ENFOQUE COLECTIVO
                            </span>
                            <strong className="text-2xl font-orbitron font-black text-emerald-400 tracking-wider">
                                94.8%
                            </strong>
                            <span className="text-[10px] text-indigo-300/80 block font-sans mt-0.5">
                                Sincronía grupal en clase
                            </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300 text-lg shadow-md">
                            🎯
                        </div>
                    </div>

                </div>

                {/* Pedagogical Rationale Info */}
                {currentSquad?.pedagogical_rationale && (
                    <div className="p-3 bg-slate-900/80 border border-indigo-500/30 rounded-2xl text-xs text-indigo-200 font-sans leading-relaxed flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span><strong>Arquitectura de Pares IA:</strong> {currentSquad.pedagogical_rationale}</span>
                    </div>
                )}
            </section>

            {/* =========================================================================
                2. MAIN INTERACTIVE GRID: HUD CHAT (LEFT 65%) & VISUAL ROSTER (RIGHT 35%)
               ========================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 💬 LEFT COLUMN (65%): IMMERSIVE HUD CHAT */}
                <div className="lg:col-span-7 xl:col-span-8 bg-slate-950/95 rounded-3xl border-2 border-indigo-500/50 p-5 md:p-6 flex flex-col h-[620px] shadow-[0_0_30px_rgba(99,102,241,0.2)] justify-between">
                    
                    {/* Chat Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-900/60 pb-3 mb-4 gap-3">
                        <div className="flex items-center gap-2.5">
                            <MessageSquare className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-wider uppercase">
                                CANAL TÁCTICO // CHAT DE ESCUADRÓN
                            </h3>
                        </div>

                        {/* Integrated SOS Squad Button */}
                        <button
                            onClick={handleTriggerSos}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-orbitron transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                                sosAlertSent 
                                    ? 'bg-rose-600 text-white animate-bounce shadow-[0_0_15px_rgba(244,63,94,0.6)]' 
                                    : 'bg-rose-950/80 text-rose-300 border border-rose-500/50 hover:bg-rose-900 hover:text-white'
                            }`}
                        >
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>{sosAlertSent ? '¡SOS ENVIADO!' : '🆘 SOS SQUAD'}</span>
                        </button>
                    </div>

                    {/* Chat Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                        {squadMessages.map((msg) => {
                            if (msg.isSystem) {
                                return (
                                    <div key={msg.id} className="p-3 bg-rose-950/70 border border-rose-500/60 rounded-2xl text-xs text-rose-200 font-sans animate-in fade-in duration-200">
                                        <div className="flex justify-between items-center text-[10px] font-mono text-rose-400 font-bold mb-1">
                                            <span>{msg.sender}</span>
                                            <span>{msg.time}</span>
                                        </div>
                                        <p className="font-medium">{msg.text}</p>
                                    </div>
                                );
                            }

                            const isMe = msg.isCurrentUser || (msg.sender || '').toLowerCase().includes('juan carlos');

                            return (
                                <div 
                                    key={msg.id} 
                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                                >
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                                        <span className={`font-bold ${isMe ? 'text-cyan-300' : 'text-indigo-300'}`}>
                                            {isMe ? 'Tú (Juan Carlos)' : msg.sender}
                                        </span>
                                        {msg.role && (
                                            <span className="text-[9px] bg-slate-900 text-indigo-400 border border-indigo-900 px-1.5 py-0.2 rounded">
                                                {msg.role}
                                            </span>
                                        )}
                                        <span className="font-mono text-slate-500">{msg.time}</span>
                                    </div>

                                    <div 
                                        className={`max-w-[85%] md:max-w-[75%] p-3.5 rounded-2xl text-xs font-sans leading-relaxed shadow-lg ${
                                            isMe 
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]' 
                                                : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-indigo-900/80'
                                        }`}
                                    >
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Action Suggestion Pills */}
                    <div className="pt-3 pb-2 flex flex-wrap gap-1.5 border-t border-indigo-950">
                        <button
                            type="button"
                            onClick={() => handleQuickActionPrompt("Mateo, ¿me explicas el concepto de respiración celular?")}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-indigo-800/80 rounded-lg text-[10px] text-indigo-300 transition cursor-pointer"
                        >
                            🧬 Pedir ayuda a Mateo
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickActionPrompt("Equipo, tengo lista la solución de la ecuación cuadrática.")}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-cyan-800/80 rounded-lg text-[10px] text-cyan-300 transition cursor-pointer"
                        >
                            📐 Compartir avance en Cálculo
                        </button>
                        <button
                            type="button"
                            onClick={() => handleQuickActionPrompt("¿Listos para enviar la entrega cooperativa?")}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-emerald-800/80 rounded-lg text-[10px] text-emerald-300 transition cursor-pointer"
                        >
                            🚀 Revisar entrega grupal
                        </button>
                    </div>

                    {/* Chat Input Form */}
                    <form onSubmit={handleSendSquadMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={squadInput}
                            onChange={(e) => setSquadInput(e.target.value)}
                            placeholder="Escribe un mensaje táctico para tu escuadrón..."
                            className="flex-1 bg-slate-900/90 border border-indigo-500/40 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-sans"
                        />
                        <button 
                            type="submit" 
                            className="p-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>

                </div>

                {/* 👥 RIGHT COLUMN (35%): VISUAL ROSTER & ACTIONABLE PEER MENTORING */}
                <div className="lg:col-span-5 xl:col-span-4 bg-slate-950/95 rounded-3xl border-2 border-indigo-500/50 p-5 md:p-6 shadow-[0_0_30px_rgba(99,102,241,0.2)] space-y-4 flex flex-col justify-between">
                    
                    <div>
                        <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3 mb-4">
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-indigo-400" />
                                <h3 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-wider uppercase">
                                    ROSTER & ROLES IA
                                </h3>
                            </div>
                            <span className="text-[10px] text-indigo-300 font-bold bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">
                                4 MIEMBROS
                            </span>
                        </div>

                        {/* Members Card List */}
                        <div className="space-y-3">
                            {currentSquad?.members?.map((member, idx) => {
                                const isCurrentUser = (member.name || '').toLowerCase().includes('juan carlos') || (member.name === studentName);
                                const gpaValue = typeof member.gpa === 'number' ? member.gpa : parseFloat(member.gpa) || 6.2;
                                const gpaPercent = Math.min(100, Math.round((gpaValue / 7.0) * 100));
                                const focusPercent = parseInt(member.focus_metric || '90', 10);

                                return (
                                    <div 
                                        key={idx} 
                                        className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                                            isCurrentUser 
                                                ? 'bg-slate-900/90 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                                                : 'bg-slate-900/70 border-indigo-900/80 hover:border-indigo-500/60'
                                        }`}
                                    >
                                        {/* Member Header */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-indigo-700/60 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-xs flex items-center gap-1.5">
                                                        <span>{member.name}</span>
                                                        {isCurrentUser && (
                                                            <span className="text-[9px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500 px-1.5 py-0.2 rounded-full">
                                                                TÚ
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[10px] text-indigo-300 font-medium">
                                                        🏷️ {member.role || 'Mentor de Pares'}
                                                    </div>
                                                </div>
                                            </div>

                                            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                                                GPA {gpaValue.toFixed(1)}
                                            </span>
                                        </div>

                                        {/* Visual Gauges: GPA & Enfoque */}
                                        <div className="space-y-1.5 pt-1">
                                            {/* GPA Progress Bar */}
                                            <div>
                                                <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-0.5">
                                                    <span>Rendimiento Académico</span>
                                                    <span className="text-amber-300 font-bold">{gpaValue.toFixed(1)} / 7.0</span>
                                                </div>
                                                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                                                    <div 
                                                        className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full" 
                                                        style={{ width: `${gpaPercent}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Focus Progress Bar */}
                                            <div>
                                                <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-0.5">
                                                    <span>Atención en Pantalla</span>
                                                    <span className="text-cyan-400 font-bold">{focusPercent}%</span>
                                                </div>
                                                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800 overflow-hidden">
                                                    <div 
                                                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full" 
                                                        style={{ width: `${focusPercent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actionable Peer Mentoring Buttons */}
                                        {!isCurrentUser ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const best = member.best_subject ? member.best_subject.split('(')[0].trim() : 'su especialidad';
                                                    handleQuickActionPrompt(`Hola ${member.name.split(' ')[0]}, ¿me ayudas con una duda puntual en ${best}?`);
                                                }}
                                                className="w-full py-1.5 px-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 text-[10px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <span>💬 Pedir ayuda en {member.best_subject ? member.best_subject.split('(')[0].trim() : 'su área'}</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    handleQuickActionPrompt("Equipo, estoy disponible si necesitan repasar derivadas y cálculo.");
                                                }}
                                                className="w-full py-1.5 px-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-[10px] font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <span>📐 Ofrecer mentoría en Matemáticas</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Synergies Summary */}
                    {currentSquad?.synergies && currentSquad.synergies.length > 0 && (
                        <div className="pt-3 border-t border-indigo-900/60 space-y-2">
                            <span className="text-[10px] text-indigo-300 font-bold uppercase block flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-indigo-400" />
                                Red de Mentoría Cruzada Activa:
                            </span>
                            {currentSquad.synergies.map((syn, i) => (
                                <div key={i} className="p-2.5 bg-slate-900/90 border border-indigo-800/80 rounded-xl text-[10px] text-slate-300 font-sans leading-relaxed">
                                    <strong className="text-cyan-300">{syn.mentor}</strong> ➔ <strong className="text-indigo-300">{syn.apprentice}</strong>: {syn.reason || `Apoyo en ${syn.area}`}
                                </div>
                            ))}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}
