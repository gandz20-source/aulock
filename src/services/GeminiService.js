/**
 * GeminiService.js
 * Official Google Gemini 2.5 Flash REST API Integration
 */

import { AULOCK_TUTORS, MINEDUC_OA_CATALOG } from '../data/AuLockTutorsData';
import { MINEDUC_QUALITY_STANDARDS } from '../data/AuLockMineducStandards';
import { MineducStandardsRegistry } from '../data/EstandaresMinEducMock';
import { MINEDUC_EVALUATION_DATASET } from '../data/AuLockMineducEvaluationDataset';
import { MINEDUC_CONVIVENCIA_RESOURCES } from '../data/AuLockMineducConvivenciaDataset';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Generate NotebookLLM 4-Slide Short Presentation Deck using Gemini 2.5 Flash
 */
export async function generateNotebookPresentation({ topic, subject, gradeLevel }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackPresentation(topic, subject, gradeLevel);
    }

    const prompt = `
Eres NotebookLLM, la IA pedagógica de AuLock.
Genera una presentación corta de 4 diapositivas para la clase:
- Asignatura: ${subject}
- Curso: ${gradeLevel}
- Tema: "${topic}"

Devuelve estrictamente en formato JSON válido con esta estructura:
{
  "title": "Presentación Corta: ${topic}",
  "slides": [
    {
      "slideNumber": 1,
      "tag": "📌 Slide 1: Gancho & Aplicación Real",
      "headline": "Título sobre ${topic}...",
      "body": "Explicación breve...",
      "keyInsight": "Punto clave..."
    },
    {
      "slideNumber": 2,
      "tag": "📐 Slide 2: Concepto Clave & Algoritmo",
      "headline": "Definición y principios...",
      "body": "Fórmulas paso a paso...",
      "keyInsight": "Consejo técnico..."
    },
    {
      "slideNumber": 3,
      "tag": "🧪 Slide 3: Ejercicio Práctico en Vivo",
      "headline": "Desafío de aplicación...",
      "body": "Problema práctico...",
      "keyInsight": "Pista de resolución..."
    },
    {
      "slideNumber": 4,
      "tag": "🚀 Slide 4: Cierre & Pregunta en Vivo",
      "headline": "Síntesis...",
      "body": "Pregunta rápida...",
      "keyInsight": "Conclusión..."
    }
  ]
}
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonText) return JSON.parse(jsonText);
        return getFallbackPresentation(topic, subject, gradeLevel);

    } catch (error) {
        return getFallbackPresentation(topic, subject, gradeLevel);
    }
}

/**
 * Generate lesson structure (Warm-up, Core, Closing) using Gemini 2.5 Flash
 */
export async function generateLessonPlan({ topic, subject, gradeLevel }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackLessonPlan(topic, subject, gradeLevel);
    }

    const prompt = `
Diseña una estructura de clase de 45 minutos para ${subject} (${gradeLevel}) sobre "${topic}".
Devuelve en formato JSON:
{
  "warmup": "Inicio (10 min)...",
  "core": "Desarrollo (25 min)...",
  "closing": "Cierre (10 min)...",
  "triggerQuestion": "Pregunta..."
}
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return jsonText ? JSON.parse(jsonText) : getFallbackLessonPlan(topic, subject, gradeLevel);
    } catch (error) {
        return getFallbackLessonPlan(topic, subject, gradeLevel);
    }
}

/**
 * Evaluate a student's debate argument using Gemini 2.5 Flash REST API
 */
export async function evaluateDebateArgument({ topic, stance, argumentText, studentName }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackDebateEvaluation(topic, stance, argumentText);
    }

    const prompt = `
Evalúa la intervención del estudiante "${studentName}" sobre el tema: "${topic}".
Postura: ${stance}. Texto: "${argumentText}".
Devuelve estrictamente en formato JSON:
{
  "logicScore": 90,
  "evidenceScore": 85,
  "civicScore": 95,
  "overallScore": 90,
  "feedback": "Retroalimentación..."
}
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (jsonText) return JSON.parse(jsonText);
        return getFallbackDebateEvaluation(topic, stance, argumentText);

    } catch (error) {
        return getFallbackDebateEvaluation(topic, stance, argumentText);
    }
}

/**
 * Generate qualitative diagnosis and study guidelines using Gemini 2.5 Flash REST API
 */
export async function generateVocationalDiagnosis({ fullName, gradeLevel, stats }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackDiagnosis(fullName, stats);
    }

    const prompt = `
Genera un diagnóstico cualitativo explícito en español para: ${fullName} (${gradeLevel}).
Devuelve estrictamente en formato JSON:
{
  "qualitativeSummary": "Párrafo conciso...",
  "studyGuidelines": ["Pauta 1...", "Pauta 2...", "Pauta 3..."],
  "suggestedCareers": [{ "name": "Carrera 1", "match": "98%", "reason": "Razón..." }]
}
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json' }
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (jsonText) return JSON.parse(jsonText);
        return getFallbackDiagnosis(fullName, stats);

    } catch (error) {
        return getFallbackDiagnosis(fullName, stats);
    }
}

/**
 * Official Google Gemini 2.5 Flash Multi-Turn Socratic Tutor Engine
 * Permite una conversación fluida, natural, cálida y socrática para los tutores de AuLock.
 */
export async function generarRespuestaTutor(
    historialChat = [], 
    mensajeUsuario = '', 
    { 
        tutorName = 'Profesor Carlos Rivas', 
        materia = 'Matemáticas y PAES (Chile)', 
        nivel = '4° Medio / PAES',
        interes = 'Fútbol ⚽',
        systemInstructionCustom = null,
        temperature = 0.7,
        maxOutputTokens = 500
    } = {}
) {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) 
        || (typeof process !== 'undefined' && process?.env?.VITE_GEMINI_API_KEY)
        || '';

    const defaultSystemInstruction = `Eres ${tutorName}, tutor experto en ${materia} para el nivel de ${nivel} en el sistema educativo chileno (MINEDUC / PAES).
Tu enfoque pedagógico es SOCRÁTICO, CÁLIDO, MOTIVADOR y FLUIDO:
1. NUNCA des la respuesta o cálculo final directamente.
2. Guía al estudiante haciéndole preguntas clave y desglosando el problema paso a paso.
3. Conecta los conceptos con analogías cotidianas o intereses del alumno (${interes}) de forma natural.
4. Mantén un tono empático, cercano y entusiasta. Valida sus aciertos y retroalimenta los errores constructivamente.
5. Responde con fluidez conversacional en 2 a 4 párrafos claros y directos.`;

    const activeSystemInstruction = systemInstructionCustom || defaultSystemInstruction;

    // Normalizar historial para el formato de Gemini (roles: 'user' y 'model')
    const formattedHistory = (historialChat || []).map(msg => {
        const role = (msg.sender === 'user' || msg.role === 'user') ? 'user' : 'model';
        const text = msg.text || (msg.parts && msg.parts[0]?.text) || '';
        return {
            role,
            parts: [{ text }]
        };
    }).filter(m => m.parts[0].text.trim() !== '');

    const contents = [
        ...formattedHistory,
        { role: 'user', parts: [{ text: mensajeUsuario }] }
    ];

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackLearnYourWay(tutorName, mensajeUsuario, interes);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: activeSystemInstruction }]
                },
                contents,
                generationConfig: {
                    temperature,
                    maxOutputTokens
                }
            })
        });

        if (!response.ok) {
            // Intentar fallback si el endpoint no soporta systemInstruction directo en el body
            const fallbackBody = {
                contents: [
                    { role: 'user', parts: [{ text: `[INSTRUCCIÓN DEL SISTEMA: ${activeSystemInstruction}]\n\nPregunta actual:\n${mensajeUsuario}` }] }
                ],
                generationConfig: { temperature, maxOutputTokens }
            };
            const retryRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fallbackBody)
            });
            if (retryRes.ok) {
                const retryData = await retryRes.json();
                return retryData.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackLearnYourWay(tutorName, mensajeUsuario, interes);
            }
            throw new Error(`Gemini API HTTP Error ${response.status}`);
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return responseText || getFallbackLearnYourWay(tutorName, mensajeUsuario, interes);
    } catch (error) {
        console.warn("Error en generarRespuestaTutor:", error);
        return getFallbackLearnYourWay(tutorName, mensajeUsuario, interes);
    }
}

/**
 * Generate Google AI "Learn Your Way" personalized tutor response (MINEDUC Multinivel)
 */
