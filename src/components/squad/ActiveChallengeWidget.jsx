import React, { useState, useEffect } from 'react';
import { 
    Zap, Sparkles, Send, CheckCircle2, Clock, 
    AlertTriangle, Shield, Award, Users, ChevronDown, 
    ChevronUp, MessageSquare, Target, Check
} from 'lucide-react';
import { supabase } from '../../config/supabase';

export default function ActiveChallengeWidget({ studentName = 'Juan Carlos Pérez' }) {
    const [challenge, setChallenge] = useState(() => {
        const saved = localStorage.getItem('aulock_active_squad_challenge');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.status === 'ACTIVE') return parsed;
            } catch (e) {}
        }
        return null;
    });

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [consensusAnswer, setConsensusAnswer] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState(null);

    // Listen to Supabase Realtime for squad challenges
    useEffect(() => {
        const handleSync = (data) => {
            if (data && data.status === 'ACTIVE') {
                setChallenge(data);
                setIsCollapsed(false);
                setHasSubmitted(false);
                setFeedbackMessage(null);
            } else if (data && data.status === 'FINISHED') {
                setChallenge(null);
            }
        };

        const handleStorageEvent = (e) => {
            let data = null;
            if (e && e.detail) {
                data = e.detail;
            } else {
                const saved = localStorage.getItem('aulock_active_squad_challenge');
                if (saved) {
                    try { data = JSON.parse(saved); } catch (err) {}
                }
            }
            handleSync(data);
        };

        // 1. Supabase Realtime Channel
        const channel = supabase
            .channel('coexistence_nexus_arena')
            .on('broadcast', { event: 'squad_challenge_launched' }, ({ payload }) => {
                if (payload) {
                    handleSync(payload);
                }
            })
            .on('broadcast', { event: 'squad_challenge_closed' }, () => {
                setChallenge(null);
            })
            .subscribe();

        // 2. Storage & Custom Events
        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener('aulock_squad_challenge_event', handleStorageEvent);

        return () => {
            supabase.removeChannel(channel);
            window.removeEventListener('storage', handleStorageEvent);
            window.removeEventListener('aulock_squad_challenge_event', handleStorageEvent);
        };
    }, []);

    const handleSubmitConsensus = (e) => {
        if (e) e.preventDefault();
        if (!consensusAnswer.trim() || hasSubmitted) return;

        setIsSubmitting(true);

        const payload = {
            challengeId: challenge?.challengeId || 'ch-live',
            squadName: challenge?.squadName || 'Squad Alfa',
            submittedBy: studentName,
            answer: consensusAnswer.trim(),
            submittedAt: new Date().toISOString()
        };

        // Save local state
        setHasSubmitted(true);
        setIsSubmitting(false);
        setFeedbackMessage(`✓ ¡Respuesta enviada con éxito! Tu escuadrón sumó +150 PS de Sinergia Cooperativa.`);

        // Broadcast to teacher via Supabase Realtime
        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'squad_challenge_submitted',
                        payload
                    });
                }
            });
        } catch (err) {
            console.warn("Realtime challenge submit error:", err);
        }
    };

    // =========================================================================
    // STATE 1: IDLE / STANDBY STATE (No active challenge)
    // =========================================================================
    if (!challenge) {
        return (
            <div className="p-4 bg-slate-950/80 border border-indigo-900/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-indigo-800/80 flex items-center justify-center text-sm text-indigo-400 shrink-0">
                        🎯
                    </div>
                    <div>
                        <span className="font-orbitron font-bold text-slate-300 uppercase block text-[11px]">
                            DESAFÍO COOPERATIVO // SQUAD FORGE
                        </span>
                        <span className="text-slate-500 text-[11px] font-sans">
                            Sin misión activa en este momento. El docente lanzará desafíos multidisciplinarios o de tutoría en tiempo real.
                        </span>
                    </div>
                </div>

                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-slate-400 font-mono shrink-0">
                    ○ En espera de reto docente
                </span>
            </div>
        );
    }

    // =========================================================================
    // STATE 2: ACTIVE CHALLENGE HUD
    // =========================================================================
    const userRoleKey = Object.keys(challenge.roles || {}).find(name => 
        name.toLowerCase().includes(studentName.toLowerCase()) || 
        studentName.toLowerCase().includes(name.toLowerCase())
    );
    const myRoleDesc = userRoleKey ? challenge.roles[userRoleKey] : null;

    return (
        <div className="bg-slate-950/95 border-2 border-amber-400/90 rounded-3xl p-5 md:p-6 shadow-[0_0_40px_rgba(251,191,36,0.3)] space-y-4 font-mono transition-all animate-in fade-in duration-300">
            
            {/* Widget Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-900/60 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0 animate-pulse">
                        🎯
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-orbitron font-extrabold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500 uppercase">
                                ● MISIÓN COOPERATIVA ACTIVA // SQUAD FORGE
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold font-orbitron">
                                🏆 +150 PS RECOMPENSA
                            </span>
                        </div>
                        <h3 className="text-sm md:text-base font-orbitron font-black text-white tracking-wider uppercase mt-0.5">
                            {challenge.title}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-amber-500/60 text-amber-300 text-xs font-mono">
                        {challenge.mode === 'SINERGIA_SUPREMA' ? '⚡ Sinergia Suprema' : '🤝 Tutoría de Debilidades'}
                    </span>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs cursor-pointer"
                        title={isCollapsed ? "Expandir Desafío" : "Minimizar"}
                    >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Collapsible Content Body */}
            {!isCollapsed && (
                <div className="space-y-4 pt-1">
                    
                    {/* Challenge Prompt Text */}
                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/40 text-xs md:text-sm text-slate-100 font-sans leading-relaxed">
                        {challenge.challengeText}
                    </div>

                    {/* Explicit Roles Grid */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-orbitron font-bold text-amber-300 uppercase block">
                            DISTRIBUCIÓN TÁCTICA DE ROLES EN TU SQUAD:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                            {Object.entries(challenge.roles || {}).map(([member, roleDesc], i) => {
                                const isMe = member.toLowerCase().includes(studentName.toLowerCase()) || studentName.toLowerCase().includes(member.toLowerCase());
                                return (
                                    <div 
                                        key={i} 
                                        className={`p-3 rounded-xl border flex items-start gap-2.5 transition ${
                                            isMe 
                                                ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                                : 'bg-slate-900/80 border-slate-800 text-slate-300'
                                        }`}
                                    >
                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                            isMe ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                                        }`}>
                                            {isMe ? '★' : i + 1}
                                        </span>
                                        <div>
                                            <strong className={`block text-[11px] font-mono ${isMe ? 'text-cyan-300' : 'text-white'}`}>
                                                {member} {isMe ? '(TÚ)' : ''}:
                                            </strong>
                                            <span className="text-[11px] leading-snug">{roleDesc}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Guidelines notice */}
                    {challenge.guidelines && (
                        <div className="p-3 bg-amber-950/50 rounded-xl border border-amber-500/50 text-xs text-amber-200 font-sans flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                            <span><strong>Pauta de Interacción:</strong> {challenge.guidelines}</span>
                        </div>
                    )}

                    {/* Single Shared Consensus Submission Form */}
                    <form onSubmit={handleSubmitConsensus} className="space-y-3 pt-2 border-t border-slate-800">
                        <label className="text-xs font-orbitron font-bold text-amber-300 uppercase block">
                            ✍️ RESPUESTA CONSENSUADA DEL SQUAD (ENTREGA ÚNICA):
                        </label>
                        
                        <textarea
                            rows={3}
                            disabled={hasSubmitted || isSubmitting}
                            value={consensusAnswer}
                            onChange={(e) => setConsensusAnswer(e.target.value)}
                            placeholder="Redacten aquí la solución final unificada del escuadrón tras coordinarse en el chat..."
                            className="w-full bg-slate-950 border-2 border-amber-500/60 focus:border-amber-400 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 outline-none font-sans"
                        />

                        {!hasSubmitted ? (
                            <button
                                type="submit"
                                disabled={!consensusAnswer.trim() || isSubmitting}
                                className={`w-full py-3.5 rounded-xl font-orbitron font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                                    consensusAnswer.trim() && !isSubmitting
                                        ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                                <span>{isSubmitting ? 'Enviando...' : '🚀 ENVIAR RESPUESTA DE SINERGIA (+150 PS)'}</span>
                            </button>
                        ) : (
                            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-center space-y-1 animate-in fade-in duration-200">
                                <p className="font-bold font-orbitron text-xs uppercase tracking-wider flex items-center justify-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>¡Entrega de Escuadrón Registrada!</span>
                                </p>
                                <p className="text-[11px] font-sans">
                                    {feedbackMessage || 'La respuesta consensuada fue transmitida en vivo al panel del profesor Carlos Rivas.'}
                                </p>
                            </div>
                        )}
                    </form>

                </div>
            )}

        </div>
    );
}
