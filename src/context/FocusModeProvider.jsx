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

    // 1. Synchronized Focus Engine States
    const [isTeacherActive, setIsTeacherActive] = useState(true);
    const [teacherTimer, setTeacherTimer] = useState(0);
    const [studentFocusTime, setStudentFocusTime] = useState(0);
    const [studentFocusScore, setStudentFocusScore] = useState(100);
    const [tabExitCount, setTabExitCount] = useState(0);
    const [isTabFocused, setIsTabFocused] = useState(true);
    const [weeklyBonus, setWeeklyBonus] = useState(false);

    // 2. Live Question Synchronization State
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

    // Student Focus Timer & Page Visibility Audit (Loss of focus = -3 points)
    useEffect(() => {
        let focusInterval = null;

        if (isTeacherActive && isTabFocused) {
            focusInterval = setInterval(() => {
                setStudentFocusTime(prev => prev + 1);
            }, 1000);
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsTabFocused(false);
                setTabExitCount(prev => prev + 1);
                // Deduct 3 points when focus is lost
                setStudentFocusScore(prev => {
                    const newScore = Math.max(0, prev - 3);
                    if (newScore < 100) setWeeklyBonus(false);
                    return newScore;
                });
                console.warn("⚠️ FOCUS LOST: Student minimized/left tab. Deducted 3 points.");
            } else {
                setIsTabFocused(true);
                console.info("👁️ FOCUS RESTORED: Student returned to application.");
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            clearInterval(focusInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isTeacherActive, isTabFocused]);

    // Check Weekly Bonus Eligibility (Maintained 100 Points)
    useEffect(() => {
        if (studentFocusScore === 100 && tabExitCount === 0) {
            setWeeklyBonus(true);
        } else {
            setWeeklyBonus(false);
        }
    }, [studentFocusScore, tabExitCount]);

    // Handle Student Answer to Live Question (+2 Points Reward)
    const submitLiveAnswer = (selectedIndex) => {
        if (activeLiveQuestion && selectedIndex === activeLiveQuestion.correctIndex) {
            setStudentFocusScore(prev => Math.min(100, prev + 2));
            console.info("✅ CORRECT ANSWER: Added 2 points back to student score!");
            return { success: true, pointsAwarded: 2 };
        }
        return { success: false, pointsAwarded: 0 };
    };

    // Teacher Trigger for Live Question
    const triggerLiveQuestion = (questionObject) => {
        setActiveLiveQuestion(questionObject);
        console.info("🚀 TEACHER TRIGGERED LIVE QUESTION across student screens.");
    };

    // End Class & Sync Final Score to Supabase
    const endClassAndSyncSupabase = async () => {
        setIsTeacherActive(false);
        const focusEfficiencyRatio = teacherTimer > 0 ? (studentFocusTime / teacherTimer) * 100 : 100;
        const finalScore = Math.round((studentFocusScore * 0.7) + (focusEfficiencyRatio * 0.3));

        const syncPayload = {
            student_name: 'Juan Carlos Pérez',
            class_name: currentSession?.className || 'STEM Mathematics',
            teacher_timer_sec: teacherTimer,
            effective_focus_sec: studentFocusTime,
            tab_exits: tabExitCount,
            final_focus_score: finalScore,
            weekly_bonus: weeklyBonus,
            synced_at: new Date().toISOString()
        };

        try {
            if (supabase) {
                await supabase.from('student_focus_metrics').insert([syncPayload]);
            }
            console.info("☁️ SUPABASE SYNC COMPLETE:", syncPayload);
        } catch (error) {
            console.warn("Supabase Sync fallback:", error.message);
        }

        return syncPayload;
    };

    // NFC Event Handler
    const handleNfcEvent = async (eventPayload) => {
        const { tagId } = eventPayload;
        if (!isPhoneInCase) {
            setIsPhoneInCase(true);
            setIsTeacherActive(true);
        } else {
            if (window.confirm("End focus session and un-tap phone case?")) {
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
            activeLiveQuestion,
            submitLiveAnswer,
            triggerLiveQuestion,
            endClassAndSyncSupabase,
            handleNfcEvent,
            setIsPhoneInCase
        }}>
            {children}
        </FocusModeContext.Provider>
    );
};

export const useFocusMode = () => useContext(FocusModeContext);
