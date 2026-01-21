import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare } from 'lucide-react';

const VideoHub = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [status, setStatus] = useState('waiting'); // waiting, connected

    return (
        <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-slate-800 shadow-2xl relative group">

            {/* Main Video Area */}
            <div className="flex-1 relative bg-slate-950 flex items-center justify-center">
                {status === 'waiting' ? (
                    <div className="text-center p-8 animate-pulse">
                        <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Users className="text-slate-500" size={40} />
                        </div>
                        <h3 className="text-slate-300 font-medium text-lg">Esperando a tu Tutor...</h3>
                        <p className="text-slate-500 text-sm mt-2">Tu sesión está programada para comenzar en breve.</p>
                        <button
                            onClick={() => setStatus('connected')}
                            className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors"
                        >
                            [DEV] Simular Conexión
                        </button>
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        {/* Remote Stream (Tutor) */}
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                            alt="Tutor"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                            <span className="text-white text-sm font-medium">Prof. Laura Mendes</span>
                        </div>

                        {/* Local Stream (Student) */}
                        <div className="absolute top-4 right-4 w-32 h-24 bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 shadow-lg">
                            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                                <span className="text-xs text-slate-400">Tú</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Control Bar */}
            <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 px-6 z-10">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3 rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>

                <button className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg shadow-red-600/20 transition-all mx-2">
                    <PhoneOff size={24} />
                </button>

                <button className="p-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-full hidden sm:flex">
                    <MessageSquare size={20} />
                </button>
            </div>

            {/* Connection Status Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
                <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                <span className="text-xs font-medium text-slate-300">
                    {status === 'connected' ? 'En vivo • 00:00' : 'Conectando...'}
                </span>
            </div>
        </div>
    );
};

export default VideoHub;
