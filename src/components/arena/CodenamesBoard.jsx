import React, { useState } from 'react';
import { KeyRound, ShieldAlert, Sparkles, Trophy, Users, CheckCircle2, AlertOctagon, RotateCcw } from 'lucide-react';

export const CodenamesBoard = () => {
    // Tablero oficial de 5x5 (25 palabras del Universo AuLock / Antigravity)
    const initialWords = [
        { id: 1, word: 'RESISTENCIA', team: 'red', revealed: false },
        { id: 2, word: 'DOMO', team: 'blue', revealed: false },
        { id: 3, word: 'ENFOQUE', team: 'neutral', revealed: false },
        { id: 4, word: 'SINERGIA', team: 'red', revealed: false },
        { id: 5, word: 'AETHEL', team: 'blue', revealed: false },
        { id: 6, word: 'CENTINELA', team: 'red', revealed: false },
        { id: 7, word: 'CÉLULA', team: 'neutral', revealed: false },
        { id: 8, word: 'GRAVEDAD', team: 'blue', revealed: false },
        { id: 9, word: 'OXÍGENO', team: 'red', revealed: false },
        { id: 10, word: 'ÁTOMO', team: 'blue', revealed: false },
        { id: 11, word: 'FOTOSÍNTESIS', team: 'red', revealed: false },
        { id: 12, word: 'ECOSISTEMA', team: 'neutral', revealed: false },
        { id: 13, word: 'ADA TECH', team: 'blue', revealed: false },
        { id: 14, word: 'ESTUCHE NFC', team: 'red', revealed: false },
        { id: 15, word: 'PASAPORTE', team: 'blue', revealed: false },
        { id: 16, word: 'SOBERANÍA', team: 'red', revealed: false },
        { id: 17, word: 'DÉCIMAS', team: 'neutral', revealed: false },
        { id: 18, word: 'SQUAD ALFA', team: 'blue', revealed: false },
        { id: 19, word: 'LORE AFTER IA', team: 'red', revealed: false },
        { id: 20, word: 'VISIÓN IA', team: 'blue', revealed: false },
        { id: 21, word: 'MÉTODO SOCRÁTICO', team: 'red', revealed: false },
        { id: 22, word: 'REACTIVACIÓN', team: 'neutral', revealed: false },
        { id: 23, word: 'SEAMOS COMUNIDAD', team: 'red', revealed: false },
        { id: 24, word: 'NEXUS ARENA', team: 'blue', revealed: false },
        { id: 25, word: 'OMEGA CENTINELA', team: 'assassin', revealed: false }
    ];

    const [board, setBoard] = useState(initialWords);
    const [currentTurn, setCurrentTurn] = useState('red'); // 'red' (Equipo Ryo) o 'blue' (Equipo Han)
    const [clue, setClue] = useState('');
    const [clueNumber, setClueNumber] = useState(1);
    const [transmittedClue, setTransmittedClue] = useState(null);
    const [gameOver, setGameOver] = useState(null);

    // Contadores de cartas restantes
    const redRemaining = board.filter(b => b.team === 'red' && !b.revealed).length;
    const blueRemaining = board.filter(b => b.team === 'blue' && !b.revealed).length;

    // Función para revelar la palabra
    const revealWord = (id) => {
        if (gameOver) return;

        const updatedBoard = board.map(item => {
            if (item.id === id) {
                return { ...item, revealed: true };
            }
            return item;
        });

        setBoard(updatedBoard);

        const targetCard = board.find(item => item.id === id);

        if (targetCard.team === 'assassin') {
            setGameOver(`💥 ¡EQUIPO ${currentTurn === 'red' ? 'RYO' : 'HAN'} REVELÓ A OMEGA CENTINELA! GANA EL EQUIPO CONTRARIO.`);
            return;
        }

        // Si elige una carta que no es de su equipo, cambia el turno
        if (targetCard.team !== currentTurn) {
            setCurrentTurn(prev => prev === 'red' ? 'blue' : 'red');
        }

        // Verificar victoria
        const newRedLeft = updatedBoard.filter(b => b.team === 'red' && !b.revealed).length;
        const newBlueLeft = updatedBoard.filter(b => b.team === 'blue' && !b.revealed).length;

        if (newRedLeft === 0) setGameOver("🎉 ¡VICTORIA PARA EL EQUIPO RYO! Han descifrado todos sus códigos.");
        if (newBlueLeft === 0) setGameOver("🎉 ¡VICTORIA PARA EL EQUIPO HAN! Han descifrado todos sus códigos.");
    };

    const handleSendClue = () => {
        if (!clue.trim()) return;
        setTransmittedClue({
            word: clue.toUpperCase(),
            number: clueNumber,
            sender: currentTurn === 'red' ? 'Ryo' : 'Han'
        });
    };

    const handleResetGame = () => {
        setBoard(initialWords.map(w => ({ ...w, revealed: false })));
        setCurrentTurn('red');
        setClue('');
        setTransmittedClue(null);
        setGameOver(null);
    };

    return (
        <div className="space-y-6 text-white animate-in fade-in duration-300">
            {/* Header del Juego */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-emerald-950/80 rounded-2xl border border-emerald-700">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                        <h3 className="text-xl md:text-2xl font-extrabold text-white">Código Resistencia (Tablero 5x5)</h3>
                        <span className="text-[10px] text-emerald-400 font-mono">25 PALABRAS MAESTRAS DEL UNIVERSO AULOCK</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase shadow tracking-wider ${
                        currentTurn === 'red' ? 'bg-rose-600 text-white' : 'bg-sky-600 text-white'
                    }`}>
                        Turno: Equipo {currentTurn === 'red' ? 'Ryo (Rojo)' : 'Han (Azul)'}
                    </div>

                    <button
                        onClick={handleResetGame}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-xs font-bold flex items-center space-x-1"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reiniciar</span>
                    </button>
                </div>
            </div>

            {/* Marcadores de Equipo */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-rose-950/90 border border-rose-500/40 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-rose-300 uppercase block">🔴 Equipo Ryo</span>
                        <span className="text-[10px] text-slate-400">Objetivo: Descifrar códigos rojos</span>
                    </div>
                    <strong className="text-2xl font-mono font-black text-white">{redRemaining} Restantes</strong>
                </div>

                <div className="bg-sky-950/90 border border-sky-500/40 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-sky-300 uppercase block">🔵 Equipo Han</span>
                        <span className="text-[10px] text-slate-400">Objetivo: Descifrar códigos azules</span>
                    </div>
                    <strong className="text-2xl font-mono font-black text-white">{blueRemaining} Restantes</strong>
                </div>
            </div>

            {/* Panel de Información Privilegiada del Capitán (GM) */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase flex items-center space-x-2">
                        <KeyRound className="w-4 h-4 text-emerald-400" />
                        <span>Panel del Capitán / GM (Vista Privilegiada):</span>
                    </span>
                    <span className="text-[10px] text-slate-400 italic">Transmitiendo vía Antigravity Mesh</span>
                </div>

                {/* Formulario de Transmisión de Pista */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                        type="text"
                        value={clue}
                        onChange={(e) => setClue(e.target.value)}
                        placeholder={`Escribe la pista para el Equipo ${currentTurn === 'red' ? 'Ryo' : 'Han'}...`}
                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-emerald-400"
                    />
                    <select
                        value={clueNumber}
                        onChange={(e) => setClueNumber(parseInt(e.target.value))}
                        className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold"
                    >
                        <option value={1}>1 Palabra</option>
                        <option value={2}>2 Palabras</option>
                        <option value={3}>3 Palabras</option>
                        <option value={4}>4 Palabras</option>
                    </select>
                    <button
                        onClick={handleSendClue}
                        className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition whitespace-nowrap"
                    >
                        Transmitir Pista
                    </button>
                </div>

                {/* Pista Transmitida Activa */}
                {transmittedClue && (
                    <div className="p-3 bg-emerald-900/60 border border-emerald-500/40 rounded-xl text-xs font-bold text-emerald-200 flex items-center justify-between">
                        <span>📢 Pista Transmitida por {transmittedClue.sender}: <strong>"{transmittedClue.word}"</strong> ({transmittedClue.number})</span>
                        <span className="text-[10px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded font-black">EN VIVO</span>
                    </div>
                )}
            </div>

            {/* Cartel de Fin de Juego */}
            {gameOver && (
                <div className="p-5 bg-rose-950 border-2 border-rose-500 text-white rounded-2xl text-center font-black text-sm uppercase tracking-wider animate-bounce shadow-2xl">
                    {gameOver}
                </div>
            )}

            {/* TABLERO 5X5 DE 25 PALABRAS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {board.map((card) => {
                    let cardBg = "bg-slate-900 border-slate-800 hover:border-emerald-400 text-white";
                    if (card.revealed) {
                        if (card.team === 'red') cardBg = "bg-rose-700 border-rose-800 text-white shadow-xl scale-[0.98]";
                        else if (card.team === 'blue') cardBg = "bg-sky-700 border-sky-800 text-white shadow-xl scale-[0.98]";
                        else if (card.team === 'assassin') cardBg = "bg-slate-950 border-rose-500 text-rose-400 animate-pulse font-black";
                        else cardBg = "bg-amber-900/70 border-amber-700 text-amber-200 opacity-70";
                    }

                    return (
                        <button
                            key={card.id}
                            onClick={() => revealWord(card.id)}
                            disabled={card.revealed || !!gameOver}
                            className={`p-3 sm:p-4 rounded-2xl border-2 font-black tracking-wider uppercase transition flex flex-col items-center justify-center space-y-1 min-h-[5.5rem] text-center shadow-md break-words ${cardBg}`}
                        >
                            <span className="text-[10px] sm:text-xs leading-tight font-black max-w-full break-words">{card.word}</span>
                            {card.revealed && (
                                <span className="text-[8px] sm:text-[9px] font-mono opacity-80 uppercase block shrink-0 mt-0.5">
                                    {card.team === 'assassin' ? '☠️ OMEGA' : card.team === 'red' ? '🔴 RYO' : card.team === 'blue' ? '🔵 HAN' : '⚪ NEUTRAL'}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CodenamesBoard;
