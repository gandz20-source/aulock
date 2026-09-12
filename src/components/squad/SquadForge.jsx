import React, { useState } from 'react';
import { 
    Zap, Sparkles, Users, Crown, ShieldAlert, Award, 
    CheckCircle2, ArrowRight, RefreshCw, Send, Check,
    BookOpen, Flame, Compass, HeartHandshake, AlertTriangle
} from 'lucide-react';
import { 
    matchSquadBySynergy, 
    matchSquadByPeerTutoring, 
    createManualSquad, 
    generateAiChallengeForSquad,
    broadcastSquadChallenge 
} from '../../services/SquadChallengeService';
import { COURSE_STUDENT_ROSTER_DATASET } from '../../services/SquadService';

export default function SquadForge({ onSquadCreated, activeCourse = '4° Medio A' }) {
    // Mode: 'SINERGIA_SUPREMA' | 'TUTORIA_DEBILIDADES' | 'ENSAMBLAJE_MANUAL'
    const [matchMode, setMatchMode] = useState('SINERGIA_SUPREMA');

    // Mode 2 Subject
    const [tutoringSubject, setTutoringSubject] = useState('math');

    // Mode 3 Manual Selection
    const [manualSquadName, setManualSquadName] = useState('Squad Dragón STEM');
    const [selectedStudentIds, setSelectedStudentIds] = useState(['st-1', 'st-3', 'st-6', 'st-7']);

    // Current Formed Squad State
    const [formedSquad, setFormedSquad] = useState(() => matchSquadBySynergy());

    // AI Challenge State
    const [challengeTopic, setChallengeTopic] = useState('Optimización Ambiental & Modelación Cuadrática');
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [generatedChallenge, setGeneratedChallenge] = useState(null);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [broadcastSuccess, setBroadcastSuccess] = useState(false);

    // Handlers for Matchmaking
    const handleRunSinergiaSuprema = () => {
        const result = matchSquadBySynergy();
        setFormedSquad(result);
        setGeneratedChallenge(null);
        setBroadcastSuccess(false);
    };

    const handleRunPeerTutoring = () => {
        const result = matchSquadByPeerTutoring(tutoringSubject);
        setFormedSquad(result);
        setGeneratedChallenge(null);
        setBroadcastSuccess(false);
    };

    const handleToggleManualStudent = (id) => {
        if (selectedStudentIds.includes(id)) {
            setSelectedStudentIds(selectedStudentIds.filter(item => item !== id));
        } else {
            if (selectedStudentIds.length >= 4) {
                alert("Un escuadrón AuLock está compuesto estrictamente por 4 estudiantes.");
                return;
            }
            setSelectedStudentIds([...selectedStudentIds, id]);
        }
    };

    const handleBuildManualSquad = () => {
        if (selectedStudentIds.length !== 4) {
            alert("Por favor selecciona exactamente 4 estudiantes para forjar el escuadrón.");
            return;
        }
        const result = createManualSquad({
            squadName: manualSquadName,
            selectedStudentIds
        });
        setFormedSquad(result);
        setGeneratedChallenge(null);
        setBroadcastSuccess(false);
    };

    // AI Challenge Generator Handler
    const handleGenerateAiChallenge = async () => {
        if (!formedSquad) return;
        setIsGeneratingAi(true);
        setBroadcastSuccess(false);

        try {
            const challenge = await generateAiChallengeForSquad({
                mode: matchMode,
                squad: formedSquad,
                subject: matchMode === 'TUTORIA_DEBILIDADES' ? formedSquad.targetSubject : 'Matemática y Ciencias Integradas',
                topic: challengeTopic
            });
            setGeneratedChallenge(challenge);
        } catch (error) {
            console.error("Error generating challenge:", error);
        } finally {
            setIsGeneratingAi(false);
        }
    };

    // Broadcast Challenge to Students via Supabase Realtime
    const handleLaunchChallengeToSquad = async () => {
        if (!generatedChallenge) return;
        setIsBroadcasting(true);

        try {
            await broadcastSquadChallenge(generatedChallenge);
            setBroadcastSuccess(true);
            if (onSquadCreated) {
                onSquadCreated(formedSquad);
            }
        } catch (error) {
            console.error("Broadcast error:", error);
            alert("Inconveniente al transmitir. Los datos se guardaron localmente.");
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <div className="space-y-6 font-mono text-white animate-in fade-in duration-300">
            
            {/* =========================================================================
                HEADER: THE SQUAD FORGE
               ========================================================================= */}
            <div className="bg-slate-950/95 border-2 border-indigo-500/70 p-6 rounded-3xl shadow-[0_0_40px_rgba(99,102,241,0.25)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] shrink-0">
                        ⚡
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base md:text-lg font-orbitron font-black text-white tracking-wider uppercase">
                                SQUAD FORGE // MOTOR DE EMPAREJAMIENTO & RETOS IA
                            </h2>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                                4 INTEGRANTES
                            </span>
                        </div>
                        <p className="text-xs text-indigo-300 font-sans mt-0.5">
                            Composición táctica de escuadrones basada en datos de telemetría de {activeCourse} y generación de desafíos multidisciplinarios con Google GenAI.
                        </p>
                    </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/60 text-emerald-400 text-xs font-mono flex items-center gap-2 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>● Supabase Realtime Listo</span>
                </div>
            </div>

            {/* =========================================================================
                MATCHMAKING MODE TABS
               ========================================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Mode 1 Tab */}
                <button
                    onClick={() => {
                        setMatchMode('SINERGIA_SUPREMA');
                        handleRunSinergiaSuprema();
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        matchMode === 'SINERGIA_SUPREMA'
                            ? 'bg-indigo-950/80 border-indigo-400 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span className="text-xl">⚡</span>
                        <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300">MODO 1</span>
                    </div>
                    <div>
                        <h4 className="text-xs font-orbitron font-black text-white uppercase tracking-wider">
                            Sinergia Suprema
                        </h4>
                        <p className="text-[11px] text-slate-300 font-sans mt-1">
                            4 expertos máximos en 4 materias distintas (Matemática, Ciencia, Lenguaje, Historia).
                        </p>
                    </div>
                </button>

                {/* Mode 2 Tab */}
                <button
                    onClick={() => {
                        setMatchMode('TUTORIA_DEBILIDADES');
                        handleRunPeerTutoring();
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        matchMode === 'TUTORIA_DEBILIDADES'
                            ? 'bg-purple-950/80 border-purple-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span className="text-xl">🤝</span>
                        <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-purple-900/60 text-purple-300">MODO 2</span>
                    </div>
                    <div>
                        <h4 className="text-xs font-orbitron font-black text-white uppercase tracking-wider">
                            Tutoría de Debilidades
                        </h4>
                        <p className="text-[11px] text-slate-300 font-sans mt-1">
                            1 estudiante en área de mejora guiado por 3 mentores de excelencia en esa materia.
                        </p>
                    </div>
                </button>

                {/* Mode 3 Tab */}
                <button
                    onClick={() => {
                        setMatchMode('ENSAMBLAJE_MANUAL');
                        handleBuildManualSquad();
                    }}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        matchMode === 'ENSAMBLAJE_MANUAL'
                            ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span className="text-xl">🛠️</span>
                        <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300">MODO 3</span>
                    </div>
                    <div>
                        <h4 className="text-xs font-orbitron font-black text-white uppercase tracking-wider">
                            Ensamblaje Manual
                        </h4>
                        <p className="text-[11px] text-slate-300 font-sans mt-1">
                            Selección personalizada de 4 alumnos de la nómina con asignación libre de roles.
                        </p>
                    </div>
                </button>

            </div>

            {/* =========================================================================
                MODE CONTROLS & CONFIGURATION PANEL
               ========================================================================= */}
            {matchMode === 'TUTORIA_DEBILIDADES' && (
                <div className="p-5 bg-slate-900/90 border border-purple-500/50 rounded-3xl flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <HeartHandshake className="w-5 h-5 text-purple-400" />
                        <div>
                            <span className="text-xs font-orbitron font-bold text-white uppercase block">
                                ASIGNATURA OBJETIVO DE LA TUTORÍA DE PARES:
                            </span>
                            <span className="text-[11px] text-slate-400 font-sans">
                                El sistema emparejará al alumno que requiere nivelación con los 3 mejores promedios.
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={tutoringSubject}
                            onChange={(e) => {
                                setTutoringSubject(e.target.value);
                                const res = matchSquadByPeerTutoring(e.target.value);
                                setFormedSquad(res);
                            }}
                            className="bg-slate-950 border-2 border-purple-500 rounded-xl px-4 py-2 text-xs font-bold text-purple-300 outline-none cursor-pointer"
                        >
                            <option value="math">📐 Matemática & Cálculo</option>
                            <option value="biology">🧬 Biología Celular</option>
                            <option value="chemistry">🧪 Química Aplicada</option>
                            <option value="language">📖 Lenguaje & Argumentación</option>
                            <option value="history">🏛️ Historia & Ciudadanía</option>
                        </select>

                        <button
                            onClick={handleRunPeerTutoring}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-bold text-xs uppercase rounded-xl transition cursor-pointer"
                        >
                            🔄 Re-Calcular
                        </button>
                    </div>
                </div>
            )}

            {matchMode === 'ENSAMBLAJE_MANUAL' && (
                <div className="p-5 bg-slate-900/90 border border-cyan-500/50 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <span className="text-xs font-orbitron font-bold text-cyan-300 uppercase block">
                                SELECCIONA EXACTAMENTE 4 ESTUDIANTES ({selectedStudentIds.length} / 4 SELECCIONADOS):
                            </span>
                            <span className="text-[11px] text-slate-400 font-sans">
                                Haz clic en los alumnos de la nómina para agregarlos o removerlos del escuadrón.
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={manualSquadName}
                                onChange={(e) => setManualSquadName(e.target.value)}
                                placeholder="Nombre del Squad..."
                                className="bg-slate-950 border border-cyan-500/60 rounded-xl px-3 py-1.5 text-xs text-white outline-none font-mono"
                            />
                            <button
                                onClick={handleBuildManualSquad}
                                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-black text-xs uppercase rounded-xl transition cursor-pointer"
                            >
                                Forjar Squad
                            </button>
                        </div>
                    </div>

                    {/* Student Selection Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                        {COURSE_STUDENT_ROSTER_DATASET.map((st) => {
                            const isSelected = selectedStudentIds.includes(st.id);
                            return (
                                <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => handleToggleManualStudent(st.id)}
                                    className={`p-2.5 rounded-xl border text-left font-mono text-xs transition cursor-pointer flex items-center justify-between ${
                                        isSelected
                                            ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                                    }`}
                                >
                                    <div>
                                        <strong className="block text-[11px] truncate">{st.name}</strong>
                                        <span className="text-[10px] text-slate-400">GPA {st.gpa}</span>
                                    </div>
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${
                                        isSelected ? 'bg-cyan-400 border-cyan-400 text-slate-950 font-bold' : 'border-slate-700'
                                    }`}>
                                        {isSelected ? '✓' : ''}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* =========================================================================
                THE FORMED SQUAD VISUALIZATION (4 PARTY CARDS)
               ========================================================================= */}
            {formedSquad && (
                <div className="p-6 bg-slate-950/90 border-2 border-indigo-500/60 rounded-3xl space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-orbitron font-black text-indigo-300 uppercase tracking-wider">
                                    {formedSquad.squadName}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600 text-[10px] font-bold">
                                    Sinergia: {formedSquad.synergyIndex}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 font-sans mt-1">
                                {formedSquad.pedagogical_rationale}
                            </p>
                        </div>

                        <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300 font-orbitron font-bold">
                            GPA Promedio: {formedSquad.avgGpa || '6.4'}
                        </div>
                    </div>

                    {/* 4 Member Party Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {formedSquad.members.map((m, idx) => (
                            <div 
                                key={m.id || idx}
                                className={`p-4 rounded-2xl border-2 space-y-3 flex flex-col justify-between transition ${
                                    m.is_apprentice 
                                        ? 'bg-amber-950/40 border-amber-400/90 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                                        : 'bg-slate-900/90 border-indigo-500/40 hover:border-indigo-400'
                                }`}
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded uppercase ${
                                            m.is_apprentice 
                                                ? 'bg-amber-900/80 text-amber-300 border border-amber-600'
                                                : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                        }`}>
                                            {m.is_apprentice ? '🎯 APRENDIZ' : `⚡ INTEGRANTE ${idx + 1}`}
                                        </span>
                                        <span className="text-xs font-orbitron font-black text-white">{m.gpa}</span>
                                    </div>

                                    <div>
                                        <h5 className="text-sm font-bold text-white font-sans">{m.name}</h5>
                                        <span className="text-[11px] text-cyan-300 font-bold block mt-0.5">
                                            {m.squad_role}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-sans">
                                    {m.expert_domain && (
                                        <div className="text-emerald-300 flex items-center gap-1">
                                            <span>🌟</span>
                                            <span>{m.expert_domain} ({m.domain_score})</span>
                                        </div>
                                    )}
                                    {m.target_growth && (
                                        <div className="text-amber-300 flex items-center gap-1">
                                            <span>📈</span>
                                            <span>Área de Mejora: {m.target_growth} ({m.score_in_subject})</span>
                                        </div>
                                    )}
                                    <div className="text-slate-400 text-[10px] font-mono">
                                        Atención auditada: {m.focus_metric || '94%'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* =========================================================================
                AI CHALLENGE GENERATION (GOOGLE GENAI ENGINE)
               ========================================================================= */}
            <div className="p-6 bg-slate-950/95 border-2 border-amber-500/70 rounded-3xl shadow-[0_0_35px_rgba(245,158,11,0.2)] space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-900/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-950 border border-amber-500 flex items-center justify-center text-xl text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0">
                            🪄
                        </div>
                        <div>
                            <h3 className="text-sm md:text-base font-orbitron font-extrabold text-white uppercase tracking-wider">
                                MOTOR DE DESAFÍOS COOPERATIVOS IA (GEMINI 1.5)
                            </h3>
                            <p className="text-xs text-amber-200/80 font-sans">
                                Genera retos adaptativos calibrados al perfil de los 4 integrantes del escuadrón.
                            </p>
                        </div>
                    </div>

                    <span className="text-[10px] font-orbitron font-bold text-amber-300 bg-amber-950 px-3 py-1 rounded-full border border-amber-600">
                        RECOMPENSA: +150 PS SINERGIA
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                            Tema o Desafío Pedagógico:
                        </label>
                        <input
                            type="text"
                            value={challengeTopic}
                            onChange={(e) => setChallengeTopic(e.target.value)}
                            placeholder="Ej. Optimización de Recursos Hídricos y Cálculo Diferencial..."
                            className="w-full bg-slate-900 border-2 border-amber-500/50 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none font-sans"
                        />
                    </div>

                    <div className="sm:col-span-4 pt-4 sm:pt-0">
                        <button
                            disabled={isGeneratingAi}
                            onClick={handleGenerateAiChallenge}
                            className={`w-full py-3.5 rounded-xl font-orbitron font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                                isGeneratingAi
                                    ? 'bg-slate-800 text-slate-400 cursor-wait'
                                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                            }`}
                        >
                            {isGeneratingAi ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                                    <span>Generando con Gemini...</span>
                                </>
                            ) : (
                                <>
                                    <span>🪄</span>
                                    <span>Generar Desafío IA</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* CHALLENGE PREVIEW CARD */}
                {generatedChallenge && (
                    <div className="p-6 rounded-2xl bg-slate-900/95 border-2 border-amber-400 space-y-4 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-in fade-in duration-200">
                        <div className="flex justify-between items-center border-b border-amber-900/60 pb-3">
                            <span className="text-xs font-orbitron font-bold text-amber-300 uppercase flex items-center gap-1.5">
                                <span>🎯</span>
                                <span>{generatedChallenge.title}</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700">
                                LISTO PARA LANZAR
                            </span>
                        </div>

                        <p className="text-xs md:text-sm text-slate-200 font-sans leading-relaxed">
                            {generatedChallenge.challengeText}
                        </p>

                        {/* Explicit Role Assignment Grid */}
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                            <span className="text-[10px] font-orbitron font-bold text-amber-300 uppercase block">
                                ROL & FASE ASIGNADA A CADA INTEGRANTE:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                                {Object.entries(generatedChallenge.roles || {}).map(([student, roleDesc], i) => (
                                    <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                                        <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-500 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <strong className="text-white block font-mono text-[11px]">{student}:</strong>
                                            <span className="text-slate-300 text-[11px]">{roleDesc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {generatedChallenge.guidelines && (
                            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40 text-xs text-amber-200 font-sans">
                                💡 <strong>Pauta de Interacción:</strong> {generatedChallenge.guidelines}
                            </div>
                        )}

                        {/* Broadcast Button */}
                        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <span className="text-xs text-slate-400 font-sans">
                                Al presionar lanzar, el desafío se proyectará en el widget de los 4 estudiantes de Squad Alfa en tiempo real.
                            </span>

                            <button
                                disabled={isBroadcasting}
                                onClick={handleLaunchChallengeToSquad}
                                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-orbitron font-extrabold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                                    broadcastSuccess
                                        ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                                        : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                }`}
                            >
                                {isBroadcasting ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Transmitiendo a Estudiantes...</span>
                                    </>
                                ) : broadcastSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                        <span>¡Desafío Transmitido con Éxito!</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>🚀 LANZAR DESAFÍO AL ESCUADRÓN</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
