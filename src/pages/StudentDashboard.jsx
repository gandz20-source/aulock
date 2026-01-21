import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLiveClassroom } from '../context/LiveClassroomContext';
import TriviaCard from '../components/TriviaCard';
import FocusMode from '../components/FocusMode';
import { Loader, Coins, Bot, ShoppingBag, Users, MessageCircle, Send, AlertTriangle, BookOpen, AlertCircle, ChevronRight, Trophy, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { academicService } from '../services/academicService';
import { supabase } from '../config/supabase';

const StudentDashboard = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const {
        activeSession,
        currentQuestion,
        sessionStatus,
        submitAnswer,
        feedback
    } = useLiveClassroom();

    const [activeTab, setActiveTab] = useState('classroom'); // 'classroom', 'squad'
    const [squad, setSquad] = useState(null);
    const [teammates, setTeammates] = useState([]);
    const [squadMessages, setSquadMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingSquad, setLoadingSquad] = useState(false);
    const chatEndRef = useRef(null);
    const [showFocusMode, setShowFocusMode] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Fetch Subjects on Mount
    useEffect(() => {
        if (profile?.id) {
            loadSubjects();
        }
    }, [profile]);

    const loadSubjects = async () => {
        setLoadingSubjects(true);
        const { data } = await academicService.getMySubjects();
        if (data) setSubjects(data);
        setLoadingSubjects(false);
    };

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
            // 1. Get my squad ID
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

            // 2. Get Squad Details
            const { data: squadData } = await supabase
                .from('squads')
                .select('*')
                .eq('id', membership.squad_id)
                .single();
            setSquad(squadData);

            // 3. Get Teammates
            const { data: members } = await supabase
                .from('squad_members')
                .select('*, profiles(id, full_name, avatar_url, au_coins)')
                .eq('squad_id', membership.squad_id);
            setTeammates(members);

            // 4. Get Messages
            const { data: messages } = await supabase
                .from('squad_messages')
                .select('*, profiles(full_name)')
                .eq('squad_id', membership.squad_id)
                .order('created_at', { ascending: true });
            setSquadMessages(messages || []);

            // 5. Subscribe to Chat
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
                content: `🆘 ${profile.full_name} necesita ayuda con una pregunta.`
            }));

            await supabase.from('notifications').insert(notifications);

            // ALSO ALERT THE TEACHER (Guardian System)
            await supabase.from('alerts').insert({
                student_id: profile.id,
                type: 'SOS',
                content: `🆘 ${profile.full_name} necesita ayuda urgente en su equipo.`,
                status: 'unread'
            });

            alert("¡Alerta SOS enviada a tu equipo y al profesor!");
        } catch (error) {
            console.error("Error sending SOS:", error);
            alert("Error al enviar SOS");
        }
    };

    // Calculate Progress
    const totalCoins = teammates.reduce((sum, m) => sum + (m.profiles?.au_coins || 0), 0);
    const weeklyGoal = 1000;
    const progressPercent = Math.min(100, (totalCoins / weeklyGoal) * 100);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* 🌟 New Modern Header */}
            <div className="bg-slate-900 text-white pt-8 pb-16 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                {/* Decoration Orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-[80px] opacity-20 -ml-16 -mb-16 pointer-events-none"></div>

                <div className="max-w-md mx-auto relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xl font-bold border-2 border-white/20 shadow-lg">
                                {profile?.full_name?.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold leading-tight">Hola, {profile?.full_name?.split(' ')[0]}</h1>
                                <div className="flex items-center text-indigo-200 text-xs font-medium bg-indigo-500/10 px-2 py-0.5 rounded-full w-fit mt-1 border border-indigo-500/20">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    Alumno Activo
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center shadow-lg transition-transform active:scale-95">
                                <Coins className="w-5 h-5 text-yellow-400 mr-2 drop-shadow-md" />
                                <span className="font-black text-lg text-yellow-50">{profile?.au_coins || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* 🌟 Modern Segmented Tabs */}
                    <div className="bg-slate-800/50 backdrop-blur-sm p-1.5 rounded-2xl flex relative border border-white/5">
                        <button
                            onClick={() => setActiveTab('classroom')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'classroom'
                                ? 'bg-white text-slate-900 shadow-md'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Clase
                        </button>
                        <button
                            onClick={() => setActiveTab('squad')}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'squad'
                                ? 'bg-white text-slate-900 shadow-md'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Squad
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Overlapping the Header slightly */}
            <div className="max-w-md mx-auto px-4 -mt-8 relative z-20 pb-20">
                {activeTab === 'classroom' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                        {/* 📚 Active Session / Trivia Card */}
                        {sessionStatus === 'active' && currentQuestion ? (
                            <div className="transform transition-all">
                                <TriviaCard
                                    question={currentQuestion}
                                    onAnswer={submitAnswer}
                                    feedback={feedback}
                                />
                            </div>
                        ) : (
                            /* Waiting Room Modernized */
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 text-center border border-slate-100 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 animate-gradient-x"></div>

                                <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-4 relative group-hover:scale-110 transition-transform duration-500">
                                    <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-30"></div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-800 mb-2">Sala de Espera</h2>
                                <p className="text-slate-500 text-sm leading-relaxed px-4">
                                    Mantente atento. La próxima pregunta aparecerá aquí automáticamente.
                                </p>
                            </div>
                        )}

                        {/* 📚 Subjects Grid */}
                        <div>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                                    <Zap className="w-5 h-5 mr-2 text-indigo-500 fill-current" />
                                    Mis Asignaturas
                                </h2>
                            </div>

                            {loadingSubjects ? (
                                <div className="flex justify-center p-8">
                                    <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
                                </div>
                            ) : subjects.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {subjects.map(subject => (
                                        <button
                                            key={subject.id}
                                            onClick={() => navigate(`/subject/${subject.id}`)}
                                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-lg hover:border-indigo-100 hover:scale-[1.02] transition-all duration-300 group aspect-square relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                                                <BookOpen className="w-6 h-6 transition-transform group-hover:scale-110" />
                                            </div>
                                            <h3 className="font-bold text-slate-700 text-sm text-center leading-tight group-hover:text-indigo-700">{subject.name}</h3>
                                        </button>
                                    ))}

                                    {/* Feature Buttons */}
                                    <button
                                        onClick={() => navigate('/ai-campus')}
                                        className="bg-gradient-to-br from-violet-500 to-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-200 flex flex-col items-center justify-center hover:scale-[1.02] transition-all group relative overflow-hidden aspect-square"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <Bot className="w-8 h-8 text-white mb-2 drop-shadow-md" />
                                        <span className="text-xs font-bold text-white tracking-wide">AI Campus</span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/store')}
                                        className="bg-gradient-to-br from-emerald-400 to-teal-500 p-5 rounded-2xl shadow-lg shadow-teal-200 flex flex-col items-center justify-center hover:scale-[1.02] transition-all group relative overflow-hidden aspect-square"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <ShoppingBag className="w-8 h-8 text-white mb-2 drop-shadow-md" />
                                        <span className="text-xs font-bold text-white tracking-wide">Tienda</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                    <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                    <h3 className="font-bold text-slate-600">Sin Asignaturas</h3>
                                    <p className="text-sm text-slate-400">No estás matriculado aún.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* 🛡️ SQUAD VIEW MODERNIZED */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        {loadingSquad ? (
                            <div className="text-center py-20"><Loader className="w-10 h-10 animate-spin mx-auto text-indigo-500" /></div>
                        ) : !squad ? (
                            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="font-bold text-slate-800 text-lg">Sin Squad</h3>
                                <p className="text-slate-500 mt-2">Aún no tienes un equipo asignado.</p>
                            </div>
                        ) : (
                            <>
                                {/* Squad Card */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div>
                                                <h2 className="text-2xl font-black tracking-tight">{squad.name}</h2>
                                                <span className="text-purple-200 text-sm font-medium flex items-center mt-1">
                                                    <BookOpen className="w-4 h-4 mr-1" /> {squad.subject}
                                                </span>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                                <Trophy className="w-5 h-5 text-yellow-300" />
                                            </div>
                                        </div>

                                        <div className="space-y-2 relative z-10">
                                            <div className="flex justify-between text-xs font-bold text-purple-100">
                                                <span>Progreso Semanal</span>
                                                <span>{Math.round(progressPercent)}%</span>
                                            </div>
                                            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-purple-200 opacity-80">
                                                <span>{totalCoins} AC</span>
                                                <span>Meta: {weeklyGoal} AC</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Teammates Grid */}
                                    <div className="p-6 bg-slate-50/50">
                                        <h3 className="text-sm font-bold text-slate-600 mb-3 px-1">Miembros del Equipo</h3>
                                        <div className="grid grid-cols-4 gap-3">
                                            {teammates.map(member => (
                                                <div key={member.id} className="bg-white p-3 rounded-2xl border border-slate-100 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full mb-2 flex items-center justify-center text-sm font-bold text-white shadow-md ${member.role === 'mentor' ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                                                        member.role === 'apprentice' ? 'bg-gradient-to-br from-red-400 to-pink-600' : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                                        }`}>
                                                        {member.profiles?.full_name?.charAt(0)}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-700 truncate w-full">{member.profiles?.full_name?.split(' ')[0]}</p>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full mt-1 font-medium ${member.role === 'mentor' ? 'bg-green-100 text-green-700' :
                                                        member.role === 'apprentice' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {member.role === 'mentor' ? 'Líder' : member.role === 'apprentice' ? 'Aprendiz' : 'Miembro'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* SOS Button */}
                                <button
                                    onClick={handleSOS}
                                    className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl border border-red-200 flex items-center justify-center transition-all active:scale-95 shadow-sm group"
                                >
                                    <div className="bg-red-200/50 p-2 rounded-full mr-3 group-hover:bg-red-200 transition-colors">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    PEDIR AYUDA (S.O.S)
                                </button>

                                {/* Modernized Chat */}
                                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col h-[400px]">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex items-center sticky top-0 z-10">
                                        <MessageCircle className="w-5 h-5 text-indigo-500 mr-2" />
                                        <h3 className="font-bold text-slate-700 text-sm">Chat de Equipo</h3>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                                        {squadMessages.map(msg => {
                                            const isMe = msg.sender_id === profile.id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${isMe
                                                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                                                        }`}>
                                                        {!isMe && <p className="text-[10px] font-bold text-indigo-500 mb-1">{msg.profiles?.full_name?.split(' ')[0]}</p>}
                                                        <p className="leading-relaxed">{msg.content}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={chatEndRef} />
                                    </div>

                                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Escribe un mensaje..."
                                            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="p-3 bg-indigo-600 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* 🔒 FOCUS MODE FAB */}
            <button
                onClick={() => setShowFocusMode(true)}
                className="fixed bottom-24 right-4 bg-slate-900 text-white p-4 rounded-full shadow-2xl shadow-slate-900/50 hover:bg-slate-800 transition-all active:scale-95 z-40 border-2 border-slate-700"
            >
                <Lock className="w-6 h-6" />
            </button>

            {/* Focus Mode Overlay */}
            <FocusMode isOpen={showFocusMode} onClose={() => setShowFocusMode(false)} />
        </div>
    );
};

export default StudentDashboard;
