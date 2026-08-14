import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Users, Plus, Trash2, ShieldAlert, Award, TrendingUp, Sparkles, 
    UserPlus, UserMinus, ArrowUpRight, CheckCircle2, AlertTriangle, 
    BrainCircuit, HeartHandshake, Link, RefreshCw, Zap
} from 'lucide-react';

const INITIAL_SQUADS = [
    {
        id: 'sq-1',
        name: 'Squad Alfa STEM',
        course: '4° Medio A',
        members: [
            { id: 'st-1', name: 'Juan Carlos Pérez', strengths: ['Matemáticas (7.0)', 'Idiomas (6.85)'], weaknesses: ['Biología Orgánica (4.38)'], role: 'Líder Lógico' },
            { id: 'st-2', name: 'Mateo Rojas', strengths: ['Biología & Ciencias (6.80)'], weaknesses: ['Matemáticas Avanzadas (4.50)'], role: 'Tutor de Ciencias' },
            { id: 'st-3', name: 'Sofía Martínez', strengths: ['Historia & Formación Ciudadana (6.90)'], weaknesses: ['Física Aplicada (4.80)'], role: 'Mentora de Humanidades' }
        ],
        synergies: [
            { student1: 'Juan Carlos Pérez', student2: 'Mateo Rojas', reason: 'Sinergia Perfecta: Juan Carlos apoya en Matemáticas y Mateo en Biología.' }
        ]
    },
    {
        id: 'sq-2',
        name: 'Squad Beta Humanidades',
        course: '4° Medio A',
        members: [
            { id: 'st-4', name: 'Camila Silva', strengths: ['Lenguaje & Argumentación (6.90)'], weaknesses: ['Química (4.60)'], role: 'Líder Debate' },
            { id: 'st-5', name: 'Lucas Fernández', strengths: ['Artes & Creatividad (6.95)'], weaknesses: ['Cálculo (4.40)'], role: 'Diseño' }
        ],
        synergies: []
    }
];

const AVAILABLE_STUDENTS = [
    { id: 'st-6', name: 'Valentina Soto', strengths: ['Física & Química (6.70)'], weaknesses: ['Historia (4.50)'], role: 'Estudiante' },
    { id: 'st-7', name: 'Diego Morales', strengths: ['Programación & Lógica (6.80)'], weaknesses: ['Lenguaje (4.60)'], role: 'Estudiante' }
];

