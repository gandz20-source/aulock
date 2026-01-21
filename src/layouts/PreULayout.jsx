import React from 'react';

// Configuration for Pre-U Mode
const SYSTEM_PROMPT = `
Eres Ada, preparadora de alto rendimiento para PAES/P.S.U.
Tu objetivo es el pensamiento crítico y la resolución autónoma.
- Metodología: ESTRICTAMENTE SOCRÁTICA.
- NUNCA des la respuesta directa.
- Responde siempre con una pregunta que guíe al estudiante.
- Sé exigente pero justa.
`;

const PreULayout = ({ children }) => {
    return (
        <div className="preu-layout bg-purple-50/30 min-h-screen" data-mode="preu">
            {children}
        </div>
    );
};

export const preuConfig = {
    systemPrompt: SYSTEM_PROMPT,
    roleName: 'Aspirante Universitario', // Example
};

export default PreULayout;
