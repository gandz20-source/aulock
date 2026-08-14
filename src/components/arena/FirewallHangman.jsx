import React, { useState, useEffect, useMemo } from 'react';
import { synergyManager } from '../../services/SynergyManager';

export const FirewallHangman = ({ theme = 'Ecosistemas & Sinergia', word = 'FOTOSINTESIS', onRoundEnd, classId = '4_MEDIO_A' }) => {
    // Estado del juego
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [incorrectGuesses, setIncorrectGuesses] = useState(0);
    const MAX_GUESSES = 10;
    const [currentAttackerGroup, setCurrentAttackerGroup] = useState(1); // Grupo 1 al 8
    const [solvedBy, setSolvedBy] = useState(null);
    const [guessInput, setGuessInput] = useState(''); // Input para resolver palabra completa

    // Normalizar la palabra (mayúsculas, sin tildes)
    const normalizedWord = useMemo(() => word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(), [word]);
    const uniqueLetters = useMemo(() => new Set(normalizedWord.split('')), [normalizedWord]);

    // Lógica para revelar la palabra
    const displayedWord = useMemo(() => {
        return normalizedWord.split('').map(letter => (guessedLetters.has(letter) ? letter : '_'));
    }, [normalizedWord, guessedLetters]);

    // Éxito
    const handleSolveSuccess = (groupId) => {
        setSolvedBy(groupId);
        alert(`🎉 ¡GRUPO ${groupId} HA DESENCRIPTADO EL CORTAFUEGOS!`);
        // Recompensa vía backend
        synergyManager.otorgarPuntosPorMision(`STUDENT_GROUP_${groupId}`, `ARENA_HANGMAN_${classId}`, 50);
        synergyManager.sumarEstrellasCurso(classId, 10);
        if (onRoundEnd) onRoundEnd(groupId);
    };

    // Manejar intento de letra
    const handleGuessLetter = (letter) => {
        if (guessedLetters.has(letter) || incorrectGuesses >= MAX_GUESSES || solvedBy) return;

        const newGuesses = new Set(guessedLetters);
        newGuesses.add(letter);
        setGuessedLetters(newGuesses);

        if (!uniqueLetters.has(letter)) {
            const nextIncorrect = incorrectGuesses + 1;
            setIncorrectGuesses(nextIncorrect);
            if (nextIncorrect >= MAX_GUESSES) {
                if (onRoundEnd) onRoundEnd(null); // Nadie gana
            }
        } else {
            // Comprobar si se resolvió
            const isSolved = Array.from(uniqueLetters).every(l => newGuesses.has(l));
            if (isSolved) {
                handleSolveSuccess(currentAttackerGroup);
            }
        }
        // Turno pasa al siguiente grupo (cíclico del 1 al 8)
        setCurrentAttackerGroup(prev => (prev % 8) + 1);
    };

    // Manejar intento de resolver palabra completa
    const handleSolveWord = (groupId) => {
        if (guessInput.trim().toUpperCase() === normalizedWord) {
            handleSolveSuccess(groupId);
        } else {
            // Intento fallido, explotan 2 globos y pasa el turno
            alert("⚠️ ¡CORRUPCIÓN DE DATOS! Palabra incorrecta (-2 Globos).");
            const newCount = Math.min(incorrectGuesses + 2, MAX_GUESSES);
            setIncorrectGuesses(newCount);
            if (newCount >= MAX_GUESSES && onRoundEnd) {
                onRoundEnd(null);
            }
            setCurrentAttackerGroup(prev => (prev % 8) + 1);
        }
        setGuessInput('');
    };

    // Generar los globos visualmente
    const renderBalloons = () => {
        const balloons = [];
        for (let i = 0; i < MAX_GUESSES; i++) {
            const isPopped = i < incorrectGuesses;
            balloons.push(
                <div
                    key={i}
                    className={`w-8 h-10 md:w-10 md:h-12 flex items-center justify-center text-xl transition-all duration-300 ${
                        isPopped ? 'opacity-30 scale-75' : 'animate-bounce'
                    }`}
                >
                    {isPopped ? '💥' : '🎈'}
                </div>
            );
        }
        return balloons;
    };

    // Teclado virtual (simplificado)
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

    return (
        <div className="p-4 md:p-6 bg-slate-950 rounded-3xl border-2 border-rose-800/80 shadow-2xl font-mono text-rose-200 space-y-6 animate-in fade-in duration-300">
            {/* Cabecera del Juego */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-rose-900 pb-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-rose-500 uppercase tracking-widest flex items-center space-x-2">
                        <span>⚠️ Cortafuegos Cyberpunk: {theme}</span>
                    </h2>
                    <p className="text-rose-300 text-xs mt-1 font-bold">
                        Turno de Ataque: <strong className="text-amber-400 font-mono">GRUPO {currentAttackerGroup}</strong> // Fallos Restantes: <strong className="text-cyan-300 font-mono">{MAX_GUESSES - incorrectGuesses}</strong>
                    </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 p-2.5 rounded-2xl border border-rose-900">
                    {renderBalloons()}
                </div>
            </div>

            {/* Tablero de Letras Ocultas / Reveladas */}
            <div className="text-center flex justify-center gap-2 sm:gap-3 p-6 sm:p-8 bg-slate-900 rounded-2xl border border-rose-900 min-h-[130px] flex-wrap items-center">
                {displayedWord.map((letter, index) => (
                    <span
                        key={index}
                        className={`text-4xl sm:text-5xl md:text-6xl font-black pb-1 border-b-4 transition-all ${
                            letter === '_' ? 'border-rose-700 w-8 sm:w-10 text-rose-900' : 'border-cyan-400 w-8 sm:w-10 text-white animate-pulse'
                        }`}
                    >
                        {letter}
                    </span>
                ))}
            </div>

            {/* Controles del Teclado y Solución Final */}
            {!solvedBy && incorrectGuesses < MAX_GUESSES && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 md:p-6 bg-slate-900 rounded-2xl border border-rose-900">
                    {/* Teclado Virtual de Letras */}
                    <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2">
                        {alphabet.map(letter => {
                            const isGuessed = guessedLetters.has(letter);
                            return (
                                <button
                                    key={letter}
                                    onClick={() => handleGuessLetter(letter)}
                                    disabled={isGuessed}
                                    className={`p-2.5 sm:p-3 text-sm sm:text-base font-black rounded-xl transition ${
                                        isGuessed 
                                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800' 
                                            : 'bg-rose-950 border border-rose-700 text-rose-100 hover:bg-rose-800 hover:scale-105 shadow'
                                    }`}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>

                    {/* Formulario para Resolver Palabra Completa */}
                    <div className="flex flex-col gap-3 justify-center items-center p-5 bg-black/40 rounded-2xl border border-rose-800/60">
                        <p className="text-sm font-black text-white uppercase tracking-wider">⚡ ¡DESENCRIPTAR PALABRA COMPLETA!</p>
                        <input
                            type="text"
                            value={guessInput}
                            onChange={(e) => setGuessInput(e.target.value)}
                            placeholder="Ingresa la palabra sin tildes..."
                            className="w-full p-3.5 bg-slate-950 text-center text-lg font-mono text-white rounded-xl border-2 border-rose-700 focus:border-rose-400 focus:outline-none"
                        />
                        <button
                            type="button"
                            onClick={() => handleSolveWord(currentAttackerGroup)}
                            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg"
                        >
                            ¡ENVIAR SOLUCIÓN FINAL (GRUPO {currentAttackerGroup})!
                        </button>
                    </div>
                </div>
            )}

            {/* Cartel de Victoria */}
            {solvedBy && (
                <div className="text-center p-6 md:p-8 bg-emerald-950 rounded-2xl border-2 border-emerald-500 text-emerald-200 animate-pulse space-y-2">
                    <h3 className="text-3xl md:text-4xl font-black uppercase text-emerald-400">🎉 ¡CORTAFUEGOS DESENCRIPTADO!</h3>
                    <p className="text-base font-bold text-white">El Grupo {solvedBy} ha salvado al curso y otorgado +10 Estrellas Meta de Sinergia Social.</p>
                </div>
            )}

            {/* Cartel de Derrota */}
            {!solvedBy && incorrectGuesses >= MAX_GUESSES && (
                <div className="text-center p-6 md:p-8 bg-rose-950 rounded-2xl border-2 border-rose-500 text-rose-200 space-y-2">
                    <h3 className="text-3xl md:text-4xl font-black uppercase text-rose-400">⚠️ ¡CORTAFUEGOS BLOQUEADO! ⚠️</h3>
                    <p className="text-base font-bold text-white">La palabra secreta era: <strong className="text-cyan-300 font-mono">{word}</strong>.</p>
                </div>
            )}
        </div>
    );
};

export default FirewallHangman;