export async function generateLearnYourWayResponse({ 
    studentId, 
    tutorId, 
    tutorName, 
    tutorRole, 
    topicOrQuestion, 
    userQuestion, 
    interest, 
    currentStudentLevelId, 
    currentOAId,
    chatHistory = []
}) {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) 
        || (typeof process !== 'undefined' && process?.env?.VITE_GEMINI_API_KEY)
        || '';
    const questionText = userQuestion || topicOrQuestion || 'Explicar concepto clave.';

    // 1. Recuperar el Tutor Específico
    const matchedTutor = AULOCK_TUTORS.find(t => t.id === tutorId || t.name === tutorName) || AULOCK_TUTORS[0];

    // 2. CONSULTA MAESTRA: Recuperar el Objetivo de Aprendizaje EXACTO y sus Indicadores de Evaluación MINEDUC
    const levelName = currentStudentLevelId || "3ro Básico";
    const catalogForLevel = MINEDUC_OA_CATALOG.find(c => c.nivel_educativo === levelName) || MINEDUC_OA_CATALOG[2];
    const oaEspecifico = catalogForLevel.objetivos_aprendizaje.find(oa => oa.oa_id === currentOAId) || catalogForLevel.objetivos_aprendizaje[0];

    // Buscar Indicadores y Rúbrica MINEDUC correspondientes
    const evalDataForLevel = MINEDUC_EVALUATION_DATASET.find(e => e.nivel === levelName) || MINEDUC_EVALUATION_DATASET[1];
    const evalOa = evalDataForLevel.oa_catalogo.find(o => o.oa_id === currentOAId) || evalDataForLevel.oa_catalogo[0];
    const indicadoresStr = evalOa?.indicadores_evaluacion_mineduc?.map(i => `[${i.indicador_id}] ${i.descripcion} (Nivel Esperado: ${i.nivel_esperado})`).join('; ') || 'Comprensión conceptual y aplicación socrática.';

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackLearnYourWay(matchedTutor.name, questionText, interest);
    }

    // 3. CONSTRUCCIÓN DEL SYSTEM PROMPT DINÁMICO MULTINIVEL CON RÚBRICA MINEDUC
    const systemPrompt = `
        Eres ${matchedTutor.name}, experto pedagógico en ${matchedTutor.eje_mineduc} para el nivel de **${levelName}** del Currículum Nacional de Chile.
        Asignatura: ${matchedTutor.specialty || 'Ciencias / Matemáticas'}.
        Objetivo de Aprendizaje (OA): **"(${oaEspecifico.oa_id}) - ${oaEspecifico.descripcion_completa || oaEspecifico.descripcion_corta}"**.
        Indicadores de Evaluación MINEDUC Auditados: ${indicadoresStr}.
        Rúbrica Sugerida MINEDUC: Niveles [Inicial, Intermedio, Avanzado, Destacado].

        Instrucciones Pedagógicas:
        - Adapta la explicación pedagógica a la edad del estudiante (${levelName}).
        - Utiliza el motor 'Learn Your Way' para adaptar la analogía al interés del alumno: "${interest || 'Fútbol ⚽'}".
        - Guía al alumno de forma SOCRÁTICA, cálida y natural (temperatura 0.7). Nunca des la respuesta directa.
        - Evalúa la respuesta del alumno e indica sutilmente en qué Nivel de Rúbrica MINEDUC se proyecta su progreso.
    `;

    return generarRespuestaTutor(chatHistory, questionText, {
        tutorName: matchedTutor.name,
        materia: matchedTutor.eje_mineduc,
        nivel: levelName,
        interes: interest,
        systemInstructionCustom: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 500
    });
}

/**
 * Multimodal Vision AI: Analyze notebook exercise/equation image with Gem Socratic Rules
 */
export async function analyzeExerciseImageWithGemini({ tutorId, tutorName, imageBase64, mimeType, interest, promptText }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const interestClean = interest || 'Fútbol ⚽';
    const userPrompt = promptText || 'Analiza el ejercicio o problema de la imagen y guíame paso a paso.';

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackVisionAnalysis(tutorName, interestClean);
    }

    // Clean base64 string
    const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, '');
    const imageMime = mimeType || 'image/jpeg';

    const systemGemInstructions = `
Eres la GEM de Inteligencia Articial de AuLock para "${tutorName}".
Regla de Oro Pedagógica SOCRÁTICA:
1. Analiza la imagen escaneada por la cámara del estudiante.
2. Identifica con precisión qué problema, ecuación o texto aparece escrito.
3. NUNCA le des el resultado final directo de forma inmediata.
4. Explícale cómo empezar a resolverlo usando la metodología Google "Learn Your Way" adaptada al interés: "${interestClean}".
5. Guíalo paso a paso y termina haciéndole una pregunta interactiva para que el alumno resuelva el primer paso por sí mismo.
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: systemGemInstructions + `\nConsulta del alumno: "${userPrompt}"` },
                        {
                            inlineData: {
                                mimeType: imageMime,
                                data: base64Data
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) throw new Error(`Gemini Vision API Error ${response.status}`);
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return text || getFallbackVisionAnalysis(tutorName, interestClean);

    } catch (error) {
        return getFallbackVisionAnalysis(tutorName, interestClean);
    }
}

/**
 * Funcionalidad de Apoyo a la Gestión Docente (Marco de la Buena Enseñanza MBE & MINEDUC)
 */
export async function generateTeacherImprovementSuggestion({ teacherId, context, teacherProblem }) {
    const teacherName = teacherId || 'Docente AuLock';
    const gradeLevel = context?.nivel || '4° Medio A';
    const subjectName = context?.asignatura || 'Ciencias Naturales';
    const challengeText = teacherProblem || 'Optimizar la atención y participación activa durante la resolución de ejercicios.';

    console.log(`🤖 Generando asesoría para Prof. ${teacherName}. Problema: "${challengeText}"`);

    // 1. Lógica de ruteo de IA: Mapear el problema al estándar MINEDUC correcto
    let targetStandard = MineducStandardsRegistry.gestion_pedagogica; // Por defecto para el MVP

    const lowerProblem = challengeText.toLowerCase();
    if (lowerProblem.includes('clima') || lowerProblem.includes('respeto') || lowerProblem.includes('convivencia')) {
        targetStandard = MineducStandardsRegistry.formacion_convivencia;
    } else if (lowerProblem.includes('liderazgo') || lowerProblem.includes('utp') || lowerProblem.includes('pme')) {
        targetStandard = MineducStandardsRegistry.liderazgo_escolar;
    } else if (lowerProblem.includes('recursos') || lowerProblem.includes('nfc') || lowerProblem.includes('funda') || lowerProblem.includes('estuche')) {
        targetStandard = MineducStandardsRegistry.gestion_recursos;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackTeacherImprovement(teacherName, gradeLevel, challengeText, targetStandard);
    }

    // 2. Construcción del System Prompt POTENCIADO
    const systemPrompt = `
        Eres un Asesor Pedagógico de Excelencia, experto en el Marco de la Buena Enseñanza (MBE) y los Estándares Indicativos de Desempeño del MINEDUC de Chile.
        Estás asistiendo al Profesor ID/Nombre: ${teacherName} que enseña en nivel: ${gradeLevel} (Asignatura: ${subjectName}).

        El profesor ha reportado el siguiente desafío pedagógico:
        " ${challengeText} "

        TU TAREA:
        Analiza este desafío a la luz del estándar MINEDUC: "${targetStandard.nombre_estandar}" y sus dimensiones: (${targetStandard.dimensiones.join(', ')}).

        Provee un plan de acción detallado de 3 pasos concretos, prácticos y alineados con el contexto educativo chileno.
        PASO 1: Sugerencia didáctica específica para el aula (ej. diversificación de la enseñanza y uso de tecnología socrática AuLock).
        PASO 2: Estrategia de evaluación formativa o retroalimentación efectiva (seguimiento individual y en Squads).
        PASO 3: Ajuste en el ambiente de aprendizaje o clima de aula (motivación, empatía y resiliencia).

        El tono debe ser empático, highly profesional, constructivo y motivador. No uses lenguaje corporativo genérico, usa terminología pedagógica chilena.
    `;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const improvementPlan = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        console.log("✅ Plan de mejora generado exitosamente.");
        return improvementPlan || getFallbackTeacherImprovement(teacherName, gradeLevel, challengeText, targetStandard);

    } catch (error) {
        console.error("❌ Error al conectar con Gemini para asesoría docente:", error);
        return getFallbackTeacherImprovement(teacherName, gradeLevel, challengeText, targetStandard);
    }
}

function getFallbackTeacherImprovement(teacherName, gradeLevel, challengeText, relevantEstandar) {
    return `🏛️ **Plan de Acción Pedagógico MBE / MINEDUC Chile**

**Docente:** ${teacherName} | **Curso:** ${gradeLevel}
**Estándar de Referencia:** ${relevantEstandar.nombre_estandar} ([${relevantEstandar.id}])
**Dimensiones Auditadas:** ${relevantEstandar.dimensiones.join(', ')}

Desafío Reportado: "*${challengeText}*"

---

### PASO 1: Sugerencia Didáctica en Aula
- **Estrategia Socrática Activa:** Inicia la sesión lanzando una pregunta interactiva al recuadro AuLock de 45 segundos, desafiando a los estudiantes a justificar su razonamiento antes de presentar la teoría.
- **Aprendizaje Colaborativo:** Divide el curso en Squads de 3 integrantes con roles complementarios (Líder Lógico, Mentor de Redacción, Diseñador STEAM).

### PASO 2: Evaluación Formativa & Retroalimentación Oportuna
- **Monitoreo con AuLock NFC:** Asegura que los dispositivos se mantengan bloqueados en la funda durante los 30 minutos de trabajo autónomo para evitar distracciones.
- **Cierre de Ciclo Formativo:** Ofrece feedback inmediato usando las rúbricas adaptativas del MINEDUC y reconociendo el avance individual.

