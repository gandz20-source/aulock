import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { Loader, Users, MessageCircle, Send, AlertTriangle, Trophy } from 'lucide-react';

const Squads = () => {
    const { profile } = useAuth();
    const [squad, setSquad] = useState(null);
    const [teammates, setTeammates] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (profile?.id) fetchSquadData();
    }, [profile]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchSquadData = async () => {
        try {
            // 1. Get Membership
            const { data: membership } = await supabase
                .from('squad_members')
                .select('squad_id')
                .eq('student_id', profile.id)
                .single();

            if (!membership) {
                setLoading(false);
                return;
            }

            // 2. Get Squad Info
            const { data: squadData } = await supabase
                .from('squads')
                .select('*')
                .eq('id', membership.squad_id)
                .single();
            setSquad(squadData);

            // 3. Get Teammates
            const { data: members } = await supabase
                .from('squad_members')
                .select('*, profiles(full_name, avatar_url, au_coins)')
                .eq('squad_id', membership.squad_id);
            setTeammates(members);

            // 4. Get Chat
            const { data: chat } = await supabase
                .from('squad_messages')
                .select('*, profiles(full_name)')
                .eq('squad_id', membership.squad_id)
                .order('created_at', { ascending: true });
            setMessages(chat || []);

            // Subscribe to Chat
            const channel = supabase
                .channel(`squad_chat:${membership.squad_id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'squad_messages', filter: `squad_id=eq.${membership.squad_id}` },
                    () => fetchMessages(membership.squad_id))
                .subscribe();

            return () => supabase.removeChannel(channel);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (squadId) => {
        const { data } = await supabase
            .from('squad_messages')
            .select('*, profiles(full_name)')
            .eq('squad_id', squadId)
            .order('created_at', { ascending: true });
        if (data) setMessages(data);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !squad) return;

        await supabase.from('squad_messages').insert({
            squad_id: squad.id,
            sender_id: profile.id,
            content: newMessage.trim()
        });
        setNewMessage('');
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader className="animate-spin text-purple-600" /></div>;

    if (!squad) return (
        <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
            <Users className="w-16 h-16 text-slate-300 mb-4" />
            <h1 className="text-xl font-bold text-slate-700">Sin Squad Asignado</h1>
            <p className="text-slate-500 max-w-sm mt-2">Tu profesor aún no te ha asignado a un equipo de trabajo. ¡Ten paciencia!</p>
        </div>
    );

    const totalCoins = teammates.reduce((sum, m) => sum + (m.profiles?.au_coins || 0), 0);
    const progress = Math.min(100, (totalCoins / 1000) * 100);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 md:pb-6 font-sans">
            <div className="max-w-5xl mx-auto p-4 md:p-8">

                {/* Header Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 mb-8 border border-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <span className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 shadow-md shadow-purple-200">
                                {squad.subject || 'Squad Alpha'}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{squad.name}</h1>
                            <p className="text-slate-500 font-medium">Misión Semanal en curso</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-2xl border border-yellow-100 shadow-sm transform rotate-3">
                            <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-sm" />
                        </div>
                    </div>

                    {/* Progress Bar Premium */}
                    <div className="mt-8">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-3xl font-black text-slate-800">{Math.round(progress)}%</span>
                                <span className="text-sm text-slate-400 font-medium ml-2">Completado</span>
                            </div>
                            <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                {totalCoins} / 1000 AC
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-5 p-1 shadow-inner">
                            <div
                                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-full rounded-full transition-all duration-1000 shadow-lg shadow-purple-500/30 relative"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-full bg-white opacity-20 animate-pulse rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Members & Actions */}
                    <div className="space-y-6">
                        {/* Members Card */}
                        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6">
                            <h2 className="font-bold text-slate-700 flex items-center mb-6 text-lg">
                                <Users className="w-5 h-5 mr-3 text-purple-600" />
                                Miembros del Squad
                            </h2>
                            <div className="space-y-4">
                                {teammates.map(member => (
                                    <div key={member.id} className="group flex items-center p-3 rounded-2xl transition-all hover:bg-slate-50 hover:shadow-md border border-transparent hover:border-slate-100">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md mr-4 transform group-hover:scale-105 transition-transform ${member.id === profile.id
                                                ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                                                : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {member.profiles?.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm ${member.id === profile.id ? 'text-purple-700' : 'text-slate-700'}`}>
                                                {member.profiles?.full_name} {member.id === profile.id && '(Tú)'}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                                                {member.role || 'Estudiante'}
                                            </p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                                {member.profiles?.au_coins || 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SOS Button */}
                        <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 p-6 rounded-3xl border-2 border-red-100 border-dashed flex items-center justify-center group transition-all hover:shadow-lg hover:border-red-300">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
                                <AlertTriangle className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-lg">Pedir Ayuda (S.O.S)</h3>
                                <p className="text-xs text-red-400 font-medium">Notificar al equipo</p>
                            </div>
                        </button>
                    </div>

                    {/* Right Column: Chat */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-[600px] overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mr-4">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-800">Chat de Equipo</h2>
                                    <p className="text-xs text-slate-400 flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                        En línea
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {messages.length === 0 && (
                                <div className="text-center py-10 opacity-50">
                                    <p className="text-slate-400">Comienza la conversación con tu equipo</p>
                                </div>
                            )}
                            {messages.map(msg => {
                                const isMe = msg.sender_id === profile.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                            <div className={`px-5 py-3 text-sm shadow-sm ${isMe
                                                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-none'
                                                    : 'bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-none'
                                                }`}>
                                                <p className="leading-relaxed">{msg.content}</p>
                                            </div>
                                            {!isMe && <p className="text-[10px] font-bold text-slate-400 mt-1 ml-1">{msg.profiles?.full_name}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="w-full bg-slate-100 border-none rounded-2xl px-6 py-4 pr-16 text-sm focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all outline-none placeholder-slate-400 font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="absolute right-2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-all shadow-md hover:shadow-lg transform active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Squads;
