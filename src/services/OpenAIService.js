import OpenAI from 'openai';
import { supabase } from '../config/supabase';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI client
// DANGER: Client-side API key usage. In production, use a backend proxy.
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
});

export const SUBJECT_AVATARS = {
    math: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%233B82F6' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%231E293B' stroke='%2360A5FA' stroke-width='2'/><text x='60' y='48' font-family='monospace, sans-serif' font-weight='bold' font-size='20' fill='%2360A5FA' text-anchor='middle'>%E2%88%91 %E2%88%9A%CF%80</text><text x='60' y='78' font-family='monospace, sans-serif' font-weight='900' font-size='24' fill='%23F59E0B' text-anchor='middle'>1 2 3</text></svg>",
    chemistry: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2310B981' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23064E3B' stroke='%2334D399' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='18' fill='%2334D399' text-anchor='middle'>H%E2%82%82O %E2%80%A2 CO%E2%82%82</text><text x='60' y='78' font-family='sans-serif' font-weight='900' font-size='22' fill='%23A7F3D0' text-anchor='middle'>%E2%9A%97%EF%B8%8F NaCl</text></svg>",
    language: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%23EC4899' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23831843' stroke='%23F472B6' stroke-width='2'/><text x='60' y='48' font-family='sans-serif' font-weight='bold' font-size='22' fill='%23F472B6' text-anchor='middle'>%F0%9F%93%96 ABC</text><text x='60' y='78' font-family='sans-serif' font-weight='900' font-size='16' fill='%23FDE047' text-anchor='middle'>ENGLISH</text></svg>",
    inclusive: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%23F59E0B' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%2378350F' stroke='%23FBBF24' stroke-width='2'/><text x='60' y='52' font-family='sans-serif' font-weight='bold' font-size='32' fill='%23FBBF24' text-anchor='middle'>%F0%9F%A9%A9</text><text x='60' y='82' font-family='sans-serif' font-weight='900' font-size='13' fill='%23FDE68A' text-anchor='middle'>TEA/INCLUSION</text></svg>",
    guidance: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' width='120' height='120'><rect width='120' height='120' rx='28' fill='%230F172A'/><rect x='4' y='4' width='112' height='112' rx='24' fill='none' stroke='%2310B981' stroke-width='3' opacity='0.6'/><circle cx='60' cy='60' r='46' fill='%23064E3B' stroke='%2334D399' stroke-width='2'/><text x='60' y='52' font-family='sans-serif' font-weight='bold' font-size='32' fill='%2334D399' text-anchor='middle'>%F0%9F%9B%A1%EF%B8%8F</text><text x='60' y='82' font-family='sans-serif' font-weight='900' font-size='13' fill='%23A7F3D0' text-anchor='middle'>BIENESTAR</text></svg>"
};

export const ASSISTANTS = {
    newton: {
        name: 'Tutor Matemática',
        role: 'Matemática Avanzada, Álgebra & Cálculo',
        systemPrompt: 'Eres Tutor Matemática. Eres un tutor de IA experto en matemática y física. Respondes dudas de cálculo, álgebra y física. Usas formato LaTeX para fórmulas matemáticas cuando es necesario. Tu tono es preciso, formal pero paciente. Si te preguntan algo fuera de matemáticas o física, redirige amablemente al tema.',
        avatar: SUBJECT_AVATARS.math,
        icon: '📐'
    },
    curie: {
        name: 'Tutor Ciencias',
        role: 'Física, Química & Biología',
        systemPrompt: 'Eres Tutor Ciencias. Explicas conceptos de física, química y biología usando ejemplos de la vida cotidiana para que sean fáciles de entender. Tu tono es inspirador, curioso y motivador. Fomentas el amor por la ciencia.',
        avatar: SUBJECT_AVATARS.chemistry,
        icon: '⚗️'
    },
    shakespeare: {
        name: 'Tutor Lenguaje & Inglés',
        role: 'Lenguaje, Literatura & English',
        systemPrompt: 'Eres Tutor Lenguaje & Inglés. Ayudas a los estudiantes a mejorar su gramática, vocabulario, redacción, comprensión lectora y práctica de inglés. Tu tono es claro, estructurado y alentador.',
        avatar: SUBJECT_AVATARS.language,
        icon: '🎭'
    },
    teapoyo: {
        name: 'Tutor Apoyo Inclusivo',
        role: 'Apoyo Pedagógico Inclusivo (TEA/NEEP)',
        systemPrompt: 'Eres Tutor Apoyo Inclusivo, un asistente especializado para alumnos con Trastorno del Espectro Autista (TEA) y necesidades especiales. Tu lenguaje es extremadamente literal, directo y sin metáforas ni doble sentido. Usas emojis al final de las frases para clarificar la emoción del mensaje (ej: Estoy feliz 😊, Eso es importante ⚠️). Tu tono es calmado, estructurado y predecible. Evitas bloques de texto muy largos.',
        avatar: SUBJECT_AVATARS.inclusive,
        icon: '🧩'
    },
    guardian: {
        name: 'Tutor Orientación & Bienestar',
        role: 'Orientación Escolar & Bienestar',
        systemPrompt: 'Eres Tutor Orientación & Bienestar, un consejero escolar empático y seguro. Escuchas dudas académicas y personales, ofreciendo orientación práctica y positiva. Tu prioridad es el bienestar del alumno.',
        avatar: SUBJECT_AVATARS.guidance,
        icon: '🛡️'
    }
};