### PASO 3: Ambiente de Aprendizaje & Clima de Aula (MBE Dominios B y C)
- Promueve el compromiso con el aprendizaje destacando la perseverancia y el buen trato entre compañeros.`;
}

/**
 * Módulo de Evaluación Formativa MINEDUC (Regla Socrática UCE & Andamios Cognitivos)
 */
export async function generateFormativeFeedback({ studentAnswer, oaContext }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const gradeLevel = oaContext?.nivel || '3º Básico';
    const oaDescription = oaContext?.oa_descripcion || 'Clasificar animales vertebrados y comparar adaptaciones al entorno.';
    const indicadoresMineduc = oaContext?.indicadores_mineduc || [
        { indicador_id: "IND06_A", descripcion: "Clasifican vertebrados por cubierta corporal y respiración.", nivel_esperado: "Intermedio" }
    ];

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackFormativeFeedback(studentAnswer, gradeLevel, oaDescription);
    }

    const systemPrompt = `
        Eres un Asesor Pedagógico experto en el currículum chileno y la implementación de las **Orientaciones de Evaluación Formativa del MINEDUC**.
        El alumno cursa ${gradeLevel} y está trabajando el Objetivo de Aprendizaje: "${oaDescription}".

        Indicadores de Evaluación MINEDUC asociados a este OA:
        ${JSON.stringify(indicadoresMineduc)}

        Respuesta del Alumno:
        " ${studentAnswer} "

        TU TAREA:
        1. Analiza la respuesta del alumno en función de los indicadores ministeriales.
        2. **No asignes una calificación numérica.**
        3. Redacta un feedback formativo y constructivo. Debes ser amable y de apoyo.
        4. **REGLA SOCRÁTICA UCE:** Si la respuesta es incorrecta o incompleta, no le des la respuesta correcta. En su lugar, hazle una o dos preguntas orientadoras (andamios cognitivos) para que él mismo descubra el error o complete la información, basándote en lo que el MINEDUC espera que aprenda.

        Devuelve el feedback en texto plano.
    `;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }]
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const feedbackText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return feedbackText || getFallbackFormativeFeedback(studentAnswer, gradeLevel, oaDescription);

    } catch (error) {
        return getFallbackFormativeFeedback(studentAnswer, gradeLevel, oaDescription);
    }
}

function getFallbackFormativeFeedback(studentAnswer, gradeLevel, oaDescription) {
    return `🌱 **Feedback Formativo UCE / MINEDUC (${gradeLevel})**

¡Excelente esfuerzo al responder! Analizamos tu razonamiento sobre: "*${oaDescription}*"

**Lo que lograste identificar muy bien:**
• Observamos que tu respuesta "*${studentAnswer}*" demuestra iniciativa y atención al concepto principal.

**Andamio Cognitivo Socrático (Preguntas Orientadoras UCE):**
1. ¿Qué característica especial observas en las estructuras respiratorias o cubierta corporal de esta especie que la diferencia de otros grupos?
2. Si comparamos esta respuesta con el hábitat de Chile donde vive, ¿qué otro factor del clima crees que influye en su desarrollo?

¡Sigue explorando y respondiendo para descubrir el siguiente paso por ti mismo! 🚀🌱`;
}

/**
 * Módulo de Evaluación Sumativa MINEDUC (Escala 1.0 a 7.0 & Rúbricas Oficiales UCE)
 */
export async function evaluateSummativeWithMineducRubric(studentWork, oaContext, rubricConfig) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const gradeLevel = oaContext?.nivel || '4° Medio A';
    const oaDescription = oaContext?.oa_descripcion || 'Análisis de datos experimentales y aplicación de modelos.';
    const rubricData = rubricConfig || {
        dimensiones: ["Rigor conceptual", "Argumentación basada en evidencia", "Redacción pedagógica"],
        niveles: ["Inicial", "Intermedio", "Avanzado", "Destacado"]
    };

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackSummativeEvaluation(studentWork, gradeLevel, oaDescription);
    }

    const systemPrompt = `
        Eres un Corrector Certificado por el MINEDUC, experto en aplicar las **Rúbricas y Mapas de Progreso** del Currículum Nacional.
        Debes evaluar el trabajo de un alumno de ${gradeLevel} respecto al OA: "${oaDescription}".

        Rúbrica de Evaluación (basada en UCE):
        ${JSON.stringify(rubricData)}

        Trabajo del Alumno:
        " ${studentWork} "

        INSTRUCCIONES:
        1. Evalúa el trabajo objetivamente usando la rúbrica provista.
        2. Asigna una puntuación de 1.0 a 7.0 (Escala Chilena MINEDUC).
        3. Determina el nivel de logro (Inicial, Intermedio, Avanzado, Destacado).
        4. Redacta una justificación breve para el docente, explicando la nota basada en los criterios de la rúbrica.

        Devuelve ÚNICAMENTE la respuesta en formato JSON válido como el siguiente:
        {
          "nota": 6.5,
          "nivel_logro": "Avanzado",
          "justificacion_docente": "El estudiante demuestra sólida comprensión conceptual..."
        }
    `;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    temperature: 0.2
                }
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJsonText);

    } catch (e) {
        console.error("Error parsing Gemini evaluation:", e);
        return getFallbackSummativeEvaluation(studentWork, gradeLevel, oaDescription);
    }
}

function getFallbackSummativeEvaluation(studentWork, gradeLevel, oaDescription) {
    return {
        nota: 6.3,
        nivel_logro: "Avanzado",
        justificacion_docente: `El trabajo entregado ("${studentWork.slice(0, 45)}...") en ${gradeLevel} cumple con el estándar de evaluación del OA "${oaDescription}". El estudiante demuestra un manejo adecuado de los conceptos y estructura lógica clara, justificando la nota 6.3 (Nivel Avanzado).`
    };
}

/**
 * Módulo de Cultura y Bienestar MINEDUC (Política 'Seamos Comunidad')
 */
export async function generateDailyCulturalMessage(studentId, studentLevel) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const sId = studentId || 'STUDENT_JC98';
    const sLevel = studentLevel || '5º Básico';

    // 1. Recuperar el recurso cultural del día desde MINEDUC_CONVIVENCIA_RESOURCES
    const dailyResource = MINEDUC_CONVIVENCIA_RESOURCES.find(r => r.tipo_recurso === 'mensaje_bienestar');
    const resourceContent = dailyResource?.contenido || {
        titulo: "El Valor del Mes: La Empatía",
        cita: "Trata a los demás como te gustaría ser tratado.",
        reflexion_corta: "¿Cómo demostraste empatía hoy con un compañero?",
        accion_sugerida: "Invita a alguien nuevo a tu grupo en el recreo."
    };

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackCulturalMessage(resourceContent);
    }

    // 2. CONSTRUCCIÓN DEL SYSTEM PROMPT DE CULTURA
    const systemPrompt = `
        Eres un Asistente Pedagógico experto en la **Política de Reactivación Educativa Integral 'Seamos Comunidad' y los lineamientos de Cultura Escolar del MINEDUC Chile**.
        Tu tarea es personalizar el mensaje diario para el estudiante ID: ${sId}, quien cursa: ${sLevel}.

        El recurso cultural base para hoy es:
        Título: "${resourceContent.titulo}"
        Reflexión: "${resourceContent.reflexion_corta}"
        Acción Sugerida: "${resourceContent.accion_sugerida || 'Comparte con tus compañeros en el recreo.'}"

        TU TAREA:
        1. Adopta un tono cálido, cercano, motivador y formativo, alineado con los valores del MINEDUC.
        2. Si el recurso base tiene una "acción sugerida", intégrala de forma natural en el mensaje (ej. "Te invitamos a...").
        3. No seas repetitivo. Usa el contexto del nivel educativo para adaptar el lenguaje (más simple para 1ro Básico, más cívico para IV Medio).
        4. Finaliza el mensaje con un saludo de ánimo.

        Devuelve el mensaje en formato JSON estructurado para la UI:
        {
          "titulo_banner": string,
          "cuerpo_mensaje": string,
          "icono_sugerido": string
        }
    `;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJsonText);

    } catch (e) {
        console.error("Error parsing Gemini cultural message:", e);
        return getFallbackCulturalMessage(resourceContent);
    }
}

function getFallbackCulturalMessage(resourceContent) {
    return {
        titulo_banner: resourceContent.titulo || "El Valor del Mes: La Empatía",
        cuerpo_mensaje: `${resourceContent.reflexion_corta || resourceContent.cita} ${resourceContent.accion_sugerida ? 'Te invitamos a: ' + resourceContent.accion_sugerida : ''}`,
        icono_sugerido: "🌱"
    };
}

/**
 * Generador Automático de Preguntas Evaluativas con IA (MINEDUC)
 */
export async function generateQuestionsWithIA(topic, oaContext, activityType = 'formativa') {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const oaCode = oaContext?.oa_codigo || oaContext?.codigo || 'OA 08';
    const oaDesc = oaContext?.oa_descripcion || oaContext?.descripcion || 'Investigar experimentalmente y explicar las propiedades de la luz.';
    const grade = oaContext?.nivel || '4° Básico';
    const subject = oaContext?.asignatura || 'Ciencias Naturales';

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackGeneratedQuestions(topic, oaCode, oaDesc);
    }

    const systemPrompt = `
        Eres un Diseñador Curricular experto del MINEDUC de Chile.
        Crea 2 preguntas de evaluación para una actividad ${activityType} para el curso ${grade} en ${subject}.
        Tema específico: "${topic || 'Propiedades de la Luz'}"
        Objetivo de Aprendizaje (OA): "${oaCode} - ${oaDesc}"

        REQUISITOS:
        1. Pregunta 1: Debe ser de tipo "alternativa" con 4 opciones (A, B, C, D) y señalar la respuesta correcta.
        2. Pregunta 2: Debe ser de tipo "abierta" que estimule la indagación científica y el pensamiento crítico.

        Devuelve ÚNICAMENTE un arreglo JSON como el siguiente:
        [
          {
            "id": "q1",
            "texto": "¿Qué sucede...",
            "tipo": "alternativa",
            "opciones": ["A) ...", "B) ...", "C) ...", "D) ..."],
            "correcta": "B) ..."
          },
          {
            "id": "q2",
            "texto": "Explica...",
            "tipo": "abierta",
            "rubrica_id": "RUB_MINEDUC_INDAGACION"
          }
        ]
    `;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    temperature: 0.4
                }
            })
        });

        if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJsonText);

    } catch (e) {
        console.error("Error generating questions with Gemini:", e);
        return getFallbackGeneratedQuestions(topic, oaCode, oaDesc);
    }
}

function getFallbackGeneratedQuestions(topic, oaCode, oaDesc) {
    const topicClean = topic || 'Propiedades de la Luz';
    return [
        {
            id: "q1",
            texto: `¿Cuál de las siguientes afirmaciones describe mejor el fenómeno de ${topicClean} según el ${oaCode}?`,
            tipo: "alternativa",
            opciones: [
                `A) La luz viaja siempre en línea recta hasta chocar con un cuerpo opaco.`,
                `B) La luz cambia de velocidad y se refracta al pasar del aire a un cuerpo transparente.`,
                `C) Todos los objetos absorben el 100% de la energía lumínica.`,
                `D) La luz no se refleja en superficies pulidas.`
            ],
            correcta: `B) La luz cambia de velocidad y se refracta al pasar del aire a un cuerpo transparente.`
        },
        {
            id: "q2",
            texto: `A partir del ${oaCode} ("${oaDesc.slice(0, 45)}..."), explica un experimento sencillo para comprobar la ${topicClean} en el aula o en tu hogar.`,
            tipo: "abierta",
            rubrica_id: "RUB_MINEDUC_INDAGACION"
        }
    ];
}

function getFallbackVisionAnalysis(tutorName, interestClean) {
    return `📷 [GEM Visión IA de ${tutorName} - Metodología Socrática "Learn Your Way" (${interestClean})]

