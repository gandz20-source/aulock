import { supabase } from '../config/supabase';

// Gemini V2 Service
// Handles Parsing, XP Updates, and Shadow Protocol (Safety)

/**
 * Processes the raw JSON response from Gemini V2.
 * @param {object} responseJson - The parsed JSON object from the AI.
 * @param {string} userId - The current user's UUID.
 * @param {function} dispatchUI - Function to update Global UI State (e.g., setActionMode).
 */
export const processGeminiResponse = async (responseJson, userId, dispatchUI) => {
    console.log('✨ Gemini V2 Processing:', responseJson);

    try {
        const {
            human_core_update,
            mental_health_flag,
            active_mode,
            response_text
        } = responseJson;

        // 1. XP Update (Human Core)
        if (human_core_update && userId) {
            console.log('📈 Updating Human Core:', human_core_update);
            const { error: rpcError } = await supabase.rpc('update_human_core_xp', {
                user_id: userId,
                xp_updates: human_core_update
            });

            if (rpcError) console.error('❌ XP Update Phase Failed:', rpcError);
            else console.log('✅ XP Integrated.');
        }

        // 2. Shadow Protocol (Mental Health Safety)
        if (mental_health_flag && mental_health_flag !== 'NORMAL' && userId) {
            console.warn('🛡️ SHADOW PROTOCOL TRIGGERED:', mental_health_flag);

            const { error: alertError } = await supabase
                .from('mental_health_alerts')
                .insert({
                    user_id: userId,
                    flag: mental_health_flag,
                    context: JSON.stringify(human_core_update) // Saving context of what triggered it (optional)
                });

            if (alertError) console.error('❌ Alert System Failed:', alertError);
        }

        // 3. UI State Update
        if (active_mode && dispatchUI) {
            console.log('🎨 Switching UI Mode:', active_mode);
            dispatchUI({ type: 'SET_MODE', payload: active_mode });
        }

        return response_text || "Procesado correctamente.";

    } catch (error) {
        console.error('💥 Gemini Service Critical Error:', error);
        return "Hubo un error procesando la respuesta.";
    }
};

/**
 * Simulates an AI Analysis of a debate session.
 * In production, this would call a Supabase Edge Function.
 * @param {string} debateId - The ID of the debate to analyze.
 * @returns {Promise<object>} - The verdict object.
 */
export const analyzeDebate = async (debateId) => {
    console.log('🤖 Analyzing Debate:', debateId);

    // 1. Fetch all messages for context (Mocking the AI reading)
    const { data: messages } = await supabase
        .from('debate_messages') // Assuming this table exists or similar
        .select('*')
        .eq('debate_id', debateId);

    // 2. Simulate AI Processing Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Return Mock Verdict (Randomized for demo effect)
    // Categories: Lógica (Logic), Evidencia (Evidence), Fundamento (Foundation)
    const randomScore = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    return {
        verdict: {
            logic: randomScore(6, 10),
            evidence: randomScore(4, 9),
            foundation: randomScore(7, 10),
            summary: "El debate mostró un buen uso de falacias lógicas, aunque faltó evidencia concreta en los argumentos finales. El equipo a favor sostuvo mejor su fundamento ético."
        }
    };
};
