import { useState, useEffect, useRef } from 'react';
import { Clock, Send, ThumbsUp, AlertCircle, Play } from 'lucide-react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const DebateArena = () => {
    const { profile } = useAuth();
    const [topic, setTopic] = useState("Esperando debate...");
    const [debateId, setDebateId] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [argumentsList, setArgumentsList] = useState([]);
    const [newArg, setNewArg] = useState('');
    const [myTeam, setMyTeam] = useState('against'); // 'for' or 'against'
    const [loading, setLoading] = useState(true);
    const argsEndRef = useRef(null);

    // Scroll to bottom of chat
    const scrollToBottom = () => {
        argsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (argumentsList.length > 0) {
            // scrollToBottom(); // Optional: Auto-scroll
        }
    }, [argumentsList]);

    useEffect(() => {
        fetchActiveDebate();

        // Subscribe to new arguments
        const argsSubscription = supabase
            .channel('public:debate_arguments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'debate_arguments' }, async (payload) => {
                // Fetch the full argument with profile name to display immediately
                const { data } = await supabase
                    .from('debate_arguments')
                    .select('*, profiles(full_name)')
                    .eq('id', payload.new.id)
                    .single();

                if (data) {
                    setArgumentsList(prev => {
                        // Prevent duplicates just in case
                        if (prev.some(arg => arg.id === data.id)) return prev;
                        return [...prev, data];
                    });
                }
            })
            .subscribe();

        // Subscribe to Debate Status/Timer changes
        const debateSubscription = supabase
            .channel('public:debates')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'debates' }, (payload) => {
                if (payload.new.status === 'active') {
                    setDebateId(payload.new.id);
                    setTopic(payload.new.topic);
                    // Only update timer if it was a timer update or new debate
                    // Ideally we sync time with server, but for now trusting the update
                } else if (payload.new.status === 'finished') {
                    setDebateId(null);
                    setTopic("El debate ha finalizado.");
                    setTimeLeft(0);
                }
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'debates' }, (payload) => {
                if (payload.new.status === 'active') {
                    setDebateId(payload.new.id);
                    setTopic(payload.new.topic);
                    setTimeLeft(payload.new.timer_seconds);
                    setArgumentsList([]); // Clear old args for new debate
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(argsSubscription);
            supabase.removeChannel(debateSubscription);
        };
    }, []);

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const fetchActiveDebate = async () => {
        try {
            // Get the most recent active debate
            const { data: debate } = await supabase
                .from('debates')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (debate) {
                setDebateId(debate.id);
                setTopic(debate.topic);
                setTimeLeft(debate.timer_seconds); // This might reset timer on refresh, ideal is calc difference from started_at
                fetchArguments(debate.id);
            } else {
                setTopic("Esperando inicio del debate...");
            }
        } catch (error) {
            console.error("Error fetching debate:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArguments = async (currentDebateId) => {
        const { data } = await supabase
            .from('debate_arguments')
            .select('*, profiles(full_name)')
            .eq('debate_id', currentDebateId)
            .order('created_at', { ascending: true });

        if (data) setArgumentsList(data);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!newArg.trim() || !debateId) return;

        try {
            await supabase.from('debate_arguments').insert({
                debate_id: debateId,
                user_id: profile.id,
                team: myTeam,
                content: newArg
            });
            setNewArg('');
        } catch (error) {
            console.error("Error posting argument:", error);
            alert("Error al enviar argumento");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold animate-pulse">Conectando a la Arena...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto h-full flex flex-col">

                {/* Header */}
                <div className="text-center mb-6 shrink-0">
                    {debateId ? (
                        <div className="inline-flex items-center px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-bold uppercase tracking-widest rounded-full mb-3 animate-pulse">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span> En Vivo
                        </div>
                    ) : (
                        <div className="inline-flex items-center px-3 py-1 bg-slate-700 text-slate-400 border border-slate-600 text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                            <span className="w-2 h-2 bg-slate-500 rounded-full mr-2"></span> Pausado
                        </div>
                    )}
                    <h1 className="text-3xl md:text-5xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 tracking-tight">
                        DEBATE ARENA
                    </h1>
                    <h2 className="text-xl md:text-2xl text-slate-200 font-bold max-w-4xl mx-auto leading-tight">"{topic}"</h2>
                </div>

                {/* Timer Bar */}
                {debateId && (
                    <div className="bg-slate-800/50 rounded-full h-10 mb-6 flex items-center justify-center relative overflow-hidden border border-slate-700 max-w-xl mx-auto shadow-lg shadow-black/20 shrink-0 w-full">
                        <div className="absolute top-0 bottom-0 left-0 bg-blue-500/10 transition-all duration-1000" style={{ width: `${(timeLeft / 300) * 100}%` }}></div>
                        <div className={`relative z-10 font-mono text-xl font-bold flex items-center ${timeLeft < 60 ? 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]' : 'text-blue-300'}`}>
                            <Clock className="w-5 h-5 mr-3" />
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                )}

                {!debateId ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-12 bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-700 text-center max-w-2xl mx-auto mt-8">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <AlertCircle className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-300 mb-2">Arena en Espera</h3>
                        <p className="text-slate-400 max-w-md">El profesor aún no ha iniciado un tema de debate. Prepárate para elegir tu bando.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-20 flex-1 min-h-0">

                        {/* Team FOR */}
                        <div className="bg-gradient-to-b from-blue-900/20 to-slate-900/50 border border-blue-500/20 rounded-3xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                            <div className="p-4 bg-blue-900/10 border-b border-blue-500/10 flex items-center justify-center shrink-0">
                                <h3 className="text-blue-400 font-black text-xl tracking-wider flex items-center">
                                    <ThumbsUp className="w-5 h-5 mr-2" /> A FAVOR
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {argumentsList.filter(a => a.team === 'for').length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                        <p className="italic">Sé el primero en argumentar a favor...</p>
                                    </div>
                                )}
                                {argumentsList.filter(a => a.team === 'for').map(arg => (
                                    <div key={arg.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 shadow-md backdrop-blur-sm animate-fade-in hover:border-blue-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs font-bold text-blue-300 uppercase tracking-wide">{arg.profiles?.full_name || 'Anónimo'}</p>
                                            <span className="text-[10px] text-slate-500 font-mono">{new Date(arg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-slate-200 text-sm leading-relaxed">{arg.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Team AGAINST */}
                        <div className="bg-gradient-to-b from-red-900/20 to-slate-900/50 border border-red-500/20 rounded-3xl flex flex-col overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <div className="p-4 bg-red-900/10 border-b border-red-500/10 flex items-center justify-center shrink-0">
                                <h3 className="text-red-400 font-black text-xl tracking-wider flex items-center">
                                    <ThumbsUp className="w-5 h-5 mr-2 rotate-180" /> EN CONTRA
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {argumentsList.filter(a => a.team === 'against').length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                        <p className="italic">Sé el primero en argumentar en contra...</p>
                                    </div>
                                )}
                                {argumentsList.filter(a => a.team === 'against').map(arg => (
                                    <div key={arg.id} className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 shadow-md backdrop-blur-sm animate-fade-in hover:border-red-500/30 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-xs font-bold text-red-300 uppercase tracking-wide">{arg.profiles?.full_name || 'Anónimo'}</p>
                                            <span className="text-[10px] text-slate-500 font-mono">{new Date(arg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-slate-200 text-sm leading-relaxed">{arg.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                {debateId && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/50 z-50">
                        <div className="max-w-4xl mx-auto flex gap-4 items-center">
                            <div className="flex flex-col shrink-0">
                                <span className="text-[10px] text-slate-400 mb-1 ml-1 uppercase font-bold tracking-widest">Tu Bando</span>
                                <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex">
                                    <button
                                        onClick={() => setMyTeam('for')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${myTeam === 'for' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        A Favor
                                    </button>
                                    <button
                                        onClick={() => setMyTeam('against')}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${myTeam === 'against' ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        En Contra
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handlePost} className="flex-1 flex gap-3 h-[52px] self-end pt-1">
                                <input
                                    type="text"
                                    value={newArg}
                                    onChange={e => setNewArg(e.target.value)}
                                    placeholder={`Argumenta ${myTeam === 'for' ? 'A FAVOR' : 'EN CONTRA'}...`}
                                    className={`flex-1 bg-slate-800 border-2 rounded-xl px-6 text-white text-sm focus:outline-none transition-all placeholder:text-slate-600 ${myTeam === 'for' ? 'focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' : 'focus:border-red-500 focus:ring-4 focus:ring-red-500/10'} border-slate-700`}
                                />
                                <button type="submit" className={`w-[52px] h-[52px] flex items-center justify-center rounded-xl transition-all transform hover:scale-105 active:scale-95 ${myTeam === 'for' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'}`}>
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebateArena;
