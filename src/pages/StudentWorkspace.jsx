import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLiveClassroom } from '../context/LiveClassroomContext';
import TriviaCard from '../components/TriviaCard';
import FocusMode from '../components/FocusMode';
import { Loader, MessageCircle, Send, AlertTriangle, Ghost, Sparkles } from 'lucide-react';
import { supabase } from '../config/supabase';

const StudentWorkspace = () => {
    const { profile } = useAuth();
    const {
        activeSession,
        currentQuestion,
        sessionStatus,
        submitAnswer,
        feedback
    } = useLiveClassroom();

    // Only 'classroom' and 'squad' tabs relevant for workspace
    const [activeTab, setActiveTab] = useState('classroom');

    // Squad State
    const [squad, setSquad] = useState(null);
    const [teammates, setTeammates] = useState([]);
    const [squadMessages, setSquadMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingSquad, setLoadingSquad] = useState(false);
    const chatEndRef = useRef(null);
    const [showFocusMode, setShowFocusMode] = useState(false);

    // Fetch Squad Data
    useEffect(() => {
        if (activeTab === 'squad' && profile?.id) {
            fetchSquadData();
        }
    }, [activeTab, profile]);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [squadMessages]);

    const fetchSquadData = async () => {
        setLoadingSquad(true);
        try {
            const { data: membership } = await supabase
                .from('squad_members')
                .select('squad_id, role')
                .eq('student_id', profile.id)
                .single();

            if (!membership) {
                setSquad(null);
                setLoadingSquad(false);
                return;
            }

            const { data: squadData } = await supabase
                .from('squads')
                .select('*')
                .eq('id', membership.squad_id)
                .single();
            setSquad(squadData);

            const { data: members } = await supabase
                .from('squad_members')
                .select('*, profiles(id, full_name, avatar_url, au_coins)')
                .eq('squad_id', membership.squad_id);
            setTeammates(members);

            const { data: messages } = await supabase
                .from('squad_messages')
                .select('*, profiles(full_name)')
                .eq('squad_id', membership.squad_id)
                .order('created_at', { ascending: true });
            setSquadMessages(messages || []);

            const channel = supabase
                .channel(`squad_chat:${membership.squad_id}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'squad_messages',
                    filter: `squad_id=eq.${membership.squad_id}`
                }, (payload) => {
                    fetchMessages(membership.squad_id);
                })
                .subscribe();

            return () => supabase.removeChannel(channel);

        } catch (error) {
            console.error("Error fetching squad:", error);
        } finally {
            setLoadingSquad(false);
        }
    };

    const fetchMessages = async (squadId) => {
        const { data } = await supabase
            .from('squad_messages')
            .select('*, profiles(full_name)')
            .eq('squad_id', squadId)
            .order('created_at', { ascending: true });
        if (data) setSquadMessages(data);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !squad) return;

        try {
            await supabase.from('squad_messages').insert({
                squad_id: squad.id,
                sender_id: profile.id,
                content: newMessage.trim()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleSOS = async () => {
        if (!squad || !confirm("¿Enviar alerta de ayuda a tu equipo?")) return;
        try {
            const otherMembers = teammates.filter(m => m.student_id !== profile.id);
            const notifications = otherMembers.map(m => ({
                recipient_id: m.student_id,
                sender_id: profile.id,
                type: 'sos',
                content: `🆘 ${profile.full_name} necesita ayuda.`
            }));
            await supabase.from('notifications').insert(notifications);
            await supabase.from('alerts').insert({
                student_id: profile.id,
                type: 'SOS',
                content: `🆘 ${profile.full_name} necesita ayuda urgente.`,
                status: 'unread'
            });
            alert("¡Alerta SOS enviada!");
        } catch (error) {
            alert("Error al enviar SOS");
        }
    };

    return (
        <div className="h-full flex flex-col p-6">
            {/* Header with Greeting & Mode Switcher */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-light text-white">
                        Hola, <span className="font-bold text-indigo-400">{profile?.full_name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-400 text-sm">¿En qué nos enfocaremos hoy?</p>
                </div>

                <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('classroom')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'classroom' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Tutoría IA
                    </button>
                    <button
                        onClick={() => setActiveTab('squad')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'squad' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Mi Squad
                    </button>
                </div>
            </div>

            {/* Main Workspace Area */}
            <div className="flex-1 bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl backdrop-blur-sm">

                {activeTab === 'classroom' && (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-indigo-900/10 to-purple-900/10">
                        {/* Live Session Check */}
                        {sessionStatus === 'active' && currentQuestion ? (
                            <div className="w-full max-w-2xl">
                                <div className="flex items-center justify-center gap-2 mb-6 text-emerald-400 bg-emerald-900/20 px-4 py-1 rounded-full w-fit mx-auto border border-emerald-500/30 animate-pulse">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                    <span className="text-xs font-bold uppercase tracking-wider">Pregunta en Vivo</span>
                                </div>
                                <TriviaCard
                                    question={currentQuestion}
                                    onAnswer={submitAnswer}
                                    feedback={feedback}
                                />
                            </div>
                        ) : (
                            /* Empty State - Encouraging Agent Interaction */
                            <div className="max-w-md">
                                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 animate-float">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-3">Tus Tutores están Listos</h2>
                                <p className="text-slate-400 leading-relaxed mb-8">
                                    Selecciona un agente en el menú lateral para comenzar una sesión de estudio personalizada.
                                    <br /><span className="text-xs text-slate-500 mt-2 block">(Ada, Profe Mate, y CivicMind están online)</span>
                                </p>

                                <div className="flex justify-center gap-4 opacity-50 pointer-events-none">
                                    <div className="h-2 w-16 bg-slate-700 rounded-full"></div>
                                    <div className="h-2 w-16 bg-slate-700 rounded-full"></div>
                                    <div className="h-2 w-16 bg-slate-700 rounded-full"></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'squad' && (
                    <div className="h-full flex flex-col">
                        {loadingSquad ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
                            </div>
                        ) : !squad ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                                <Ghost className="w-12 h-12 mb-4 opacity-50" />
                                <p>No tienes Squad asignado.</p>
                            </div>
                        ) : (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-white/5 bg-slate-800/30 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white flex items-center gap-2">
                                            {squad.name}
                                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Lvl. 1</span>
                                        </h3>
                                    </div>
                                    <button onClick={handleSOS} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Pedir Ayuda SOS">
                                        <AlertTriangle size={18} />
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                    {squadMessages.map(msg => {
                                        const isMe = msg.sender_id === profile.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-700 text-slate-200 rounded-tl-sm'
                                                    }`}>
                                                    {!isMe && <p className="text-[10px] font-bold text-indigo-300 mb-1">{msg.profiles?.full_name?.split(' ')[0]}</p>}
                                                    <p>{msg.content}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/30 border-t border-white/5 flex gap-2">
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Escribe a tu equipo..."
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-colors"
                                    />
                                    <button type="submit" disabled={!newMessage.trim()} className="p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors">
                                        <Send size={18} />
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                )}

            </div>

            <FocusMode isOpen={showFocusMode} onClose={() => setShowFocusMode(false)} />
        </div>
    );
};

export default StudentWorkspace;
