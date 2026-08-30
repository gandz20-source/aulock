import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../config/supabase';

const FocusModeContext = createContext();

export const FocusModeProvider = ({ children }) => {
    // 1. Session Persistence & Absolute Timestamps
    const [isPhoneInCase, setIsPhoneInCase] = useState(() => {
        return localStorage.getItem('aulock_phone_in_case') === 'true';
    });

    const [currentSession, setCurrentSession] = useState({
        sessionId: 'SESSION_LIVE_2026',
        className: 'Mathematics & STEM Specialization',
        teacherName: 'Prof. Carlos Rivas',
        startedAt: new Date().toLocaleTimeString()
    });

    const [isTeacherActive, setIsTeacherActive] = useState(() => {
        return localStorage.getItem('aulock_session_active') === 'true' || true;
    });

    // Persistent session start timestamp (Absolute Time in ms)
    const [sessionStartTime, setSessionStartTime] = useState(() => {
        const saved = localStorage.getItem('aulock_session_start_time');
        if (saved) {
            const parsed = parseInt(saved, 10);
            if (!isNaN(parsed) && parsed > 0) return parsed;
        }
        const now = Date.now();
        localStorage.setItem('aulock_session_start_time', String(now));
        return now;
    });

    // Dynamic Elapsed Times (Calculated from Absolute Timestamps)
    const [teacherTimer, setTeacherTimer] = useState(() => {
        const savedStart = parseInt(localStorage.getItem('aulock_session_start_time') || '0', 10);
        return savedStart > 0 ? Math.floor((Date.now() - savedStart) / 1000) : 0;
    });

    const [studentFocusTime, setStudentFocusTime] = useState(() => {
        const saved = localStorage.getItem('aulock_student_focus_time');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [studentFocusScore, setStudentFocusScore] = useState(() => {
        const saved = localStorage.getItem('aulock_student_focus_score');
        return saved ? parseInt(saved, 10) : 100;
    });

    const [tabExitCount, setTabExitCount] = useState(() => {
        const saved = localStorage.getItem('aulock_student_tab_exits');
        return saved ? parseInt(saved, 10) : 0;
    });

    const [isTabFocused, setIsTabFocused] = useState(true);
    const [weeklyBonus, setWeeklyBonus] = useState(true);
    const [showWarningModal, setShowWarningModal] = useState(false);

    // 2. Live Questions Synchronization
    const [activeLiveQuestion, setActiveLiveQuestion] = useState({
        id: 'Q_LIVE_1',
        title: 'Formative Question: Solve x² - 5x + 6 = 0',
        options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 1, x = 6', 'x = 0'],
        correctIndex: 0,
        active: true
    });

    // 3. Absolute Timestamp-Based Timer Engine (Ticks every second, always computes Date.now() - sessionStartTime)
    useEffect(() => {
        let interval = null;

        if (isTeacherActive && sessionStartTime > 0) {
            interval = setInterval(() => {
                const now = Date.now();
                const absoluteElapsed = Math.floor((now - sessionStartTime) / 1000);
                setTeacherTimer(absoluteElapsed);

                // Accumulate focus time if tab is currently focused
                if (!document.hidden && isTabFocused) {
                    setStudentFocusTime(prev => {
                        const updated = prev + 1;
                        localStorage.setItem('aulock_student_focus_time', String(updated));
                        return updated;
                    });
                }
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTeacherActive, sessionStartTime, isTabFocused]);

    // 4. Page Visibility API Audit (Decoupled from timer resets)
    useEffect(() => {
        const handleVisibilityChange = () => {
            const currentPath = (window.location.pathname || '').toLowerCase();
            // NEVER trigger out-of-focus warning on teacher or school admin routes
            if (currentPath.includes('teacher') || currentPath.includes('school') || currentPath.includes('core-intelligence') || currentPath.includes('admin')) {
                return;
            }

            if (document.visibilityState === 'hidden' || document.hidden) {
                // Tab exited or window minimized: ONLY apply penalty logic, NEVER reset or clear clock timestamps!
                setIsTabFocused(false);
                setTabExitCount(prev => {
                    const updated = prev + 1;
                    localStorage.setItem('aulock_student_tab_exits', String(updated));
                    return updated;
                });

                // Deduct 3 points immediately
                setStudentFocusScore(prev => {
                    const updatedScore = Math.max(0, prev - 3);
                    localStorage.setItem('aulock_student_focus_score', String(updatedScore));
                    if (updatedScore < 100) setWeeklyBonus(false);
                    return updatedScore;
                });

                // Trigger warning alert modal
                setShowWarningModal(true);
                console.warn("⚠️ ¡Atención! Salida de pestaña detectada. -3 puntos de enfoque. (El temporizador maestro continúa intacto).");
            } else {
                // Tab restored: Re-sync focus and compute exact current elapsed time immediately!
                setIsTabFocused(true);
                const currentElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
                setTeacherTimer(currentElapsed);
                console.info("👁️ Foco restaurado. Temporizador sincronizado con precisión:", currentElapsed, "segundos.");
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', () => {
            setIsTabFocused(true);
            setTeacherTimer(Math.floor((Date.now() - sessionStartTime) / 1000));
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [sessionStartTime]);

    // 5. Live Questions & Point Recovery (+2 points up to max 100)
    const submitLiveAnswer = (selectedIndex) => {
        if (activeLiveQuestion && selectedIndex === activeLiveQuestion.correctIndex) {
            setStudentFocusScore(prev => {
                const updated = Math.min(100, prev + 2);
                localStorage.setItem('aulock_student_focus_score', String(updated));
                return updated;
            });
            console.info("✅ Correct answer! +2 points added back to focus score.");
            return { success: true, pointsAwarded: 2 };
        }
        return { success: false, pointsAwarded: 0 };
    };

    const triggerLiveQuestion = (questionObject) => {
        setActiveLiveQuestion(questionObject);
    };

    // 6. Class Completion & Supabase Sync (`student_session_metrics`)
    const endClassAndSyncSupabase = async () => {
        setIsTeacherActive(false);
        localStorage.setItem('aulock_session_active', 'false');

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
                await supabase.from('student_session_metrics').insert([sessionPayload]);
            }
            console.info("☁️ SUPABASE: Saved session to student_session_metrics:", sessionPayload);
        } catch (error) {
            console.warn("Supabase Sync fallback:", error.message);
        }

        return sessionPayload;
    };

    const resetSessionTimer = () => {
        const now = Date.now();
        setSessionStartTime(now);
        setTeacherTimer(0);
        setStudentFocusTime(0);
        setStudentFocusScore(100);
        setTabExitCount(0);
        localStorage.setItem('aulock_session_start_time', String(now));
        localStorage.setItem('aulock_student_focus_time', '0');
        localStorage.setItem('aulock_student_focus_score', '100');
        localStorage.setItem('aulock_student_tab_exits', '0');
    };

    const closeWarningModal = () => setShowWarningModal(false);

    const handleNfcEvent = async (eventPayload) => {
        if (!isPhoneInCase) {
            setIsPhoneInCase(true);
            setIsTeacherActive(true);
            localStorage.setItem('aulock_phone_in_case', 'true');
            localStorage.setItem('aulock_session_active', 'true');
        } else {
            if (window.confirm("¿Deseas finalizar la sesión de enfoque y liberar el estuche NFC?")) {
                setIsPhoneInCase(false);
                localStorage.setItem('aulock_phone_in_case', 'false');
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
