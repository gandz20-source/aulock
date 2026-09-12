/**
 * SquadChallengeService.js
 * Matchmaking & AI Challenge Generation Engine (Squad Forge)
 * High-Stakes Public Education Pilot (SLEP Andalién Sur / MINEDUC Chile)
 */

import { supabase } from '../config/supabase';
import { COURSE_STUDENT_ROSTER_DATASET } from './SquadService';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * 1. MODE 1: Sinergia Suprema (AI Strengths Match)
 * Automatically groups 4 students who are top experts in 4 DIFFERENT subjects.
 */
export function matchSquadBySynergy(roster = COURSE_STUDENT_ROSTER_DATASET) {
    // 1. Math / Logic Expert
    const mathExpert = [...roster].sort((a, b) => (b.subjects?.math || b.gpa) - (a.subjects?.math || a.gpa))[0];

    // 2. Science / Biology / Chemistry Expert (excluding previous)
    const scienceExpert = [...roster]
        .filter(s => s.id !== mathExpert.id)
        .sort((a, b) => Math.max(b.subjects?.biology || 0, b.subjects?.chemistry || 0) - Math.max(a.subjects?.biology || 0, a.subjects?.chemistry || 0))[0];

    // 3. Language / Debate Expert (excluding previous)
    const languageExpert = [...roster]
        .filter(s => s.id !== mathExpert.id && s.id !== scienceExpert.id)
        .sort((a, b) => (b.subjects?.language || 0) - (a.subjects?.language || 0))[0];

    // 4. History / Humanities / Tech Expert (excluding previous)
    const historyOrTechExpert = [...roster]
        .filter(s => s.id !== mathExpert.id && s.id !== scienceExpert.id && s.id !== languageExpert.id)
        .sort((a, b) => Math.max(b.subjects?.history || 0, b.subjects?.coding || 0, b.subjects?.english || 0) - Math.max(a.subjects?.history || 0, a.subjects?.coding || 0, a.subjects?.english || 0))[0];

    const members = [
        {
            ...mathExpert,
            squad_role: 'Líder en Modelación Matemática',
            expert_domain: 'Matemática & Cálculo Diferencial',
            domain_score: mathExpert.subjects?.math || 7.0
        },
        {
            ...scienceExpert,
            squad_role: 'Mentor en Ciencias Experimentales',
            expert_domain: 'Biología Celular & Química',
            domain_score: scienceExpert.subjects?.biology || 6.8
        },
        {
            ...languageExpert,
            squad_role: 'Capitana de Argumentación & Síntesis',
            expert_domain: 'Lenguaje & Debate Crítico',
            domain_score: languageExpert.subjects?.language || 6.9
        },
        {
            ...historyOrTechExpert,
            squad_role: 'Estratega de Ciudadanía & Contexto',
            expert_domain: 'Historia & Análisis Cívico',
            domain_score: historyOrTechExpert.subjects?.history || 6.9
        }
    ];

    const avgGpa = (members.reduce((acc, m) => acc + (Number(m.gpa) || 6.0), 0) / members.length).toFixed(1);

    return {
        mode: 'SINERGIA_SUPREMA',
        squadName: 'Squad Alfa // Sinergia Suprema STEM',
        members,
        avgGpa,
        synergyIndex: '98% Óptimo',
        pedagogical_rationale: 'Complementariedad total: Cada integrante lidera una disciplina nuclear (Matemática, Ciencias, Lenguaje, Historia), garantizando que el escuadrón aborde problemas complejos de 360 grados.'
    };
}

/**
 * 2. MODE 2: Tutoría de Debilidades (AI Peer-Mentoring Match)
 * Finds 1 student with a growth area in a specific subject and pairs with 3 top mentors.
 */