// Safety Check Function (The "Guardián" Logic)
const checkSafety = async (text) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Fast model for check
            messages: [
                {
                    role: "system",
                    content: "You are a safety content moderator for a school app. Analyze the following user message. If it indicates BULLYING (being bullied or bullying others) or DEPRESSION/SELF-HARM, reply with 'UNSAFE: [REASON]'. If it is safe, reply with 'SAFE'. Reason should be 'BULLYING' or 'DEPRESSION'. Example: 'UNSAFE: BULLYING'"
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0,
            max_tokens: 10
        });

        const result = response.choices[0].message.content;
        if (result.startsWith('UNSAFE')) {
            const reason = result.split(':')[1]?.trim() || 'OTHER';
            return { isSafe: false, reason };
        }
        return { isSafe: true };
    } catch (error) {
        console.error('Safety check failed:', error);
        // Fail safe: allow message if check fails, or block? 
        // For prototype, we'll log and allow, but in prod maybe block.
        return { isSafe: true };
    }
};

// Main Chat Function
export const sendMessageToAI = async (assistantKey, messages, userId, image = null) => {
    const assistant = ASSISTANTS[assistantKey];
    if (!assistant) throw new Error("Assistant not found");

    // Get the last user message to check for safety
    // If there's an image, we assume the text part is the caption or just "Analiza esta imagen"
    const lastUserMessage = messages[messages.length - 1].content;

    // 1. Run Safety Check (Guardián Logic) - ONLY FOR TEXT
    // We skip image safety check for this prototype to save complexity/cost
    const safetyCheck = await checkSafety(lastUserMessage);

    if (!safetyCheck.isSafe) {
        // TRIGGER RED ALERT
        await supabase.from('alerts').insert({
            student_id: userId,
            type: safetyCheck.reason.toLowerCase(),
            content: lastUserMessage,
            status: 'unread'
        });

        // Return a blocked response
        return {
            role: 'assistant',
            content: "Lo siento, no puedo responder a eso en este momento. He notificado a un profesor para que pueda apoyarte mejor. 🛡️",
            blocked: true
        };
    }

    // 1.5. Prompt Specialization (University Stage)
    // Check if extra context is needed based on optional arguments (not passed yet in prototype, but adding slot)
    // We will assume 'userId' might be used to fetch profile in a real scenario, or we pass 'academicStage' param.
    // For this prototype, we'll check if the system prompt needs modification dynamically.

    // NOTE: In a real app, pass academicStage as a param to this function.
    // Here we inject it via a hidden system instruction if the user context implies it (or we force it for testing).
    // Let's assume the caller appends a special flag or we just add a flexible instructions block.

    // ... (Existing Safety Check) ...

    // 2. Prepare Messages for OpenAI
    let apiMessages = [
        { role: "system", content: assistant.systemPrompt },
        ...messages.slice(0, -1) // History
    ];

    // Handle the latest message (Text + Optional Image)
    const latestMessageContent = [];

    // Add text
    latestMessageContent.push({ type: "text", text: lastUserMessage });

    // Add image if present
    if (image) {
        latestMessageContent.push({
            type: "image_url",
            image_url: {
                url: image
            }
        });

        // Inject Hidden Vision Prompt
        apiMessages[0].content += "\n\n[SYSTEM INSTRUCTION]: El usuario te ha enviado una imagen. Analízala visualmente y ayuda.";
    }

    // Add the constructed latest message
    apiMessages.push({
        role: "user",
        content: image ? latestMessageContent : lastUserMessage
    });

    try {
        const response = await openai.chat.completions.create({
            model: image ? "gpt-4o" : "gpt-4o-mini",
            messages: apiMessages,
            temperature: 0.7,
        });

        return response.choices[0].message;
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
};

/**
 * Parses an image of an academic curriculum (Malla) to extract subjects.
 * @param {string} base64Image - The image data.
 * @returns {Promise<Array>} - List of extracted subject objects { name, code, credits }.
 */
export const parseCurriculum = async (base64Image) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are an Optical Character Recognition (OCR) specialist for academic documents. Your task is to extract a list of Subject Names from the provided image of a University Curriculum (Malla Curricular). Return ONLY a JSON array of strings, e.g., ['Cálculo I', 'Química General', ...]. Do not include markdown formatting or extra text."
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Extract the subjects from this curriculum image." },
                        { type: "image_url", image_url: { url: base64Image } }
                    ]
                }
            ],
            max_tokens: 1000
        });

        const content = response.choices[0].message.content;
        // Clean up markdown if any
        const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);

    } catch (error) {
        console.error("Curriculum Parsing Error:", error);
        throw new Error("Failed to parse curriculum image.");
    }
};
