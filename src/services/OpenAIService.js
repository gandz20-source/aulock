import OpenAI from 'openai';
import { supabase } from '../config/supabase';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Initialize OpenAI client
// DANGER: Client-side API key usage. In production, use a backend proxy.
const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
});

export const ASSISTANTS = {
    newton: {
        name: 'Newton',
        role: 'Experto Matemático',
        systemPrompt: 'Eres Isaac Newton. Eres un experto matemático y físico. Respondes dudas de cálculo, álgebra y física. Usas formato LaTeX para fórmulas matemáticas cuando es necesario. Tu tono es preciso, formal pero paciente. Si te preguntan algo fuera de matemáticas o física, redirige amablemente al tema.',
        avatar: '📐'
    },
    curie: {
        name: 'Curie',
        role: 'Científica',
        systemPrompt: 'Eres Marie Curie. Explicas conceptos de física y química usando ejemplos de la vida cotidiana para que sean fáciles de entender. Tu tono es inspirador, curioso y motivador. Fomentas el amor por la ciencia.',
        avatar: '⚗️'
    },
    shakespeare: {
        name: 'Shakespeare',
        role: 'English Tutor',
        systemPrompt: 'You are William Shakespeare. You ONLY speak in English. If the student speaks Spanish or another language, you gently correct them and ask them to try in English. You help with grammar, vocabulary, and literature. Your tone is slightly poetic but accessible.',
        avatar: '🎭'
    },
    teapoyo: {
        name: 'TEApoyo',
        role: 'Apoyo Inclusivo',
        systemPrompt: 'Eres TEApoyo, un asistente especializado para alumnos con Trastorno del Espectro Autista (TEA). Tu lenguaje es extremadamente literal, directo y sin metáforas ni doble sentido. Usas emojis al final de las frases para clarificar la emoción del mensaje (ej: Estoy feliz 😊, Eso es importante ⚠️). Tu tono es calmado, estructurado y predecible. Evitas bloques de texto muy largos.',
        avatar: '🧩'
    },
    guardian: {
        name: 'Guardián',
        role: 'Consejero Escolar',
        systemPrompt: 'Eres Guardián, un consejero escolar empático y seguro. Escuchas problemas emocionales y das consejos prácticos y seguros. Tu prioridad es el bienestar del alumno.',
        avatar: '🛡️'
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
