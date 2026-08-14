import React, { useState, useEffect, useMemo } from 'react';
import { synergyManager } from '../../services/SynergyManager';

// Configuración de temas predefinidos
const GAME_THEMES = {
    ECOSISTEMAS: {
        id: 'ECOSISTEMAS',
        name: 'Ecosistemas & Sinergia',
        pista: 'Interacción biológica y cooperación en el Yermo.',
        palabra: 'MUTUALISMO' // 10 letras
    },
    UNIDADES_LONGITUD: {
        id: 'UNIDADES_LONGITUD',
        name: 'Unidad de Medida de Longitud',
        pista: 'Unidad base del Sistema Internacional.',
        palabra: 'METRO' // 5 letras
    },
    TECNOLOGIA_AETHEL: {
        id: 'TECNOLOGIA_AETHEL',
        name: 'Tecnología Aethel Corp',
        pista: 'Protocolo de seguridad de red principal.',
        palabra: 'CORTAFUEGOS' // 11 letras
    }
};

export const TeacherControlCenter = () => {
    // --- 1. ESTADO DE CONFIGURACIÓN DE SESIÓN (Profesor) ---
    const [selectedThemeKey, setSelectedThemeKey] = useState('UNIDADES_LONGITUD'); // Tema por defecto
    const [groupSize, setGroupSize] = useState(4); // Tamaño de grupo por defecto
    const [numGroups, setNumGroups] = useState(8); // Número de grupos por defecto
    const [awardingDecimals, setAwardingDecimals] = useState(true);
    const [pointsPerDecima, setPointsPerDecima] = useState(100);
    const [isAutoMode, setIsAutoMode] = useState(false); // Toggle de IA

    // --- 2. ESTADO DEL JUEGO (Compartido) ---
    const currentTheme = GAME_THEMES[selectedThemeKey];
    const [gameStarted, setGameStarted] = useState(false);
    const [currentAttackerGroup, setCurrentAttackerGroup] = useState(1);
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const MAX_GUESSES = 10;
    const [solvedByGroup, setSolvedByGroup] = useState(null);
    const [localSolutionInput, setLocalSolutionInput] = useState(''); // Input del profesor para "Validación Final"

    // --- 3. LÓGICA DERIVADA ---
    const normalizedWord = useMemo(() => currentTheme.palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(), [currentTheme.palabra]);
    const uniqueLetters = useMemo(() => new Set(normalizedWord.split('')), [normalizedWord]);

    const displayedWord = useMemo(() => {
        return normalizedWord.split('').map(letter => (guessedLetters.has(letter) ? letter : '_'));
    }, [normalizedWord, guessedLetters]);

    const isSolved = useMemo(() => {
        return displayedWord.join('') === normalizedWord;
    }, [displayedWord, normalizedWord]);

    // --- 4. FUNCIONES DE CONTROL (Profesor) ---
    const handleStartGame = () => {
        setGuessedLetters(new Set());
        setIncorrectGuesses(0);
        setSolvedByGroup(null);
        setCurrentAttackerGroup(1);
        setGameStarted(true);
    };

    const handleResetGame = () => {
        setGameStarted(false);
        setGuessedLetters(new Set());
        setIncorrectGuesses(0);
        setSolvedByGroup(null);
    };

    // --- 5. LÓGICA DEL JUEGO ---
    const handleGroupGuessLetter = (groupId, letter) => {
        if (!gameStarted || solvedByGroup || incorrectGuesses >= MAX_GUESSES || groupId !== currentAttackerGroup) return;

        const newGuesses = new Set(guessedLetters);
        newGuesses.add(letter);
        setGuessedLetters(newGuesses);

        if (!uniqueLetters.has(letter)) {
            const newIncorrectCount = incorrectGuesses + 1;
            setIncorrectGuesses(newIncorrectCount);
            if (newIncorrectCount >= MAX_GUESSES) {
                alert("⚠️ ¡CORTAFUEGOS ACTIVADO! Se han agotado los intentos.");
                handleResetGame();
            }
        } else {
            const isCurrentlySolved = Array.from(uniqueLetters).every(l => newGuesses.has(l));
            if (isCurrentlySolved) {
                handleSolveSuccess(groupId);
            }
        }

        const nextGroup = (currentAttackerGroup % numGroups) + 1;
        setCurrentAttackerGroup(nextGroup);
    };

    const handleSolveSuccess = (groupId) => {
        setSolvedByGroup(groupId);
        alert(`🎉 ¡GRUPO ${groupId} HA DESENCRIPTADO EL CORTAFUEGOS!`);

        if (awardingDecimals) {
            const pointsEarned = 100 + ((MAX_GUESSES - incorrectGuesses) * 10);
            synergyManager.otorgarPuntosPorMision(
                `STUDENT_GROUP_${groupId}`,
                `ARENA_CORTAFUEGOS_${currentTheme.id}_${numGroups}`,
                pointsEarned
            );
            synergyManager.sumarEstrellasCurso('4_MEDIO_A', 15);
            console.log(`[SISTEMA GESTIÓN] Otorgando ${pointsEarned} PS al Grupo ${groupId}. Esto equivale a ${pointsEarned / pointsPerDecima} décimas.`);
        }
        setGameStarted(false);
    };

    const handleTeacherForceSolve = () => {
        if (localSolutionInput.toUpperCase() === normalizedWord) {
            handleSolveSuccess('PROFESOR (Manual)');
        } else {
            alert("La solución ingresada es incorrecta.");
        }
        setLocalSolutionInput('');
    };

    // Renderizar los globos
    const renderBalloons = () => {
        const balloons = [];
        for (let i = 0; i < MAX_GUESSES; i++) {
            const isPopped = i < incorrectGuesses;
            balloons.push(
                <div
                    key={i}
                    className={`w-8 h-10 flex items-center justify-center text-xl transition-all duration-300 ${
                        isPopped ? 'opacity-20 scale-50' : 'animate-bounce'
                    }`}
                >
                    {isPopped ? '💥' : '🎈'}
                </div>
            );
        }
        return balloons;
    };

    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

    return (
        <div className="p-4 md:p-6 space-y-8 bg-slate-950 min-h-screen text-cyan-100 font-mono rounded-3xl border border-cyan-800 shadow-2xl animate-in fade-in duration-300">
            {/* Cabecera Principal */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b-2 border-cyan-900">
                <h1 className="text-2xl md:text-3xl font-extrabold text-cyan-300 tracking-tight flex items-center space-x-2">
                    <span className="text-cyan-500">ANTIGRAVITY:</span> <span>Centro de Control GM (Docente)</span>
                </h1>
                <div className="flex items-center gap-3 bg-slate-900 p-3 px-5 rounded-2xl shadow-inner border border-cyan-700">
                    <span className="text-xs text-cyan-500 font-bold">Clima de Aula:</span>
                    <div className="w-32 md:w-40 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: '85%' }}></div>
                    </div>
                    <span className="font-bold text-base text-cyan-200">85%</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 🟢 COLUMNA IZQUIERDA: PANEL DE CONTROL DEL PROFESOR */}
                <aside className="lg:col-span-1 bg-slate-900 p-5 rounded-3xl shadow-xl border border-cyan-800 space-y-6">
                    <section className="space-y-4">
                        <h2 className="text-base font-bold text-cyan-400 border-b border-cyan-800 pb-2 uppercase tracking-wider">
                            // CONFIGURACIÓN DE SESIÓN
                        </h2>

                        {/* Selector de Temática */}
                        <div>
                            <label className="block text-xs text-cyan-300 mb-1 font-bold">Temática Activa (Proyector):</label>
                            <select
                                value={selectedThemeKey}
                                onChange={(e) => setSelectedThemeKey(e.target.value)}
                                className="w-full p-2.5 bg-slate-950 border border-cyan-800 rounded-xl text-cyan-100 text-xs font-bold"
                            >
                                {Object.entries(GAME_THEMES).map(([key, theme]) => (
                                    <option key={key} value={key}>{theme.name}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-cyan-400 mt-1 p-2 bg-slate-950 rounded border border-cyan-900/60">
                                Pista: {currentTheme.pista}
                            </p>
                        </div>

                        {/* Organización de Grupos */}
                        <div>
                            <label className="block text-xs text-cyan-300 mb-1 font-bold">Tamaño de Grupo:</label>
                            <div className="grid grid-cols-4 gap-1.5 text-center">
                                {[1, 2, 4, 8].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setGroupSize(size)}
                                        className={`p-2 rounded-xl text-[11px] font-bold border ${
                                            groupSize === size 
                                                ? 'bg-cyan-600 text-slate-950 border-cyan-400 font-black' 
                                                : 'bg-slate-950 text-cyan-200 border-cyan-800 hover:border-cyan-600'
                                        }`}
                                    >
                                        {size === 1 ? 'Individual' : `G${size}`}
                                    </button>
                                ))}
                            </div>
                            <label className="block text-xs text-cyan-400 mt-3 mb-1 font-bold">Número de Grupos en el Aula:</label>
                            <input
                                type="number"
                                min="1" max="8" step="1"
                                value={numGroups}
                                onChange={(e) => setNumGroups(parseInt(e.target.value) || 1)}
                                className="w-full p-2 bg-slate-950 border border-cyan-800 rounded-xl text-cyan-100 text-center text-xs font-bold"
                            />
                            <p className="text-[10px] text-cyan-500 mt-1 p-2 bg-slate-950 rounded border border-cyan-900/60">
                                Configuración: {numGroups} grupos de {groupSize} alumnos.
                            </p>
                        </div>

                        {/* Sistema de Puntuación */}
                        <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-cyan-900 text-xs">
                            <span className="text-cyan-200">Otorgar Décimas (Sinergia):</span>
                            <button
                                onClick={() => setAwardingDecimals(!awardingDecimals)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                    awardingDecimals ? 'bg-emerald-600 text-white' : 'bg-rose-900 text-rose-100'
                                }`}
                            >
                                {awardingDecimals ? 'Activado' : 'Desactivado'}
                            </button>
                        </div>
                        {awardingDecimals && (
                            <div>
                                <label className="block text-[10px] text-cyan-400 mb-1">Valor del Bono (Puntos por +0.1):</label>
                                <input
                                    type="number"
                                    min="100" step="10"
                                    value={pointsPerDecima}
                                    onChange={(e) => setPointsPerDecima(parseInt(e.target.value) || 100)}
                                    className="w-full p-2 bg-slate-950 border border-cyan-800 rounded-xl text-cyan-100 text-center text-xs font-bold"
                                />
                            </div>
                        )}

                        {/* Control IA Auto */}
                        <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-cyan-900 text-xs">
                            <span className="text-cyan-200">IA Auto-Adaptativa:</span>
                            <button
                                onClick={() => setIsAutoMode(!isAutoMode)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                    isAutoMode ? 'bg-emerald-600 text-white' : 'bg-rose-900 text-rose-100'
                                }`}
                            >
                                {isAutoMode ? 'Activado' : 'Desactivado'}
                            </button>
                        </div>
                    </section>

                    {/* Botones de Acción del Profesor */}
                    <div className="pt-4 border-t border-cyan-900 flex flex-col gap-2.5">
                        {!gameStarted ? (
                            <button
                                onClick={handleStartGame}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg"
                            >
                                ▶️ Lanzar Juego a Sala
                            </button>
                        ) : (
                            <button
                                onClick={handleResetGame}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg"
                            >
                                🛑 Detener / Reiniciar Ronda
                            </button>
                        )}
                    </div>
                </aside>

                {/* 🔵 ÁREA DE JUEGO PRINCIPAL / PROYECTOR */}
                <main className="lg:col-span-3 bg-slate-900 p-5 md:p-8 rounded-3xl shadow-2xl border border-cyan-800 space-y-6">
                    {/* Status & Balloons Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-cyan-800 pb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                                PROYECTOR EN VIVO • CORTAFUEGOS
                            </span>
                            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                                Temática: {currentTheme.name}
                            </h2>
                            <p className="text-xs text-cyan-400 font-bold mt-1">
                                Grupo Atacante: <strong className="text-amber-400 font-mono text-sm">GRUPO {currentAttackerGroup}</strong> // Fallos: <strong className="text-rose-400 font-mono text-sm">{incorrectGuesses} / {MAX_GUESSES}</strong>
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-2xl border border-cyan-800">
                            {renderBalloons()}
                        </div>
                    </div>

                    {/* Word Display Grid */}
                    <div className="text-center flex justify-center gap-2 sm:gap-3 p-6 sm:p-8 bg-slate-950 rounded-2xl border border-cyan-800 min-h-[140px] flex-wrap items-center">
                        {displayedWord.map((letter, index) => (
                            <span
                                key={index}
                                className={`text-4xl sm:text-5xl md:text-6xl font-black pb-1 border-b-4 transition-all ${
                                    letter === '_' ? 'border-cyan-700 w-8 sm:w-10 text-cyan-900' : 'border-emerald-400 w-8 sm:w-10 text-white animate-pulse'
                                }`}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>

                    {/* Simulated Group Attack Buttons */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-900 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-400 uppercase">Simulación de Ataques por Grupo (1 a {numGroups}):</span>
                            <span className="text-[10px] text-slate-400">Prueba rápida de turnos</span>
                        </div>

                        <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5">
                            {alphabet.map(letter => {
                                const isGuessed = guessedLetters.has(letter);
                                const isCorrect = uniqueLetters.has(letter);
                                return (
                                    <button
                                        key={letter}
                                        onClick={() => handleGroupGuessLetter(currentAttackerGroup, letter)}
                                        disabled={!gameStarted || isGuessed || !!solvedByGroup}
                                        className={`p-2.5 text-xs font-black rounded-xl transition border ${
                                            !gameStarted
                                                ? 'bg-slate-900 text-slate-700 border-slate-800 cursor-not-allowed'
                                                : isGuessed
                                                ? isCorrect
                                                    ? 'bg-emerald-600 text-white border-emerald-400'
                                                    : 'bg-rose-950 text-rose-400 border-rose-800'
                                                : 'bg-slate-900 text-cyan-100 border-cyan-800 hover:bg-cyan-950 hover:border-cyan-400'
                                        }`}
                                    >
                                        {letter}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Manual Override Form for Teacher */}
                    {gameStarted && (
                        <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-950 rounded-2xl border border-amber-500/40">
                            <input
                                type="text"
                                value={localSolutionInput}
                                onChange={(e) => setLocalSolutionInput(e.target.value)}
                                placeholder="Escribe la solución manual para desbloquear..."
                                className="w-full bg-slate-900 border border-cyan-800 text-white rounded-xl p-2.5 text-xs font-mono outline-none focus:border-amber-400"
                            />
                            <button
                                onClick={handleTeacherForceSolve}
                                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition whitespace-nowrap"
                            >
                                Resolver Manualmente
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TeacherControlCenter;
