import React, { useState } from 'react';
import { CodenamesBoard } from './CodenamesBoard';
import { ForbiddenIslandMaster } from './ForbiddenIslandMaster';
import { FirewallHangman } from './FirewallHangman';
import { BabelProtocol } from './BabelProtocol';
import { TeacherControlCenter } from './TeacherControlCenter';
import { synergyManager } from '../../services/SynergyManager';

// Avatares / Iconos de los juegos
const iconCodenames = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
const iconForbiddenIsland = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
const iconFirewall = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
const iconBabel = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80';
const iconTeacherControl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80';

export const ClassroomArena = ({ isTeacher = false }) => {
    // Si es profesor, iniciamos por defecto en el Centro de Control GM (ARENA_05)
    const [activeGame, setActiveGame] = useState(isTeacher ? 'ARENA_05' : null);
    const [classSynergyStars, setClassSynergyStars] = useState(120); // Estrellas acumuladas por el curso
    const [classClimateIndex, setClassClimateIndex] = useState(85); // 0 a 100

    // Catálogo completo de juegos
    const allGames = [
        {
            id: 'ARENA_01',
            titulo: 'Código Resistencia',
            descripcion: 'Juego de deducción y pistas. Pon a prueba tu comunicación.',
            icono: iconCodenames,
            dificultad: 'Media',
            tipo: 'Grupo vs Grupo'
        },
        {
            id: 'ARENA_02',
            titulo: 'La Isla Prohibida: Modo Cooperativo',
            descripcion: 'Salven los tesoros antes de que la isla sea inhabitable.',
            icono: iconForbiddenIsland,
            dificultad: 'Alta',
            tipo: 'Cooperativo'
        },
        {
            id: 'ARENA_03',
            titulo: 'Cortafuegos Cyberpunk',
            descripcion: 'Ahorcado de red por turnos (Grupos 1-8) y desencriptación.',
            icono: iconFirewall,
            dificultad: 'Alta',
            tipo: 'Ahorcado por Equipos'
        },
        {
            id: 'ARENA_04',
            titulo: 'Protocolo Babel',
            descripcion: 'Tutti-Frutti / Stop de Datos Cruzados con validación automática.',
            icono: iconBabel,
            dificultad: 'Media',
            tipo: 'Tutti-Frutti por Equipos'
        },
        {
            id: 'ARENA_05',
            titulo: 'Centro de Control GM',
            descripcion: 'Consola maestra docente: Configura temáticas, grupos (1-8) e IA.',
            icono: iconTeacherControl,
            dificultad: 'Avanzada',
            tipo: 'Consola Maestro Docente'
        }
    ];

    // Solo el profesor ve la Consola GM (ARENA_05); los alumnos solo ven las actividades de juego
    const availableGames = isTeacher ? allGames : allGames.filter(game => game.id !== 'ARENA_05');

    // Función para iniciar un juego
    const handleStartGame = (gameId) => {
        setActiveGame(gameId);
    };

    const handleRedeemGroupReward = () => {
        if (classSynergyStars >= 500) {
            setClassSynergyStars(prev => prev - 500);
            alert("🎉 ¡FELICITACIONES AL CURSO! Recompensa grupal canjeada: 15 minutos extra de recreo o música libre en sala.");
        } else {
            alert(`⚠️ Necesitan 500 Estrellas Meta como curso. Actualmente tienen ${classSynergyStars} estrellas.`);
        }
    };

    return (
        <div className="w-full max-w-full overflow-hidden p-4 md:p-8 space-y-8 bg-slate-950 font-sans text-white rounded-3xl border-2 border-emerald-500/40 shadow-2xl">
            {/* Cabecera */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
                    <span className="text-emerald-400 font-mono">NEXUS:</span> <span>Ágora de Convivencia Escolar</span>
                </h1>
                <div className="flex items-center gap-3 bg-slate-900 p-3 px-5 rounded-2xl shadow-md border border-slate-800">
                    <span className="text-xs text-slate-400 font-bold">Clima de Aula:</span>
                    <div className="w-32 md:w-40 h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${classClimateIndex > 70 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${classClimateIndex}%` }}></div>
                    </div>
                    <span className="font-bold text-base text-emerald-400 font-mono">{classClimateIndex}%</span>
                </div>
            </header>

            {/* ZONA DE LA ARENA */}
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Panel de Control Lateral */}
                <aside className="lg:col-span-1 bg-slate-900 p-5 rounded-3xl shadow-xl border border-slate-800 space-y-5">
                    <div>
                        <h2 className="text-base font-bold text-emerald-400 uppercase tracking-wider">
                            {isTeacher ? 'Panel de Control (GM Docente)' : 'Actividades de Convivencia'}
                        </h2>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                            {isTeacher ? 'Selecciona una actividad o configura la sesión del curso.' : 'Participa en los desafíos activos de la clase.'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        {availableGames.map(game => (
                            <button
                                key={game.id}
                                onClick={() => handleStartGame(game.id)}
                                className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center gap-3 ${
                                    activeGame === game.id 
                                        ? 'bg-emerald-950/80 border-emerald-400 shadow-lg scale-[1.01]' 
                                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <img src={game.icono} alt={game.titulo} className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30 shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-white text-xs truncate">{game.titulo}</h4>
                                    <span className="text-[9px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">{game.tipo}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Área de Juego Principal (Dinámica a la derecha) */}
                <main className="lg:col-span-3 bg-slate-900 p-5 md:p-8 rounded-3xl shadow-2xl border border-slate-800 text-white min-h-[420px] overflow-hidden">
                    {!activeGame && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16 text-slate-400">
                            <span className="text-5xl">👥⚙️</span>
                            <h3 className="text-xl md:text-2xl font-bold text-emerald-400">Esperando Instrucciones del GM...</h3>
                            <p className="max-w-md text-xs text-slate-300 leading-relaxed font-medium">
                                El profesor iniciará la actividad de convivencia en breve desde el panel GM. ¡Preparen sus equipos!
                            </p>
                        </div>
                    )}

                    {activeGame === 'ARENA_01' && (
                        <CodenamesBoard />
                    )}

                    {activeGame === 'ARENA_02' && (
                        <ForbiddenIslandMaster />
                    )}

                    {activeGame === 'ARENA_03' && (
                        <FirewallHangman
                            theme="Ecosistemas & Sinergia"
                            word="FOTOSINTESIS"
                            classId="4_MEDIO_A"
                            onRoundEnd={(winnerGroup) => {
                                if (winnerGroup) setClassSynergyStars(prev => prev + 10);
                            }}
                        />
                    )}

                    {activeGame === 'ARENA_04' && (
                        <BabelProtocol
                            classId="4_MEDIO_A"
                            isTeacher={isTeacher}
                            onRoundEnd={() => setClassSynergyStars(prev => prev + 15)}
                        />
                    )}

                    {activeGame === 'ARENA_05' && isTeacher && (
                        <TeacherControlCenter />
                    )}
                </main>
            </section>

            {/* ZONA INFERIOR: BANCO DE RECOMPENSAS GRUPAL */}
            <section className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-amber-500/20 border border-amber-400/30 rounded-2xl text-amber-300 text-2xl shrink-0">
                        ⭐
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Recompensas del Curso (Sinergia Social)</h3>
                        <p className="text-xs text-slate-400 font-medium">Alcanza metas como curso para desbloquear privilegios en el aula.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-4xl md:text-5xl font-extrabold text-amber-400 font-mono">{classSynergyStars}</span>
                    <span className="text-sm font-bold text-slate-400 mt-2">/ 500 Estrellas Meta</span>
                </div>

                <button
                    onClick={handleRedeemGroupReward}
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition whitespace-nowrap"
                >
                    Canjear Recompensa del Curso
                </button>
            </section>
        </div>
    );
};

export default ClassroomArena;