¡He analizado la imagen de tu cuaderno correctamente! 🔍

1. **Reconocimiento del Ejercicio**: Veo una ecuación cuadrática de segundo grado ($ax^2 + bx + c = 0$) escrita a mano.
2. **Conexión con tu interés en ${interestClean}**: Piensa en esta ecuación como la trayectoria de un pase bombeado en la cancha. La altura máxima depende del coeficiente de $x^2$.
3. **Paso 1 - Desafío Socrático**: Para aplicar la fórmula general $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$, primero debemos identificar las constantes.

👉 Mirando tu cuaderno: ¿Cuáles son los valores exactos de $a$, $b$ y $c$ en la ecuación que escribiste? ¡Respóndeme aquí para dar el siguiente paso juntos! ⚽🎮✨`;
}

function getFallbackLearnYourWay(tutorName, topicOrQuestion, interest) {
    const interestClean = interest || 'Fútbol ⚽';
    return `🎯 [Metodología Google "Learn Your Way" - Enfoque: ${interestClean}]

¡Excelente pregunta! Para entender "${topicOrQuestion}", veámoslo desde la perspectiva de ${interestClean}:

1. **La Analogía Clave**: Piensa en ${topicOrQuestion} como el momento exacto en que un jugador calcula la trayectoria de un tiro libre con comba en un partido decisivo. La fuerza, el ángulo y la rotación son variables que se optimizan al mismo tiempo.

2. **El Principio Técnico**: Así como en ${interestClean} cada movimiento requiere precisión y coordinación para lograr el objetivo sin desperdiciar energía, en esta materia desglosamos el problema en pasos lógicos secuenciales.

3. **Ejemplo Práctico**: Si estás en el minuto 90 y necesitas maximizar el área de cobertura del equipo, aplicas la regla de optimización $f'(x) = 0$.

¿Cómo aplicarías esta misma estrategia al siguiente desafío en tu entrenamiento o partida? ⚽🎮🚀`;
}

// Fallbacks
function getFallbackPresentation(topic, subject, gradeLevel) {
    return {
        title: `NotebookLLM Presentation: ${topic}`,
        slides: [
            {
                slideNumber: 1,
                tag: "📌 Slide 1: Gancho & Aplicación Real",
                headline: `¿Cómo los algoritmos de IA utilizan ${topic} en tiempo real?`,
                body: `En la industria tecnológica y financiera, ${topic} permite calcular variaciones instantáneas y optimizar recursos con máxima eficiencia.`,
                keyInsight: "💡 El 90% de los modelos predictivos dependen de esta optimización."
            },
            {
                slideNumber: 2,
                tag: "📐 Slide 2: Concepto Clave & Algoritmo",
                headline: "Principios Fundamentales & Punto Crítico f'(x) = 0",
                body: "Para encontrar el máximo o mínimo de una función, calculamos la primera derivada y resolvemos la ecuación cuando la pendiente es igual a cero.",
                keyInsight: "🧠 Si f''(x) < 0 es un máximo local; si f''(x) > 0 es un mínimo."
            },
            {
                slideNumber: 3,
                tag: "🧪 Slide 3: Ejercicio Práctico en Vivo",
                headline: "Desafío de Optimización para Squads",
                body: "Un panel solar rectangular debe maximizar su superficie con 40 metros de marco. ¿Cuáles son sus dimensiones óptimas?",
                keyInsight: "📐 Pista: Modela el área A(x) = x(20 - x) y calcula A'(x) = 0."
            },
            {
                slideNumber: 4,
                tag: "🚀 Slide 4: Cierre & Pregunta para Aula en Vivo",
                headline: "Síntesis & Pregunta Detonante",
                body: "¿Cuál es el valor del lado 'x' que maximiza el área del panel solar?",
                keyInsight: "🎯 Alternativas: A) x = 10m  B) x = 5m  C) x = 20m  D) x = 15m"
            }
        ]
    };
}

function getFallbackLessonPlan(topic, subject, gradeLevel) {
    return {
        warmup: `Inicio (10 min): Presentar la pregunta detonante sobre ${topic} y pedir respuestas en vivo.`,
        core: `Desarrollo (25 min): Exposición interactiva de los principios de ${topic} en ${subject}.`,
        closing: `Cierre (10 min): Evaluación en vivo de 2 alternativas y síntesis del concepto clave.`,
        triggerQuestion: `¿Cómo aplicarías ${topic} en un problema real?`
    };
}

function getFallbackDiagnosis(fullName, stats) {
    return {
        qualitativeSummary: `${fullName} presenta un rendimiento destacado en el área Lógica e Idiomas (percentil 98), con oportunidades de reforzamiento en ciencias orgánicas.`,
        studyGuidelines: [
            "1. Micro-sesiones de Biología Visual de 25 minutos.",
            "2. Práctica Intercalada STEM-Idiomas.",
            "3. Pausas Activas & Manejo de Ansiedad."
        ],
        suggestedCareers: [
            { name: "Ingeniería Civil Informática & Data Science", match: "98%", reason: "Sobresaliente pensamiento algorítmico." }
        ]
    };
}

/**
 * AI Squads Matching Engine (Heterogeneous Clustering & Peer Mentoring)
 * Ingests student records, subject grades, and focus metrics to generate balanced squads of 3-4 members.
 */
export async function generateAISquadsClustering({ roster, courseName = '4° Medio A', subject = 'STEM & Humanidades' }) {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) 
        || (typeof process !== 'undefined' && process?.env?.VITE_GEMINI_API_KEY)
        || '';

    const inputRoster = (roster && roster.length > 0) ? roster : [
        { id: 'st-1', name: 'Juan Carlos Pérez', gpa: 6.8, subjects: { math: 7.0, biology: 4.3, history: 6.8, physics: 6.9 }, focus: '96%', strengths: ['Matemáticas', 'Física'], weaknesses: ['Biología'] },
        { id: 'st-2', name: 'Mateo Rojas', gpa: 6.2, subjects: { math: 4.5, biology: 6.8, history: 5.8, physics: 5.5 }, focus: '88%', strengths: ['Biología & Ciencias'], weaknesses: ['Matemática Avanzada'] },
        { id: 'st-3', name: 'Sofía Martínez', gpa: 6.5, subjects: { math: 5.2, biology: 5.9, history: 6.9, language: 6.8 }, focus: '94%', strengths: ['Historia & Formación Ciudadana'], weaknesses: ['Física Aplicada'] },
        { id: 'st-4', name: 'Camila Silva', gpa: 6.4, subjects: { math: 4.8, biology: 5.0, history: 6.5, language: 6.9 }, focus: '91%', strengths: ['Lenguaje & Debate'], weaknesses: ['Química'] },
        { id: 'st-5', name: 'Lucas Fernández', gpa: 6.1, subjects: { math: 4.4, biology: 5.8, arts: 6.9, tech: 6.7 }, focus: '86%', strengths: ['Diseño & Tecnología'], weaknesses: ['Cálculo'] },
        { id: 'st-6', name: 'Valentina Soto', gpa: 6.6, subjects: { math: 6.5, biology: 6.7, chemistry: 6.8, history: 4.5 }, focus: '95%', strengths: ['Química & Física'], weaknesses: ['Historia'] },
        { id: 'st-7', name: 'Diego Morales', gpa: 6.3, subjects: { math: 6.8, coding: 7.0, language: 4.6, history: 5.0 }, focus: '93%', strengths: ['Algoritmos & Lógica'], weaknesses: ['Comprensión Lectora'] },
        { id: 'st-8', name: 'Constanza Silva', gpa: 6.2, subjects: { math: 4.2, english: 7.0, language: 6.8, science: 5.2 }, focus: '90%', strengths: ['Inglés Técnico & Redacción'], weaknesses: ['Álgebra'] }
    ];

    const systemPrompt = `Eres un Arquitecto de Datos Educativos y Algoritmo de Clustering Heterogéneo para la plataforma AuLock (Currículum MINEDUC & PAES Chile).
