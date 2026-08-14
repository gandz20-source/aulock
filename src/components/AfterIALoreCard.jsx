import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Shield, Award, Zap, ChevronRight, BookOpen, User, CheckCircle2, Gift } from 'lucide-react';
import { synergyManager } from '../services/SynergyManager';

export const AfterIALoreCard = ({ progress = { chapter: 1, mission: 1, synergyPoints: 50 } }) => {
    const [showLoreDetails, setShowLoreDetails] = useState(false);
    const [synergyData, setSynergyData] = useState(() => synergyManager.getStudentSynergy('STUDENT_001'));
    const [isMissionCompleted, setIsMissionCompleted] = useState(false);

    useEffect(() => {
        const data = synergyManager.getStudentSynergy('STUDENT_001');
        setSynergyData(data);
        setIsMissionCompleted(!!(data.misionesCompletadas && data.misionesCompletadas['AI_M_BIO01']));
    }, []);

    const handleCompleteMission = async () => {
        try {
            const result = await synergyManager.otorgarPuntosPorMision('STUDENT_001', 'AI_M_BIO01', 100);
            const updated = synergyManager.getStudentSynergy('STUDENT_001');
            setSynergyData(updated);
            setIsMissionCompleted(true);
            alert(`✨ ¡Misión completada! Ganaste +${result.puntosOtorgados} PS. Total: ${result.synergyPoints} PS.`);
        } catch (e) {
            alert(`⚠️ Error: ${e.message}`);
        }
    };

    const handleRedeemBonus = async (decimas = 0.1) => {
        try {
            const res = await synergyManager.canjearPuntosPorNota('STUDENT_001', 'Matemáticas', 'EVAL_MAT_01', decimas);
            const updated = synergyManager.getStudentSynergy('STUDENT_001');
            setSynergyData(updated);
            alert(res.message);
        } catch (e) {
            alert(`⚠️ Error: ${e.message}`);
        }
    };

    return (
        <div className="relative overflow-hidden bg-slate-950 border-2 border-cyan-500/40 rounded-3xl p-6 md:p-8 shadow-2xl text-white space-y-6">
            {/* Ambient Glowing Background Layer */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Badges */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl border border-cyan-300/40 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 shrink-0">
                        <Zap className="w-8 h-8 fill-slate-950 stroke-slate-950" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-500/20 px-3 py-0.5 rounded-full border border-cyan-400/40 tracking-widest">
                                UNIVERSO AFTER IA • SAGA PRINCIPAL
                            </span>
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                                CAPÍTULO {progress.chapter || 1}
                            </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black text-white mt-1 flex items-center space-x-2">
                            <span>El Cisma del Conocimiento y la Era de la Sinergia</span>
                        </h2>
                    </div>
                </div>

                {/* Synergy Score Badge */}
                <div className="flex items-center space-x-3 bg-slate-900/90 border border-cyan-500/30 px-4 py-2.5 rounded-2xl shadow-inner shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                    <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Puntos de Sinergia:</span>
                        <strong className="text-cyan-300 font-mono text-sm">{synergyData.synergyPoints} PS</strong>
                    </div>
                </div>
            </div>

            {/* Body / Current Mission Overview */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                    <h3 className="text-base font-bold text-cyan-200 flex items-center space-x-2">
                        <User className="w-5 h-5 text-cyan-400" />
                        <span>Misión {progress.mission || 1}: El Despertar de Ryo el Aprendiz</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Tras el Gran Cisma de la IA, el mundo escolar descubrió que el aprendizaje no reside en memorizar datos aislados, sino en la **Sinergia Humano-IA**. Ryo inicia su entrenamiento socrático para desbloquear las 4 dimensiones científicas.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            onClick={handleCompleteMission}
                            disabled={isMissionCompleted}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition shadow flex items-center space-x-2 ${
                                isMissionCompleted
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                                    : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold'
                            }`}
                        >
                            {isMissionCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Zap className="w-4 h-4 text-slate-950" />}
                            <span>{isMissionCompleted ? 'Misión 1 de Ryo Completada (+100 PS)' : '🎯 Completar Misión 1 de Ryo (+100 PS)'}</span>
                        </button>

                        <button
                            onClick={() => handleRedeemBonus(0.1)}
                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-black transition shadow flex items-center space-x-1.5"
                        >
                            <Gift className="w-4 h-4 text-slate-950" />
                            <span>🎓 Canjear 500 PS por +0.1 Décima</span>
                        </button>

                        <button
                            onClick={() => setShowLoreDetails(!showLoreDetails)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1 transition underline underline-offset-4"
                        >
                            <span>{showLoreDetails ? 'Ocultar Prólogo' : '✨ Ver Prólogo After IA'}</span>
                            <ChevronRight className={`w-4 h-4 transform transition-transform ${showLoreDetails ? 'rotate-90' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Interactive Card Graphic */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-cyan-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-lg">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-mono text-cyan-400 font-bold">RYO_AVATAR_LEVEL_01</span>
                        <span className="text-emerald-400 font-bold">EN VIVO</span>
                    </div>

                    <div className="space-y-1 text-center py-2">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-cyan-500/20">
                            🛡️
                        </div>
                        <h4 className="font-bold text-white text-sm mt-2">Ryo el Aprendiz</h4>
                        <span className="text-[11px] text-slate-400">Guardián de la Curiosidad</span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full w-[65%]" />
                    </div>
                </div>
            </div>

            {/* Expandable Lore Capsule & Historial de Canjes */}
            {showLoreDetails && (
                <div className="relative z-10 space-y-4">
                    <div className="p-5 bg-slate-900/90 border border-cyan-500/30 rounded-2xl text-xs text-slate-300 space-y-3 animate-in fade-in duration-300 leading-relaxed shadow-inner">
                        <h4 className="font-bold text-cyan-300 uppercase flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-cyan-400" />
                            <span>Prólogo Oficial de la Saga After IA</span>
                        </h4>
                        <p>
                            "En el año 2026, la tecnología no reemplazó la mente humana; creó el **Cisma de Enfoque**. Aquellos que confiaron ciega y pasivamente en la tecnología quedaron varados en el automatismo. Pero quienes dominaron el método socrático con el apoyo del Guardián AuLock encendieron la era **After IA**."
                        </p>
                        <p className="italic text-slate-400 border-l-2 border-cyan-400 pl-3">
                            "Cada pregunta que formulas a tus Tutores IA en AuLock genera Sinergia y fortalece tu Expediente Académico Soberano."
                        </p>
                    </div>

                    {/* Historial de Canjes de Décimas */}
                    {synergyData.historialCanje && synergyData.historialCanje.length > 0 && (
                        <div className="p-5 bg-slate-900/90 border border-amber-500/30 rounded-2xl text-xs text-slate-300 space-y-3 animate-in fade-in duration-300 shadow-inner">
                            <h4 className="font-bold text-amber-300 uppercase flex items-center space-x-2">
                                <Award className="w-4 h-4 text-amber-400" />
                                <span>Historial de Canjes de Décimas ({synergyData.nombre} - ID: {synergyData.id || 'STUDENT_001'})</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {synergyData.historialCanje.map((c, idx) => (
                                    <div key={idx} className="p-3 bg-slate-950/80 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
                                        <div>
                                            <span className="font-bold text-white block">{c.materia || 'Matemáticas'}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">{new Date(c.fecha).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-amber-300 font-black text-xs block">+{c.bono} Décimas</span>
                                            <span className="text-[10px] text-slate-400 font-mono">-{c.puntos} PS</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AfterIALoreCard;