export function matchSquadByPeerTutoring(targetSubject = 'math', roster = COURSE_STUDENT_ROSTER_DATASET) {
    const subjectKey = targetSubject.toLowerCase();
    
    // Sort roster by specific subject score
    const sorted = [...roster].sort((a, b) => {
        const scoreA = a.subjects?.[subjectKey] || 5.0;
        const scoreB = b.subjects?.[subjectKey] || 5.0;
        return scoreA - scoreB;
    });

    // Lowest student in this subject = Apprentice
    const apprentice = sorted[0];

    // Highest 3 students in this subject = Mentors
    const mentors = [...roster]
        .filter(s => s.id !== apprentice.id)
        .sort((a, b) => (b.subjects?.[subjectKey] || b.gpa) - (a.subjects?.[subjectKey] || a.gpa))
        .slice(0, 3);

    const subjectLabels = {
        math: 'Matemática & Cálculo',
        biology: 'Biología Celular',
        chemistry: 'Química Aplicada',
        language: 'Lenguaje y Argumentación',
        history: 'Historia y Ciudadanía'
    };
    const humanSubject = subjectLabels[subjectKey] || targetSubject;

    const members = [
        {
            ...apprentice,
            squad_role: 'Investigador Principal (Aprendiz)',
            is_apprentice: true,
            target_growth: humanSubject,
            score_in_subject: apprentice.subjects?.[subjectKey] || 4.5
        },
        ...mentors.map((m, idx) => ({
            ...m,
            squad_role: `Mentor de Apoyo Nivel ${idx + 1}`,
            is_mentor: true,
            score_in_subject: m.subjects?.[subjectKey] || 6.8
        }))
    ];

    return {
        mode: 'TUTORIA_DEBILIDADES',
        targetSubject: humanSubject,
        squadName: `Squad Tutoría // Refuerzo de ${humanSubject}`,
        members,
        apprenticeName: apprentice.name,
        mentorsNames: mentors.map(m => m.name),
        synergyIndex: '94% Nivelación',
        pedagogical_rationale: `Andamiaje Pedagógico Vygotskiano: ${apprentice.name} trabaja en su zona de desarrollo próximo guiado por 3 mentores de excelencia (${mentors.map(m => m.name.split(' ')[0]).join(', ')}).`
    };
}

/**
 * 3. MODE 3: Ensamblaje Manual (Manual Mode)
 */
export function createManualSquad({ squadName, selectedStudentIds, roster = COURSE_STUDENT_ROSTER_DATASET }) {
    const selected = roster.filter(s => selectedStudentIds.includes(s.id));

    const defaultRoles = [
        'Coordinador General',
        'Líder Técnico / Lógico',
        'Verificador de Evidencia',
        'Relator de Entrega'
    ];

    const members = selected.map((s, i) => ({
        ...s,
        squad_role: defaultRoles[i] || 'Colaborador Activo'
    }));

    const avgGpa = members.length > 0 
        ? (members.reduce((acc, m) => acc + (Number(m.gpa) || 6.0), 0) / members.length).toFixed(1)
        : '6.0';

    return {
        mode: 'ENSAMBLAJE_MANUAL',
        squadName: squadName || 'Squad Personalizado',
        members,
        avgGpa,
        synergyIndex: '90% Personalizado',
        pedagogical_rationale: 'Composición manual estratégica definida por el docente titular según observación directa de aula.'
    };
}

/**
 * 4. AI CHALLENGE GENERATION USING GOOGLE GENAI SDK (GEMINI)
 */
