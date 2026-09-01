import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, Zap, Award, Crown, Play, Pause, RotateCw, Plus, 
    Sparkles, Shield, Flame, Sword, Target, MessageSquare, 
    Clock, CheckCircle2, AlertTriangle, ChevronRight, Activity, 
    Share2, Compass, Radio, BarChart3, HelpCircle, Eye, RefreshCw,
    Edit3, BookOpen, Info, Check, Sliders
} from 'lucide-react';
import { generateArenaGamificationChallenge } from '../../services/GeminiService';
import { supabase } from '../../config/supabase';

// --- CURRICULUM TOPICS REGISTRY ---
export const CURRICULUM_UNITS = [
    { id: 'math-quad', label: '📐 Ecuaciones Cuadráticas & Parábolas (STEM)' },
    { id: 'bio-cells', label: '🧬 Biología Celular, Fotosíntesis & Ecosistemas' },
    { id: 'hist-ind', label: '🏛️ Revolución Industrial & Formación Ciudadana' },
    { id: 'lang-paes', label: '✍️ Argumentación, Falacias & Debate PAES' },
    { id: 'chem-reac', label: '🧪 Estequiometría & Reacciones Químicas' },
    { id: 'custom', label: '✨ Tema Personalizado / Unidad en Curso' }
];

// --- 10 SQUADS BASELINE DATASET (40 STUDENTS) ---
export const INITIAL_10_SQUADS = [
    { 
        id: 'sq-1', 
        name: 'Squad Alfa', 
        color: 'from-cyan-500 to-blue-600', 
        score: 450, 
        progress: 85, 
        status: 'Active', 
        damageDealt: 1000,
        speakerName: 'Juan Carlos Pérez',
        members: [
            { id: 'usr-1', name: 'Juan Carlos Pérez', role: 'Líder Lógico', isSpeaker: true },
            { id: 'usr-2', name: 'Mateo Rojas', role: 'Mentor de Pares', isSpeaker: false },
            { id: 'usr-3', name: 'Lucas Fernández', role: 'Colaborador Creativo', isSpeaker: false },
            { id: 'usr-4', name: 'Diego Morales', role: 'Coordinador Algorítmico', isSpeaker: false }
        ]
    },
    { 
        id: 'sq-2', 
        name: 'Squad Beta', 
        color: 'from-purple-500 to-indigo-600', 
        score: 420, 
        progress: 80, 
        status: 'Active', 
        damageDealt: 1000,
        speakerName: 'Sofía Martínez',
        members: [
            { id: 'usr-5', name: 'Sofía Martínez', role: 'Líder de Historia', isSpeaker: true },
            { id: 'usr-6', name: 'Camila Silva', role: 'Capitán de Debate', isSpeaker: false },
            { id: 'usr-7', name: 'Valentina Soto', role: 'Líder Científica', isSpeaker: false },
            { id: 'usr-8', name: 'Constanza Silva', role: 'Coordinadora Técnica', isSpeaker: false }
        ]
    },
    { id: 'sq-3', name: 'Squad Gamma', color: 'from-emerald-500 to-teal-600', score: 390, progress: 75, status: 'Active', damageDealt: 1000 },
    { id: 'sq-4', name: 'Squad Delta', color: 'from-amber-500 to-orange-600', score: 380, progress: 70, status: 'Active', damageDealt: 1000 },
    { id: 'sq-5', name: 'Squad Epsilon', color: 'from-rose-500 to-red-600', score: 410, progress: 80, status: 'Active', damageDealt: 1000 },
    { id: 'sq-6', name: 'Squad Zeta', color: 'from-fuchsia-500 to-pink-600', score: 360, progress: 65, status: 'Active', damageDealt: 1000 },
    { id: 'sq-7', name: 'Squad Eta', color: 'from-sky-500 to-cyan-600', score: 400, progress: 78, status: 'Active', damageDealt: 1000 },
    { id: 'sq-8', name: 'Squad Theta', color: 'from-violet-500 to-purple-600', score: 370, progress: 72, status: 'Active', damageDealt: 1000 },
    { id: 'sq-9', name: 'Squad Iota', color: 'from-lime-500 to-emerald-600', score: 440, progress: 82, status: 'Active', damageDealt: 1000 },
    { id: 'sq-10', name: 'Squad Kappa', color: 'from-yellow-500 to-amber-600', score: 350, progress: 60, status: 'Active', damageDealt: 1000 }
];

