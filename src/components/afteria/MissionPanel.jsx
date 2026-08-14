import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, Timer, Sparkles, Send, RefreshCw, Layers } from 'lucide-react';
import { generateFormativeFeedback } from '../../services/GeminiService';

export const MissionPanel = ({ mission, onComplete, onClose }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Estado especial para el tipo match_columna (Inglés)
    const [matchState, setMatchState] = useState({
        zanahoria: '',
        papa: '',
        manzana: '',
        cebolla: ''
    });

    if (!mission) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (mission.tipoInput === 'match_columna') {
                const isMatchCorrect = 
                    matchState.zanahoria === 'CARROT' &&
                    matchState.papa === 'POTATO' &&
                    matchState.manzana === 'APPLE' &&
                    matchState.cebolla === 'ONION';

                if (isMatchCorrect) {
                    setFeedbackMsg({ isCorrect: true, text: '¡Excelente! Has emparejado correctamente los ingredientes.' });
                    setTimeout(() => onComplete(mission.id, mission.puntosPremio, mission.tipoInput, matchState), 1200);
                } else {
                    setFeedbackMsg({ isCorrect: false, text: 'Revisa las parejas de vocabulario e intenta de nuevo.' });
                }
            } else if (mission.tipoInput === 'texto_desarrollo') {
                // Retroalimentación formativa de IA Socrática
                const socraticFeedback = await generateFormativeFeedback({
                    studentAnswer: userAnswer,
                    oaContext: {
                        nivel: '8° Básico / I° Medio',
                        oa_descripcion: mission.problema
                    }
                });
                setFeedbackMsg({ isCorrect: true, text: socraticFeedback });
                setTimeout(() => onComplete(mission.id, mission.puntosPremio, mission.tipoInput, userAnswer), 2000);
            } else {
                // Validación numérica / científica / cámara
                const cleanUser = userAnswer.trim().replace(',', '.');
                const cleanExpected = mission.respuestaCorrecta.trim().replace(',', '.');

                if (cleanUser === cleanExpected || Math.abs(parseFloat(cleanUser) - parseFloat(cleanExpected)) < 0.5) {
                    setFeedbackMsg({ isCorrect: true, text: `¡Respuesta Correcta! Desbloqueaste +${mission.puntosPremio} PS.` });
                    setTimeout(() => onComplete(mission.id, mission.puntosPremio, mission.tipoInput, userAnswer), 1200);
                } else {
                    setFeedbackMsg({ isCorrect: false, text: `Respuesta incorrecta. Revisa tus cálculos e intenta nuevamente.` });
                }
            }
        } catch (err) {
            console.error("Error en validación de misión:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSimulateCameraCapture = () => {
        setIsCameraActive(true);
        setTimeout(() => {
            setUserAnswer(mission.respuestaCorrecta);
            setIsCameraActive(false);
            alert("📷 Cámara Visión IA AuLock: Ejercicio detectado y escaneado con éxito (x = 1).");
        }, 1500);
    };

    return (
        <div className="bg-slate-900 border-2 border-cyan-500/50 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl text-white animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-4">
                    <img
                        src={mission.avatarUrl}
                        alt={mission.personaje}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400 shadow-md shrink-0"
                    />
                    <div>
                        <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-500/20 px-3 py-0.5 rounded-full border border-cyan-400/40">
                            {mission.materia} • NIVEL: {mission.nivel}
                        </span>
                        <h2 className="text-xl font-black text-white mt-1">{mission.titulo} ({mission.personaje})</h2>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-amber-300 bg-amber-500/20 px-4 py-2 rounded-2xl border border-amber-400/40">
                        🏆 +{mission.puntosPremio} PS
                    </span>
                    <button
                        onClick={onClose}
                        className="text-xs text-slate-400 hover:text-white px-3 py-2 bg-slate-800 rounded-xl font-bold"
                    >
                        ✕ Cerrar
                    </button>
                </div>
            </div>

            {/* Contexto y Problema */}
            <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-300 italic">"{mission.contexto}"</p>
                <h3 className="text-sm md:text-base font-black text-cyan-200 leading-relaxed font-mono">
                    {mission.problema}
                </h3>
            </div>

            {/* Formulario según tipoInput */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Texto Numérico / Numérico Científico */}
                {(mission.tipoInput === 'texto_numerico' || mission.tipoInput === 'texto_numerico_cientifico') && (
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ingresa tu Respuesta:</label>
                        <input
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder={mission.tipoInput === 'texto_numerico_cientifico' ? "Ej. 1988.3" : "Ej. 3"}
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm font-bold font-mono focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                )}

                {/* 2. Texto Numérico con Cámara */}
                {mission.tipoInput === 'texto_numerico_camara' && (
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ingresa tu Respuesta o Escanea:</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Ingresa x = ..."
                                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm font-bold font-mono focus:outline-none focus:border-cyan-400"
                            />
                            <button
                                type="button"
                                onClick={handleSimulateCameraCapture}
                                disabled={isCameraActive}
                                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase flex items-center space-x-2 shrink-0"
                            >
                                <Camera className="w-4 h-4" />
                                <span>{isCameraActive ? 'Escaneando...' : '📷 Visión IA'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. Texto Desarrollo (Ensayo) */}
                {mission.tipoInput === 'texto_desarrollo' && (
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Escribe tu Reflexión / Desarrollo:</label>
                        <textarea
                            rows={4}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Escribe tu análisis sobre el consumismo y la crisis climática para ser evaluado por la IA Formativa..."
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                )}

                {/* 4. Match Columna (Inglés Vocabulario) */}
                {mission.tipoInput === 'match_columna' && (
                    <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div>
                            <span className="text-xs font-bold text-slate-400 block mb-1">🥕 Zanahoria</span>
                            <select
                                value={matchState.zanahoria}
                                onChange={(e) => setMatchState({ ...matchState, zanahoria: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="CARROT">CARROT</option>
                                <option value="POTATO">POTATO</option>
                                <option value="APPLE">APPLE</option>
                                <option value="ONION">ONION</option>
                            </select>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-slate-400 block mb-1">🥔 Papa</span>
                            <select
                                value={matchState.papa}
                                onChange={(e) => setMatchState({ ...matchState, papa: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="CARROT">CARROT</option>
                                <option value="POTATO">POTATO</option>
                                <option value="APPLE">APPLE</option>
                                <option value="ONION">ONION</option>
                            </select>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-slate-400 block mb-1">🍎 Manzana</span>
                            <select
                                value={matchState.manzana}
                                onChange={(e) => setMatchState({ ...matchState, manzana: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="CARROT">CARROT</option>
                                <option value="POTATO">POTATO</option>
                                <option value="APPLE">APPLE</option>
                                <option value="ONION">ONION</option>
                            </select>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-slate-400 block mb-1">🧅 Cebolla</span>
                            <select
                                value={matchState.cebolla}
                                onChange={(e) => setMatchState({ ...matchState, cebolla: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 text-white p-2 rounded-xl text-xs font-bold"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="CARROT">CARROT</option>
                                <option value="POTATO">POTATO</option>
                                <option value="APPLE">APPLE</option>
                                <option value="ONION">ONION</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
                >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>{isSubmitting ? 'Validando con Servidores After IA...' : 'Enviar Respuesta a Aethel Corp'}</span>
                </button>
            </form>

            {/* Feedback Display */}
            {feedbackMsg && (
                <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed ${
                    feedbackMsg.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                    <div className="flex items-center space-x-2 mb-1">
                        {feedbackMsg.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
                        <span className="uppercase">{feedbackMsg.isCorrect ? 'Respuesta Registrada' : 'Revisión Necesaria'}</span>
                    </div>
                    <p className="whitespace-pre-line">{feedbackMsg.text}</p>
                </div>
            )}
        </div>
    );
};

export default MissionPanel;
