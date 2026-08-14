import React, { createContext, useState, useContext } from 'react';

const FocusModeContext = createContext();

export const FocusModeProvider = ({ children }) => {
    const [isPhoneInCase, setIsPhoneInCase] = useState(false); // Estuche NFC lock state
    const [currentSession, setCurrentSession] = useState(null);

    // NFC Event Handler (TAP IN / TAP OUT)
    const handleNfcEvent = async (eventPayload) => {
        const { tagId, studentId } = eventPayload;

        if (!isPhoneInCase) {
            // TAP IN: Lock phone in case and record attendance
            setIsPhoneInCase(true);
            setCurrentSession({
                sessionId: 'SESSION_LIVE_2026',
                className: '4° Medio A - Ciencias Naturales (MINEDUC)',
                teacherName: 'Prof. Roberto Silva',
                tagId: tagId || 'NFC_CASE_TOKEN_01',
                startedAt: new Date().toLocaleTimeString()
            });
            console.info("📥 MODO ENFOQUE ACTIVADO: Teléfono detectado en funda AuLock NFC.");
        } else {
            // TAP OUT: Release phone from case
            const confirmExit = window.confirm("¿Estás seguro de retirar tu teléfono y finalizar la sesión de enfoque?");
            if (confirmExit) {
                setIsPhoneInCase(false);
                setCurrentSession(null);
                console.info("📤 MODO ENFOQUE DESACTIVADO: Teléfono liberado.");
            }
        }
    };

    return (
        <FocusModeContext.Provider value={{ isPhoneInCase, currentSession, handleNfcEvent, setIsPhoneInCase }}>
            {children}
        </FocusModeContext.Provider>
    );
};

export const useFocusMode = () => useContext(FocusModeContext);