// --- GAME DEFINITIONS (MICRO VS MACRO) WITH COMPREHENSIVE INSTRUCTIONS ---
export const GAME_MODES = {
    MICRO: [
        {
            id: 'PALABRA_PROHIBIDA',
            title: 'Palabra Prohibida (Tabú)',
            tagline: 'Oratoria & Síntesis Conceptual',
            description: 'Un integrante actúa como Orador y explica el concepto a su equipo sin pronunciar 4 palabras prohibidas.',
            icon: '🔤',
            color: 'cyan',
            defaultDuration: 180,
            cooperativeType: 'Micro-Squad (4 alumnos)',
            instructions: {
                goal: 'Fomentar la precisión del lenguaje oral y la comprensión conceptual profunda sin caer en términos mecánicos.',
                steps: [
                    'Paso 1: Se designa 1 Orador por escuadrón. El resto son Adivinadores.',
                    'Paso 2: El Orador ve la Palabra Secreta y las 4 Palabras Prohibidas. Sus compañeros NO pueden ver su pantalla.',
                    'Paso 3: El Orador explica el concepto en voz alta usando metáforas y definiciones.',
                    'Paso 4: Los Adivinadores escriben sus respuestas en su terminal. Al acertar, suman +100 PS.'
                ],
                rules: [
                    'Prohibido pronunciar la palabra secreta o cualquier derivada.',
                    'Prohibido pronunciar cualquiera de las 4 palabras tabú.',
                    'Prohibido hacer mímica o escribir en el aire.',
                    'Los adivinadores pueden enviar múltiples intentos hasta acertar.'
                ]
            },
            defaultContent: {
                secretWord: 'PARÁBOLA',
                tabooWords: ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE'],
                hint: 'Gráfica geométrica simétrica característica de las funciones polinómicas de grado 2.'
            }
        },
        {
            id: 'INFO_ASIMETRICA',
            title: 'Información Asimétrica (Puzzle)',
            tagline: 'Interdependencia Positiva Total',
            description: 'Cada alumno recibe un dato exclusivo en su pantalla. Ninguno puede resolver el problema solo.',
            icon: '🧩',
            color: 'indigo',
            defaultDuration: 300,
            cooperativeType: 'Micro-Squad (4 alumnos)',
            instructions: {
                goal: 'Obligar a la comunicación activa e interdependencia. Ningún alumno tiene los datos suficientes de forma individual.',
                steps: [
                    'Paso 1: Cada alumno recibe 1 pista única según su rol (Líder Lógico, Mentor, etc.).',
                    'Paso 2: Prohibido mostrar las pantallas. Deben leer y comunicar sus variables en voz alta.',
                    'Paso 3: El escuadrón combina las 4 variables para resolver la ecuación central.',
                    'Paso 4: Cualquier integrante escribe la respuesta unificada en su terminal.'
                ],
                rules: [
                    'Cada integrante debe verbalizar su pista a sus compañeros.',
                    'Se valida la solución numérica o conceptual consensuada.',
                    '+100 PS para todo el squad al enviar el resultado correcto.'
                ]
            },
            defaultContent: {
                mainObjective: 'Calcular la altura máxima h(max) alcanzada por el proyectil y el tiempo de vuelo.',
                clueRole1: 'Velocidad de lanzamiento inicial: v0 = 20 m/s con ángulo vertical (90°).',
                clueRole2: 'Ecuación cinemática de posición: h(t) = v0·t - 0.5·g·t².',
                clueRole3: 'Aceleración de gravedad efectiva en la sala: g = 10 m/s².',
                clueRole4: 'Condición en la cúspide: la velocidad vertical se anula en t = 2 segundos.',
                expectedSolution: '20'
            }
        },
        {
            id: 'CONSENSO_OBLIGATORIO',
            title: 'Consenso Obligatorio',
            tagline: 'Negociación & Dilemas Éticos',
            description: 'El escuadrón debe debatir un dilema complejo y alcanzar una votación 100% unánime antes del tiempo límite.',
            icon: '🗳️',
            color: 'emerald',
            defaultDuration: 240,
            cooperativeType: 'Micro-Squad (4 alumnos)',
            instructions: {
                goal: 'Desarrollar habilidades de argumentación, escucha activa y negociación sin imposiciones.',
                steps: [
                    'Paso 1: Leer el caso o dilema ético/pedagógico presentado en pantalla.',
                    'Paso 2: Discutir las 3 posturas posibles dentro del escuadrón.',
                    'Paso 3: Votar individualmente en sus pantallas.',
                    'Paso 4: Para ganar la ronda (+150 PS), los 4 miembros deben votar exactamente por la misma opción (100% Consenso).'
                ],
                rules: [
                    'Si el tiempo expira sin consenso unánime (4/4), no se desbloquea el bonus.',
                    'Cada estudiante puede cambiar su voto en tiempo real tras escuchar a sus pares.'
                ]
            },
            defaultContent: {
                dilemmaTitle: 'Dilema de Optimización y Ética en el Aula',
                scenario: 'El curso debe elegir el protocolo prioritario para implementar inteligencia artificial y evaluación formativa en el próximo semestre.',
                optionA: 'Opción A: Máxima automatización con retroalimentación instantánea.',
                optionB: 'Opción B: Co-evaluación grupal con mediación docente obligatoria.',
                optionC: 'Opción C: Protocolo híbrido con defensa socrática presencial.'
            }
        }
    ],
    MACRO: [
        {
            id: 'DESAFIO_COLOSO',
            title: 'Desafío Coloso (Boss Raid)',
            tagline: '10 Squads vs Jefe Final del Curso',
            description: 'Toda la sala (40 alumnos) une fuerzas. Cada respuesta correcta de los 10 squads resta 1.000 HP al Coloso.',
            icon: '⚔️',
            color: 'rose',
            defaultDuration: 300,
            cooperativeType: 'Macro-Curso (40 alumnos / 10 Squads)',
            instructions: {
                goal: 'Unión masiva de toda la clase. La meta no es competir entre squads, sino derrotar al jefe colaborativamente.',
                steps: [
                    'Paso 1: En el proyector aparece el Jefe Final con 10.000 HP.',
                    'Paso 2: Cada escuadrón recibe un micro-desafío matemático o conceptual en su terminal.',
                    'Paso 3: Al resolver y enviar su respuesta correcta, el escuadrón lanza un ataque de -1.000 HP al Coloso.',
                    'Paso 4: El curso gana cuando los 10 escuadrones logran impactar al Coloso a tiempo.'
                ],
                rules: [
                    'Cada squad ataca de forma independiente pero suma al daño global de la sala.',
                    'Se permite que alumnos que terminen ayuden a otros squads en sala.'
                ]
            },
            defaultContent: {
                bossName: 'KRÓNOS // El Titán de la Entropía',
                bossAvatar: '👹',
                bossTotalHp: 10000,
                bossLore: 'Una anomalía temporal amenaza con desestabilizar la sala. Los 10 escuadrones deben resolver sus micro-misiones para derrotarlo.',
                squadProblem: 'Calcula el valor crítico para neutralizar el escudo: ¿Cuánto es (4 × 5) + 12?',
                expectedAnswer: '32'
            }
        },
        {
            id: 'RED_EMBAJADORES',
            title: 'Red de Embajadores',
            tagline: 'Intercambio Físico en Sala',
            description: 'Un embajador de cada squad viaja físicamente a otro equipo para intercambiar estrategias y validar soluciones.',
            icon: '🌐',
            color: 'amber',
            defaultDuration: 420,
            cooperativeType: 'Macro-Curso (40 alumnos / 10 Squads)',
            instructions: {
                goal: 'Romper la barrera del subgrupo y compartir buenas prácticas entre toda la sala.',
                steps: [
                    'Paso 1: El sistema elige 1 Embajador por squad.',
                    'Paso 2: El Embajador se pone de pie y se desplaza físicamente al squad contiguo.',
                    'Paso 3: El Embajador explica la estrategia de su equipo y aprende el método del equipo anfitrión.',
                    'Paso 4: El Embajador regresa y el escuadrón registra la síntesis en su terminal.'
                ],
                rules: [
                    'El Embajador no puede escribir por el otro equipo; solo puede enseñar y dialogar.',
                    'El equipo anfitrión debe escuchar con respeto y explicar sus dudas.'
                ]
            },
            defaultContent: {
                missionTitle: 'Misión Diplomática de Transferencia Cognitiva',
                instructionsText: 'Cada escuadrón envía 1 embajador al squad siguiente (1→2, 2→3, etc.) para compartir su técnica de resolución.',
                challengeGoal: 'Validar el resultado final de la unidad mediante contraste de dos métodos distintos.'
            }
        },
        {
            id: 'TERMOMETRO_CIUDADANO',
            title: 'Termómetro Ciudadano',
            tagline: 'Debate Plenario & Votación Anónima',
            description: 'Tesis de controversia en vivo. La sala argumenta y calibra en tiempo real la temperatura del consenso democrático.',
            icon: '🌡️',
            color: 'fuchsia',
            defaultDuration: 240,
            cooperativeType: 'Macro-Curso (40 alumnos / 10 Squads)',
            instructions: {
                goal: 'Ejercitar el pensamiento crítico, la tolerancia y la fundamentación de posturas ciudadanas complejas.',
                steps: [
                    'Paso 1: El docente proyecta la tesis o afirmación controversial.',
                    'Paso 2: Los alumnos eligen su postura (A Favor / En Contra / Síntesis) y redactan su argumento.',
                    'Paso 3: El termómetro proyecta los porcentajes globales en tiempo real de forma anónima.',
                    'Paso 4: Se abre el plenario para escuchar argumentos destacados.'
                ],
                rules: [
                    'El voto es estrictamente anónimo para evitar presión social.',
                    'Todo argumento debe fundamentarse con datos o principios éticos.'
                ]
            },
            defaultContent: {
                debateThesis: '¿Debe priorizarse el aprendizaje automatizado por sobre la evaluación tradicional en la educación secundaria?',
                reflectionPrompt: 'Fundamenta tu postura en menos de 280 caracteres con al menos un argumento técnico o ético.'
            }
        }
    ]
};