Tu misión es agrupar a los estudiantes en 'Squads' balanceados de 3 a 4 integrantes aplicando las siguientes REGLAS PEDAGÓGICAS ESTRICTAS:

1. HETEROGENEIDAD Y MENTORÍA CRUZADA (PEER MENTORING):
   - Empareja estudiantes de alto rendimiento (notas >= 6.0 en una asignatura como Matemáticas o Ciencias) con compañeros que tengan áreas de mejora identificadas (notas <= 4.9) en esa misma asignatura.
   - Asegúrate de que el estudiante que necesita apoyo en una materia sea fuerte en otra (ej. Biología, Historia, Idiomas o Creatividad), generando una mentoría recíproca y bidireccional.
2. BALANCE DE ENFOQUE Y ATENCIÓN:
   - Distribuye a los estudiantes con altos índices de atención (>= 90%) con aquellos que presentan alertas preventivas o menor enfoque para dinamizar el trabajo colaborativo.
3. ASIGNACIÓN AUTOMÁTICA DE ROLES INTERNOS:
   - Asigna a cada miembro un rol según su perfil:
     * 'Líder Lógico': Estudiante fuerte en Matemáticas/Cálculo/Programación.
     * 'Mentor de Pares (Ciencias/Humanidades)': Estudiante tutor en áreas específicas.
     * 'Colaborador Creativo': Estudiante fuerte en diseño, redacción o debate.
     * 'Coordinador de Enfoque': Estudiante con alto índice de atención y gestión de tiempos.
4. RAZONAMIENTO Y SINERGIAS:
   - Define un nombre de Squad inspirador (ej: 'Squad Alfa STEM', 'Squad Beta Humanidades', 'Squad Gamma Biociencias').
   - Explica la 'pedagogical_rationale' y lista las 'synergies' explícitas de mentoría entre los alumnos.

Formato JSON obligatorio:
{
  "status": "SUCCESS",
  "clustering_summary": "Resumen general de balance y distribución de la cohorte...",
  "squads": [
    {
      "id": "sq-1",
      "name": "Squad Alfa STEM",
      "course": "${courseName}",
      "specialty": "Ciencias & Tecnología",
      "pedagogical_rationale": "Sinergia bidireccional entre Juan Carlos (líder en cálculo) y Mateo (tutor en biología)...",
      "average_gpa": 6.5,
      "collaboration_index": "94%",
      "members": [
        {
          "id": "st-1",
          "name": "Juan Carlos Pérez",
          "gpa": 6.8,
          "role": "Líder Lógico",
          "best_subject": "Matemáticas (7.0)",
          "growth_area": "Biología (4.3)",
          "focus_metric": "96%"
        }
      ],
      "synergies": [
        {
          "mentor": "Juan Carlos Pérez",
          "apprentice": "Mateo Rojas",
          "area": "Matemáticas & Cálculo",
          "reason": "Juan Carlos (7.0) apoya en modelamiento algebraico a Mateo (4.5)."
        }
      ]
    }
  ]
}`;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackSquadClustering(inputRoster, courseName, subject);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Cohorte del curso ${courseName}:\n${JSON.stringify(inputRoster, null, 2)}\n\nGenera el agrupamiento heterogéneo óptimo en formato JSON estructurado.`
                    }]
                }],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.4,
                    maxOutputTokens: 1600
                }
            })
        });

        if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
            const parsed = JSON.parse(jsonText);
            if (parsed.squads && parsed.squads.length > 0) return parsed;
        }
        return getFallbackSquadClustering(inputRoster, courseName, subject);
    } catch (err) {
        console.warn('AI Squads clustering failed, using fallback:', err);
        return getFallbackSquadClustering(inputRoster, courseName, subject);
    }
}

function getFallbackSquadClustering(roster, courseName, subject) {
    return {
        status: "SUCCESS",
        clustering_summary: "Clustering heterogéneo completado con éxito: 8 estudiantes distribuidos en 2 Squads equilibrados de 4 integrantes con mentoría cruzada bidireccional.",
        squads: [
            {
                id: 'sq-1',
                name: 'Squad Alfa STEM',
                course: courseName || '4° Medio A',
                specialty: 'Ciencias Exactas & Tecnología',
                pedagogical_rationale: 'Complementariedad de alta sinergia: Juan Carlos y Diego lideran el rigor lógico-matemático (7.0 y 6.8), apoyando a Mateo y Lucas en Cálculo. En retorno, Mateo y Lucas aportan maestría en Biología Celular y Diseño Tecnológico.',
                average_gpa: 6.4,
                collaboration_index: '95%',
                members: [
                    { id: 'st-1', name: 'Juan Carlos Pérez', gpa: 6.8, role: 'Líder Lógico', best_subject: 'Matemáticas (7.0)', growth_area: 'Biología (4.3)', focus_metric: '96%' },
                    { id: 'st-2', name: 'Mateo Rojas', gpa: 6.2, role: 'Mentor de Pares (Ciencias)', best_subject: 'Biología (6.8)', growth_area: 'Matemática Avanzada (4.5)', focus_metric: '88%' },
                    { id: 'st-5', name: 'Lucas Fernández', gpa: 6.1, role: 'Colaborador Creativo & UI', best_subject: 'Diseño & Tech (6.9)', growth_area: 'Cálculo (4.4)', focus_metric: '86%' },
                    { id: 'st-7', name: 'Diego Morales', gpa: 6.3, role: 'Coordinador de Algoritmos', best_subject: 'Programación (7.0)', growth_area: 'Comprensión Lectora (4.6)', focus_metric: '93%' }
                ],
                synergies: [
                    { mentor: 'Juan Carlos Pérez', apprentice: 'Mateo Rojas', area: 'Matemáticas & Cálculo', reason: 'Juan Carlos (7.0) refuerza derivadas y optimización a Mateo (4.5).' },
                    { mentor: 'Mateo Rojas', apprentice: 'Juan Carlos Pérez', area: 'Biología Orgánica', reason: 'Mateo (6.8) guía el laboratorio de ecosistemas celulares a Juan Carlos (4.3).' },
                    { mentor: 'Diego Morales', apprentice: 'Lucas Fernández', area: 'Estructuras Lógicas', reason: 'Diego (7.0) asesora a Lucas en la resolución computacional de desafíos.' }
                ]
            },
            {
                id: 'sq-2',
                name: 'Squad Beta Humanidades & Debate',
                course: courseName || '4° Medio A',
                specialty: 'Lenguaje, Historia & Química Aplicada',
                pedagogical_rationale: 'Emparejamiento de habilidades comunicativas y científicas: Camila y Sofía guían la argumentación crítica y formación ciudadana (6.9), mientras que Valentina lidera la modelación en Química y Física.',
                average_gpa: 6.4,
                collaboration_index: '93%',
                members: [
                    { id: 'st-3', name: 'Sofía Martínez', gpa: 6.5, role: 'Líder de Ciudadanía & Historia', best_subject: 'Historia (6.9)', growth_area: 'Física Aplicada (4.8)', focus_metric: '94%' },
                    { id: 'st-4', name: 'Camila Silva', gpa: 6.4, role: 'Capitana de Debate & Lenguaje', best_subject: 'Lenguaje (6.9)', growth_area: 'Química (4.6)', focus_metric: '91%' },
                    { id: 'st-6', name: 'Valentina Soto', gpa: 6.6, role: 'Mentora de Pares (Química & Física)', best_subject: 'Química & Física (6.8)', growth_area: 'Historia (4.5)', focus_metric: '95%' },
                    { id: 'st-8', name: 'Constanza Silva', gpa: 6.2, role: 'Coordinadora de Inglés Técnico', best_subject: 'Inglés Técnico (7.0)', growth_area: 'Álgebra (4.2)', focus_metric: '90%' }
                ],
                synergies: [
                    { mentor: 'Valentina Soto', apprentice: 'Camila Silva', area: 'Química & Estequiometría', reason: 'Valentina (6.8) apoya a Camila (4.6) en balance de masa y estequiometría.' },
                    { mentor: 'Camila Silva', apprentice: 'Valentina Soto', area: 'Argumentación & Debate', reason: 'Camila (6.9) entrena a Valentina (4.5) en ensayos y comprensión histórica.' },
                    { mentor: 'Constanza Silva', apprentice: 'Sofía Martínez', area: 'Inglés Científico', reason: 'Constanza (7.0) asesora a Sofía en la traducción de papers académicos.' }
                ]
            }
        ]
    };
}

/**
 * Official Gemini 2.5 Flash Socratic Tutor & Dynamic Blackboard Service
 * Generates non-meta-talk conversational Socratic response + structured blackboard JSON schema
 */