export async function generateAiChallengeForSquad({ mode, squad, subject = 'Matemática y Ciencias', topic = 'Optimización Ambiental y Modelación Cuadrática' }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const members = squad.members || [];

    // Fallback if no API key
    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackChallenge(mode, squad, subject, topic);
    }

    let prompt = '';

    if (mode === 'SINERGIA_SUPREMA') {
        prompt = `
Actúa como Diseñador de Gamificación Educativa y Evaluador de Aprendizaje Basado en Proyectos para AuLock.
Un escuadrón de 4 estudiantes de 4° Medio debe resolver un "Desafío Multidisciplinario (Boss Problem)".
Los 4 integrantes tienen especialidades distintas:
1. ${members[0]?.name || 'Estudiante 1'} (${members[0]?.squad_role || 'Matemáticas'})
2. ${members[1]?.name || 'Estudiante 2'} (${members[1]?.squad_role || 'Ciencias'})
3. ${members[2]?.name || 'Estudiante 3'} (${members[2]?.squad_role || 'Lenguaje'})
4. ${members[3]?.name || 'Estudiante 4'} (${members[3]?.squad_role || 'Historia'})

Tema del desafío: "${topic}" (${subject}).

Genera un problema desafiante, inmersivo y estructurado donde cada integrante deba aplicar su área para que el equipo llegue a una solución unificada.
Devuelve estrictamente en formato JSON válido con esta estructura:
{
  "title": "Título épico del desafío",
  "challengeText": "Enunciado del problema de 3 a 5 párrafos...",
  "roles": {
    "${members[0]?.name || 'Estudiante 1'}": "Fase 1: Calcular la modelación matemática o ecuación cuadrática...",
    "${members[1]?.name || 'Estudiante 2'}": "Fase 2: Analizar el impacto biológico y químico...",
    "${members[2]?.name || 'Estudiante 3'}": "Fase 3: Redactar la justificación argumentativa y síntesis crítica...",
    "${members[3]?.name || 'Estudiante 4'}": "Fase 4: Evaluar las implicancias cívicas y normativas..."
  },
  "guidelines": "Instrucción de consenso grupal: Los 4 deben validar la solución en el cuadro de respuesta antes de enviar.",
  "rewardPoints": 150
}
`;
    } else if (mode === 'TUTORIA_DEBILIDADES') {
        const apprentice = members.find(m => m.is_apprentice) || members[0];
        const mentors = members.filter(m => m !== apprentice);

        prompt = `
Actúa como Especialista en Andamiaje Pedagógico y Tutoría de Pares para AuLock.
Diseña un desafío formativo de "${squad.targetSubject || subject}" para el escuadrón.
El estudiante que necesita nivelación es: ${apprentice?.name}.
Los 3 mentores de apoyo son: ${mentors.map(m => m.name).join(', ')}.

Tema: "${topic}".
REGLA PEDAGÓGICA CRÍTICA:
Los mentores tienen estrictamente prohibido darle la respuesta final a ${apprentice?.name}. Deben guiarlo paso a paso mediante preguntas socráticas para que él/ella descubra el procedimiento y redacte la respuesta final del equipo.

Devuelve estrictamente en formato JSON válido:
{
  "title": "Misión de Tutoría: Dominio de ${squad.targetSubject || subject}",
  "challengeText": "Problema formativo paso a paso...",
  "roles": {
    "${apprentice?.name}": "Investigador Principal: Formular preguntas y redactar la solución final consensuada.",
    "${mentors[0]?.name || 'Mentor 1'}": "Mentor Socrático 1: Guiar el planteamiento inicial sin dar la respuesta.",
    "${mentors[1]?.name || 'Mentor 2'}": "Mentor Socrático 2: Supervisar los cálculos intermedios.",
    "${mentors[2]?.name || 'Mentor 3'}": "Mentor Socrático 3: Validar la coherencia y verificar el resultado."
  },
  "guidelines": "Regla de Oro: Mentores guían con preguntas socráticas. El aprendiz lidera la redacción final.",
  "rewardPoints": 150
}
`;
    } else {
        // Manual mode
        prompt = `
Diseña una misión cooperativa para el squad "${squad.squadName}" compuesto por: ${members.map(m => m.name).join(', ')}.
Tema: "${topic}" (${subject}).
Devuelve en JSON con title, challengeText, roles (un rol específico para cada integrante) y guidelines.
`;
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
            })
        });

        if (!response.ok) throw new Error(`Gemini HTTP Error ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
            const parsed = JSON.parse(jsonText);
            return {
                ...parsed,
                challengeId: 'ch-' + Date.now(),
                mode,
                squadName: squad.squadName,
                rewardPoints: 150
            };
        }
        return getFallbackChallenge(mode, squad, subject, topic);
    } catch (e) {
        console.warn("Gemini AI challenge generation fallback:", e);
        return getFallbackChallenge(mode, squad, subject, topic);
    }
}

/**
 * 5. Procedural Fallback Challenge Generator
 */
function getFallbackChallenge(mode, squad, subject, topic) {
    const members = squad.members || [];
    const now = Date.now();

    if (mode === 'SINERGIA_SUPREMA') {
        return {
            challengeId: 'ch-' + now,
            mode: 'SINERGIA_SUPREMA',
            squadName: squad.squadName,
            title: `Desafío Multidisciplinario: Optimización Hídrica & Biosfera (${topic})`,
            challengeText: `La cuenca hídrica del Río Maipo presenta una tasa de recarga descrita por la función R(t) = -2t² + 24t + 50 (donde t representa horas de operación). El escuadrón debe modelar el punto crítico de máximo rendimiento, determinar el impacto en las comunidades microbianas del ecosistema, argumentar la viabilidad ética del racionamiento y justificar la política comunitaria de distribución de recursos.`,
            roles: {
                [members[0]?.name || 'Juan Carlos Pérez']: 'Fase 1 (Matemática): Calcular derivada dR/dt = 0 y determinar la hora óptima t de máxima recarga.',
                [members[1]?.name || 'Mateo Rojas']: 'Fase 2 (Ciencias): Explicar cómo la tasa máxima afecta la saturación de oxígeno en el ecosistema acuático.',
                [members[2]?.name || 'Camila Silva']: 'Fase 3 (Lenguaje): Redactar una síntesis argumentativa formal de 4 líneas con la recomendación del Squad.',
                [members[3]?.name || 'Sofía Martínez']: 'Fase 4 (Historia/Cívica): Evaluar el marco de derechos de agua y justicia distributiva local.'
            },
            guidelines: 'Protocolo de Sinergia: Cada miembro redacta su fase y el equipo ensambla una respuesta única consensuada.',
            rewardPoints: 150
        };
    }

    if (mode === 'TUTORIA_DEBILIDADES') {
        const apprentice = members.find(m => m.is_apprentice) || members[0];
        const mentors = members.filter(m => m !== apprentice);

        return {
            challengeId: 'ch-' + now,
            mode: 'TUTORIA_DEBILIDADES',
            squadName: squad.squadName,
            title: `Misión de Tutoría: Dominio de ${squad.targetSubject || 'Cálculo'} (${topic})`,
            challengeText: `Se presenta la ecuación cuadrática de consumo energético E(x) = 3x² - 18x + 24 = 0. El escuadrón debe encontrar las raíces exactas y explicar el significado físico de los puntos de cruce.`,
            roles: {
                [apprentice?.name || 'Aprendiz']: 'Investigador Principal: Plantear la factorización o fórmula cuadrática y redactar la respuesta.',
                [mentors[0]?.name || 'Mentor 1']: 'Mentor Socrático 1: Guiar el cálculo del discriminante (b² - 4ac) sin dar el resultado.',
                [mentors[1]?.name || 'Mentor 2']: 'Mentor Socrático 2: Verificar la simplificación algebraica paso a paso.',
                [mentors[2]?.name || 'Mentor 3']: 'Mentor Socrático 3: Validar la interpretación de los dos valores de x obtenidos.'
            },
            guidelines: 'Regla de Oro: Los mentores acompañan con preguntas reflexivas. El aprendiz registra la respuesta consensuada.',
            rewardPoints: 150
        };
    }

    return {
        challengeId: 'ch-' + now,
        mode: 'ENSAMBLAJE_MANUAL',
        squadName: squad.squadName,
        title: `Misión Cooperativa: Resolución Aplicada en Equipo (${topic})`,
        challengeText: `El equipo debe resolver de forma colaborativa el problema de aplicación práctica en ${subject}, validando conjuntamente cada argumento antes del envío final.`,
        roles: members.reduce((acc, m, i) => {
            acc[m.name] = `Rol ${i + 1}: ${m.squad_role || 'Colaborador de Área'}`;
            return acc;
        }, {}),
        guidelines: 'Consenso obligatorio: Todos los integrantes deben validar la entrega grupal.',
        rewardPoints: 150
    };
}

/**
 * 6. Broadcast Challenge to Squad via Supabase Realtime & LocalStorage
 */
export async function broadcastSquadChallenge(challengePayload) {
    const targetEndTime = Date.now() + (15 * 60 * 1000); // 15 minutes default
    const fullPayload = {
        ...challengePayload,
        status: 'ACTIVE',
        targetEndTime,
        launchedAt: new Date().toISOString()
    };

    // Save to local storage for multi-tab resilience
    localStorage.setItem('aulock_active_squad_challenge', JSON.stringify(fullPayload));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aulock_squad_challenge_event', { detail: fullPayload }));

    // Broadcast through Supabase Realtime channel
    try {
        if (supabase) {
            const channel = supabase.channel('coexistence_nexus_arena');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    channel.send({
                        type: 'broadcast',
                        event: 'squad_challenge_launched',
                        payload: fullPayload
                    });
                    console.info("📡 Supabase Realtime: Broadcasted squad challenge:", fullPayload);
                }
            });
        }
    } catch (err) {
        console.warn("Supabase Realtime broadcast error:", err);
    }

    return fullPayload;
}