export const CoexistenceTeacher = () => {
    // --- 1. STATE MANAGEMENT ---
    const [activeScaleTab, setActiveScaleTab] = useState('MICRO'); // 'MICRO' | 'MACRO'
    const [selectedGame, setSelectedGame] = useState(GAME_MODES.MICRO[0]);
    const [selectedTopicId, setSelectedTopicId] = useState('math-quad');
    const [customTopicText, setCustomTopicText] = useState('');
    const [durationSeconds, setDurationSeconds] = useState(GAME_MODES.MICRO[0].defaultDuration);
    const [difficulty, setDifficulty] = useState('Normal');
    const [autoAssignSquads, setAutoAssignSquads] = useState(false);
    const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
    const [activeConfigTab, setActiveConfigTab] = useState('SETUP'); // 'SETUP' | 'CUSTOMIZER' | 'RULES'

    // --- 2. EDITABLE GAME CONTENT STATE (TEACHER OVERWRITES / CUSTOMIZATIONS) ---
    const [customGameContent, setCustomGameContent] = useState(() => ({
        ...GAME_MODES.MICRO[0].defaultContent
    }));

    // --- 3. LIVE GAME SESSION STATE ---
    const [activeSession, setActiveSession] = useState(() => {
        const saved = localStorage.getItem('aulock_arena_game_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.status === 'RUNNING' || parsed.status === 'PAUSED') {
                    return parsed;
                }
            } catch (e) {}
        }
        return null;
    });

    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [squadsList, setSquadsList] = useState(INITIAL_10_SQUADS);
    const [bossCurrentHp, setBossCurrentHp] = useState(10000);
    const [liveSubmissions, setLiveSubmissions] = useState([]);

    const activeTopicLabel = useMemo(() => {
        if (selectedTopicId === 'custom' && customTopicText) return customTopicText;
        const found = CURRICULUM_UNITS.find(u => u.id === selectedTopicId);
        return found ? found.label : 'Ecuaciones Cuadráticas & Matemáticas STEM';
    }, [selectedTopicId, customTopicText]);

    // When selected game changes, update duration and default content if not manually edited
    const handleSelectGame = (gameItem) => {
        setSelectedGame(gameItem);
        setDurationSeconds(gameItem.defaultDuration);
        setCustomGameContent(gameItem.defaultContent || {});
    };

    // --- 4. SUPABASE REALTIME & CLOCK SYNC ENGINE ---
    useEffect(() => {
        let interval = null;

        if (activeSession && activeSession.status === 'RUNNING' && activeSession.targetEndTime) {
            const syncTick = () => {
                const now = Date.now();
                const rem = Math.max(0, Math.ceil((activeSession.targetEndTime - now) / 1000));
                setRemainingSeconds(rem);

                if (rem === 0) {
                    handleFinishSession(true);
                }
            };

            syncTick();
            interval = setInterval(syncTick, 500);
        }

        // Setup Supabase Realtime channel
        const channel = supabase
            .channel('coexistence_nexus_arena')
            .on('broadcast', { event: 'student_answer_submitted' }, ({ payload }) => {
                console.log('📡 Realtime: Student response received:', payload);
                if (payload) {
                    setLiveSubmissions(prev => [payload, ...prev.slice(0, 19)]);
                    if (payload.isCorrect && payload.damage) {
                        handleBossAttack(payload.damage);
                    }
                }
            })
            .subscribe();

        const handleStorageSync = (e) => {
            let data = null;
            if (e && e.detail && e.detail.session) {
                data = e.detail.session;
            } else {
                const saved = localStorage.getItem('aulock_arena_game_session');
                if (saved) {
                    try { data = JSON.parse(saved); } catch (err) {}
                }
            }

            if (data) {
                setActiveSession(data);
                if (data.targetEndTime) {
                    setRemainingSeconds(Math.max(0, Math.ceil((data.targetEndTime - Date.now()) / 1000)));
                }
                if (data.ai_context?.bossTotalHp || data.gameData?.bossTotalHp) {
                    const total = data.ai_context?.bossTotalHp || data.gameData?.bossTotalHp;
                    const current = data.ai_context?.bossCurrentHp ?? data.gameData?.bossCurrentHp ?? total;
                    setBossCurrentHp(current);
                }
            } else {
                setActiveSession(null);
            }
        };

        window.addEventListener('storage', handleStorageSync);
        window.addEventListener('aulock_arena_game_event', handleStorageSync);

        return () => {
            if (interval) clearInterval(interval);
            supabase.removeChannel(channel);
            window.removeEventListener('storage', handleStorageSync);
            window.removeEventListener('aulock_arena_game_event', handleStorageSync);
        };
    }, [activeSession?.status, activeSession?.targetEndTime]);

    // --- 5. REALTIME BROADCAST HELPER ---
    const broadcastSession = (sessionData) => {
        // 1. LocalStorage & Window Custom Events (instant local sync)
        localStorage.setItem('aulock_arena_game_session', JSON.stringify(sessionData));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('aulock_arena_game_event', { detail: { session: sessionData } }));

        // 2. Supabase Realtime Broadcast (multi-device network sync)
        try {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'arena_session_update',
                        payload: sessionData
                    });
                }
            });
        } catch (err) {
            console.warn("Supabase Realtime broadcast fallback:", err);
        }
    };

    // --- 6. AI CONTENT GENERATOR / AUTO-POPULATOR ---
    const handleGenerateWithAI = async () => {
        setIsGeneratingWithAI(true);
        try {
            const generated = await generateArenaGamificationChallenge({
                gameId: selectedGame.id,
                gameTitle: selectedGame.title,
                topic: activeTopicLabel,
                difficulty,
                durationMinutes: Math.ceil(durationSeconds / 60)
            });

            if (generated) {
                // Map generated fields to customGameContent
                if (selectedGame.id === 'PALABRA_PROHIBIDA') {
                    setCustomGameContent({
                        secretWord: generated.secretWord || 'PARÁBOLA',
                        tabooWords: generated.tabooWords || ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE'],
                        hint: generated.hint || 'Concepto clave de la función cuadrática.'
                    });
                } else if (selectedGame.id === 'INFO_ASIMETRICA') {
                    setCustomGameContent({
                        mainObjective: generated.mainObjective || 'Calcular la altura máxima y tiempo de vuelo.',
                        clueRole1: generated.roleClues?.[0]?.clue || 'Velocidad de lanzamiento inicial: v0 = 20 m/s.',
                        clueRole2: generated.roleClues?.[1]?.clue || 'Ecuación: h(t) = v0·t - 0.5·g·t².',
                        clueRole3: generated.roleClues?.[2]?.clue || 'Aceleración de gravedad efectiva: g = 10 m/s².',
                        clueRole4: generated.roleClues?.[3]?.clue || 'Tiempo en la cima: t = 2 segundos.',
                        expectedSolution: generated.expectedSolution || '20'
                    });
                } else if (selectedGame.id === 'CONSENSO_OBLIGATORIO') {
                    setCustomGameContent({
                        dilemmaTitle: generated.dilemmaTitle || 'Dilema Ético & Pedagógico',
                        scenario: generated.scenario || 'Situación compleja a debatir en sala...',
                        optionA: generated.options?.[0]?.title || 'Opción A: Máxima automatización.',
                        optionB: generated.options?.[1]?.title || 'Opción B: Mediación docente obligatoria.',
                        optionC: generated.options?.[2]?.title || 'Opción C: Protocolo híbrido socrático.'
                    });
                } else if (selectedGame.id === 'DESAFIO_COLOSO') {
                    setCustomGameContent({
                        bossName: generated.bossName || 'KRÓNOS // El Titán de la Entropía',
                        bossAvatar: generated.bossAvatar || '👹',
                        bossTotalHp: generated.bossTotalHp || 10000,
                        bossLore: generated.bossLore || 'El Coloso amenaza la sala...',
                        squadProblem: generated.squadChallenges?.[0]?.problem || 'Calcula el valor crítico para neutralizar el escudo: (4 × 5) + 12',
                        expectedAnswer: generated.squadChallenges?.[0]?.answer || '32'
                    });
                } else if (selectedGame.id === 'RED_EMBAJADORES') {
                    setCustomGameContent({
                        missionTitle: generated.missionTitle || 'Misión Diplomática de Transferencia Cognitiva',
                        instructionsText: generated.instructions || 'Cada escuadrón envía 1 embajador...',
                        challengeGoal: generated.ambassadorObjective || 'Validar el resultado final de la unidad.'
                    });
                } else if (selectedGame.id === 'TERMOMETRO_CIUDADANO') {
                    setCustomGameContent({
                        debateThesis: generated.debateThesis || '¿Debe priorizarse el aprendizaje automatizado en la educación secundaria?',
                        reflectionPrompt: generated.reflectionPrompt || 'Fundamenta tu postura en menos de 280 caracteres.'
                    });
                }
            }
            alert("✨ ¡Contenido generado con Gemini 2.5 Flash! Puedes afinar o editar cualquier palabra o pregunta antes de lanzar.");
            setActiveConfigTab('CUSTOMIZER');
        } catch (err) {
            console.error("Error generating with AI:", err);
            alert("Se mantuvo el contenido editable predeterminado.");
        } finally {
            setIsGeneratingWithAI(false);
        }
    };

    // --- 7. LAUNCH GAME ACTION (USING CUSTOMIZED TEACHER CONTENT) ---
    const handleLaunchGame = async () => {
        const now = Date.now();
        const targetEndTime = now + (durationSeconds * 1000);

        // Build complete payload integrating teacher's exact customized content
        const sessionPayload = {
            sessionId: 'ARENA_SESSION_' + now,
            game_id: selectedGame.id,
            gameId: selectedGame.id,
            gameTitle: selectedGame.title,
            gameIcon: selectedGame.icon,
            scale: activeScaleTab,
            topic: activeTopicLabel,
            difficulty,
            duration: durationSeconds,
            durationSeconds,
            startTime: now,
            targetEndTime,
            status: 'RUNNING',
            speakerName: 'Juan Carlos Pérez',
            speakerId: 'usr-1',
            instructions: selectedGame.instructions,
            ai_context: {
                ...customGameContent,
                gameId: selectedGame.id,
                // Harmonize fields for student components
                secretWord: customGameContent.secretWord,
                tabooWords: customGameContent.tabooWords || ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE'],
                hint: customGameContent.hint,
                mainObjective: customGameContent.mainObjective,
                roleClues: [
                    { role: 'Líder Lógico', clue: customGameContent.clueRole1 },
                    { role: 'Mentor de Pares', clue: customGameContent.clueRole2 },
                    { role: 'Colaborador Creativo', clue: customGameContent.clueRole3 },
                    { role: 'Coordinador Algorítmico', clue: customGameContent.clueRole4 }
                ],
                expectedSolution: customGameContent.expectedSolution,
                dilemmaTitle: customGameContent.dilemmaTitle,
                scenario: customGameContent.scenario,
                options: [
                    { id: 'A', title: customGameContent.optionA },
                    { id: 'B', title: customGameContent.optionB },
                    { id: 'C', title: customGameContent.optionC }
                ],
                bossName: customGameContent.bossName,
                bossTotalHp: customGameContent.bossTotalHp || 10000,
                bossCurrentHp: customGameContent.bossTotalHp || 10000,
                bossLore: customGameContent.bossLore,
                squadProblem: customGameContent.squadProblem,
                expectedAnswer: customGameContent.expectedAnswer,
                missionTitle: customGameContent.missionTitle,
                instructionsText: customGameContent.instructionsText,
                debateThesis: customGameContent.debateThesis,
                reflectionPrompt: customGameContent.reflectionPrompt
            },
            squads: INITIAL_10_SQUADS,
            launchedBy: 'Prof. Carlos Rivas'
        };

        broadcastSession(sessionPayload);
        setActiveSession(sessionPayload);
        setRemainingSeconds(durationSeconds);
        setSquadsList(INITIAL_10_SQUADS);
        if (customGameContent.bossTotalHp) setBossCurrentHp(customGameContent.bossTotalHp);
    };

    // --- 8. MASTER GM CONTROLS ---
    const handleTogglePause = () => {
        if (!activeSession) return;

        if (activeSession.status === 'RUNNING') {
            const updated = {
                ...activeSession,
                status: 'PAUSED',
                pausedRemaining: remainingSeconds,
                targetEndTime: null
            };
            broadcastSession(updated);
            setActiveSession(updated);
        } else if (activeSession.status === 'PAUSED') {
            const remSec = activeSession.pausedRemaining || 60;
            const targetEndTime = Date.now() + (remSec * 1000);
            const updated = {
                ...activeSession,
                status: 'RUNNING',
                targetEndTime,
                pausedRemaining: null
            };
            broadcastSession(updated);
            setActiveSession(updated);
        }
    };

    const handleAdd30Seconds = () => {
        if (!activeSession || activeSession.status !== 'RUNNING') return;
        const newTargetEndTime = (activeSession.targetEndTime || Date.now()) + 30000;
        const updated = {
            ...activeSession,
            targetEndTime: newTargetEndTime
        };
        broadcastSession(updated);
        setActiveSession(updated);
    };

    const handleFinishSession = (autoEnded = false) => {
        if (!autoEnded && !window.confirm("¿Deseas finalizar la ronda actual y consolidar los puntos del curso?")) {
            return;
        }

        const completedPayload = {
            ...activeSession,
            status: 'FINISHED',
            finishedAt: new Date().toISOString()
        };

        broadcastSession(completedPayload);
        setActiveSession(null);
        alert("🎉 ¡Dinámica completada con éxito! Se han abonado los Puntos de Sinergia (PS) a todos los escuadrones.");
    };

    const handleBossAttack = (damage = 1000) => {
        setBossCurrentHp(prev => {
            const nextHp = Math.max(0, prev - damage);
            const updated = {
                ...activeSession,
                ai_context: {
                    ...activeSession.ai_context,
                    bossCurrentHp: nextHp
                }
            };
            broadcastSession(updated);
            return nextHp;
        });
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // =========================================================================
    // RENDER 1: LIVE PROJECTOR DASHBOARD (TEACHER ACTIVE VIEW)
    // =========================================================================
    if (activeSession && (activeSession.status === 'RUNNING' || activeSession.status === 'PAUSED')) {
        const gameData = activeSession.ai_context || activeSession.gameData || {};
        const isPaused = activeSession.status === 'PAUSED';

        return (
            <div className="w-full bg-slate-950 text-white font-mono rounded-3xl border-2 border-emerald-500/60 p-5 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.3)] space-y-6 animate-in fade-in duration-300">
                
                {/* PROJECTOR HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-emerald-900/60">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                            {selectedGame?.icon || '🎮'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-orbitron font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase">
                                    ● EN VIVO // PROYECTOR DE AULA
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 font-sans">
                                    {activeSession.scale === 'MICRO' ? '🤝 MODO SQUAD (4 INTEGRANTES)' : '⚔️ MODO COLOSO (CURSO COMPLETO)'}
                                </span>
                            </div>
                            <h1 className="text-lg md:text-2xl font-orbitron font-black text-white tracking-wider uppercase mt-0.5">
                                {activeSession.gameTitle}
                            </h1>
                            <p className="text-xs text-emerald-300/90 font-sans">
                                📌 Unidad Curricular: <strong>{activeSession.topic}</strong> • Nivel: <strong>{activeSession.difficulty}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Massive Countdown Clock */}
                    <div className="flex items-center gap-4 bg-slate-900/95 border-2 border-emerald-500/80 px-6 py-3 rounded-2xl shadow-xl">
                        <Clock className={`w-7 h-7 ${remainingSeconds < 60 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
                        <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">TIEMPO RESTANTE</span>
                            <span className={`text-3xl md:text-4xl font-black font-orbitron tracking-widest ${remainingSeconds < 60 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                                {formatTime(remainingSeconds)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* TEACHER MASTER CONTROLS */}
                <div className="p-4 bg-slate-900/90 border border-emerald-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-bold font-orbitron">// CONTROLES MASTER GM:</span>
                        <span className="text-[10px] text-slate-400 font-sans">Gestión de dinamización en vivo</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={handleTogglePause}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer flex items-center gap-1.5 ${
                                isPaused 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                    : 'bg-amber-600/90 hover:bg-amber-500 text-white'
                            }`}
                        >
                            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                            <span>{isPaused ? 'REANUDAR' : 'PAUSAR JUEGO'}</span>
                        </button>

                        <button
                            onClick={handleAdd30Seconds}
                            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 font-orbitron"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+30 SEG</span>
                        </button>

                        <button
                            onClick={() => handleFinishSession(false)}
                            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition cursor-pointer shadow-md font-orbitron"
                        >
                            🛑 FINALIZAR RONDA
                        </button>
                    </div>
                </div>

                {/* GAME SPECIFIC TELEMETRY DISPLAY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT COLUMN: ACTIVE GAME CONTENT */}
                    <div className="lg:col-span-7 space-y-4">
                        
                        {/* 🔤 PALABRA PROHIBIDA VIEW */}
                        {activeSession.game_id === 'PALABRA_PROHIBIDA' && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/70 shadow-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 uppercase">
                                        DESAFÍO TABÚ // ORADOR: {activeSession.speakerName}
                                    </span>
                                    <span className="text-xs text-amber-300 font-bold font-orbitron">+100 PS / ACIERTO</span>
                                </div>

                                <div className="text-center py-4 bg-slate-950/80 rounded-2xl border border-cyan-500/40">
                                    <span className="text-[11px] text-cyan-400 font-bold uppercase block mb-1">PALABRA SECRETA (PROYECTOR GM)</span>
                                    <strong className="text-3xl md:text-4xl font-orbitron font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                                        {gameData.secretWord || 'PARÁBOLA'}
                                    </strong>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs text-rose-400 font-bold uppercase flex items-center gap-1.5">
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        <span>4 PALABRAS PROHIBIDAS (TABÚ):</span>
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(gameData.tabooWords || ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE']).map((word, i) => (
                                            <div key={i} className="p-3 bg-rose-950/60 border border-rose-500/50 rounded-xl text-center font-bold text-rose-200 text-sm tracking-wide">
                                                🚫 {word}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-950/90 rounded-xl border border-cyan-800 text-xs text-cyan-300 font-sans">
                                    💡 <strong>Pista para el equipo:</strong> {gameData.hint || 'Concepto fundamental de la unidad.'}
                                </div>
                            </div>
                        )}

                        {/* 🧩 INFORMACIÓN ASIMÉTRICA VIEW */}
                        {activeSession.game_id === 'INFO_ASIMETRICA' && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-indigo-500/70 shadow-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 uppercase">
                                        PUZZLE COOPERATIVO ASIMÉTRICO
                                    </span>
                                    <span className="text-xs text-amber-300 font-bold font-orbitron">4 PISTAS DISTRIBUIDAS</span>
                                </div>

                                <div className="p-4 bg-slate-950/90 rounded-2xl border border-indigo-500/40 space-y-1">
                                    <span className="text-[10px] text-indigo-400 font-bold uppercase">OBJETIVO CENTRAL DE LA SALA</span>
                                    <h3 className="text-sm font-bold text-white font-sans">
                                        {gameData.mainObjective || 'Calcular la altura máxima y punto de inflexión'}
                                    </h3>
                                    <span className="text-xs text-emerald-400 font-mono block pt-1">
                                        ✓ Solución Esperada: <strong>{gameData.expectedSolution || '20'}</strong>
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs text-indigo-300 font-bold uppercase block">// DISTRIBUCIÓN DE ROLES:</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {(gameData.roleClues || [
                                            { role: 'Líder Lógico', clue: gameData.clueRole1 || 'v0 = 20 m/s' },
                                            { role: 'Mentor de Pares', clue: gameData.clueRole2 || 'h(t) = v0·t - 0.5·g·t²' },
                                            { role: 'Colaborador Creativo', clue: gameData.clueRole3 || 'g = 10 m/s²' },
                                            { role: 'Coordinador Algorítmico', clue: gameData.clueRole4 || 't = 2 seg' }
                                        ]).map((clueObj, idx) => (
                                            <div key={idx} className="p-3 bg-slate-950 border border-indigo-800/80 rounded-xl space-y-1">
                                                <span className="text-[10px] font-bold text-cyan-300 uppercase block font-orbitron">
                                                    🏷️ {clueObj.role}
                                                </span>
                                                <p className="text-xs text-slate-200 font-sans">{clueObj.clue}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ⚔️ DESAFÍO COLOSO VIEW */}
                        {activeSession.game_id === 'DESAFIO_COLOSO' && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-rose-500/70 shadow-xl space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-700 uppercase">
                                        BOSS RAID // 10 SQUADS VS JEFE FINAL
                                    </span>
                                    <span className="text-xs text-rose-400 font-bold font-orbitron">
                                        HP: {bossCurrentHp.toLocaleString()} / 10,000
                                    </span>
                                </div>

                                <div className="text-center py-4 bg-slate-950 rounded-2xl border border-rose-500/40 relative overflow-hidden">
                                    <span className="text-5xl mb-2 block">{gameData.bossAvatar || '👹'}</span>
                                    <h2 className="text-xl font-orbitron font-black text-rose-300 tracking-wider">
                                        {gameData.bossName || 'KRÓNOS // El Titán de la Entropía'}
                                    </h2>
                                    <p className="text-xs text-slate-400 font-sans max-w-md mx-auto mt-1">
                                        {gameData.bossLore || 'El Coloso amenaza la sala. ¡Los 10 squads deben atacarlo en simultáneo!'}
                                    </p>

                                    {/* Boss Health Bar */}
                                    <div className="w-11/12 mx-auto bg-slate-900 rounded-full h-4 border border-rose-900 overflow-hidden mt-4 shadow-inner">
                                        <div 
                                            className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]" 
                                            style={{ width: `${(bossCurrentHp / 10000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-950 border border-rose-800 rounded-xl text-xs text-rose-200 font-sans flex justify-between items-center">
                                    <span>🎯 Pregunta para los Squads: <strong>{gameData.squadProblem || '¿Cuánto es (4 × 5) + 12?'}</strong></span>
                                    <span className="text-emerald-400 font-bold font-mono">Resp: {gameData.expectedAnswer || '32'}</span>
                                </div>
                            </div>
                        )}

                        {/* 🗳️ CONSENSO / RED / TERMÓMETRO */}
                        {(activeSession.game_id === 'CONSENSO_OBLIGATORIO' || activeSession.game_id === 'TERMOMETRO_CIUDADANO' || activeSession.game_id === 'RED_EMBAJADORES') && (
                            <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/70 shadow-xl space-y-4">
                                <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 uppercase">
                                    DIÁLOGO & DEBATE PLENARIO
                                </span>
                                <h3 className="text-base font-bold text-white font-sans">
                                    {gameData.dilemmaTitle || gameData.debateThesis || gameData.missionTitle || 'Debate en Vivo'}
                                </h3>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                                    {gameData.scenario || gameData.reflectionPrompt || gameData.instructionsText || 'Analicen en escuadrones antes de registrar el consenso.'}
                                </p>
                            </div>
                        )}

                        {/* LIVE STUDENT RESPONSES FEED */}
                        {liveSubmissions.length > 0 && (
                            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
                                <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase block">
                                    // ACTIVIDAD RECIENTE DE ESCUADRONES EN TIEMPO REAL:
                                </span>
                                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                    {liveSubmissions.map((sub, i) => (
                                        <div key={i} className="text-xs text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                                            <span><strong>{sub.squadName || 'Squad Alfa'}</strong> ({sub.studentName}): "{sub.guess || sub.answer || sub.vote || sub.strategy}"</span>
                                            {sub.isCorrect && <span className="text-emerald-400 font-bold text-[10px]">✓ Acierto (+100 PS)</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: 10 SQUADS LIVE LEADERBOARD */}
                    <div className="lg:col-span-5 p-5 bg-slate-900/90 rounded-2xl border border-emerald-500/40 shadow-xl space-y-4">
                        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-2.5">
                            <span className="text-xs font-orbitron font-bold text-emerald-300 uppercase">
                                // TABLA DE 10 SQUADS EN SALA (40 ALUMNOS)
                            </span>
                            <span className="text-[10px] text-cyan-300 font-bold">100% CONECTADOS</span>
                        </div>

                        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                            {squadsList.map((sq, idx) => (
                                <div key={sq.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center font-orbitron shrink-0">
                                            {idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <span className="text-xs font-bold text-white block truncate">{sq.name}</span>
                                            <span className="text-[9px] text-slate-400 font-sans">4 Alumnos Activos</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="w-20 bg-slate-900 rounded-full h-2 border border-slate-800 overflow-hidden">
                                            <div className={`h-full bg-gradient-to-r ${sq.color}`} style={{ width: `${sq.progress}%` }}></div>
                                        </div>
                                        <span className="text-xs font-orbitron font-black text-amber-300">{sq.score} PS</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        );
    }

    // =========================================================================
    // RENDER 2: TEACHER LAUNCHPAD & INTERACTIVE CUSTOMIZER SETUP VIEW
    // =========================================================================
    return (
        <div className="w-full bg-slate-950 text-white font-mono rounded-3xl border-2 border-emerald-500/60 p-5 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.25)] space-y-6">
            
            {/* LAUNCHPAD HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-emerald-900/60">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-2xl text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                        🚀
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-orbitron font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 uppercase">
                                AULOCK ARENA // GAME MASTER LAUNCHPAD
                            </span>
                            <span className="text-[10px] text-slate-400 font-sans">
                                (Capacidad: 40 Alumnos / 10 Escuadrones)
                            </span>
                        </div>
                        <h1 className="text-lg md:text-2xl font-orbitron font-black text-white tracking-wider uppercase mt-0.5">
                            Ágora de Convivencia & Dinámicas en Sala
                        </h1>
                        <p className="text-xs text-slate-400 font-sans">
                            Selecciona una dinámica, personaliza sus palabras y preguntas, o genera contenido pedagógico con IA.
                        </p>
                    </div>
                </div>

                {/* SCALE SELECTOR TABS (MICRO VS MACRO) */}
                <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-emerald-500/40">
                    <button
                        onClick={() => {
                            setActiveScaleTab('MICRO');
                            handleSelectGame(GAME_MODES.MICRO[0]);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer ${
                            activeScaleTab === 'MICRO' 
                                ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        🤝 MODO SQUAD (Micro - 4 Integrantes)
                    </button>
                    <button
                        onClick={() => {
                            setActiveScaleTab('MACRO');
                            handleSelectGame(GAME_MODES.MACRO[0]);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer ${
                            activeScaleTab === 'MACRO' 
                                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        ⚔️ MODO COLOSO (Macro - Curso Completo)
                    </button>
                </div>
            </div>

            {/* MAIN TWO-COLUMN LAYOUT: GAMES GRID (LEFT 55%) & CONFIGURATION / CUSTOMIZER (RIGHT 45%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 🎮 LEFT COLUMN (55%): GAME SELECTION CATALOG */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-orbitron font-bold text-emerald-300 uppercase">
                            // CATÁLOGO DE DINÁMICAS ({activeScaleTab === 'MICRO' ? 'ENFOQUE MICRO-EQUIPO' : 'ENFOQUE MACRO-COLECTIVO'})
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">Haz clic para seleccionar</span>
                    </div>

                    <div className="space-y-3">
                        {(activeScaleTab === 'MICRO' ? GAME_MODES.MICRO : GAME_MODES.MACRO).map((gameItem) => {
                            const isSelected = selectedGame.id === gameItem.id;

                            return (
                                <div
                                    key={gameItem.id}
                                    onClick={() => handleSelectGame(gameItem)}
                                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                                        isSelected
                                            ? 'bg-slate-900 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-[1.01]'
                                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                        {gameItem.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-orbitron font-bold text-sm text-white">{gameItem.title}</h3>
                                            <span className="text-[9px] font-bold bg-slate-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full uppercase">
                                                {gameItem.cooperativeType}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-cyan-300 font-medium block mt-0.5">{gameItem.tagline}</span>
                                        <p className="text-xs text-slate-400 font-sans mt-1 leading-relaxed">
                                            {gameItem.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 🚀 RIGHT COLUMN (45%): INTERACTIVE CONFIGURATION & CONTENT CUSTOMIZER */}
                <div className="lg:col-span-6 bg-slate-900/90 rounded-3xl border-2 border-emerald-500/50 p-6 shadow-2xl space-y-5 flex flex-col justify-between">
                    
                    <div className="space-y-4">
                        
                        {/* Subtabs: 1. Setup | 2. Personalizar Palabras/Preguntas | 3. Reglas & Guía */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                            <button
                                type="button"
                                onClick={() => setActiveConfigTab('SETUP')}
                                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    activeConfigTab === 'SETUP'
                                        ? 'bg-emerald-600 text-slate-950 shadow-md font-black'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Sliders className="w-3.5 h-3.5" />
                                <span>1. Parámetros</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveConfigTab('CUSTOMIZER')}
                                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    activeConfigTab === 'CUSTOMIZER'
                                        ? 'bg-cyan-600 text-white shadow-md font-black'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>2. Editar Palabras/Preguntas</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveConfigTab('RULES')}
                                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold font-orbitron transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    activeConfigTab === 'RULES'
                                        ? 'bg-purple-600 text-white shadow-md font-black'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>3. Guía Sala</span>
                            </button>
                        </div>

                        {/* TAB 1: BASIC SETUP & AI GENERATION */}
                        {activeConfigTab === 'SETUP' && (
                            <div className="space-y-4 animate-in fade-in">
                                
                                {/* Selected Game Pill */}
                                <div className="p-3.5 bg-slate-950 rounded-2xl border-2 border-emerald-500/60 flex items-center gap-3.5 shadow-inner">
                                    <span className="text-3xl">{selectedGame.icon}</span>
                                    <div className="min-w-0 flex-1">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">JUEGO SELECCIONADO</span>
                                        <strong className="text-sm font-orbitron font-bold text-emerald-300 block truncate">{selectedGame.title}</strong>
                                        <span className="text-[10px] text-slate-400 font-sans truncate block">{selectedGame.tagline}</span>
                                    </div>
                                </div>

                                {/* Topic Selector */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-300 uppercase font-orbitron flex items-center justify-between">
                                        <span>📚 UNIDAD CURRICULAR:</span>
                                        <span className="text-emerald-400">Gemini 2.5 Flash</span>
                                    </label>
                                    <select
                                        value={selectedTopicId}
                                        onChange={(e) => setSelectedTopicId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white outline-none focus:border-emerald-400 font-sans"
                                    >
                                        {CURRICULUM_UNITS.map(u => (
                                            <option key={u.id} value={u.id}>{u.label}</option>
                                        ))}
                                    </select>

                                    {selectedTopicId === 'custom' && (
                                        <input
                                            type="text"
                                            value={customTopicText}
                                            onChange={(e) => setCustomTopicText(e.target.value)}
                                            placeholder="Escribe el tema específico para la IA..."
                                            className="w-full bg-slate-950 border border-emerald-500/50 rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-400 font-sans mt-2"
                                        />
                                    )}
                                </div>

                                {/* AI Auto-Populate Button */}
                                <button
                                    type="button"
                                    disabled={isGeneratingWithAI}
                                    onClick={handleGenerateWithAI}
                                    className="w-full py-2.5 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 border border-purple-400 text-purple-200 text-xs font-orbitron font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4 text-purple-300 animate-spin" />
                                    <span>{isGeneratingWithAI ? 'GENERANDO CON GEMINI 2.5...' : '✨ GENERAR / AUTO-RELLENAR CON IA'}</span>
                                </button>

                                {/* Duration & Difficulty */}
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase font-orbitron">⏱️ DURACIÓN:</label>
                                        <select
                                            value={durationSeconds}
                                            onChange={(e) => setDurationSeconds(Number(e.target.value))}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-300 font-bold outline-none focus:border-emerald-400 font-mono"
                                        >
                                            <option value={60}>1 minuto</option>
                                            <option value={180}>3 minutos</option>
                                            <option value={300}>5 minutos</option>
                                            <option value={420}>7 minutos</option>
                                            <option value={600}>10 minutos</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase font-orbitron">DIFICULTAD:</label>
                                        <select
                                            value={difficulty}
                                            onChange={(e) => setDifficulty(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-emerald-400 font-mono"
                                        >
                                            <option value="Fácil">Fácil (Formativo)</option>
                                            <option value="Normal">Normal (Equilibrado)</option>
                                            <option value="Desafío Alto">Desafío Alto (PAES)</option>
                                            <option value="Titán">Nivel Titán (Experto)</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        )}

                        {/* TAB 2: INTERACTIVE CONTENT CUSTOMIZER (TEACHER EDITS WORDS & QUESTIONS) */}
                        {activeConfigTab === 'CUSTOMIZER' && (
                            <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1 animate-in fade-in custom-scrollbar">
                                
                                <div className="flex justify-between items-center pb-2 border-b border-cyan-900/60">
                                    <span className="text-[10px] font-orbitron font-bold text-cyan-300 uppercase">
                                        ✏️ EDITOR DE PALABRAS & PREGUNTAS (PERSONALIZACIÓN)
                                    </span>
                                    <span className="text-[9px] text-slate-400">Modifica cualquier campo</span>
                                </div>

                                {/* 🔤 PALABRA PROHIBIDA CUSTOMIZER */}
                                {selectedGame.id === 'PALABRA_PROHIBIDA' && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-300 uppercase">1. PALABRA SECRETA PRINCIPAL (A ADIVINAR):</label>
                                            <input
                                                type="text"
                                                value={customGameContent.secretWord || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, secretWord: e.target.value.toUpperCase() })}
                                                placeholder="Ej: PARÁBOLA"
                                                className="w-full bg-slate-950 border border-cyan-500/60 rounded-xl p-2.5 text-xs text-cyan-300 font-bold font-orbitron"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-rose-400 uppercase">2. LAS 4 PALABRAS PROHIBIDAS (TABÚ):</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {(customGameContent.tabooWords || ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE']).map((word, idx) => (
                                                    <input
                                                        key={idx}
                                                        type="text"
                                                        value={word}
                                                        onChange={(e) => {
                                                            const newWords = [...(customGameContent.tabooWords || ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE'])];
                                                            newWords[idx] = e.target.value.toUpperCase();
                                                            setCustomGameContent({ ...customGameContent, tabooWords: newWords });
                                                        }}
                                                        className="bg-slate-950 border border-rose-500/50 rounded-xl p-2 text-xs text-rose-300 font-bold"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">3. PISTA GUÍA PARA EL ORADOR:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.hint || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, hint: e.target.value })}
                                                placeholder="Pista de apoyo..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-300"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 🧩 INFORMACIÓN ASIMÉTRICA CUSTOMIZER */}
                                {selectedGame.id === 'INFO_ASIMETRICA' && (
                                    <div className="space-y-2.5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-300 uppercase">OBJETIVO CENTRAL DEL PROBLEMA:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.mainObjective || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, mainObjective: e.target.value })}
                                                placeholder="Ej: Calcular la altura máxima..."
                                                className="w-full bg-slate-950 border border-indigo-500/60 rounded-xl p-2 text-xs text-white"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-cyan-400 uppercase">PISTAS DISTRIBUIDAS POR ROL:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.clueRole1 || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, clueRole1: e.target.value })}
                                                placeholder="Pista 1: Líder Lógico (v0 = 20 m/s)..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                            <input
                                                type="text"
                                                value={customGameContent.clueRole2 || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, clueRole2: e.target.value })}
                                                placeholder="Pista 2: Mentor de Pares (h(t) = v0·t - 0.5·g·t²)..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                            <input
                                                type="text"
                                                value={customGameContent.clueRole3 || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, clueRole3: e.target.value })}
                                                placeholder="Pista 3: Colaborador Creativo (g = 10 m/s²)..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                            <input
                                                type="text"
                                                value={customGameContent.clueRole4 || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, clueRole4: e.target.value })}
                                                placeholder="Pista 4: Coordinador Algorítmico (t = 2 s)..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-emerald-400 uppercase">SOLUCIÓN NUMÉRICA / TEXTUAL ESPERADA:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.expectedSolution || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, expectedSolution: e.target.value })}
                                                placeholder="Ej: 20"
                                                className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl p-2 text-xs text-emerald-300 font-bold"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 🗳️ CONSENSO OBLIGATORIO CUSTOMIZER */}
                                {selectedGame.id === 'CONSENSO_OBLIGATORIO' && (
                                    <div className="space-y-2.5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-300 uppercase">TÍTULO DEL DILEMA:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.dilemmaTitle || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, dilemmaTitle: e.target.value })}
                                                className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl p-2 text-xs text-white"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-300 uppercase">ESCENARIO / CASO PROBLEMA:</label>
                                            <textarea
                                                rows={2}
                                                value={customGameContent.scenario || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, scenario: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-amber-400 uppercase">3 OPCIONES DE VOTACIÓN:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.optionA || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, optionA: e.target.value })}
                                                placeholder="Opción A..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                            <input
                                                type="text"
                                                value={customGameContent.optionB || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, optionB: e.target.value })}
                                                placeholder="Opción B..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                            <input
                                                type="text"
                                                value={customGameContent.optionC || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, optionC: e.target.value })}
                                                placeholder="Opción C..."
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ⚔️ DESAFÍO COLOSO CUSTOMIZER */}
                                {selectedGame.id === 'DESAFIO_COLOSO' && (
                                    <div className="space-y-2.5">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-300 uppercase">NOMBRE DEL JEFE:</label>
                                                <input
                                                    type="text"
                                                    value={customGameContent.bossName || ''}
                                                    onChange={(e) => setCustomGameContent({ ...customGameContent, bossName: e.target.value })}
                                                    className="w-full bg-slate-950 border border-rose-500/60 rounded-xl p-2 text-xs text-rose-300 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-300 uppercase">HP TOTAL:</label>
                                                <input
                                                    type="number"
                                                    value={customGameContent.bossTotalHp || 10000}
                                                    onChange={(e) => setCustomGameContent({ ...customGameContent, bossTotalHp: Number(e.target.value) })}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-amber-300 font-mono font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-300 uppercase">PREGUNTA / ECUACIÓN PARA SQUADS:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.squadProblem || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, squadProblem: e.target.value })}
                                                placeholder="Ej: ¿Cuánto es (4 × 5) + 12?"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-emerald-400 uppercase">RESPUESTA CORRECTA:</label>
                                            <input
                                                type="text"
                                                value={customGameContent.expectedAnswer || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, expectedAnswer: e.target.value })}
                                                placeholder="Ej: 32"
                                                className="w-full bg-slate-950 border border-emerald-500/60 rounded-xl p-2 text-xs text-emerald-300 font-bold font-mono"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 🌐 / 🌡️ RED & TERMÓMETRO */}
                                {(selectedGame.id === 'RED_EMBAJADORES' || selectedGame.id === 'TERMOMETRO_CIUDADANO') && (
                                    <div className="space-y-2.5">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-300 uppercase">TESIS / TÍTULO DE LA DINÁMICA:</label>
                                            <textarea
                                                rows={2}
                                                value={customGameContent.debateThesis || customGameContent.missionTitle || ''}
                                                onChange={(e) => setCustomGameContent({ ...customGameContent, debateThesis: e.target.value, missionTitle: e.target.value })}
                                                className="w-full bg-slate-950 border border-purple-500/60 rounded-xl p-2 text-xs text-white"
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                        {/* TAB 3: COMPLETE PEDAGOGICAL RULES & STEP-BY-STEP GUIDE */}
                        {activeConfigTab === 'RULES' && (
                            <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1 animate-in fade-in custom-scrollbar">
                                <div className="p-3.5 bg-slate-950 rounded-2xl border border-purple-500/50 space-y-1.5">
                                    <span className="text-[10px] font-orbitron font-bold text-purple-300 uppercase flex items-center gap-1.5">
                                        <Target className="w-3.5 h-3.5 text-purple-400" />
                                        <span>OBJETIVO DE CONVIVENCIA & FORMATIVO:</span>
                                    </span>
                                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                                        {selectedGame.instructions.goal}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-orbitron font-bold text-cyan-300 uppercase block">
                                        ⏱️ PASO A PASO EN SALA (0 A {Math.ceil(durationSeconds / 60)} MINUTOS):
                                    </span>
                                    <div className="space-y-1.5">
                                        {selectedGame.instructions.steps.map((step, i) => (
                                            <div key={i} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans flex items-start gap-2">
                                                <span className="text-emerald-400 font-bold shrink-0">{i + 1}.</span>
                                                <span>{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-orbitron font-bold text-rose-400 uppercase block">
                                        ⚠️ REGLAS & PROHIBICIONES ESTRICTAS:
                                    </span>
                                    <div className="space-y-1.5">
                                        {selectedGame.instructions.rules.map((rule, i) => (
                                            <div key={i} className="p-2 bg-rose-950/40 rounded-xl border border-rose-900/60 text-xs text-rose-200 font-sans flex items-start gap-2">
                                                <span className="text-rose-400 shrink-0">●</span>
                                                <span>{rule}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* 🚀 THE MASSIVE GLOWING ACTION BUTTON */}
                    <div className="pt-4 border-t border-emerald-900/60">
                        <button
                            type="button"
                            disabled={isGeneratingWithAI}
                            onClick={handleLaunchGame}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-orbitron font-black text-sm md:text-base rounded-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-all transform hover:scale-[1.02] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 animate-pulse"
                        >
                            <span>🚀 LANZAR DINÁMICA AL CURSO</span>
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default CoexistenceTeacher;
