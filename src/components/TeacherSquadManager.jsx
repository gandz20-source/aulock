import React, { useState, useEffect } from 'react';
import { 
    Users, Plus, Trash2, ShieldAlert, Award, TrendingUp, Sparkles, 
    UserPlus, UserMinus, ArrowUpRight, CheckCircle2, AlertTriangle, 
    BrainCircuit, HeartHandshake, Link, RefreshCw, Zap, Search, ShieldCheck
} from 'lucide-react';

const DEFAULT_COURSE_ROSTER = [
    { id: 'st-1', name: 'Juan Carlos Pérez', course: '4° Medio A', strengths: ['Matemáticas (7.0)', 'Idiomas (6.8)'], weaknesses: ['Biología Orgánica (4.3)'], role: 'Líder Lógico' },
    { id: 'st-2', name: 'Mateo Rojas', course: '4° Medio A', strengths: ['Biología & Ciencias (6.8)'], weaknesses: ['Matemáticas Avanzadas (4.5)'], role: 'Tutor de Ciencias' },
    { id: 'st-3', name: 'Sofía Martínez', course: '4° Medio A', strengths: ['Historia & Formación Ciudadana (6.9)'], weaknesses: ['Física Aplicada (4.8)'], role: 'Mentora de Humanidades' },
    { id: 'st-4', name: 'Camila Silva', course: '4° Medio A', strengths: ['Lenguaje & Argumentación (6.9)'], weaknesses: ['Química (4.6)'], role: 'Líder Debate' },
    { id: 'st-5', name: 'Lucas Fernández', course: '4° Medio A', strengths: ['Artes & Creatividad (6.9)'], weaknesses: ['Cálculo (4.4)'], role: 'Diseño' },
    { id: 'st-6', name: 'Valentina Soto', course: '4° Medio A', strengths: ['Física & Química (6.7)'], weaknesses: ['Historia (4.5)'], role: 'Científica' },
    { id: 'st-7', name: 'Diego Morales', course: '4° Medio A', strengths: ['Programación & Lógica (6.8)'], weaknesses: ['Lenguaje (4.6)'], role: 'Desarrollador' },
    { id: 'st-8', name: 'Constanza Silva', course: '4° Medio A', strengths: ['Inglés Técnico (7.0)'], weaknesses: ['Álgebra (4.2)'], role: 'Lingüista' }
];

const DEFAULT_SQUADS = [
    {
        id: 'sq-1',
        name: 'Squad Alfa STEM',
        course: '4° Medio A',
        specialty: 'Ciencias & Tecnología',
        members: [
            { id: 'st-1', name: 'Juan Carlos Pérez', role: 'Líder Lógico' },
            { id: 'st-2', name: 'Mateo Rojas', role: 'Tutor de Ciencias' },
            { id: 'st-3', name: 'Sofía Martínez', role: 'Mentora de Humanidades' }
        ],
        synergies: [
            { student1: 'Juan Carlos Pérez', student2: 'Mateo Rojas', reason: 'Tutoría Cruzada: Juan Carlos apoya en Matemáticas y Mateo en Biología.' }
        ]
    },
    {
        id: 'sq-2',
        name: 'Squad Beta Humanidades',
        course: '4° Medio A',
        specialty: 'Debate & Literatura',
        members: [
            { id: 'st-4', name: 'Camila Silva', role: 'Líder Debate' },
            { id: 'st-5', name: 'Lucas Fernández', role: 'Diseño' }
        ],
        synergies: []
    }
];

