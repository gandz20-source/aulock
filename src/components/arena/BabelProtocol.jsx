import React, { useState, useEffect } from 'react';
import { synergyManager } from '../../services/SynergyManager';

export const BabelProtocol = ({ 
    categories = ['CONCEPTO BIOLOGÍA', 'ELEMENTO / ÁTOMO', 'TÉRMINO MINEDUC', 'PAÍS / CIUDAD', 'HERRAMIENTA IA'], 
    classId = '4_MEDIO_A', 
    onRoundEnd, 
    isTeacher = true 
}) => {
    // Estado del juego
    const [currentLetter, setCurrentLetter] = useState('P');
    const [isActive, setIsActive] = useState(false); // Si la ronda está corriendo
    const [timeLeft, setTimeLeft] = useState(0);
    const [roundResults, setRoundResults] = useState([]); // Resultados por grupo
    const [teacherSelectedCategories, setTeacherSelectedCategories] = useState(categories);

    // Cronómetro
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && isActive) {
            handleStopGame(); // Tiempo acabado
        }
    }, [isActive, timeLeft]);

    // --- FUNCIONES DE GESTIÓN (Solo Profesor / GM) ---
    const handleStartNewRound = (letter = 'P', duration = 90) => {
        setCurrentLetter(letter);
        setTimeLeft(duration);
        setIsActive(true);
        setRoundResults([]); // Limpiar ronda anterior
    };

    const handleStopGame = () => {
        setIsActive(false);
    };

    // Simulador de envío para pruebas rápidas
    const handleSimulateGroupSubmission = () => {
        if (!isActive) return;
        const mockGroups = [
            { id: 1, name: 'Squad Alfa' },
            { id: 2, name: 'Equipo Ryo' },
            { id: 3, name: 'Squad Beta' },
            { id: 4, name: 'Equipo Han' },
            { id: 5, name: 'Sinergia 5' },
            { id: 6, name: 'Navegantes' },
            { id: 7, name: 'BioLab' },
            { id: 8, name: 'Antigravity' }
        ];

        const nextGroup = mockGroups[roundResults.length % 8];
        const mockAnswers = [
            `${currentLetter}roceso`,
            `${currentLetter}roton`,
            `${currentLetter}asaporte`,
            `${currentLetter}arís`,
            `${currentLetter}rompt`
        ];

        handleSubmitGroupAnswers(nextGroup.id, nextGroup.name, mockAnswers);
    };

    // --- FUNCIONES DE RESPUESTA (Alumnos) ---
    const handleSubmitGroupAnswers = (groupId, groupName, answersArray) => {
        if (!isActive) return; // Fuera de tiempo
        setRoundResults(prev => [...prev, { groupId, groupName, answers: answersArray }]);
    };

    // --- MECÁNICA DE VALIDACIÓN Y PUNTUACIÓN (Profesor + UI) ---
    const validateAndScore = () => {
        if (!currentLetter) return [];
        const categoryScores = Array(teacherSelectedCategories.length).fill(null).map(() => ({}));

        // 1. Contar frecuencias
        roundResults.forEach(groupResult => {
            groupResult.answers.forEach((answer, catIndex) => {
                const normalizedAnswer = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
                if (normalizedAnswer === '' || normalizedAnswer[0] !== currentLetter.toLowerCase()) return; // Inválida o vacía

                categoryScores[catIndex][normalizedAnswer] = (categoryScores[catIndex][normalizedAnswer] || 0) + 1;
            });
        });

        // 2. Asignar puntos
        const finalScores = roundResults.map(groupResult => {
            let totalPoints = 0;
            const groupCategoryPoints = groupResult.answers.map((answer, catIndex) => {
                const normalizedAnswer = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
                if (normalizedAnswer === '' || normalizedAnswer[0] !== currentLetter.toLowerCase()) return 0;

                const points = categoryScores[catIndex][normalizedAnswer] > 1 ? 5 : 10;
                totalPoints += points;
                return points;
            });

            // 3. Otorgar Puntos de Sinergia vía backend
            synergyManager.otorgarPuntosPorMision(`STUDENT_GROUP_${groupResult.groupId}`, `ARENA_BABEL_${classId}_${currentLetter}`, totalPoints);
            if (totalPoints > 0) synergyManager.sumarEstrellasCurso(classId, Math.round(totalPoints / 2));

            return { ...groupResult, groupCategoryPoints, totalPoints };
        });

        return finalScores;
    };

    // Renderizado del Tablero Principal (Proyector)
    const renderMainBoard = () => {
        return (
            <div className="space-y-8 p-6 md:p-8 bg-slate-950 rounded-3xl border-2 border-cyan-500/50 shadow-2xl font-mono text-cyan-100 animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-cyan-800 pb-6">
                    <div>
                        <span className="text-xs font-black uppercase text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                            NEXUS ARENA • STOP/TUTTI-FRUTTI CYBERPUNK
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-cyan-400 mt-1">Protocolo Babel: Datos Cruzados</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {currentLetter && (
                            <span className="text-5xl md:text-7xl font-black text-white bg-cyan-950 px-5 py-1.5 rounded-2xl border-4 border-cyan-500 shadow-lg">
                                {currentLetter}
                            </span>
                        )}
                        <div className="text-center bg-slate-900 px-4 py-2 rounded-2xl border border-cyan-800">
                            <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono">{String(timeLeft).padStart(2, '0')}</div>
                            <div className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest">Segundos</div>
                        </div>

                        {isTeacher && !isActive && (
                            <button
                                onClick={() => handleStartNewRound('P', 90)}
                                className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-2xl transition shadow-lg uppercase text-xs tracking-wider"
                            >
                                ▶️ Iniciar Ronda (Letra P)
                            </button>
                        )}

                        {isTeacher && isActive && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSimulateGroupSubmission}
                                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition text-xs"
                                >
                                    + Simular Envío Grupo ({roundResults.length}/8)
                                </button>
                                <button
                                    onClick={handleStopGame}
                                    className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl transition uppercase text-xs"
                                >
                                    🛑 ¡Forzar Alto!
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Categorías */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
                    {teacherSelectedCategories.map((cat, index) => (
                        <div key={index} className="p-3.5 bg-cyan-950/80 rounded-2xl font-bold text-xs uppercase text-cyan-300 border border-cyan-700/60 shadow">
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Tabla de Progreso en Vivo */}
                <div className="p-6 bg-slate-900/90 rounded-2xl border border-cyan-800/60 min-h-[260px] flex items-center justify-center">
                    {isActive && (
                        <div className="text-center flex flex-col items-center justify-center space-y-3 text-cyan-400">
                            <span className="text-5xl animate-pulse">🧠⚡</span>
                            <h3 className="text-2xl font-black text-cyan-300">¡DESENCRIPTANDO DATOS CRUZADOS!</h3>
                            <p className="text-xs text-slate-300 font-medium">Esperando envíos de los 8 escuadrones de la sala...</p>
                            <p className="text-4xl font-mono font-black text-white">{roundResults.length} / 8 GRUPOS</p>
                            {roundResults.length > 0 && (
                                <p className="text-xs text-emerald-400 font-mono">
                                    Grupos enlazados: {roundResults.map(r => r.groupName).join(', ')}
                                </p>
                            )}
                        </div>
                    )}

                    {!isActive && roundResults.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 w-full">
                            {validateAndScore().map((finalScores, index) => (
                                <div key={index} className="bg-slate-950 p-3 rounded-2xl text-center space-y-2 border border-cyan-800">
                                    <div className="font-black text-xs text-white truncate">{finalScores.groupName}</div>
                                    {finalScores.answers.map((ans, i) => (
                                        <div key={i} className={`p-1.5 rounded-xl text-[10px] ${finalScores.groupCategoryPoints[i] === 0 ? 'bg-rose-950 text-rose-300' : 'bg-slate-900 text-cyan-200 border border-cyan-800'}`}>
                                            <span className="truncate block">{ans === '' ? '-' : ans}</span>
                                            <span className="block text-[9px] text-amber-400 font-bold">{finalScores.groupCategoryPoints[i]} pts</span>
                                        </div>
                                    ))}
                                    <div className="text-lg font-black text-white bg-cyan-700 p-1.5 rounded-xl font-mono mt-2">{finalScores.totalPoints}</div>
                                    <div className="text-[9px] text-cyan-400 font-bold uppercase">TOTAL</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isActive && roundResults.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-3 py-8 text-cyan-500">
                            <span className="text-5xl opacity-60">🌐📡</span>
                            <h3 className="text-xl font-black text-cyan-400">Sistema en Espera del GM</h3>
                            <p className="text-xs text-slate-400 max-w-sm">Presiona "Iniciar Ronda" en el panel GM para desplegar la letra de encriptación.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {renderMainBoard()}

            {/* ZONA DE VALIDACIÓN (Solo visible para el profesor en su pantalla de control) */}
            {isTeacher && !isActive && roundResults.length > 0 && (
                <div className="p-6 bg-slate-900 rounded-3xl border-2 border-amber-500/40 text-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-black text-amber-400">Panel Game Master: Validación de Respuestas</h3>
                        <p className="text-xs text-slate-300 font-medium">Revisa las respuestas cruzadas y confirma la publicación de los puntajes finales.</p>
                    </div>

                    <button
                        onClick={() => {
                            if (onRoundEnd) onRoundEnd();
                            alert("🏆 ¡Marcador de Protocolo Babel publicado en la sala!");
                        }}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg whitespace-nowrap"
                    >
                        Publicar Marcador Final
                    </button>
                </div>
            )}
        </div>
    );
};

export default BabelProtocol;
