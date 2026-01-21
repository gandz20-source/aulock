import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';

const LiveClassroomContext = createContext({});

export const useLiveClassroom = () => {
    const context = useContext(LiveClassroomContext);
    if (!context) {
        throw new Error('useLiveClassroom must be used within a LiveClassroomProvider');
    }
    return context;
};

export const LiveClassroomProvider = ({ children }) => {
    const { user, profile } = useAuth();
    const [activeSession, setActiveSession] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [sessionStatus, setSessionStatus] = useState('waiting'); // waiting, active, finished
    const [studentAnswer, setStudentAnswer] = useState(null);
    const [feedback, setFeedback] = useState(null); // correct, incorrect

    // Subscribe to active sessions (for students)
    useEffect(() => {
        if (!profile || profile.role !== 'alumno') return;

        // In a real app, we'd filter by the student's assigned teacher/class
        // For this demo, we'll listen to the most recent active session created by any teacher
        // or a specific session if we had a code.

        // Let's listen to ALL active_sessions changes for the demo
        const channel = supabase
            .channel('public:active_sessions')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'active_sessions',
                },
                (payload) => {
                    console.log('Realtime update:', payload);
                    handleSessionUpdate(payload.new);
                }
            )
            .subscribe();

        // Initial fetch
        fetchActiveSession();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile]);

    const fetchActiveSession = async () => {
        // Fetch the most recent active session
        const { data, error } = await supabase
            .from('active_sessions')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            handleSessionUpdate(data);
        }
    };

    const handleSessionUpdate = (session) => {
        if (!session) return;
        setActiveSession(session);
        setSessionStatus(session.status);
        setCurrentQuestion(session.current_question);

        // Reset student state if a new question is launched
        if (session.status === 'active' && session.current_question) {
            // Check if it's a new question ID or timestamp to reset
            setStudentAnswer(null);
            setFeedback(null);
        }
    };

    // TEACHER METHODS
    const createSession = async () => {
        if (profile.role !== 'profesor') return;

        const { data, error } = await supabase
            .from('active_sessions')
            .insert({
                teacher_id: user.id,
                status: 'waiting',
                current_question: null
            })
            .select()
            .single();

        if (data) setActiveSession(data);
        return { data, error };
    };

    const launchQuestion = async (questionData) => {
        if (!activeSession) await createSession();

        // Update the session with the new question and set status to active
        const { error } = await supabase
            .from('active_sessions')
            .update({
                status: 'active',
                current_question: {
                    ...questionData,
                    launched_at: new Date().toISOString()
                },
                updated_at: new Date().toISOString()
            })
            .eq('teacher_id', user.id); // Ensure we update our own session

        if (error) console.error('Error launching question:', error);
    };

    const endQuestion = async () => {
        const { error } = await supabase
            .from('active_sessions')
            .update({
                status: 'finished',
                updated_at: new Date().toISOString()
            })
            .eq('teacher_id', user.id);
    };

    // STUDENT METHODS
    const submitAnswer = async (answer) => {
        if (!activeSession || !currentQuestion) return;

        setStudentAnswer(answer);

        // Check correctness locally for immediate feedback (secure validation should be server-side in prod)
        const isCorrect = answer === currentQuestion.correct_answer;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        // Record answer in DB
        await supabase.from('student_answers').insert({
            session_id: activeSession.id,
            student_id: user.id,
            answer: answer,
            is_correct: isCorrect
        });

        // Award AuCoins if correct
        if (isCorrect) {
            // Optimistic update
            // In real app, use a Postgres function/trigger for security
            const { error } = await supabase.rpc('increment_au_coins', {
                user_id: user.id,
                amount: 10
            });

            if (error) {
                // Fallback if RPC doesn't exist yet (we'll need to create it)
                console.warn('RPC increment_au_coins failed, trying direct update');
                const { data: currentProfile } = await supabase
                    .from('profiles')
                    .select('au_coins')
                    .eq('id', user.id)
                    .single();

                if (currentProfile) {
                    await supabase
                        .from('profiles')
                        .update({ au_coins: (currentProfile.au_coins || 0) + 10 })
                        .eq('id', user.id);
                }
            }
        }
    };

    const value = {
        activeSession,
        currentQuestion,
        sessionStatus,
        studentAnswer,
        feedback,
        createSession,
        launchQuestion,
        endQuestion,
        submitAnswer
    };

    return <LiveClassroomContext.Provider value={value}>{children}</LiveClassroomContext.Provider>;
};
