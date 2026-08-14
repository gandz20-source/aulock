import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { evaluateDebateArgument } from '../services/GeminiService';
import { recordStudentActivity } from '../services/VocationalEngine';
import { 
    Mic, Sparkles, Send, Award, ThumbsUp, ThumbsDown, MessageSquare, 
    CheckCircle2, BrainCircuit, ShieldCheck, RefreshCw, ChevronRight, Zap
} from 'lucide-react';

const DEBATE_TOPICS = [
    {
        id: 'topic-1',
        title: '¿Debe la Inteligencia Artificial reemplazarse como herramienta principal de enseñanza en todos los colegios?',
        category: 'Tecnología & Educación',
        favorCount: 14,
        againstCount: 9
    },
    {
        id: 'topic-2',
        title: '¿Es más importante priorizar el aprendizaje de programación antes que ramos artísticos?',
        category: 'Currículo & Futuro',
        favorCount: 18,
        againstCount: 12
    }
];

const INITIAL_ARGUMENTS = [
    {
        id: 'arg-1',
        author: 'Sofía Martínez',
        course: '4° Medio A',
        stance: 'favor',
        text: 'La IA permite personalizar el ritmo de aprendizaje a la velocidad exacta de cada estudiante, algo imposible en un aula tradicional con 35 alumnos.',
        aiScore: 92,
        feedback: 'Excelente uso de evidencia sobre personalización cognitiva.'
    },
    {
        id: 'arg-2',
        author: 'Mateo Rojas',
        course: '4° Medio A',
        stance: 'against',
        text: 'El contacto humano, la empatía y la formación ética de un profesor no pueden ser reemplazados por ningún algoritmo.',
        aiScore: 94,
        feedback: 'Argumento centrado en desarrollo socioemocional sólido.'
    }
];

