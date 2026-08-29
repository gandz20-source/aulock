import React, { useState, useEffect } from 'react';
import { 
    Users, Plus, Trash2, ShieldAlert, Award, TrendingUp, Sparkles, 
    UserPlus, UserMinus, ArrowUpRight, CheckCircle2, AlertTriangle, 
    BrainCircuit, HeartHandshake, Link, RefreshCw, Zap, Search, ShieldCheck,
    Lock, Unlock, ArrowRightLeft, Compass, Check
} from 'lucide-react';
import { 
    COURSE_STUDENT_ROSTER_DATASET, 
    fetchStudentRosterForClustering, 
    executeAIClusteringEngine, 
    lockSquadsForSemester 
} from '../services/SquadService';

export default function TeacherSquadManager() {
    const [roster, setRoster] = useState(COURSE_STUDENT_ROSTER_DATASET);
    const [squads, setSquads] = useState(() => {
        const saved = localStorage.getItem('aulock_teacher_squads_v3');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { /* fallback */ }
        }
        return [
            {
                id: 'sq-1',
                name: 'Squad Alfa STEM',
                course: '4° Medio A',
                specialty: 'Ciencias Exactas & Tecnología',
                pedagogical_rationale: 'Emparejamiento de alta sinergia entre Juan Carlos (líder en cálculo 7.0) y Mateo (tutor en biología 6.8), complementando sus respectivas áreas de mejora.',
                average_gpa: 6.4,
                collaboration_index: '95%',
                members: [
                    { id: 'st-1', name: 'Juan Carlos Pérez', gpa: 6.8, role: 'Líder Lógico', best_subject: 'Matemáticas (7.0)', growth_area: 'Biología (4.3)', focus_metric: '96%' },
                    { id: 'st-2', name: 'Mateo Rojas', gpa: 6.2, role: 'Mentor de Pares (Ciencias)', best_subject: 'Biología (6.8)', growth_area: 'Matemática Avanzada (4.5)', focus_metric: '88%' },
                    { id: 'st-5', name: 'Lucas Fernández', gpa: 6.1, role: 'Colaborador Creativo & UI', best_subject: 'Diseño & Tech (6.9)', growth_area: 'Cálculo (4.4)', focus_metric: '86%' },
                    { id: 'st-7', name: 'Diego Morales', gpa: 6.3, role: 'Coordinador de Algoritmos', best_subject: 'Programación (7.0)', growth_area: 'Comprensión Lectora (4.6)', focus_metric: '93%' }
                ],
                synergies: [
                    { mentor: 'Juan Carlos Pérez', apprentice: 'Mateo Rojas', area: 'Matemáticas & Cálculo', reason: 'Juan Carlos (7.0) refuerza derivadas y optimización a Mateo (4.5).' },
                    { mentor: 'Mateo Rojas', apprentice: 'Juan Carlos Pérez', area: 'Biología Orgánica', reason: 'Mateo (6.8) guía el laboratorio de ecosistemas celulares a Juan Carlos (4.3).' }
                ]
            },
            {
                id: 'sq-2',
                name: 'Squad Beta Humanidades & Debate',
                course: '4° Medio A',
                specialty: 'Lenguaje, Historia & Química Aplicada',
                pedagogical_rationale: 'Emparejamiento de habilidades comunicativas y científicas: Camila y Sofía guían la argumentación crítica y formación ciudadana (6.9), mientras que Valentina lidera la modelación en Química y Física.',
                average_gpa: 6.4,
                collaboration_index: '93%',
                members: [
                    { id: 'st-3', name: 'Sofía Martínez', gpa: 6.5, role: 'Líder de Ciudadanía & Historia', best_subject: 'Historia (6.9)', growth_area: 'Física Aplicada (4.8)', focus_metric: '94%' },
                    { id: 'st-4', name: 'Camila Silva', gpa: 6.4, role: 'Capitana de Debate & Lenguaje', best_subject: 'Lenguaje (6.9)', growth_area: 'Química (4.6)', focus_metric: '91%' },
                    { id: 'st-6', name: 'Valentina Soto', gpa: 6.6, role: 'Mentora de Pares (Química & Física)', best_subject: 'Química & Física (6.8)', growth_area: 'Historia (4.5)', focus_metric: '95%' },
                    { id: 'st-8', name: 'Constanza Silva', gpa: 6.2, role: 'Coordinadora de Inglés Técnico', best_subject: 'Inglés Técnico (7.0)', growth_area: 'Álgebra (4.2)', focus_metric: '90%' }
                ],
                synergies: [
                    { mentor: 'Valentina Soto', apprentice: 'Camila Silva', area: 'Química & Estequiometría', reason: 'Valentina (6.8) apoya a Camila (4.6) en balance de masa y estequiometría.' },
                    { mentor: 'Camila Silva', apprentice: 'Valentina Soto', area: 'Argumentación & Debate', reason: 'Camila (6.9) entrena a Valentina (4.5) en ensayos y comprensión histórica.' }
                ]
            }
        ];
    });

    const [isClusteringLoading, setIsClusteringLoading] = useState(false);
    const [clusteringSummary, setClusteringSummary] = useState(null);
    const [isLocked, setIsLocked] = useState(() => {
        const saved = localStorage.getItem('aulock_active_squads_v4');
        if (saved) {
            try { return JSON.parse(saved).status === 'LOCKED_SEMESTER'; } catch (e) {}
        }
        return false;
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newSquadName, setNewSquadName] = useState('');
    const [newSquadCourse, setNewSquadCourse] = useState('4° Medio A');
    const [newSquadSpecialty, setNewSquadSpecialty] = useState('STEM & Modelamiento Matemático');

    const [selectedStudentForSquad, setSelectedStudentForSquad] = useState({});
    const [customStudentName, setCustomStudentName] = useState({});
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        fetchStudentRosterForClustering('4° Medio A').then(setRoster);
    }, []);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 4000);
    };

    const saveSquads = (updated) => {
        setSquads(updated);
        localStorage.setItem('aulock_teacher_squads_v3', JSON.stringify(updated));
    };

    const handleRunAIClustering = async () => {
        setIsClusteringLoading(true);
        try {
            const result = await executeAIClusteringEngine('4° Medio A', 'STEM & Humanidades');
            if (result && result.squads && result.squads.length > 0) {
                saveSquads(result.squads);
                setClusteringSummary(result.clustering_summary || 'Algoritmo de clustering completado con balance heterogéneo óptimo.');
                showToast("⚡ ¡Squads generados exitosamente con IA Gemini 2.5 Flash!");
            }
        } catch (err) {
            console.error("Clustering error:", err);
            showToast("⚠️ Error al ejecutar motor de IA, usando modelo de contingencia.");
        } finally {
            setIsClusteringLoading(false);
        }
    };

    const handleToggleLockSemester = async () => {
        if (!isLocked) {
            await lockSquadsForSemester(squads, '4° Medio A');
            setIsLocked(true);
            showToast("🔒 ¡Squads bloqueados y publicados oficialmente para el semestre en el Hub del Alumno!");
        } else {
            if (window.confirm("¿Deseas desbloquear los squads para realizar modificaciones docentes?")) {
                setIsLocked(false);
                const saved = localStorage.getItem('aulock_active_squads_v4');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        parsed.status = 'DRAFT';
                        localStorage.setItem('aulock_active_squads_v4', JSON.stringify(parsed));
                    } catch (e) {}
                }
                showToast("🔓 Modo de edición docente habilitado.");
            }
        }
    };

    const handleChangeMemberRole = (squadId, memberId, newRole) => {
        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                return {
                    ...sq,
                    members: sq.members.map(m => m.id === memberId ? { ...m, role: newRole } : m)
                };
            }
            return sq;
        });
        saveSquads(updated);
        showToast("Rol de estudiante actualizado.");
    };

    const handleMoveMemberToSquad = (fromSquadId, toSquadId, member) => {
        if (fromSquadId === toSquadId) return;
        const targetSquad = squads.find(s => s.id === toSquadId);
        if (targetSquad && targetSquad.members.some(m => m.id === member.id)) {
            return alert("El estudiante ya está en ese Squad.");
        }

        const updated = squads.map(sq => {
            if (sq.id === fromSquadId) {
                return {
                    ...sq,
                    members: sq.members.filter(m => m.id !== member.id)
                };
            }
            if (sq.id === toSquadId) {
                return {
                    ...sq,
                    members: [...sq.members, member]
                };
            }
            return sq;
        });

        saveSquads(updated);
        showToast(`Estudiante ${member.name} reasignado a ${targetSquad?.name}.`);
    };

    const handleCreateSquad = (e) => {
        e.preventDefault();
        if (!newSquadName.trim()) return alert("Por favor ingresa un nombre para el Squad.");

        const newSq = {
            id: 'sq-' + Date.now(),
            name: newSquadName.trim(),
            course: newSquadCourse,
            specialty: newSquadSpecialty,
            pedagogical_rationale: 'Squad personalizado creado por el docente.',
            average_gpa: 6.0,
            collaboration_index: '90%',
            members: [],
            synergies: []
        };

        saveSquads([...squads, newSq]);
        setNewSquadName('');
        setIsCreateModalOpen(false);
        showToast(`Squad "${newSq.name}" creado.`);
    };

    const handleDeleteSquad = (squadId, squadName) => {
        if (window.confirm(`¿Estás seguro de disolver el "${squadName}"?`)) {
            const updated = squads.filter(sq => sq.id !== squadId);
            saveSquads(updated);
            showToast(`Squad "${squadName}" disuelto.`);
        }
    };

    const handleAddRosterStudent = (squadId) => {
        const studentId = selectedStudentForSquad[squadId];
        if (!studentId) return alert("Selecciona un estudiante de la nómina.");

        const student = roster.find(s => s.id === studentId);
        if (!student) return;

        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                if (sq.members.some(m => m.id === student.id || m.name === student.name)) {
                    alert(`${student.name} ya es miembro de este Squad.`);
                    return sq;
                }
                return {
                    ...sq,
                    members: [...sq.members, { 
                        id: student.id, 
                        name: student.name, 
                        role: 'Mentor de Pares', 
                        gpa: student.gpa, 
                        best_subject: student.strengths?.[0] || 'General',
                        growth_area: student.weaknesses?.[0] || 'Refuerzo',
                        focus_metric: student.focus_metric || '90%'
                    }]
                };
            }
            return sq;
        });

        saveSquads(updated);
        setSelectedStudentForSquad(prev => ({ ...prev, [squadId]: '' }));
    };

    const handleRemoveStudent = (squadId, memberId, memberName) => {
        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                return {
                    ...sq,
                    members: sq.members.filter(m => m.id !== memberId && m.name !== memberName)
                };
            }
            return sq;
        });
        saveSquads(updated);
        showToast(`${memberName} removido del Squad.`);
    };

    return (
        <div className="bg-slate-950/90 border-2 border-indigo-500/80 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 font-mono">
            
            {toastMessage && (
                <div className="fixed top-6 right-6 z-50 bg-indigo-600 text-white font-orbitron font-bold text-xs px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(99,102,241,0.8)] border border-indigo-300 animate-bounce flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{toastMessage}</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-indigo-900/60 pb-5">
                <div className="flex items-center space-x-3">
                    <div className="p-3.5 bg-indigo-600/30 border-2 border-indigo-400 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        <BrainCircuit className="w-7 h-7 text-indigo-300" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl md:text-2xl font-orbitron font-black text-white tracking-wider">
                                AI SQUADS MATCHING ENGINE // MINEDUC
                            </h2>
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold font-orbitron uppercase border ${
                                isLocked 
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.4)]' 
                                    : 'bg-amber-950 text-amber-300 border-amber-500'
                            }`}>
                                {isLocked ? '🔒 BLOQUEADO PARA EL SEMESTRE' : '✏️ MODO BORRADOR / AJUSTABLE'}
                            </span>
                        </div>
                        <p className="text-xs text-indigo-300 mt-1">
                            Clustering heterogéneo con Gemini 2.5 Flash, mentoría cruzada bidireccional y control docente.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleRunAIClustering}
                        disabled={isClusteringLoading}
                        className="px-5 py-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.5)] transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                        <Sparkles className={`w-4 h-4 text-amber-300 ${isClusteringLoading ? 'animate-spin' : ''}`} />
                        <span>{isClusteringLoading ? 'Analizando Cohorte...' : '⚡ Generar Squads con IA Heterogénea'}</span>
                    </button>

                    <button
                        onClick={handleToggleLockSemester}
                        className={`px-5 py-3 font-orbitron font-extrabold text-xs uppercase tracking-wider rounded-2xl transition flex items-center space-x-2 cursor-pointer border-2 ${
                            isLocked
                                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                        }`}
                    >
                        {isLocked ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-emerald-200" />}
                        <span>{isLocked ? 'Desbloquear para Edición' : '🔒 Bloquear Squads del Semestre'}</span>
                    </button>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-indigo-500/50 text-indigo-300 font-bold text-xs uppercase rounded-2xl transition flex items-center space-x-1.5 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>+ Nuevo Squad</span>
                    </button>
                </div>
            </div>

            {clusteringSummary && (
                <div className="bg-indigo-950/40 border-2 border-indigo-500/60 p-4 rounded-2xl flex items-start gap-3 shadow-inner">
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                        <strong className="text-xs text-indigo-200 uppercase font-orbitron block">
                            Justificación Pedagógica del Algoritmo de Clustering:
                        </strong>
                        <p className="text-xs text-slate-200 mt-1 font-sans leading-relaxed">
                            {clusteringSummary}
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-orbitron font-extrabold text-indigo-300 uppercase">
                        📊 Nómina Ingestada de Estudiantes (4° Medio A - Supabase):
                    </span>
                    <span className="text-slate-400">Total: {roster.length} alumnos evaluados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {roster.map(st => (
                        <div key={st.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                            <div className="flex justify-between items-start">
                                <strong className="text-white font-bold truncate">{st.name}</strong>
                                <span className="text-amber-300 font-bold font-orbitron">{st.gpa}</span>
                            </div>
                            <div className="text-[10px] text-emerald-400 truncate">
                                🌟 Fuerte: {st.strengths?.[0] || 'Matemáticas'}
                            </div>
                            <div className="text-[10px] text-rose-400 truncate">
                                🎯 Mejora: {st.weaknesses?.[0] || 'Biología'}
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-cyan-300 font-mono border-t border-slate-900 pt-1">
                                <span>Enfoque: {st.focus_metric}</span>
                                <span>Exits: {st.tab_exits_count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {squads.map((sq) => (
                    <div 
                        key={sq.id}
                        className="bg-slate-900/90 border-2 border-indigo-500/40 hover:border-indigo-400 rounded-3xl p-6 space-y-4 shadow-xl transition-all relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between border-b border-slate-800 pb-3 gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-[10px] font-bold uppercase tracking-wider font-orbitron">
                                        {sq.course} • {sq.specialty || 'STEM'}
                                    </span>
                                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-[10px] font-bold">
                                        Prom: {sq.average_gpa || '6.4'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-orbitron font-extrabold text-white mt-1">
                                    {sq.name}
                                </h3>
                            </div>
                            
                            <button
                                onClick={() => handleDeleteSquad(sq.id, sq.name)}
                                className="p-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl transition text-xs flex items-center space-x-1 cursor-pointer"
                                title="Disolver Squad"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {sq.pedagogical_rationale && (
                            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-900/50 text-[11px] text-slate-300 leading-relaxed font-sans">
                                💡 <strong className="text-indigo-300">Razón de Agrupamiento:</strong> {sq.pedagogical_rationale}
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                                <span>INTEGRANTES ({sq.members.length} / 4):</span>
                                <span className="text-indigo-400 text-[11px]">Roles Asignados por IA</span>
                            </div>

                            {sq.members.length === 0 ? (
                                <p className="text-xs text-slate-500 italic py-3 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                                    Este Squad aún no tiene integrantes. Añade alumnos abajo.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {sq.members.map((member) => (
                                        <div 
                                            key={member.id || member.name}
                                            className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 text-xs space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                                    <span className="font-bold text-white text-sm">{member.name}</span>
                                                    <span className="text-amber-300 font-bold font-mono">({member.gpa || '6.5'})</span>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveStudent(sq.id, member.id, member.name)}
                                                    className="p-1 bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-300 rounded-lg transition cursor-pointer"
                                                    title={`Remover a ${member.name}`}
                                                >
                                                    <UserMinus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                                                <div>
                                                    <label className="text-[10px] text-slate-400 block mb-0.5">Rol en el Squad:</label>
                                                    <select
                                                        value={member.role || 'Líder Lógico'}
                                                        onChange={(e) => handleChangeMemberRole(sq.id, member.id, e.target.value)}
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-indigo-300 font-bold outline-none cursor-pointer"
                                                    >
                                                        <option value="Líder Lógico">Líder Lógico (Matemáticas)</option>
                                                        <option value="Mentor de Pares (Ciencias)">Mentor de Pares (Ciencias)</option>
                                                        <option value="Capitana de Debate & Lenguaje">Capitán de Debate (Lenguaje)</option>
                                                        <option value="Colaborador Creativo & UI">Colaborador Creativo (Diseño)</option>
                                                        <option value="Coordinador de Enfoque">Coordinador de Enfoque</option>
                                                        <option value="Líder de Ciudadanía & Historia">Líder de Historia & Civismo</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] text-slate-400 block mb-0.5">Reasignar a Squad:</label>
                                                    <select
                                                        onChange={(e) => handleMoveMemberToSquad(sq.id, e.target.value, member)}
                                                        defaultValue=""
                                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-cyan-300 outline-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Mover a otro squad...</option>
                                                        {squads.filter(s => s.id !== sq.id).map(s => (
                                                            <option key={s.id} value={s.id}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                                                <span>🌟 {member.best_subject || 'Matemáticas'}</span>
                                                <span className="text-cyan-400 font-mono">Enfoque: {member.focus_metric || '95%'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                            <span className="text-[11px] text-indigo-300 font-bold uppercase block">
                                + AÑADIR ALUMNO DE LA NÓMINA A ESTE SQUAD:
                            </span>

                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedStudentForSquad[sq.id] || ''}
                                    onChange={(e) => setSelectedStudentForSquad({ ...selectedStudentForSquad, [sq.id]: e.target.value })}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-400 font-mono"
                                >
                                    <option value="">-- Seleccionar de la Nómina --</option>
                                    {roster.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.name} (GPA {st.gpa} • {st.strengths?.[0]})
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => handleAddRosterStudent(sq.id)}
                                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 cursor-pointer"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>Añadir</span>
                                </button>
                            </div>
                        </div>

                        {sq.synergies && sq.synergies.length > 0 && (
                            <div className="pt-2 border-t border-slate-800 space-y-2">
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block font-orbitron">
                                    🤝 VÍNCULOS DE MENTORÍA CRUZADA (PEER SYNERGIES):
                                </span>
                                {sq.synergies.map((syn, idx) => (
                                    <div key={idx} className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-200 leading-relaxed space-y-0.5">
                                        <div className="font-bold flex items-center gap-1.5">
                                            <span>{syn.mentor}</span>
                                            <span className="text-emerald-400">➔</span>
                                            <span>{syn.apprentice}</span>
                                            <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-emerald-300 ml-auto font-orbitron">{syn.area}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-300 font-sans">{syn.reason}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-slate-900 border-2 border-indigo-500 p-6 md:p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="text-lg font-orbitron font-extrabold text-white">
                                Crear Nuevo Squad
                            </h3>
                            <button 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreateSquad} className="space-y-4 text-xs">
                            <div>
                                <label className="text-slate-300 block mb-1 font-bold">Nombre del Squad:</label>
                                <input 
                                    type="text"
                                    value={newSquadName}
                                    onChange={e => setNewSquadName(e.target.value)}
                                    placeholder="Ej: Squad Gamma Biociencias"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-400"
                                />
                            </div>

                            <div>
                                <label className="text-slate-300 block mb-1 font-bold">Curso:</label>
                                <input 
                                    type="text"
                                    value={newSquadCourse}
                                    onChange={e => setNewSquadCourse(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-slate-300 block mb-1 font-bold">Especialidad / Foco:</label>
                                <input 
                                    type="text"
                                    value={newSquadSpecialty}
                                    onChange={e => setNewSquadSpecialty(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-orbitron font-extrabold rounded-xl shadow transition uppercase"
                            >
                                Crear Squad
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