export default function TeacherSquadManager() {
    const [squads, setSquads] = useState(() => {
        const saved = localStorage.getItem('aulock_teacher_squads_v3');
        return saved ? JSON.parse(saved) : DEFAULT_SQUADS;
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newSquadName, setNewSquadName] = useState('');
    const [newSquadCourse, setNewSquadCourse] = useState('4° Medio A');
    const [newSquadSpecialty, setNewSquadSpecialty] = useState('STEM & PAES');

    const [selectedStudentForSquad, setSelectedStudentForSquad] = useState({});
    const [customStudentName, setCustomStudentName] = useState({});

    // Save squads to state and localStorage
    const saveSquads = (updated) => {
        setSquads(updated);
        localStorage.setItem('aulock_teacher_squads_v3', JSON.stringify(updated));
    };

    // Create New Squad
    const handleCreateSquad = (e) => {
        e.preventDefault();
        if (!newSquadName.trim()) return alert("Por favor ingresa un nombre para el Squad.");

        const newSq = {
            id: 'sq-' + Date.now(),
            name: newSquadName.trim(),
            course: newSquadCourse,
            specialty: newSquadSpecialty,
            members: [],
            synergies: []
        };

        saveSquads([...squads, newSq]);
        setNewSquadName('');
        setIsCreateModalOpen(false);
    };

    // Delete Squad
    const handleDeleteSquad = (squadId, squadName) => {
        if (window.confirm(`¿Estás seguro de disolver el "${squadName}"?`)) {
            const updated = squads.filter(sq => sq.id !== squadId);
            saveSquads(updated);
        }
    };

    // Add Roster Student to Squad
    const handleAddRosterStudent = (squadId) => {
        const studentId = selectedStudentForSquad[squadId];
        if (!studentId) return alert("Selecciona un alumno de la lista.");

        const student = DEFAULT_COURSE_ROSTER.find(s => s.id === studentId);
        if (!student) return;

        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                if (sq.members.some(m => m.id === student.id || m.name === student.name)) {
                    alert(`${student.name} ya pertenece a este Squad.`);
                    return sq;
                }
                return {
                    ...sq,
                    members: [...sq.members, { id: student.id, name: student.name, role: student.role || 'Integrante' }]
                };
            }
            return sq;
        });

        saveSquads(updated);
        setSelectedStudentForSquad(prev => ({ ...prev, [squadId]: '' }));
    };

    // Add Custom Student Name to Squad
    const handleAddCustomStudent = (squadId) => {
        const name = customStudentName[squadId]?.trim();
        if (!name) return alert("Escribe el nombre del alumno.");

        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                if (sq.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
                    alert(`${name} ya pertenece a este Squad.`);
                    return sq;
                }
                return {
                    ...sq,
                    members: [...sq.members, { id: 'custom-' + Date.now(), name: name, role: 'Estudiante' }]
                };
            }
            return sq;
        });

        saveSquads(updated);
        setCustomStudentName(prev => ({ ...prev, [squadId]: '' }));
    };

    // Remove Student from Squad
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
    };

    // Generate Automatic Synergy Link
    const handleGenerateSynergy = (squadId) => {
        const squad = squads.find(sq => sq.id === squadId);
        if (!squad || squad.members.length < 2) {
            return alert("Se necesitan al menos 2 estudiantes en el Squad para generar sinergia de pares.");
        }

        const m1 = squad.members[0].name;
        const m2 = squad.members[1].name;

        const newSynergy = {
            student1: m1,
            student2: m2,
            reason: `Vínculo de Mentoría: ${m1} lidera la resolución lógica y ${m2} complementa en desarrollo.`
        };

        const updated = squads.map(sq => {
            if (sq.id === squadId) {
                return { ...sq, synergies: [...(sq.synergies || []), newSynergy] };
            }
            return sq;
        });

        saveSquads(updated);
    };

    return (
        <div className="bg-slate-950/90 border-2 border-indigo-500/80 p-6 rounded-3xl shadow-2xl space-y-6 font-mono">
            
            {/* HEADER OF SQUAD MANAGER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-900/60 pb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-600/30 border border-indigo-400 rounded-2xl">
                        <Users className="w-6 h-6 text-indigo-300" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-orbitron font-black text-white tracking-wider">
                            GESTIÓN & CONFORMACIÓN DE SQUADS DE AULA
                        </h2>
                        <p className="text-xs text-indigo-300">
                            Organiza, agrega, remueve estudiantes y gestiona equipos de trabajo colaborativo.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)] transition flex items-center space-x-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>+ Crear Nuevo Squad</span>
                </button>
            </div>

            {/* SQUADS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {squads.map((sq) => (
                    <div 
                        key={sq.id}
                        className="bg-slate-900/90 border border-indigo-500/40 hover:border-indigo-400 rounded-3xl p-5 space-y-4 shadow-xl transition-all relative overflow-hidden"
                    >
                        {/* Squad Title Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {sq.course} • {sq.specialty || 'General'}
                                </span>
                                <h3 className="text-lg font-orbitron font-extrabold text-white mt-1">
                                    {sq.name}
                                </h3>
                            </div>
                            
                            <button
                                onClick={() => handleDeleteSquad(sq.id, sq.name)}
                                className="p-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl transition text-xs flex items-center space-x-1"
                                title="Disolver Squad"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Disolver</span>
                            </button>
                        </div>

                        {/* Member List */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                                <span>INTEGRANTES ({sq.members.length}):</span>
                                <span className="text-indigo-400 text-[11px]">Colaboración Activa</span>
                            </div>

                            {sq.members.length === 0 ? (
                                <p className="text-xs text-slate-500 italic py-2 text-center bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                                    Este Squad no tiene alumnos asignados. Agrega integrantes abajo.
                                </p>
                            ) : (
                                <div className="space-y-1.5">
                                    {sq.members.map((member) => (
                                        <div 
                                            key={member.id || member.name}
                                            className="flex items-center justify-between bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800/80 hover:border-slate-700 text-xs"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                                <span className="font-bold text-white">{member.name}</span>
                                                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                                                    {member.role || 'Estudiante'}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveStudent(sq.id, member.id, member.name)}
                                                className="p-1 bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-300 rounded-lg transition"
                                                title={`Quitar a ${member.name}`}
                                            >
                                                <UserMinus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add Member Controls */}
                        <div className="pt-2 border-t border-slate-800/80 space-y-2">
                            <span className="text-[11px] text-indigo-300 font-bold uppercase block">
                                + AGREGAR ALUMNO A ESTE SQUAD:
                            </span>

                            {/* Option A: Select from Course Roster */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedStudentForSquad[sq.id] || ''}
                                    onChange={(e) => setSelectedStudentForSquad({ ...selectedStudentForSquad, [sq.id]: e.target.value })}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-indigo-400 font-mono"
                                >
                                    <option value="">-- Seleccionar de Nómina del Curso --</option>
                                    {DEFAULT_COURSE_ROSTER.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.name} ({st.role})
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={() => handleAddRosterStudent(sq.id)}
                                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>Agregar</span>
                                </button>
                            </div>

                            {/* Option B: Manual Student Name Input */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="O escribe nombre de otro estudiante..."
                                    value={customStudentName[sq.id] || ''}
                                    onChange={(e) => setCustomStudentName({ ...customStudentName, [sq.id]: e.target.value })}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 outline-none focus:border-indigo-400 font-mono"
                                />
                                <button
                                    onClick={() => handleAddCustomStudent(sq.id)}
                                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/40 font-bold text-xs rounded-xl transition"
                                >
                                    + Añadir
                                </button>
                            </div>
                        </div>

                        {/* Synergies Section */}
                        {sq.synergies && sq.synergies.length > 0 && (
                            <div className="pt-2 border-t border-slate-800 space-y-1.5">
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                                    🤝 SINERGIAS & MENTORÍA DE PARES VINCULADAS:
                                </span>
                                {sq.synergies.map((syn, idx) => (
                                    <div key={idx} className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-200 leading-relaxed">
                                        <strong>{syn.student1}</strong> ↔ <strong>{syn.student2}</strong>: {syn.reason}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Footer Action Button */}
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => handleGenerateSynergy(sq.id)}
                                className="px-3 py-1.5 bg-slate-950 border border-emerald-500/50 hover:bg-emerald-950 text-emerald-300 text-[11px] font-bold rounded-xl transition flex items-center space-x-1"
                            >
                                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                                <span>⚡ Vincular Sinergia de Pares</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE NEW SQUAD MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border-2 border-indigo-500 p-6 md:p-8 rounded-3xl max-w-md w-full space-y-5 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-lg font-orbitron font-extrabold text-white">
                                CREAR NUEVO SQUAD DE AULA
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-white font-bold text-sm"
                            >
                                ✖
                            </button>
                        </div>

                        <form onSubmit={handleCreateSquad} className="space-y-4 text-xs font-mono">
                            <div className="space-y-1">
                                <label className="text-slate-300 font-bold">Nombre del Squad *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Squad Gamma PAES / Squad Delta Lógica"
                                    value={newSquadName}
                                    onChange={(e) => setNewSquadName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-slate-300 font-bold">Curso Asignado *</label>
                                <select
                                    value={newSquadCourse}
                                    onChange={(e) => setNewSquadCourse(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-400"
                                >
                                    <option value="4° Medio A">4° Medio A</option>
                                    <option value="3° Medio B">3° Medio B</option>
                                    <option value="2° Medio C">2° Medio C</option>
                                    <option value="1° Medio A">1° Medio A</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-slate-300 font-bold">Especialidad u Objetivo</label>
                                <input
                                    type="text"
                                    placeholder="Ej: STEM, Debate, PAES, Inclusión"
                                    value={newSquadSpecialty}
                                    onChange={(e) => setNewSquadSpecialty(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-400"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2.5 bg-slate-950 text-slate-300 border border-slate-800 rounded-xl font-bold hover:bg-slate-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase tracking-wider shadow"
                                >
                                    Guardar Squad
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
