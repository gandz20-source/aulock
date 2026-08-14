import React, { useState, useEffect } from 'react';
import { StoryScroll } from './StoryScroll';
import { MissionPanel } from './MissionPanel';
import { SynergyBank } from './SynergyBank';
import { synergyManager } from '../../services/SynergyManager';

// Avatares de los personajes
const imgRyo = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
const imgHan = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80';
const imgSacerdotisa = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
const imgYorky = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';

export const AfterIAWorld = () => {
    const [studentPoints, setStudentPoints] = useState(350);
    const [activeMission, setActiveMission] = useState(null);
    const [completedMissions, setCompletedMissions] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadSynergy = () => {
            const data = synergyManager.getStudentSynergy('STUDENT_001');
            setStudentPoints(data.synergyPoints || 350);
            setCompletedMissions(data.misionesCompletadas || {});
        };
        loadSynergy();
    }, []);

    // --- CONFIGURACIÓN MAESTRA DE LAS 5 MISIONES ---
    const missionsConfig = [
        {
            id: 'AI_M_MAT01',
            materia: 'Matemática',
            titulo: 'El Algoritmo de Cifrado',
            personaje: 'Ryo',
            avatarUrl: imgRyo,
            contexto: 'Ryo necesita acceder a este servidor de Aethel Corp para liberar a los rehenes.',
            problema: 'Resuelve para x: 2^(x+1) = 16',
            tipoInput: 'texto_numerico',
            respuestaCorrecta: '3',
            puntosPremio: 150,
            nivel: 'Avanzado'
        },
        {
            id: 'AI_M_FIS01',
            materia: 'Ciencias // Física',
            titulo: 'La Trayectoria del Proyectil',
            personaje: 'Han',
            avatarUrl: imgHan,
            contexto: 'Han necesita calibrar el cañón de iones para destruir un Centinela Titán.',
            problema: 'Si v0 = 200 m/s y θ = 40°, ¿cuál es el alcance horizontal máximo R? (g=9.8m/s²)',
            tipoInput: 'texto_numerico_cientifico',
            respuestaCorrecta: '1988.3',
            puntosPremio: 200,
            nivel: 'Avanzado'
        },
        {
            id: 'AI_M_MAT02',
            materia: 'Matemática // Álgebra',
            titulo: 'Decencripta la Cerradura',
            personaje: 'Ryo',
            avatarUrl: imgRyo,
            contexto: '¡Los robots Centinela me han localizado! ¡Ayuda a Ryo a desbloquear la puerta de emergencia!',
            problema: 'Resolver ecuación: 2x + 32x = 34',
            tipoInput: 'texto_numerico_camara',
            respuestaCorrecta: '1',
            puntosPremio: 300,
            nivel: 'Medio',
            tiempoLimite: 45
        },
        {
            id: 'AI_M_HIS01',
            materia: 'Historia // Lenguaje',
            titulo: 'La Antigua Humanidad',
            personaje: 'Sacerdotisa',
            avatarUrl: imgSacerdotisa,
            contexto: 'La Sacerdotisa necesita entender el legado de la antigua civilización.',
            problema: 'DESARROLLA CÓMO EL CONSUMISMO HA AFECTADO A LA SOCIEDAD, REFLEXIONANDO SOBRE EL ORIGEN DE LA CRISIS CLIMÁTICA.',
            tipoInput: 'texto_desarrollo',
            respuestaCorrecta: 'VALIDACION_MANUAL',
            puntosPremio: 250,
            nivel: 'Avanzado'
        },
        {
            id: 'AI_M_ING01',
            materia: 'Inglés // Vocabulario',
            titulo: 'Reunir los Ingredientes',
            personaje: 'Yorky',
            avatarUrl: imgYorky,
            contexto: 'Yorky encontró un manual en inglés. Une las palabras con los ingredientes correctos para el estofado.',
            problema: 'Une: (CARROT, POTATO, APPLE, ONION) con sus iconos correspondientes.',
            tipoInput: 'match_columna',
            respuestaCorrecta: { 'zanahoria': 'CARROT', 'papa': 'POTATO', 'manzana': 'APPLE', 'cebolla': 'ONION' },
            puntosPremio: 100,
            nivel: 'Básico',
            tiempoLimite: 90
        }
    ];

    // --- LÓGICA DE FINALIZACIÓN DE MISIÓN ---
    const handleMissionComplete = async (misionId, puntosGanados, tipoInput, respuestaUsuario) => {
        setIsLoading(true);
        try {
            // 1. Llamada al backend para validar y otorgar puntos
            await synergyManager.otorgarPuntosPorMision('STUDENT_001', misionId, puntosGanados);

            // 2. Actualización del frontend
            const updated = synergyManager.getStudentSynergy('STUDENT_001');
            setStudentPoints(updated.synergyPoints);
            setCompletedMissions(updated.misionesCompletadas || {});
            setActiveMission(null);
        } catch (err) {
            alert(`⚠️ Error al registrar misión: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Banco de Sinergia */}
            <SynergyBank
                studentPoints={studentPoints}
                onPointsUpdated={() => {
                    const data = synergyManager.getStudentSynergy('STUDENT_001');
                    setStudentPoints(data.synergyPoints);
                }}
            />

            {/* Historia / Prólogo */}
            <StoryScroll onSelectMission={(mission) => setActiveMission(mission)} />

            {/* Modal / Panel de Misión Activa */}
            {activeMission && (
                <MissionPanel
                    mission={activeMission}
                    onComplete={handleMissionComplete}
                    onClose={() => setActiveMission(null)}
                />
            )}

            {/* Grid de las 5 Misiones de Campo */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center space-x-2">
                    <span>⚔️ LAS 5 MISIONES DE CAMPO AFTER IA</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {missionsConfig.map((m) => {
                        const isDone = !!completedMissions[m.id];
                        return (
                            <div
                                key={m.id}
                                className={`bg-slate-900 border-2 rounded-3xl p-6 flex flex-col justify-between space-y-4 transition ${
                                    isDone 
                                        ? 'border-emerald-500/40 opacity-80' 
                                        : 'border-slate-800 hover:border-cyan-500 shadow-xl hover:scale-[1.02]'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-400/30">
                                            {m.materia}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-amber-300">
                                            +{m.puntosPremio} PS
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={m.avatarUrl}
                                            alt={m.personaje}
                                            className="w-12 h-12 rounded-2xl object-cover border border-cyan-400 shrink-0"
                                        />
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{m.titulo}</h4>
                                            <span className="text-[11px] text-slate-400 font-medium">Héroe: {m.personaje}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                        {m.contexto}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setActiveMission(m)}
                                    disabled={isDone}
                                    className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow ${
                                        isDone
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                                            : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold'
                                    }`}
                                >
                                    {isDone ? '✓ Misión Completada' : '🎯 Iniciar Misión'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AfterIAWorld;
