import React, { useState, useEffect } from 'react';
import {
    MessageSquare,
    Shield,
    Zap,
    Brain,
    BarChart2,
    CheckCircle2,
    AlertCircle,
    Mic,
    Sparkles
} from 'lucide-react';

const MOCK_MESSAGES = [
    { id: 1, user: "Sofia A.", text: "La IA no reemplaza, sino que amplifica la creatividad humana al eliminar tareas repetitivas.", type: "pro", badge: "Fundamentado" },
    { id: 2, user: "Diego M.", text: "Pero la dependencia excesiva podría atrofiar nuestras habilidades básicas de redacción.", type: "con", badge: "Contrapunto" },
    { id: 3, user: "Valeria T.", text: "Es como la calculadora: no dejamos de saber matemáticas, solo calculamos más rápido.", type: "pro", badge: "Analogía Clave" },
];

const ProgressBar = ({ label, value, colorClass, shadowClass }) => (
    <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full ${colorClass} ${shadowClass} transition-all duration-1000 ease-out`}
                style={{ width: `${value}%` }}
            />
        </div>
    </div>
);

const MessageBubble = ({ msg }) => (
    <div className={`flex flex-col gap-1 mb-4 ${msg.type === 'pro' ? 'items-start' : 'items-end'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
            <span className="text-xs font-bold text-slate-500">{msg.user}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${msg.badge === 'Fundamentado' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    msg.badge === 'Contrapunto' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                {msg.badge}
            </span>
        </div>
        <div className={`p-4 rounded-2xl max-w-[85%] border text-sm shadow-sm ${msg.type === 'pro'
                ? 'bg-slate-800 border-slate-700 text-slate-200 rounded-tl-none'
                : 'bg-slate-700/50 border-slate-600/50 text-slate-200 rounded-tr-none'
            }`}>
            {msg.text}
        </div>
    </div>
);

const DebatePanel = () => {
    const [analyzing, setAnalyzing] = useState(false);
    const [verdict, setVerdict] = useState(null);

    const handleGenerateVerdict = () => {
        setAnalyzing(true);
        // Simulate AI Processing
        setTimeout(() => {
            setAnalyzing(false);
            setVerdict({
                winner: "Equipo Pro-IA",
                reason: "Mayor uso de evidencia empírica y analogías sólidas.",
                score: 92
            });
        }, 2000);
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Arena de Debate</h1>
                    <p className="text-slate-400 text-sm">Moderación Inteligente en Tiempo Real</p>
                </div>

                {/* Civic_Guardian Indicator */}
                <div className="flex items-center bg-slate-800/80 px-4 py-2 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                    <Shield size={16} className="text-indigo-400 mr-2" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-indigo-300">Civic_Guardian</span>
                        <span className="text-[10px] text-indigo-400/70 leading-none">Moderación Activa</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
                {/* CENTER: Argument Feed */}
                <div className="flex-1 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 flex flex-col relative overflow-hidden">

                    {/* Topic Header */}
                    <div className="text-center mb-6 pb-6 border-b border-slate-700/50">
                        <h2 className="text-xl font-bold text-white">¿La IA reemplazará la creatividad humana?</h2>
                        <span className="text-xs font-bold bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 mt-2 inline-block">
                            ● Debate en Curso
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
                        {MOCK_MESSAGES.map(msg => (
                            <MessageBubble key={msg.id} msg={msg} />
                        ))}
                    </div>

                    {/* Input Area (Mock) */}
                    <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-3">
                        <input
                            type="text"
                            placeholder="Escribe un argumento..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 text-slate-200 text-sm outline-none focus:border-blue-500 transition-colors"
                        />
                        <button className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors">
                            <Mic size={20} />
                        </button>
                    </div>
                </div>

                {/* SIDEBAR: AI Analytics */}
                <div className="w-full lg:w-80 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6 text-slate-300 font-bold border-b border-slate-700/50 pb-4">
                        <BrainCircuit size={18} className="text-purple-400" />
                        <h2>Analítica IA</h2>
                    </div>

                    <div className="flex-1">
                        <ProgressBar
                            label="Rigor Lógico"
                            value={85}
                            colorClass="bg-gradient-to-r from-blue-600 to-blue-400"
                            shadowClass="shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                        />
                        <ProgressBar
                            label="Calidad de Evidencia"
                            value={72}
                            colorClass="bg-gradient-to-r from-purple-600 to-purple-400"
                            shadowClass="shadow-[0_0_10px_rgba(147,51,234,0.4)]"
                        />
                        <ProgressBar
                            label="Participación"
                            value={94}
                            colorClass="bg-gradient-to-r from-emerald-600 to-emerald-400"
                            shadowClass="shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                        />

                        {/* Verdict Box */}
                        {analyzing ? (
                            <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-indigo-500/20 flex flex-col items-center justify-center text-center animate-pulse">
                                <Sparkles className="text-indigo-400 animate-spin mb-3" size={32} />
                                <p className="text-indigo-200 font-bold">Procesando Veredicto...</p>
                                <p className="text-xs text-indigo-400/70 mt-1">Analizando 14 puntos de datos</p>
                            </div>
                        ) : verdict ? (
                            <div className="mt-8 p-0 overflow-hidden bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-2xl border border-indigo-500/30 animate-in fade-in zoom-in-95 duration-500">
                                <div className="p-4 bg-indigo-600/20 border-b border-indigo-500/20 text-center">
                                    <h3 className="text-white font-bold text-lg">Veredicto Final</h3>
                                </div>
                                <div className="p-5 text-center">
                                    <div className="text-4xl font-black text-white mb-1">{verdict.score}</div>
                                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">Puntuación Global</div>

                                    <div className="text-sm text-slate-300 mb-2">
                                        Ganador: <span className="font-bold text-white">{verdict.winner}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 italic">"{verdict.reason}"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-auto pt-8"></div>
                        )}
                    </div>

                    <button
                        onClick={handleGenerateVerdict}
                        disabled={analyzing || verdict}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {analyzing ? 'Analizando...' : <><Zap size={18} fill="currentColor" /> Generar Veredicto IA</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DebatePanel;
