import { createContext, useContext, useReducer, useEffect } from 'react';

const UIContext = createContext();

const uiReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACTIVE_MODE':
            return { ...state, activeMode: action.payload };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'TOGGLE_SIDEBAR':
            return { ...state, isSidebarOpen: !state.isSidebarOpen };
        case 'SET_PLATFORM':
            return { ...state, platform: action.payload };
        default:
            return state;
    }
};

const getInitialState = () => {
    try {
        const saved = localStorage.getItem('ui_context');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn('Failed to parse UI state from local storage:', e);
        localStorage.removeItem('ui_context'); // Clear corrupted state
    }
    return {
        activeMode: 'STORY',
        theme: 'default',
        isSidebarOpen: false,
        platform: 'school'
    };
};

export const UIProvider = ({ children }) => {
    const [state, dispatch] = useReducer(uiReducer, getInitialState());

    // Persist active state (specifically platform and mode)
    useEffect(() => {
        localStorage.setItem('ui_context', JSON.stringify(state));
    }, [state]);

    return (
        <UIContext.Provider value={{ state, dispatch }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