const DebateArena = () => {
    const { profile } = useAuth();
    const [selectedTopic, setSelectedTopic] = useState(DEBATE_TOPICS[0]);
    const [stance, setStance] = useState('favor');
    const [argumentText, setArgumentText] = useState('');
    const [argumentsList, setArgumentsList] = useState(INITIAL_ARGUMENTS);
    const [evaluating, setEvaluating] = useState(false);
    const [lastEvaluation, setLastEvaluation] = useState(null);

    const handleSubmitArgument = async (e) => {
        e.preventDefault();
        if (!argumentText.trim()) return alert("Por favor escribe tu argumento.");

        setEvaluating(true);

        // Evaluate argument using Gemini 2.5 Flash AI
        const evaluation = await evaluateDebateArgument({
            topic: selectedTopic.title,
            stance: stance === 'favor' ? 'A Favor' : 'En Contra',
            argumentText: argumentText,
            studentName: profile?.full_name || 'Juan Carlos Pérez'
        });

        // Record measurable score into student profile engine
        recordStudentActivity({
            type: 'Debate Arena',
            title: `Debate: ${selectedTopic.title.slice(0, 30)}...`,
            score: evaluation.overallScore,
            dimension: 'communication',
            details: `Postura: ${stance === 'favor' ? 'A Favor' : 'En Contra'} | Nota Lógica: ${evaluation.logicScore}`
        });

        const newArg = {
            id: 'arg-' + Date.now(),
            author: profile?.full_name || 'Juan Carlos Pérez',
            course: '4° Medio A',
            stance: stance,
            text: argumentText,
            aiScore: evaluation.overallScore,
            feedback: evaluation.feedback
        };

        setArgumentsList([newArg, ...argumentsList]);
        setLastEvaluation(evaluation);
        setArgumentText('');
        setEvaluating(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 pb-24">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/20">
                            <Mic className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-black text-white">Arena de Debate con Evaluación IA</h1>
                                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                    Medición Medible de Comunicación
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">
                                Presenta argumentos, debate con tus compañeros y recibe una evaluación cualitativa en tiempo real por <strong>Gemini 2.5 Flash</strong>.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs font-bold text-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Tu Competencia de Argumentación</span>
                        <div className="text-2xl font-black text-rose-400 mt-0.5">90% / 100</div>
                        <span className="text-[10px] text-slate-500">Actualizado con cada intervención</span>
                    </div>
                </div>

                {/* TOPIC SELECTOR & FORM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Form Section (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                        <div>
                            <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                                Tema de Debate Activo
                            </span>
                            <h2 className="text-lg font-black text-white mt-2 leading-snug">
                                "{selectedTopic.title}"
                            </h2>
                        </div>

                        <form onSubmit={handleSubmitArgument} className="space-y-4">
                            {/* Stance Selector */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Selecciona tu Postura</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStance('favor')}
                                        className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                                            stance === 'favor'
                                                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/20'
                                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                        }`}
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>A Favor ({selectedTopic.favorCount})</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setStance('against')}
                                        className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                                            stance === 'against'
                                                ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/20'
                                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                                        }`}
                                    >
                                        <ThumbsDown className="w-4 h-4" />
                                        <span>En Contra ({selectedTopic.againstCount})</span>
                                    </button>
                                </div>
                            </div>

                            {/* Argument Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Fundamenta tu Argumento</label>
                                <textarea
                                    value={argumentText}
                                    onChange={e => setArgumentText(e.target.value)}
                                    placeholder="Expón tus ideas principales, evidencias y argumentos lógicos..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-rose-500 transition-all h-32 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={evaluating}
                                className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Sparkles className={`w-4 h-4 ${evaluating ? 'animate-spin' : ''}`} />
                                <span>{evaluating ? 'Gemini IA Evaluando...' : 'Enviar Argumento & Evaluar con IA'}</span>
                            </button>
                        </form>
                    </div>

                    {/* AI Feedback Panel (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-white flex items-center space-x-2">
                                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                                    <span>Evaluación en Tiempo Real por Gemini IA</span>
                                </h3>
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded">
                                    Gemini 2.5 Flash
                                </span>
                            </div>

                            {lastEvaluation ? (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Lógica</span>
                                            <span className="text-lg font-black text-emerald-400">{lastEvaluation.logicScore}%</span>
                                        </div>
                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Evidencia</span>
                                            <span className="text-lg font-black text-indigo-400">{lastEvaluation.evidenceScore}%</span>
                                        </div>
                                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                            <span className="text-[9px] text-slate-400 uppercase font-bold block">Formación</span>
                                            <span className="text-lg font-black text-amber-400">{lastEvaluation.civicScore}%</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Veredicto y Retroalimentación:</span>
                                        <p className="text-xs text-slate-200 leading-relaxed italic">
                                            "{lastEvaluation.feedback}"
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-slate-950 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
                                    <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <span>Envía tu argumento para recibir la evaluación instantánea y registrar tus puntos de comunicación.</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
                            <span>Puntaje Integrado al Perfil</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* ARGUMENTS TIMELINE */}
                <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                    <h3 className="text-base font-black text-white flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-indigo-400" />
                        <span>Argumentos de la Comunidad Evaluados por IA ({argumentsList.length})</span>
                    </h3>

                    <div className="space-y-4">
                        {argumentsList.map((arg) => (
                            <div key={arg.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                                            arg.stance === 'favor' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                        }`}>
                                            {arg.stance === 'favor' ? '👍 A Favor' : '👎 En Contra'}
                                        </span>
                                        <div>
                                            <h4 className="text-xs font-bold text-white">{arg.author}</h4>
                                            <span className="text-[10px] text-slate-500">{arg.course}</span>
                                        </div>
                                    </div>

                                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                                        Evaluación IA: {arg.aiScore}%
                                    </span>
                                </div>

                                <p className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-slate-800">
                                    "{arg.text}"
                                </p>

                                {arg.feedback && (
                                    <p className="text-[11px] text-indigo-300 font-medium bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
                                        💡 Retroalimentación IA: {arg.feedback}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DebateArena;
