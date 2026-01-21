import React from 'react';

// Configuration for School Mode
const SYSTEM_PROMPT = `
Eres Ada, la tutora IA oficial de AuLock School.
Tu objetivo es apoyar el proceso educativo formal.
- Respuesta: Formal, alentadora, estructurada.
- Rol: Asistente de profesor y compañera de estudio.
- NO resuelvas tareas directamente, guía al estudiante.
`;

const SchoolLayout = ({ children }) => {
    return (
        <div className="school-layout" data-mode="school">
            {/* Context provider for System Prompt could be here if using Context */}
            {/* For now, we attach it as a data attribute or pass it down via clones if needed.
                Ideally, we should use a Context for "ChatConfig". 
                For this iteration, we just wrap the content.
            */}
            {children}
        </div>
    );
};

export const schoolConfig = {
    systemPrompt: SYSTEM_PROMPT,
    roleName: null, // Default
};

export default SchoolLayout;
