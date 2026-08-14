import React, { useState } from 'react';
import { PlusCircle, Award, CheckCircle2, BookOpen, Sparkles, X } from 'lucide-react';

const SUBJECT_OPTIONS = [
    { id: 'math', name: 'Matemáticas / Lógica', category: 'logic', defaultScore: 92 },
    { id: 'languages', name: 'Idiomas & Lenguaje', category: 'communication', defaultScore: 88 },
    { id: 'biology', name: 'Biología & Ciencias Naturales', category: 'naturalSciences', defaultScore: 52 },
    { id: 'history', name: 'Historia & Humanidades', category: 'humanities', defaultScore: 72 },
    { id: 'art', name: 'Artes & Diseño Creativo', category: 'creativity', defaultScore: 90 },
    { id: 'physics', name: 'Física & Mecánica', category: 'logic', defaultScore: 85 }
];

const GRADE_LEVELS = [
    'Enseñanza Básica (1° - 8° Básica)',
    'Enseñanza Media (1° - 4° Medio)',
    'Pre-Universitario (PAES / Admisión)',
    'Universidad (1° - 5° Año)'
];

const TestEvaluator = ({ onAddAssessment, onClose }) => {
    const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0]);
    const [score, setScore] = useState(85);
    const [maxScore, setMaxScore] = useState(100);
    const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[1]);
    const [testTitle, setTestTitle] = useState('Prueba Parcial de Evaluación');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const percentage = Math.round((score / maxScore) * 100);

        const newAssessment = {
            subject: selectedSubject.name,
            category: selectedSubject.category,
            score: percentage,
            rawScore: score,
            totalScore: maxScore,
            title: testTitle,
            gradeLevel,
            notes,
            date: new Date().toISOString().split('T')[0]
        };

        onAddAssessment(newAssessment);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
                        <PlusCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Registrar Nueva Evaluación / Control</h2>
                        <p className="text-xs text-slate-400">Ingresa notas para actualizar las estadísticas y el perfil vocacional</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nivel Educativo</label>
                        <select
                            value={gradeLevel}
                            onChange={(e) => setGradeLevel(e.target.value)}
                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-slate-200 outline-none focus:border-indigo-500"
                        >
                            {GRADE_LEVELS.map((g, i) => (
                                <option key={i} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Asignatura</label>
                        <select
                            value={selectedSubject.id}
                            onChange={(e) => setSelectedSubject(SUBJECT_OPTIONS.find(s => s.id === e.target.value))}
                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-slate-200 outline-none focus:border-indigo-500"
                        >
                            {SUBJECT_OPTIONS.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre de la Evaluación</label>
                        <input
                            type="text"
                            value={testTitle}
                            onChange={(e) => setTestTitle(e.target.value)}
                            placeholder="Ej. Control 1 de Álgebra / Test de Vocabulario"
                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 outline-none focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Puntaje Obtenido</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={score}
                                onChange={(e) => setScore(Number(e.target.value))}
                                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 outline-none focus:border-indigo-500 font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Puntaje Máximo</label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={maxScore}
                                onChange={(e) => setMaxScore(Number(e.target.value))}
                                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 outline-none focus:border-indigo-500 font-mono"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Observaciones / Hábitos de Estudio</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ej. El alumno respondió con rapidez en razonamiento pero omitió preguntas memorísticas."
                            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 h-20 resize-none"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center justify-center space-x-2"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Guardar Evaluación & Recalcular Perfil IA</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestEvaluator;
