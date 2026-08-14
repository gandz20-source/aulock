import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../config/supabase';

const FocusModeContext = createContext();

export const FocusModeProvider = ({ children }) => {
    const [isPhoneInCase, setIsPhoneInCase] = useState(false);
    const [currentSession, setCurrentSession] = useState({
        sessionId: 'SESSION_LIVE_2026',
        className: 'Mathematics & STEM Specialization',
        teacherName: 'Prof. Carlos Rivas',
        startedAt: new Date().toLocaleTimeString()
    });

    // 1. Client-Side Page Visibility & Focus Engine States
    const [isTeacherActive, setIsTeacherActive] = useState(true);
    const [teacherTimer, setTeacherTimer] = useState(0);
    const [studentFocusTime, setStudentFocusTime] = useState(0);
    const [studentFocusScore, setStudentFocusScore] = useState(100); // Initial Student Score = 100
    const [tabExitCount, setTabExitCount] = useState(0);
    const [isTabFocused, setIsTabFocused] = useState(true);
    const [weeklyBonus, setWeeklyBonus] = useState(true); // Weekly_Bonus flag
    const [showWarningModal, setShowWarningModal] = useState(false);

    // 2. Live Questions Synchronization
    const [activeLiveQuestion, setActiveLiveQuestion] = useState({
        id: 'Q_LIVE_1',
        title: 'Formative Question: Solve x² - 5x + 6 = 0',
        options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 1, x = 6', 'x = 0'],
        correctIndex: 0,
        active: true
    });

    // Teacher-Led Timer
    useEffect(() => {
        let interval = null;
        if (isTeacherActive) {
            interval = setInterval(() => {
                setTeacherTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTeacherActive]);

    // Page Visibility API Audit (document.visibilityState === 'hidden')
    useEffect(() => {
        let focusInterval = null;

        if (isTeacherActive && isTabFocused) {
            focusInterval = setInterval(() => {
                setStudentFocusTime(prev => prev + 1);
            }, 1000);
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' || document.hidden) {
                // 1. Pause student focus timer
                setIsTabFocused(false);
                setTabExitCount(prev => prev + 1);

                // 2. Deduct 3 points immediately
                setStudentFocusScore(prev => {
                    const updatedScore = Math.max(0, prev - 3);
                    if (updatedScore < 100) setWeeklyBonus(false); // Flag Weekly_Bonus false if score drops below 100
                    return updatedScore;
                });

                // 3. Trigger warning alert modal
                setShowWarningModal(true);
                console.warn("⚠️ ¡Atención! Has salido de la pantalla. -3 puntos de enfoque.");
            } else {
                setIsTabFocused(true);
                console.info("👁️ Focus restored. Personal focus timer resumed.");
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            clearInterval(focusInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isTeacherActive, isTabFocused]);

    // 3. Live Questions & Point Recovery (+2 points up to max 100)
    const submitLiveAnswer = (selectedIndex) => {
        if (activeLiveQuestion && selectedIndex === activeLiveQuestion.correctIndex) {
            setStudentFocusScore(prev => Math.min(100, prev + 2)); // Score never exceeds 100 max
            console.info("✅ Correct answer! +2 points added back to focus score.");
            return { success: true, pointsAwarded: 2 };
        }
        return { success: false, pointsAwarded: 0 };
    };

    const triggerLiveQuestion = (questionObject) => {
        setActiveLiveQuestion(questionObject);
    };

    // 4. Class Completion & Supabase Sync (`student_session_metrics`)
    const endClassAndSyncSupabase = async () => {
        setIsTeacherActive(false);
        const focusEfficiencyRatio = teacherTimer > 0 ? (studentFocusTime / teacherTimer) * 100 : 100;
        const finalScore = Math.round((studentFocusScore * 0.7) + (focusEfficiencyRatio * 0.3));

        const sessionPayload = {
            student_name: 'Juan Carlos Pérez',
            class_name: currentSession?.className || 'Mathematics & STEM',
            teacher_timer_sec: teacherTimer,
            total_time_focused: studentFocusTime,
            tab_switch_count: tabExitCount,
            final_focus_score: finalScore,
            weekly_bonus: weeklyBonus,
            synced_at: new Date().toISOString()
        };

        try {
            if (supabase) {
                // Upsert to student_session_metrics table
                await supabase.from('student_session_metrics').insert([sessionPayload]);
            }
            console.info("☁️ SUPABASE: Saved session to student_session_metrics:", sessionPayload);
        } catch (error) {
            console.warn("Supabase Sync fallback:", error.message);
        }

        return sessionPayload;
    };

    const closeWarningModal = () => setShowWarningModal(false);

    const handleNfcEvent = async (eventPayload) => {
        if (!isPhoneInCase) {
            setIsPhoneInCase(true);
            setIsTeacherActive(true);
        } else {
            if (window.confirm("End focus session and release NFC case?")) {
                setIsPhoneInCase(false);
                endClassAndSyncSupabase();
            }
        }
    };

    return (
        <FocusModeContext.Provider value={{
            isPhoneInCase,
            currentSession,
            isTeacherActive,
            setIsTeacherActive,
            teacherTimer,
            studentFocusTime,
            studentFocusScore,
            tabExitCount,
            isTabFocused,
            weeklyBonus,
            showWarningModal,
            closeWarningModal,
            activeLiveQuestion,
            submitLiveAnswer,
            triggerLiveQuestion,
            endClassAndSyncSupabase,
            handleNfcEvent,
            setIsPhoneInCase
        }}>
            {children}

            {/* ⚠️ VISUAL WARNING ALERT MODAL */}
            {showWarningModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-gray-950 border-2 border-red-500 p-6 md:p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.5)] font-mono">
                        <div className="w-16 h-16 bg-red-950/80 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold font-orbitron text-red-400 uppercase tracking-wide">
                            ¡Atención! Focus Lost
                        </h2>
                        <p className="text-sm text-red-200 leading-relaxed font-sans">
                            Has salido de la pantalla o minimizado la aplicación.
                        </p>
                        <div className="p-3 bg-red-950/60 border border-red-800 rounded-2xl text-xs font-bold text-red-300 font-orbitron">
                            📉 Penalización: -3 puntos de enfoque (-3 PS)
                        </div>
                        <button
                            onClick={closeWarningModal}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-orbitron font-extrabold text-xs rounded-xl shadow-lg uppercase tracking-wider transition cursor-pointer"
                        >
                            Entendido // Volver a Enfoque
                        </button>
                    </div>
                </div>
            )}
        </FocusModeContext.Provider>
    );
};

export const useFocusMode = () => useContext(FocusModeContext);
