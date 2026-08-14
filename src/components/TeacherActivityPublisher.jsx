import React, { useState } from 'react';
import { generateQuestionsWithIA } from '../services/GeminiService';
import { MINEDUC_OA_CATALOG } from '../data/AuLockTutorsData';
import { CurriculumSearchInput } from './CurriculumSearchInput';
import { Sparkles, BookOpen, Send, CheckCircle, Search, Layers, Play } from 'lucide-react';

export const TeacherActivityPublisher = ({ onActivityPublished }) => {
    const allOAs = MINEDUC_OA_CATALOG.flatMap(item => {
        const oas = item.objetivos_aprendizaje || item.oa_catalogo || [];
        return oas.map(oa => ({
            ...oa,
            oa_id: oa.oa_id || oa.codigo || 'OA 08',
            oa_descripcion: oa.descripcion_completa || oa.oa_descripcion || oa.descripcion_corta || 'Objetivo de Aprendizaje',
            nivel: item.nivel_educativo || item.nivel || '4° Básico',
            asignatura: item.eje_tematico || item.asignatura || 'Ciencias Naturales'
        }));
    });

    const [activityData, setActivityData] = useState({
        titulo: '',
        tipo: 'formativa',
        oa: allOAs[0] || {
            oa_id: "OA 08",
            oa_descripcion: "Investigar experimentalmente y explicar las propiedades de la luz (propagación rectilínea, reflexión y refracción).",
            nivel: "4° Básico",
            asignatura: "Ciencias Naturales"
        }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [topicInput, setTopicInput] = useState('');
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    // 1. Búsqueda Inteligente del OA
    const handleCurriculumSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredOAs = searchQuery.trim() === '' ? allOAs.slice(0, 3) : allOAs.filter(oa => 
        (oa.oa_id && oa.oa_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (oa.oa_descripcion && oa.oa_descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (oa.asignatura && oa.asignatura.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 2. Generación Automática de Preguntas con IA
    const handleGenerateWithIA = async () => {
        if (!activityData.oa) return;
        setIsGenerating(true);
        try {
            const questions = await generateQuestionsWithIA(topicInput, activityData.oa, activityData.tipo);
            setGeneratedQuestions(questions);
        } catch (e) {
            console.error("Error generando preguntas:", e);
        } finally {
            setIsGenerating(false);
        }
    };

    // 3. Publicación de la Actividad
    const handlePublish = async () => {
        if (!activityData.titulo.trim()) {
            alert("Por favor ingresa un título para la actividad.");
            return;
        }

        const finalActivity = {
            actividad_id: `ACT_${Date.now().toString().slice(-5)}`,
            profesor_id: "PROF_001",
            titulo: activityData.titulo,
            estado: 'lanzada',
            vinculacion_curricular: {
                asignatura: activityData.oa.asignatura || "Ciencias Naturales",
                nivel: activityData.oa.nivel || "4° Básico",
                eje: "Ciencias Físicas y Químicas",
                oa_codigo: activityData.oa.oa_id || "OA 08",
                oa_descripcion: activityData.oa.oa_descripcion
            },
            configuracion: {
                tipo: activityData.tipo === 'formativa' ? "cuestionario_vivo" : "investigacion_sumativa",
                usa_rubrica_ia: true,
                permite_entrega_tardia: false
            },
            preguntas: generatedQuestions.length > 0 ? generatedQuestions : [
                {
                    id: "q1",
                    texto: `Explica en tus palabras los principios del ${activityData.oa.oa_id || 'OA 08'}.`,
                    tipo: "abierta",
                    rubrica_id: "RUB_MINEDUC"
                }
            ],
            fecha_creacion: new Date().toISOString()
        };

        if (onActivityPublished) {
            onActivityPublished(finalActivity);
        }

        setIsPublished(true);
        setTimeout(() => setIsPublished(false), 4000);
    };

    return (
        <div className="p-6 md:p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl space-y-6 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 tracking-wider">
                        INTELIGENCIA CURRICULAR MINEDUC
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white mt-2 flex items-center space-x-2">
                        <Sparkles className="w-6 h-6 text-amber-400" />
                        <span>🤖 Lanzador Inteligente de Actividades Evaluativas</span>
                    </h2>
                </div>

                {isPublished && (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black px-4 py-2 rounded-2xl animate-bounce flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>¡Lanzada a Sala con Éxito!</span>
                    </span>
                )}
            </div>

            {/* Paso 1: Título y Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Título de la Actividad</label>
                    <input
                        type="text"
                        placeholder="Ej. Control: Propiedades de la Luz (4° Básico)"
                        value={activityData.titulo}
                        onChange={(e) => setActivityData({ ...activityData, titulo: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Tipo de Evaluación</label>
                    <select
                        value={activityData.tipo}
                        onChange={(e) => setActivityData({ ...activityData, tipo: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-indigo-500"
                    >
                        <option value="formativa">Formativa (Socrática)</option>
                        <option value="sumativa">Sumativa (Escala 1.0-7.0)</option>
                    </select>
                </div>
            </div>

            {/* Paso 2: Vinculación Curricular Inteligente */}
            <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase">¿Qué OA vas a evaluar? (Búsqueda Inteligente MINEDUC)</label>
                <CurriculumSearchInput
                    onSelect={(oa) => setActivityData({ ...activityData, oa })}
                    nivelId={activityData.oa?.nivel || '4° Básico'}
                    asignaturaId={activityData.oa?.asignatura || 'Ciencias Naturales'}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {filteredOAs.map((oa, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActivityData({ ...activityData, oa })}
                            className={`p-3 rounded-2xl border transition cursor-pointer ${
                                activityData.oa?.oa_id === oa.oa_id
                                    ? 'bg-indigo-950/80 border-indigo-500 shadow-md scale-[1.01]'
                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="font-mono font-bold text-amber-300">{oa.oa_id}</span>
                                <span className="text-slate-400">{oa.nivel}</span>
                            </div>
                            <p className="text-xs text-slate-300 line-clamp-2 font-medium">{oa.oa_descripcion}</p>
                        </div>
                    ))}
                </div>

                {activityData.oa && (
                    <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span><strong>Vinculado:</strong> {activityData.oa.oa_id} - {activityData.oa.oa_descripcion}</span>
                    </div>
                )}
            </div>

            {/* Paso 3: Generación de Preguntas con IA */}
            {activityData.oa && (
                <div className="border-t border-slate-800 pt-5 space-y-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                                <Layers className="w-4 h-4 text-cyan-400" />
                                <span>Generar preguntas automáticas con Gemini 2.5 Flash</span>
                            </h3>
                            <p className="text-xs text-slate-400">Genera preguntas de alternativas y abiertas socráticas ligadas al OA</p>
                        </div>

                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <input
                                type="text"
                                placeholder="Tema específico (ej. Refracción en prismas)..."
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500 flex-1 md:w-64"
                            />
                            <button
                                onClick={handleGenerateWithIA}
                                disabled={isGenerating}
                                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition whitespace-nowrap flex items-center space-x-1.5"
                            >
                                <Sparkles className="w-4 h-4 text-amber-300" />
                                <span>{isGenerating ? 'Generando...' : 'Generar Preguntas'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Vista previa de preguntas generadas */}
                    {generatedQuestions.length > 0 && (
                        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Vista Previa de Preguntas Generadas</span>
                            {generatedQuestions.map((q, i) => (
                                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                                    <div className="flex justify-between font-bold text-slate-200">
                                        <span>Q{i + 1}: {q.texto}</span>
                                        <span className="text-cyan-400 text-[10px] uppercase">{q.tipo}</span>
                                    </div>
                                    {q.opciones && (
                                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 pt-1">
                                            {q.opciones.map((opt, idx) => (
                                                <div key={idx} className={opt === q.correcta ? 'text-emerald-400 font-bold' : ''}>{opt}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Paso 4: Botón de Publicación */}
            <button
                onClick={handlePublish}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition flex items-center justify-center space-x-2"
            >
                <Play className="w-5 h-5 fill-white" />
                <span>🚀 Lanzar Actividad y Notificar al Curso en Tiempo Real</span>
            </button>
        </div>
    );
};

export default TeacherActivityPublisher;