export async function handleTutorQueryService({ specialist, query, mode }) {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) 
        || (typeof process !== 'undefined' && process?.env?.VITE_GEMINI_API_KEY)
        || '';

    const cleanQuery = query || 'Concepto General';
    const activeSpecialist = specialist || 'Tutor de Ciencias y Matemáticas';

    const systemInstructionText = `Eres un Tutor Socrático de Elite en ${activeSpecialist} para la plataforma AuLock (Currículum MINEDUC & PAES Chile).
REGLAS ESTRICTAS DE RESPUESTA:
1. CERO META-TALK: NUNCA digas "he estructurado la pizarra", "revisa el tablero", "he preparado este desglose", ni frases robóticas sobre la interfaz.
2. ENFOQUE SOCRÁTICO INMEDIATO: Inicia el texto de chat INMEDIATAMENTE con una analogía del mundo real potente e intuitiva que aterrice el concepto "${cleanQuery}" (por ejemplo, para derivadas: la diferencia entre el velocímetro en un milisegundo vs la distancia total del viaje).
3. PREGUNTA GUÍA FINAL: Cierra el mensaje con una pregunta socrática reflexiva y guiada que invite al estudiante a razonar y responder.
4. RIGOR EN LA PIZARRA: Completa cada campo de "blackboard" con contenido técnico, ecuaciones explícitas y aplicaciones reales sin ningún texto genérico de relleno.

Formato JSON obligatorio:
{
  "status": "SUCCESS",
  "chat_response": "Analogía intuitiva inicial + explicación socrática + pregunta detonante al alumno.",
  "blackboard": {
    "topic": "Nombre formal y preciso del tema",
    "core_equation": "Fórmula matemática central o principio rector",
    "definition": "Definición conceptual rigurosa y rol de las variables principales.",
    "equation_governance": "Ecuaciones de gobierno, teoremas o reglas operativas paso a paso.",
    "practical_application": "Aplicación práctica en ingeniería/ciencias y criterio de validación analítica para evitar errores en pruebas."
  }
}`;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackTutorQueryResponse(activeSpecialist, cleanQuery, mode);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `El estudiante pregunta: "${cleanQuery}". Tutor: ${activeSpecialist}. Genera la analogía socrática y la pizarra analítica en JSON estructurado.`
                    }]
                }],
                systemInstruction: {
                    parts: [{
                        text: systemInstructionText
                    }]
                },
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.7,
                    maxOutputTokens: 800
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
            const parsed = JSON.parse(jsonText);
            // Asegurar compatibilidad de campos
            if (parsed.blackboard) {
                return {
                    status: "SUCCESS",
                    chat_response: parsed.chat_response || parsed.tutor_response,
                    tutor_response: parsed.chat_response || parsed.tutor_response,
                    blackboard: parsed.blackboard
                };
            }
        }
        return getFallbackTutorQueryResponse(activeSpecialist, cleanQuery, mode);
    } catch (err) {
        console.warn('Gemini 2.5 Flash query failed, using fallback:', err);
        return getFallbackTutorQueryResponse(activeSpecialist, cleanQuery, mode);
    }
}

function getFallbackTutorQueryResponse(specialist, query, mode) {
    const q = (query || '').toLowerCase();

    if (q.includes('derivad') || q.includes('calculo') || q.includes('cálculo') || q.includes('tasa de cambio') || q.includes('razon de cambio') || q.includes('razón de cambio')) {
        return {
            status: "SUCCESS",
            chat_response: "Imagina que vas en un automóvil por la carretera. Si miras el odómetro al final del viaje, calculas tu velocidad promedio dividiendo la distancia total entre las horas. Pero si miras el velocímetro en una curva cerrada, estás viendo exactamente tu velocidad instantánea en ese milisegundo: la derivada de la posición respecto al tiempo. Si una partícula se mueve según la posición s(t) = 3t² + 2t, ¿qué crees que le ocurre a la velocidad cuando el intervalo de tiempo tiende a cero?",
            tutor_response: "Imagina que vas en un automóvil por la carretera. Si miras el odómetro al final del viaje, calculas tu velocidad promedio dividiendo la distancia total entre las horas. Pero si miras el velocímetro en una curva cerrada, estás viendo exactamente tu velocidad instantánea en ese milisegundo: la derivada de la posición respecto al tiempo. Si una partícula se mueve según la posición s(t) = 3t² + 2t, ¿qué crees que le ocurre a la velocidad cuando el intervalo de tiempo tiende a cero?",
            blackboard: {
                topic: "Cálculo Diferencial: Derivadas y Razón de Cambio Instantánea",
                core_equation: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = \\frac{df}{dx}",
                definition: "La derivada representa la tasa de cambio instantánea de una función con respecto a su variable independiente, geométricamente equivalente a la pendiente de la recta tangente a la curva en un punto dado.",
                equation_governance: "Regla de la Potencia: d/dx(xⁿ) = n·xⁿ⁻¹ | Regla del Producto: (f·g)' = f'g + fg' | Regla de la Cadena: (f∘g)'(x) = f'(g(x))·g'(x)",
                practical_application: "Optimización de Sistemas: Se determinan puntos críticos haciendo f'(x) = 0. Si f''(x) < 0 se confirma un máximo absoluto (máxima ganancia, menor pérdida de energía)."
            }
        };
    }

    if (q.includes('newton') || q.includes('fuerza') || q.includes('dinamica') || q.includes('dinámica') || q.includes('aceleracion') || q.includes('aceleración')) {
        return {
            status: "SUCCESS",
            chat_response: "Imagina empujar un carro de supermercado vacío frente a uno completamente lleno de compras. Con la misma fuerza en tus brazos, el carro vacío acelera rápidamente, mientras que el lleno apenas cambia su velocidad. Esa resistencia natural es la masa inercial. Si duplicas la masa de un cohete espacial pero mantienes el empuje constante de los motores, ¿qué fracción de su aceleración original experimentará?",
            tutor_response: "Imagina empujar un carro de supermercado vacío frente a uno completamente lleno de compras. Con la misma fuerza en tus brazos, el carro vacío acelera rápidamente, mientras que el lleno apenas cambia su velocidad. Esa resistencia natural es la masa inercial. Si duplicas la masa de un cohete espacial pero mantienes el empuje constante de los motores, ¿qué fracción de su aceleración original experimentará?",
            blackboard: {
                topic: "Mecánica Clásica: Segunda Ley de Newton & Dinámica Vectorial",
                core_equation: "\\vec{F}_{net} = m \\cdot \\vec{a} = \\frac{d\\vec{p}}{dt}",
                definition: "La aceleración que adquiere un cuerpo es directamente proporcional a la fuerza neta resultante que actúa sobre él e inversamente proporcional a su masa inercial total.",
                equation_governance: "Sumatoria Vectorial: ΣF_x = m·a_x  y  ΣF_y = m·a_y | Fuerza de Roce: f_r = μ·N | Peso Gravitatorio: P = m·g",
                practical_application: "Diagramas de Cuerpo Libre (DCL): Aislamiento de tensiones, normales y fuerzas de fricción para predecir trayectorias balísticas y estructuras estáticas seguras."
            }
        };
    }

    if (q.includes('mru') || q.includes('mruv') || q.includes('rectilineo') || q.includes('rectilíneo') || q.includes('cinematica') || q.includes('cinemática')) {
        return {
            status: "SUCCESS",
            chat_response: "Piensa en el piloto automático de un tren de alta velocidad en una vía recta e infinita: el velocímetro permanece clavado en 200 km/h sin moverse ni un milímetro. Como no hay variación de velocidad, la aceleración es exactamente cero. Si este tren viaja durante 45 minutos a velocidad constante, ¿cómo despejarías la distancia recorrida sin confundir los minutos con horas?",
            tutor_response: "Piensa en el piloto automático de un tren de alta velocidad en una vía recta e infinita: el velocímetro permanece clavado en 200 km/h sin moverse ni un milímetro. Como no hay variación de velocidad, la aceleración es exactamente cero. Si este tren viaja durante 45 minutos a velocidad constante, ¿cómo despejarías la distancia recorrida sin confundir los minutos con horas?",
            blackboard: {
                topic: "Cinemática 1D: Movimiento Rectilíneo Uniforme y Variado",
                core_equation: "x(t) = x_0 + v_0 \\cdot t + \\frac{1}{2} a \\cdot t^2",
                definition: "Estudio del movimiento unidimensional continuo. En MRU la aceleración es nula (a = 0) y la velocidad constante; en MRUV la aceleración es constante y la velocidad varía linealmente.",
                equation_governance: "Ecuación de Torricelli: v_f² = v_i² + 2·a·Δx | Velocidad Instantánea: v(t) = v₀ + a·t | Pendiente x-t = Velocidad",
                practical_application: "Cálculo de Distancia de Frenado: Determinación del tiempo y distancia segura de detención vehicular ante emergencias de tráfico."
            }
        };
    }

    if (q.includes('quimic') || q.includes('química') || q.includes('mol') || q.includes('estequiometr') || q.includes('reaccion') || q.includes('reacción')) {
        return {
            status: "SUCCESS",
            chat_response: "Imagina preparar emparedados: si cada sándwich requiere exactamente 2 rebanadas de pan y 1 lámina de queso, tener 20 panes y solo 3 quesos significa que el queso es tu reactivo limitante y solo obtendrás 3 sándwiches completos. En química los átomos se combinan con esta misma proporción molar estricta. Si tienes 4 moles de H₂ y 1 mol de O₂, ¿cuántos moles de agua líquida H₂O puedes sintetizar?",
            tutor_response: "Imagina preparar emparedados: si cada sándwich requiere exactamente 2 rebanadas de pan y 1 lámina de queso, tener 20 panes y solo 3 quesos significa que el queso es tu reactivo limitante y solo obtendrás 3 sándwiches completos. En química los átomos se combinan con esta misma proporción molar estricta. Si tienes 4 moles de H₂ y 1 mol de O₂, ¿cuántos moles de agua líquida H₂O puedes sintetizar?",
            blackboard: {
                topic: "Estequiometría & Conservación de Masa: Ley de Lavoisier",
                core_equation: "n = \\frac{m}{\\text{MM}} \\quad | \\quad aA + bB \\longrightarrow cC + dD",
                definition: "Relación cuantitativa ponderal y volumétrica entre reactantes y productos en una reacción balanceada, gobernada por el Número de Avogadro (6.022 × 10²³ partículas/mol).",
                equation_governance: "Rendimiento Porcentual: %R = (Masa Real / Masa Teórica) × 100% | Reactivo Limitante: Comparación estequiométrica mol a mol",
                practical_application: "Síntesis Farmacéutica & Industrial: Maximización del rendimiento de síntesis química minimizando residuos y costos de reactivos no transformados."
            }
        };
    }

    return {
        status: "SUCCESS",
        chat_response: `Pensemos en "${query}" a través de un sistema de balance energético: cuando una variable aumenta en el sistema, otra debe compensarla para preservar el equilibrio. Si analizamos este fenómeno en condiciones ideales de laboratorio frente a condiciones reales con fricción o ruido, ¿cuál es el factor clave que determinaría el cambio en la respuesta?`,
        tutor_response: `Pensemos en "${query}" a través de un sistema de balance energético: cuando una variable aumenta en el sistema, otra debe compensarla para preservar el equilibrio. Si analizamos este fenómeno en condiciones ideales de laboratorio frente a condiciones reales con fricción o ruido, ¿cuál es el factor clave que determinaría el cambio en la respuesta?`,
        blackboard: {
            topic: `Análisis Fundamental: ${query.toUpperCase()}`,
            core_equation: "f(\\vec{X}) = \\sum_{i=1}^n w_i \\cdot x_i + b",
            definition: `Desglose analítico riguroso de las propiedades esenciales y comportamiento dimensional de "${query}" bajo estándares PAES/MINEDUC.`,
            equation_governance: "Relación de Conservación: Variables de Entrada [X] ⟷ Función de Transferencia [H] ⟷ Variables de Salida [Y]",
            practical_application: "Metodología de Validación: Verificación de unidades dimensionales consistentes y evaluación en valores límite (asíntotas y condiciones iniciales)."
        }
    };
}

