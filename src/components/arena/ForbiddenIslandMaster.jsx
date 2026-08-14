import React, { useState } from 'react';
import { Shield, Droplets, Flame, Wind, Mountain, RefreshCw, Trophy, Sparkles } from 'lucide-react';

export const ForbiddenIslandMaster = () => {
    const [floodLevel, setFloodLevel] = useState(3); // Level 1 to 5
    const [actionPoints, setActionPoints] = useState(3);
    const [treasuresCaptured, setTreasuresCaptured] = useState({
        fuego: false,
        viento: false,
        agua: false,
        tierra: false
    });

    const tiles = [
        { id: 1, name: 'Templo del Sol', status: 'dry' },
        { id: 2, name: 'Duna del Viento', status: 'flooded' },
        { id: 3, name: 'Cueva de Sombras', status: 'dry' },
        { id: 4, name: 'Isla Dorada', status: 'flooded' },
        { id: 5, name: 'Puerta de Cobre', status: 'dry' },
        { id: 6, name: 'Bosque de Coral', status: 'submerged' },
        { id: 7, name: 'Helipuerto de Escape', status: 'dry' },
        { id: 8, name: 'Jardín Suspendido', status: 'flooded' },
        { id: 9, name: 'Palacio de Coral', status: 'dry' }
    ];

    const [islandTiles, setIslandTiles] = useState(tiles);

    const handleTileAction = (id) => {
        if (actionPoints <= 0) {
            alert("⚠️ Te has quedado sin Puntos de Acción en este turno.");
            return;
        }

        setIslandTiles(prev => prev.map(t => {
            if (t.id === id) {
                const nextStatus = t.status === 'flooded' ? 'dry' : t.status === 'dry' ? 'flooded' : 'submerged';
                return { ...t, status: nextStatus };
            }
            return t;
        }));
        setActionPoints(prev => prev - 1);
    };

    const handleCaptureTreasure = (key) => {
        setTreasuresCaptured(prev => ({ ...prev, [key]: true }));
        alert(`🏆 ¡El curso ha asegurado el Tesoro: ${key.toUpperCase()}!`);
    };

    return (
        <div className="space-y-6 text-white animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-800 pb-4">
                <div>
                    <span className="text-xs font-black uppercase text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                        NEXUS ARENA • COOPERATIVO
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">La Isla Prohibida (Rescate de Tesoros)</h2>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="bg-cyan-950/80 border border-cyan-500/40 px-4 py-2 rounded-2xl text-center">
                        <span className="text-[10px] text-cyan-300 uppercase font-bold block">Nivel de Agua</span>
                        <strong className="text-lg font-mono text-cyan-300">NIVEL {floodLevel} / 5</strong>
                    </div>

                    <div className="bg-amber-950/80 border border-amber-500/40 px-4 py-2 rounded-2xl text-center">
                        <span className="text-[10px] text-amber-300 uppercase font-bold block">Puntos de Acción</span>
                        <strong className="text-lg font-mono text-amber-300">{actionPoints} PA</strong>
                    </div>
                </div>
            </div>

            {/* 4 Treasures Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                    onClick={() => handleCaptureTreasure('fuego')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                        treasuresCaptured.fuego ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                >
                    <span className="text-xs font-bold">🔥 Cáliz de Fuego</span>
                    <span className="text-xs font-black">{treasuresCaptured.fuego ? '✓' : '🔒'}</span>
                </button>

                <button
                    onClick={() => handleCaptureTreasure('viento')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                        treasuresCaptured.viento ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                >
                    <span className="text-xs font-bold">🌬️ Estatua Viento</span>
                    <span className="text-xs font-black">{treasuresCaptured.viento ? '✓' : '🔒'}</span>
                </button>

                <button
                    onClick={() => handleCaptureTreasure('agua')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                        treasuresCaptured.agua ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                >
                    <span className="text-xs font-bold">💧 Cristal Agua</span>
                    <span className="text-xs font-black">{treasuresCaptured.agua ? '✓' : '🔒'}</span>
                </button>

                <button
                    onClick={() => handleCaptureTreasure('tierra')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                        treasuresCaptured.tierra ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                >
                    <span className="text-xs font-bold">🪨 Piedra Tierra</span>
                    <span className="text-xs font-black">{treasuresCaptured.tierra ? '✓' : '🔒'}</span>
                </button>
            </div>

            {/* Island Grid */}
            <div className="grid grid-cols-3 gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                {islandTiles.map((t) => {
                    let tileStyle = "bg-emerald-900/60 border-emerald-600 text-emerald-200";
                    if (t.status === 'flooded') tileStyle = "bg-blue-900/80 border-blue-500 text-blue-200 animate-pulse";
                    if (t.status === 'submerged') tileStyle = "bg-slate-950 border-slate-800 text-slate-600 line-through opacity-50";

                    return (
                        <button
                            key={t.id}
                            onClick={() => handleTileAction(t.id)}
                            className={`p-5 rounded-2xl border-2 font-black text-xs transition flex flex-col items-center justify-center space-y-1 h-24 ${tileStyle}`}
                        >
                            <span>{t.name}</span>
                            <span className="text-[10px] font-mono uppercase">
                                {t.status === 'dry' ? '🟢 SECO' : t.status === 'flooded' ? '🌊 INUNDADO' : '⬛ HUNDIDO'}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ForbiddenIslandMaster;
