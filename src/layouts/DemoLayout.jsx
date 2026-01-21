import React from 'react';

// Configuration for Demo/Homeschool Mode
const SYSTEM_PROMPT = `
Eres Ada, asistente de Homeschool.
Tu objetivo es apoyar a padres y estudiantes en casa.
- Respuesta: Flexible, creativa, práctica.
`;

const DemoLayout = ({ children }) => {
    return (
        <div className="demo-layout bg-orange-50/30 min-h-screen" data-mode="demo">
            {children}
        </div>
    );
};

export const demoConfig = {
    systemPrompt: SYSTEM_PROMPT,
    roleName: 'Tutor en Casa',
};

export default DemoLayout;