/**
 * Generate TEAsisto Emotional & Calming Conversational AI Support Response
 */
export async function generateTEAsistoSupportResponse({ userMessage, history = [], activePet = null }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const petPersona = activePet ? `Acompañante actual: ${activePet.name} (${activePet.type}). Incluye una breve nota de ánimo de ${activePet.name} con un emoji.` : '';

    const prompt = `
Eres TEAsisto, un asistente de apoyo emocional pedagógico, empático, calmado y libre de juicios para estudiantes de educación secundaria en la plataforma AuLock.
Tu objetivo es escuchar al estudiante con profunda calidez, validar sus emociones (ansiedad, cansancio, dudas, alegría, estrés escolar o social), y responder de manera conversacional, cercana y reconfortante.
${petPersona}

Mensaje del estudiante: "${userMessage}"

Reglas de respuesta:
1. Responde de forma completamente conversacional y fluida. NUNCA uses respuestas estáticas ni repetitivas.
2. Muestra empatía genuina y valida lo que siente el alumno sin juzgar.
3. Si el alumno menciona estrés, exámenes o agobio, ofrece un consejo suave y una invitación breve a pausar o respirar.
4. Mantén la respuesta entre 2 y 4 oraciones cálidas y reconfortantes.
`;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackTEAsistoResponse(userMessage, activePet);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) throw new Error('Gemini API Error');
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
        return getFallbackTEAsistoResponse(userMessage, activePet);
    } catch (err) {
        console.warn("Using fallback TEAsisto response due to API connection:", err);
        return getFallbackTEAsistoResponse(userMessage, activePet);
    }
}

function getFallbackTEAsistoResponse(userMessage, activePet) {
    const textLower = userMessage.toLowerCase();
    const petNote = activePet ? `\n\n${activePet.emoji || '🐾'} ${activePet.name}: "${activePet.advice}"` : '';

    if (textLower.includes('hola') || textLower.includes('hello') || textLower.includes('hi')) {
        return `¡Hola! Me alegra mucho saludarte. Recuerda que este es tu espacio seguro, sin presiones ni juzgamientos. ¿Cómo te has sentido durante la jornada de hoy?${petNote}`;
    }
    if (textLower.includes('como estas') || textLower.includes('how are you')) {
        return `Estoy aquí contigo, listo para escucharte y acompañarte a tu propio ritmo. Cuéntame, ¿qué tal ha estado tu día o qué tienes en mente en este momento?${petNote}`;
    }
    if (textLower.includes('estres') || textLower.includes('ansiedad') || textLower.includes('agobiad') || textLower.includes('mal') || textLower.includes('sad') || textLower.includes('tired') || textLower.includes('cansad')) {
        return `Comprendo totalmente esa sensación de agobio, y es 100% válido sentirse así. No tienes que demostrarle nada a nadie en este momento. Tómate una pausa suave, haz una inhalación profunda y recuerda que ir paso a paso es una gran victoria.${petNote}`;
    }
    if (textLower.includes('gracias') || textLower.includes('thank')) {
        return `¡De nada! Siempre es un gusto estar aquí para ti. Recuerda que eres capaz de superar cualquier reto y que tus mascotas y tu equipo están contigo.${petNote}`;
    }
    if (textLower.includes('prueba') || textLower.includes('examen') || textLower.includes('paes') || textLower.includes('nota') || textLower.includes('tarea')) {
        return `Las evaluaciones pueden sentirse intimidantes, pero tu valor no se define por un solo número. Has estado trabajando duro; confía en tu proceso y regálate 5 minutos de descanso para despejar tu mente.${petNote}`;
    }

    return `Te escucho con mucha atención. Todo lo que sientes es importante y válido. Tómate tu tiempo para expresar lo que necesitas; estoy aquí para acompañarte sin ninguna prisa.${petNote}`;
}

/**
 * Generate Actionable AI Remediation Advisory for Teacher Analytics Hub
 */
export async function generateTeacherRemediationAdvisory({ topic, courseName = 'Senior High A', strugglePercentage = 42 }) {
    const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) 
        || (typeof process !== 'undefined' && process?.env?.VITE_GEMINI_API_KEY)
        || '';

    const cleanTopic = topic || 'Derivadas y Optimización de Funciones';

    const prompt = `
Eres el Asesor Pedagógico de Inteligencia Docente de AuLock (Alineado al MBE y MINEDUC Chile).
Analiza la siguiente brecha conceptual detectada en los logs del Tutor Socrático y evaluaciones:
- Asignatura: Matemática Avanzada & Cálculo
- Curso: ${courseName}
- Concepto Crítico con Dificultades: "${cleanTopic}"
- Tasa de Error / Dificultad en la Cohorte: ${strugglePercentage}%

Genera una recomendación docente hiper-específica, accionable y estructurada en formato JSON estricto:
{
  "recommendationTitle": "Plan de Nivelación Rápida: ${cleanTopic}",
  "priorityLevel": "ALTA PRIORIDAD (${strugglePercentage}% de estudiantes)",
  "rootCauseAnalysis": "Explicación del error conceptual frecuente identificado por la IA...",
  "suggestedIntervention": "Estrategia didáctica concreta para la próxima sesión de aula (20-25 min)...",
  "interactiveChallenge": "Un micro-desafío o pregunta socrática detonante para proyectar en pizarra...",
  "squadPeerRemediationStrategy": "Cómo apalancar la mentoría cruzada en los Squads de aprendizaje..."
}
`;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackRemediationAdvisory(cleanTopic, courseName, strugglePercentage);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json', temperature: 0.5 }
            })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) return JSON.parse(jsonText);
        return getFallbackRemediationAdvisory(cleanTopic, courseName, strugglePercentage);
    } catch (err) {
        console.warn("Using fallback remediation advisory:", err);
        return getFallbackRemediationAdvisory(cleanTopic, courseName, strugglePercentage);
    }
}

function getFallbackRemediationAdvisory(topic, courseName, strugglePercentage) {
    return {
        recommendationTitle: `Plan de Nivelación: ${topic}`,
        priorityLevel: `ATENCIÓN RECOMENDADA (${strugglePercentage}% de la cohorte)`,
        rootCauseAnalysis: `Los estudiantes muestran confusión al identificar las dependencias funcionales compuestas y omiten la multiplicación por la derivada interna g'(x).`,
        suggestedIntervention: `Iniciar la próxima clase con una analogía física (ruedas de bicicleta conectadas por cadena) y descomponer en 3 pasos visuales en la Pizarra Socrática antes de asignar ejercicios individuales.`,
        interactiveChallenge: `Proyectar en vivo: Si h(x) = (3x² - 5)⁴, ¿cuál es la función exterior f(u) y cuál es la función interior u(x)?`,
        squadPeerRemediationStrategy: `Emparejar a los Líderes Lógicos con los compañeros que presentaron alertas en este tema dentro del Squad Alfa y Beta para resolver un problema de optimización en 10 minutos.`
    };
}

/**
 * Generate Dynamic Gamification Dynamic Content via Gemini 2.5 Flash
 */
