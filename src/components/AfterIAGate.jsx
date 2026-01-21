import React from 'react';
import { useUI } from '../context/UIContext';

/**
 * AfterIAGate
 * Conditionally renders content based on whether the current module supports gamification/features
 * AFTER the IA interaction.
 * 
 * Logic:
 * - School: Gamification Allowed (Check specific config if needed)
 * - Tutor: Often restricted until task completion
 * - PreU: Gamification might be disabled to force focus
 */
const AfterIAGate = ({ children, fallback = null }) => {
    const { state } = useUI();
    const { platform } = state;

    // Rules for Gamification/Extra features
    const ALLOWED_MODULES = ['school', 'demo'];
    // Tutor and PreU might be "Focus First", hiding games until unlocked.
    // User request: "verifique si el módulo actual permite la gamificación"

    const isAllowed = ALLOWED_MODULES.includes(platform);

    if (!isAllowed) {
        return fallback;
    }

    return <>{children}</>;
};

export default AfterIAGate;