const Squads = () => {
    const { profile } = useAuth();
    const [squads, setSquads] = useState(() => {
        const saved = localStorage.getItem('aulock_squads_v2');
        return saved ? JSON.parse(saved) : INITIAL_SQUADS;
    });

    const [availableStudents] = useState(AVAILABLE_STUDENTS);
    const [newSquadName, setNewSquadName] = useState('');
    const [selectedStudentToAdd, setSelectedStudentToAdd] = useState('');

    const saveSquads = (updated) => {
        setSquads(updated);
        localStorage.setItem('aulock_squads_v2', JSON.stringify(updated));
    };

    const handleCreateSquad = (e) => {
        e.preventDefault();
        if (!newSquadName.trim()) return alert("Por favor ingresa un nombre para el escuadrón.");

        const newSq = {
            id: 'sq-' + Date.now(),
            name: newSquadName,
            course: '4° Medio A',
            members: [],
            synergies: []
        };

        saveSquads([...squads, newSq]);
        setNewSquadName('');
    };

    const handleAddMember = (squadId, student) => {
        const updated = squads.map(sq => {
            if (sq.id === squadId && !sq.members.some(m => m.name === student.name)) {
                return { ...sq, members: [...sq.members, student] };
            }
            return sq;
        });
        saveSquads(updated);
    };

    const handleRemoveMember = (squadId, memberId) => {
        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                return { ...sq, members: sq.members.filter(m => m.id !== memberId) };
            }
            return sq;
        });
        saveSquads(updated);
    };

    const handleLinkSynergy = (squadId, student1Name, student2Name) => {
        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                const newSyn = {
                    student1: student1Name,
                    student2: student2Name,
                    reason: `Tutoría de Pares Vinculada: ${student1Name} apoya en Lógica y ${student2Name} en Ciencias.`
                };
                return { ...sq, synergies: [...sq.synergies, newSyn] };
            }
            return sq;
        });
        saveSquads(updated);
        alert(`🤝 ¡Emparejamiento de mentoría entre ${student1Name} y ${student2Name} registrado con éxito!`);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-black text-white">Gestor de Escuadrones & Tutoría entre Pares</h1>
                                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                                    Emparejamiento por Fortalezas y Debilidades
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Organiza grupos de trabajo colaborativo, visualiza el diagnóstico académico de cada alumno y crea alianzas de mentoría complementaria.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs font-bold text-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Escuadrones Activos</span>
                        <div className="text-2xl font-black text-purple-400 mt-0.5">{squads.length} Grupos</div>
                    </div>
                </div>

                {/* CREATE SQUAD FORM */}
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                    <h3 className="text-sm font-black text-white flex items-center space-x-2">
                        <Plus className="w-4 h-4 text-purple-400" />
                        <span>Crear Nuevo Escuadrón</span>
                    </h3>

                    <form onSubmit={handleCreateSquad} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={newSquadName}
                            onChange={e => setNewSquadName(e.target.value)}
                            placeholder="Nombre del Escuadrón (ej. Squad Gamma Robótica)..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-purple-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                        >
                            Crear Escuadrón
                        </button>
                    </form>
                </div>

                {/* SQUADS CARDS WITH STRENGTHS/WEAKNESSES & PAIRING */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {squads.map(sq => (
                        <div key={sq.id} className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
                            
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-md">
                                            {sq.course}
                                        </span>
                                        <h3 className="text-xl font-black text-white mt-1">{sq.name}</h3>
                                        <p className="text-xs text-slate-400">{sq.members.length} Alumnos Integrantes</p>
                                    </div>
                                </div>

                                {/* MEMBERS DIAGNOSIS (FORTALEZAS Y DEBILIDADES VISIBLES) */}
                                <div className="space-y-4 mb-6">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                        Integrantes & Matriz de Diagnóstico:
                                    </span>

                                    {sq.members.length > 0 ? (
                                        sq.members.map(member => (
                                            <div key={member.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-white">{member.name}</h4>
                                                        <span className="text-[10px] text-indigo-400 font-medium">{member.role}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveMember(sq.id, member.id)}
                                                        className="text-rose-400 hover:text-rose-300 text-[10px] font-bold bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20 transition-colors flex items-center space-x-1"
                                                    >
                                                        <UserMinus className="w-3 h-3" />
                                                        <span>Quitar</span>
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                                                    {/* Strengths */}
                                                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                                                        <span className="text-[9px] font-extrabold text-emerald-400 uppercase block mb-0.5">🟢 Fortalezas:</span>
                                                        <ul className="text-slate-300 space-y-0.5">
                                                            {member.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                                                        </ul>
                                                    </div>

                                                    {/* Weaknesses */}
                                                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/20">
                                                        <span className="text-[9px] font-extrabold text-rose-400 uppercase block mb-0.5">🔴 Áreas de Mejora:</span>
                                                        <ul className="text-slate-300 space-y-0.5">
                                                            {member.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 italic p-4 bg-slate-950 rounded-2xl text-center">
                                            Sin miembros asignados en este escuadrón.
                                        </p>
                                    )}
                                </div>

                                {/* PEER MENTORING RECOMMENDATIONS (EMPAREJAMIENTO INTELIGENTE) */}
                                {sq.members.length >= 2 && (
                                    <div className="bg-indigo-950/60 p-4 rounded-2xl border border-indigo-500/30 space-y-3 mb-6">
                                        <div className="flex items-center space-x-2">
                                            <HeartHandshake className="w-4 h-4 text-amber-400" />
                                            <h4 className="text-xs font-bold text-indigo-200">Sugerencia de Tutoría entre Pares (IA AuLock)</h4>
                                        </div>

                                        <p className="text-[11px] text-slate-300 leading-relaxed">
                                            <strong>{sq.members[0]?.name}</strong> (Fuerte en Matemáticas) puede apoyar a <strong>{sq.members[1]?.name}</strong>, quien a su vez puede ser su tutor en Ciencias.
                                        </p>

                                        <button
                                            onClick={() => handleLinkSynergy(sq.id, sq.members[0]?.name, sq.members[1]?.name)}
                                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow flex items-center justify-center space-x-1.5"
                                        >
                                            <Link className="w-3.5 h-3.5 text-amber-300" />
                                            <span>Vincular Pareja de Mentoría Recíproca</span>
                                        </button>

                                        {sq.synergies?.length > 0 && (
                                            <div className="pt-2 border-t border-indigo-500/20">
                                                {sq.synergies.map((syn, idx) => (
                                                    <p key={idx} className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/10 p-2 rounded-lg">
                                                        🤝 Pareja Activa: {syn.student1} ↔ {syn.student2}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ADD MEMBER SELECTOR */}
                            <div className="pt-4 border-t border-slate-800 space-y-2">
                                <label className="block text-[10px] text-slate-400 font-bold uppercase">Añadir Alumno al Escuadrón:</label>
                                <div className="flex gap-2">
                                    <select
                                        id={`select-st-${sq.id}`}
                                        className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none"
                                    >
                                        {availableStudents.map(st => (
                                            <option key={st.id} value={st.id}>
                                                {st.name} ({st.strengths[0]})
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => {
                                            const select = document.getElementById(`select-st-${sq.id}`);
                                            const stObj = availableStudents.find(s => s.id === select.value);
                                            if (stObj) handleAddMember(sq.id, stObj);
                                        }}
                                        className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center space-x-1"
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        <span>Añadir</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Squads;