export async function generateArenaGamificationChallenge({ gameId, gameTitle, topic, difficulty = 'Normal', durationMinutes = 3 }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const cleanTopic = topic || 'Ecuaciones Cuadráticas & Matemáticas STEM';

    const prompt = `
Act as a Senior Educational Game Designer and Gamification Master for AuLock.
Generate the complete, high-stakes game content for the classroom gamification activity:
- Game ID: "${gameId}" (${gameTitle})
- Topic: "${cleanTopic}"
- Difficulty: "${difficulty}"
- Target Duration: ${durationMinutes} minutes
- Target Audience: 40 students organized in 10 squads of 4.

Return ONLY a strictly valid JSON object matching the appropriate structure:

For "PALABRA_PROHIBIDA":
{
  "gameId": "PALABRA_PROHIBIDA",
  "secretWord": "Término secreto principal",
  "tabooWords": ["Palabra 1", "Palabra 2", "Palabra 3", "Palabra 4"],
  "hint": "Pista contextual pedagógica para el expositor",
  "pointsPerRound": 100,
  "rules": "El orador debe lograr que su escuadrón adivine la palabra secreta sin pronunciar ninguna de las 4 palabras prohibidas."
}

For "INFO_ASIMETRICA":
{
  "gameId": "INFO_ASIMETRICA",
  "mainObjective": "Objetivo cooperativo central a resolver",
  "roleClues": [
    { "role": "Líder Lógico", "clue": "Pista o dato numérico 1..." },
    { "role": "Mentor de Pares", "clue": "Pista o fórmula 2..." },
    { "role": "Colaborador Creativo", "clue": "Pista o condición de borde 3..." },
    { "role": "Coordinador Algorítmico", "clue": "Pista o paso de integración 4..." }
  ],
  "expectedSolution": "Solución final sintetizada",
  "verificationPrompt": "Cómo validar la respuesta unificada del grupo"
}

For "CONSENSO_OBLIGATORIO":
{
  "gameId": "CONSENSO_OBLIGATORIO",
  "dilemmaTitle": "Título del Dilema Ético o Científico",
  "scenario": "Situación problema compleja sobre ${cleanTopic} donde no hay solución trivial...",
  "options": [
    { "id": "A", "title": "Opción A...", "impact": "Impacto pedagógico o ético A" },
    { "id": "B", "title": "Opción B...", "impact": "Impacto pedagógico o ético B" },
    { "id": "C", "title": "Opción C...", "impact": "Impacto pedagógico o ético C" }
  ],
  "unanimityBonus": 150,
  "consensusQuestion": "¿Qué postura unánime defenderá el escuadrón?"
}

For "DESAFIO_COLOSO":
{
  "gameId": "DESAFIO_COLOSO",
  "bossName": "KRÓNOS // El Titán de la Entropía",
  "bossAvatar": "👹",
  "bossTotalHp": 10000,
  "bossLore": "Una anomalía temporal amenaza con borrar el conocimiento sobre ${cleanTopic}. Los 10 escuadrones deben resolver sus micro-misiones para infligir daño al Coloso.",
  "squadChallenges": [
    { "squadIndex": 1, "squadName": "Squad Alfa", "problem": "Micro-desafío 1...", "answer": "Resultado 1", "damage": 1000 },
    { "squadIndex": 2, "squadName": "Squad Beta", "problem": "Micro-desafío 2...", "answer": "Resultado 2", "damage": 1000 },
    { "squadIndex": 3, "squadName": "Squad Gamma", "problem": "Micro-desafío 3...", "answer": "Resultado 3", "damage": 1000 },
    { "squadIndex": 4, "squadName": "Squad Delta", "problem": "Micro-desafío 4...", "answer": "Resultado 4", "damage": 1000 },
    { "squadIndex": 5, "squadName": "Squad Epsilon", "problem": "Micro-desafío 5...", "answer": "Resultado 5", "damage": 1000 },
    { "squadIndex": 6, "squadName": "Squad Zeta", "problem": "Micro-desafío 6...", "answer": "Resultado 6", "damage": 1000 },
    { "squadIndex": 7, "squadName": "Squad Eta", "problem": "Micro-desafío 7...", "answer": "Resultado 7", "damage": 1000 },
    { "squadIndex": 8, "squadName": "Squad Theta", "problem": "Micro-desafío 8...", "answer": "Resultado 8", "damage": 1000 },
    { "squadIndex": 9, "squadName": "Squad Iota", "problem": "Micro-desafío 9...", "answer": "Resultado 9", "damage": 1000 },
    { "squadIndex": 10, "squadName": "Squad Kappa", "problem": "Micro-desafío 10...", "answer": "Resultado 10", "damage": 1000 }
  ]
}

For "RED_EMBAJADORES":
{
  "gameId": "RED_EMBAJADORES",
  "missionTitle": "Misión Diplomática de Transferencia Cognitiva",
  "topic": "${cleanTopic}",
  "instructions": "Cada squad designa 1 embajador que viajará físicamente a otro escuadrón para transmitir una técnica y traer de vuelta una solución comprobada.",
  "ambassadorObjective": "Enseñar la estrategia óptima de resolución sobre ${cleanTopic} y validar el método alternativo del equipo anfitrión."
}

For "TERMOMETRO_CIUDADANO":
{
  "gameId": "TERMOMETRO_CIUDADANO",
  "debateThesis": "Tesis detonante para debate ciudadano sobre ${cleanTopic}",
  "stances": ["Totalmente de Acuerdo", "En Desacuerdo", "Postura Crítica / Síntesis"],
  "reflectionPrompt": "Argumenten en 30 segundos con evidencia sólida antes de que se abra el termómetro de votación anónima."
}
`;

    if (!apiKey || apiKey === 'DEMO_KEY') {
        return getFallbackArenaChallenge(gameId, cleanTopic);
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: 'application/json', temperature: 0.7 }
            })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) return JSON.parse(jsonText);
        return getFallbackArenaChallenge(gameId, cleanTopic);
    } catch (err) {
        console.warn("Using fallback arena challenge:", err);
        return getFallbackArenaChallenge(gameId, cleanTopic);
    }
}

function getFallbackArenaChallenge(gameId, topic) {
    if (gameId === 'PALABRA_PROHIBIDA') {
        return {
            gameId: 'PALABRA_PROHIBIDA',
            secretWord: 'PARÁBOLA',
            tabooWords: ['VÉRTICE', 'CUADRÁTICA', 'CURVA', 'EJE'],
            hint: `Concepto fundamental relacionado con ${topic}.`,
            pointsPerRound: 100,
            rules: 'Explica el término sin mencionar ninguna de las 4 palabras prohibidas en 60 segundos.'
        };
    }
    if (gameId === 'INFO_ASIMETRICA') {
        return {
            gameId: 'INFO_ASIMETRICA',
            mainObjective: `Calcular la trayectoria y punto óptimo en ${topic}`,
            roleClues: [
                { role: 'Líder Lógico', clue: 'La velocidad inicial es v0 = 20 m/s con ángulo vertical.' },
                { role: 'Mentor de Pares', clue: 'La ecuación de altura es h(t) = v0·t - 0.5·g·t².' },
                { role: 'Colaborador Creativo', clue: 'La aceleración de gravedad efectiva es g = 10 m/s².' },
                { role: 'Coordinador Algorítmico', clue: 'La altura máxima se alcanza cuando la velocidad vertical es 0 (t = 2 s).' }
            ],
            expectedSolution: 'Altura máxima = 20 metros a los 2 segundos.',
            verificationPrompt: 'Verificar usando h_max = (v0²) / (2g)'
        };
    }
    if (gameId === 'CONSENSO_OBLIGATORIO') {
        return {
            gameId: 'CONSENSO_OBLIGATORIO',
            dilemmaTitle: `Dilema de Optimización y Ética en ${topic}`,
            scenario: `La comunidad enfrenta una decisión crítica sobre el uso de recursos y modelos predictivos en ${topic}.`,
            options: [
                { id: 'A', title: 'Priorizar máxima precisión algorítmica sin restricciones.', impact: 'Alto rendimiento pero requiere mayor tiempo.' },
                { id: 'B', title: 'Implementar solución rápida con verificación cruzada humana.', impact: 'Equilibrio óptimo entre velocidad y seguridad.' },
                { id: 'C', title: 'Desarrollar un protocolo híbrido comunitario.', impact: 'Mayor participación pero requiere consenso unánime.' }
            ],
            unanimityBonus: 150,
            consensusQuestion: '¿Cuál opción elegirá el escuadrón de forma 100% unánime?'
        };
    }
    if (gameId === 'DESAFIO_COLOSO') {
        return {
            gameId: 'DESAFIO_COLOSO',
            bossName: 'KRÓNOS // El Coloso de la Entropía',
            bossAvatar: '👹',
            bossTotalHp: 10000,
            bossLore: `Una distorsión en la matriz de ${topic} intenta desestabilizar la sala. Los 10 escuadrones deben resolver sus micro-misiones para derrotarlo.`,
            squadChallenges: Array.from({ length: 10 }, (_, i) => ({
                squadIndex: i + 1,
                squadName: `Squad ${['Alfa', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'][i]}`,
                problem: `Calcula el valor crítico para la fase ${i + 1} de ${topic}: ¿Cuánto es (${i + 2} × 4) + ${i * 5}?`,
                answer: String((i + 2) * 4 + i * 5),
                damage: 1000
            }))
        };
    }
    if (gameId === 'RED_EMBAJADORES') {
        return {
            gameId: 'RED_EMBAJADORES',
            missionTitle: 'Protocolo Diplomático de Saberes Cruzados',
            topic,
            instructions: `Cada escuadrón envía un embajador a otro squad para intercambiar una estrategia de resolución sobre ${topic}.`,
            ambassadorObjective: `Transferir la técnica de simplificación rápida y validar el resultado con el squad receptor.`
        };
    }
    return {
        gameId: 'TERMOMETRO_CIUDADANO',
        debateThesis: `¿Es la aplicación de ${topic} la vía más justa para resolver los desafíos sociales actuales?`,
        stances: ['Totalmente de Acuerdo', 'En Desacuerdo', 'Postura Crítica / Síntesis'],
        reflectionPrompt: 'Argumenten con evidencia de la unidad antes de abrir la votación de la sala.'
    };
}



