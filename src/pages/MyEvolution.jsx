import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVocationalReport, CAREER_DATABASE } from '../services/VocationalEngine';
import TestEvaluator from '../components/TestEvaluator';
import { 
    Award, TrendingUp, Zap, Target, BookOpen, Compass, 
    Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, 
    Calendar, GraduationCap, School, FileText, BrainCircuit, RefreshCw, PlusCircle
} from 'lucide-react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

const MyEvolution = () => {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState(null);
    const [selectedCareer, setSelectedCareer] = useState(CAREER_DATABASE[0]);
    const [radarData, setRadarData] = useState([]);
    const [showTestModal, setShowTestModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [profile]);

    const loadData = async () => {
        setLoading(true);
        const userName = profile?.full_name || 'Juan Carlos';
        const userStats = profile?.stats || null;
        
        const data = await getVocationalReport(userName, userStats);
        setReport(data);

        if (data?.skills) {
            updateRadarChart(data.skills, CAREER_DATABASE[0]);
        }
        setLoading(false);
    };

    const updateRadarChart = (skills, careerTarget) => {
        const categories = [
            { name: 'Lógica / Mat.', key: 'logic', reqKey: 'reqLogic' },
            { name: 'Idiomas', key: 'communication', reqKey: 'reqLanguages' },
            { name: 'Biología / C. Nat.', key: 'naturalSciences', reqKey: 'reqBio' },
            { name: 'Humanidades', key: 'humanities', reqKey: 'reqHumanities' },
            { name: 'Artes / Creatividad', key: 'creativity', reqKey: 'reqArt' },
            { name: 'Resiliencia', key: 'resilience', reqKey: 'reqResilience' }
        ];

        const chartData = categories.map(c => ({
            subject: c.name,
            Alumno: skills[c.key] || 70,
            Carrera: careerTarget ? careerTarget[c.reqKey] : 80,
            fullMark: 100
        }));

        setRadarData(chartData);
    };

    const handleCareerChange = (e) => {
        const found = CAREER_DATABASE.find(c => c.id === e.target.value);
        if (found) {
            setSelectedCareer(found);
            if (report?.skills) {
                updateRadarChart(report.skills, found);
            }
        }
    };

    const handleAddAssessment = async (newAssessment) => {
        setLoading(true);
        const updatedSkills = { ...report.skills };

        if (newAssessment.category && updatedSkills[newAssessment.category] !== undefined) {
            // Smooth moving average update
            updatedSkills[newAssessment.category] = Math.round(
                (updatedSkills[newAssessment.category] * 0.7) + (newAssessment.score * 0.3)
            );
        }

        const updatedTests = [newAssessment, ...report.recentTests];
        
        // Re-generate report with new assessment
        const data = await getVocationalReport(profile?.full_name || 'Juan Carlos', updatedSkills);
        data.recentTests = updatedTests;
        
        setReport(data);
        updateRadarChart(updatedSkills, selectedCareer);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                <p className="text-slate-400 font-medium">Analizando perfil vocacional y recalculando estadísticas con Gemini AI...</p>
            </div>
        );
    }

    const { skills, diagnosis, longitudinalHistory, recentTests } = report;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Top Profile Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center space-x-5">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-xl">
                                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-black text-white">
                                    {profile?.full_name?.charAt(0) || 'J'}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-2">
                                    <h1 className="text-2xl md:text-3xl font-black text-white">{profile?.full_name || 'Juan Carlos'}</h1>
                                    <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                        4° Medio • K-12 a Universidad
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mt-1">
                                    Seguimiento de Pruebas, Controles y Diagnóstico Vocacional Continuo
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowTestModal(true)}
                                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center space-x-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>+ Registrar Control / Prueba</span>
                            </button>

                            <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Promedio General</span>
                                    <p className="text-xl font-black text-white">80.8% (Nota 6.3)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Vocational Cognitive Summary Card (The Executive Report requested) */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 rounded-3xl p-6 md:p-8 border border-indigo-500/30 shadow-xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                                    Diagnóstico Cognitivo y Vocacional <span className="text-xs bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-md">Impulsado por Gemini AI</span>
                                </h2>
                                <p className="text-xs text-slate-400">Síntesis cualitativa basada en controles, pruebas y trayectoria académica acumulada</p>
                            </div>
                        </div>
                    </div>

                    {/* Qualitative AI Summary Text */}
                    <div className="bg-slate-950/70 backdrop-blur-md rounded-2xl p-5 border border-slate-800 mb-6">
                        <p className="text-sm md:text-base text-slate-200 leading-relaxed italic">
                            "{diagnosis.qualitativeSummary}"
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Top Strengths */}
                        <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80">
                            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Fortalezas Principales
                            </h3>
                            <ul className="space-y-2">
                                {diagnosis.topStrengths?.map((str, idx) => (
                                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Areas to Improve */}
                        <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800/80">
                            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Oportunidades de Refuerzo
                            </h3>
                            <ul className="space-y-2">
                                {diagnosis.areasToImprove?.map((area, idx) => (
                                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                                        <span className="text-amber-400 font-bold">•</span>
                                        <span>{area}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Skill Radar & Career Match Explorer Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left: Interactive Radar Chart & Career Comparison (7 Cols) */}
                    <div className="lg:col-span-7 bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                                        <Compass className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-white">Brújula de Aptitudes vs Requisitos</h3>
                                        <p className="text-xs text-slate-400">Compara tu perfil académico actual con carreras universitarias</p>
                                    </div>
                                </div>
                            </div>

                            {/* Career Select Dropdown */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Selecciona Meta Profesional</label>
                                <select
                                    value={selectedCareer.id}
                                    onChange={handleCareerChange}
                                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    {CAREER_DATABASE.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.area})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Radar Chart */}
                            <div className="h-[280px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid stroke="#334155" opacity={0.5} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

                                        <Radar
                                            name="Tu Nivel Actual"
                                            dataKey="Alumno"
                                            stroke="#818cf8"
                                            strokeWidth={3}
                                            fill="#6366f1"
                                            fillOpacity={0.35}
                                        />
                                        <Radar
                                            name="Requisito de Carrera"
                                            dataKey="Carrera"
                                            stroke="#ec4899"
                                            strokeDasharray="4 4"
                                            fill="transparent"
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex justify-center gap-6 mt-2 text-xs font-bold">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Tu Nivel Actual</span>
                                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-pink-500 rounded-full border border-dashed"></div> Requisito Carrera ({selectedCareer.name})</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-800/80 bg-slate-950/40 p-4 rounded-2xl">
                            <p className="text-xs text-slate-400">
                                <strong className="text-slate-200">Descripción:</strong> {selectedCareer.description}
                            </p>
                        </div>
                    </div>

                    {/* Right: Study Guidelines & Pautas Complementarias (5 Cols) */}
                    <div className="lg:col-span-5 bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-white">Pautas de Estudio & Ayuda</h3>
                                    <p className="text-xs text-slate-400">Estrategias recomendadas para potenciar tu rendimiento</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {diagnosis.studyGuidelines?.map((guide, idx) => (
                                    <div key={idx} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {guide}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Tests List */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center justify-between">
                                <span>Historial Reciente de Evaluaciones</span>
                                <span className="text-[10px] text-indigo-400">Total: {recentTests.length}</span>
                            </h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                {recentTests.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                                        <div>
                                            <p className="font-bold text-slate-200">{t.subject} - {t.title || 'Control'}</p>
                                            <p className="text-[10px] text-slate-500">{t.date} • {t.gradeLevel || 'Escolar'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-black ${t.score >= 80 ? 'text-emerald-400' : t.score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                {t.score}%
                                            </span>
                                            <p className="text-[10px] text-slate-400">{t.status || 'Registrado'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Longitudinal Academic Progress Line Chart (K-12 to University Timeline) */}
                <div className="bg-slate-900/80 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-white">Trayectoria Longitudinal Histórica (K-12 → Universidad)</h3>
                                <p className="text-xs text-slate-400">Evolución de promedios por asignatura registrados a lo largo de los años escolares</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <span>Registro Histórico Acumulado (2023 - 2026)</span>
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={longitudinalHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: 'bold' }} />
                                <YAxis domain={[40, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                                />
                                <Line type="monotone" dataKey="math" name="Matemáticas" stroke="#818cf8" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="languages" name="Idiomas" stroke="#34d399" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="art" name="Artes & Creatividad" stroke="#f472b6" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="biology" name="Biología" stroke="#fbbf24" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs font-bold text-slate-400">
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-indigo-400 rounded-full"></div> Matemáticas (+12%)</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-400 rounded-full"></div> Idiomas (+5%)</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-pink-400 rounded-full"></div> Artes & Creatividad (+7%)</span>
                        <span className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded-full"></div> Biología (-8%)</span>
                    </div>
                </div>

            </div>

            {/* Test Evaluator Modal */}
            {showTestModal && (
                <TestEvaluator
                    onAddAssessment={handleAddAssessment}
                    onClose={() => setShowTestModal(false)}
                />
            )}
        </div>
    );
};

export default MyEvolution;
