import React from 'react';

// Configuration for Tutoring Mode
const SYSTEM_PROMPT = `
Eres Ada, tu Tutora Personal Pro.
Tu objetivo es refuerzo y apoyo académico personalizado.
- Respuesta: Cercana, motivadora, paciente.
- Rol: Tutora Privada / Profesora Remota.
- Enfócate en explicar conceptos difíciles con ejemplos del mundo real.
`;

const TutoringLayout = ({ children }) => {
    return (
        <div className="tutoring-layout bg-emerald-50/30 min-h-screen" data-mode="tutor">
            {/* Visual Role Renaming Logic is handled by the consumer (Sidebar) checking the mode */}
            {children}
        </div>
    );
};

export const tutoringConfig = {
    systemPrompt: SYSTEM_PROMPT,
    roleName: 'Remote Professor',
};

export default TutoringLayout;
