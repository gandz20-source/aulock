```javascript
import React, { useState } from 'react';
import { 
    Activity, 
    Users, 
    Zap, 
    Mic, 
    BrainCircuit, 
    Play, 
    Clock, 
    AlertTriangle,
    BarChart3,
    Cast,
    Gamepad2,
    Sparkles
} from 'lucide-react';

const Card = ({ children, className = "", title, icon: Icon, span = "col-span-1" }) => (
    <div className={`bg - slate - 900 / 50 backdrop - blur - md border border - slate - 700 / 50 rounded - 3xl p - 6 ${ span } hover: border - blue - 500 / 30 transition - all duration - 300 group ${ className } `}>
        {title && (
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-800/80 text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/10 transition-colors">
                    <Icon strokeWidth={1.5} size={20} />
                </div>
                <h3 className="font-semibold text-slate-200 text-sm tracking-wide">{title}</h3>
            </div>
        )}
        {children}
    </div>
);

const TeacherCommand = ({ 
    onLaunchQuestion, 
    onToggleGames, 
    gamesEnabled = false,
    attentionLevel = 'high', // 'high', 'medium', 'low'
    teasistoActive = false
}) => {
    const [questionText, setQuestionText] = useState('');

    const handleLaunch = () => {
        const payload = {
            action: "launch_question",
            gemini_version: "v4",
            content: {
                text: questionText,
                timestamp: new Date().toISOString()
            }
        };
        console.log("🚀 [Gemini V4] Payload sent:", payload);
        if (onLaunchQuestion) onLaunchQuestion(payload);
        setQuestionText('');
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Centro de Mando</h1>
                    <p className="text-slate-400 text-sm">Panel de Control Docente v4.0 • Night Pro</p>
                </div>

                {/* 'After IA Gate' Control */}
                <div className="flex items-center bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
                    <span className="text-xs font-bold text-slate-400 px-3 mr-2">After IA Gate</span>
                    <button 
                        onClick={() => onToggleGames && onToggleGames(!gamesEnabled)}
                        className={`flex items - center gap - 2 px - 4 py - 2 rounded - xl text - sm font - bold transition - all ${
    gamesEnabled
        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
        : 'bg-slate-700/50 text-slate-500 border border-transparent'
} `}
                    >
                        <Gamepad2 size={16} />
                        {gamesEnabled ? 'Juegos ACTIVOS' : 'Juegos BLOQUEADOS'}
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
                
                {/* 1. Live Action (Large) */}
                <Card title="Aula en Vivo" icon={Zap} span="md:col-span-2 row-span-2" className="bg-gradient-to-br from-blue-900/20 to-slate-900/50">
                    <div className="h-full flex flex-col justify-between">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Pregunta Rápida</label>
                                <textarea 
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm resize-none focus:ring-2 focus:ring-blue-500/50 outline-none placeholder:text-slate-600"
                                    rows="3"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    placeholder="Escribe para lanzar a Gemini V4..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                             <button 
                                onClick={handleLaunch}
                                className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                             >
                                <Play size={18} /> Lanzar Ahora
                             </button>
                             <div className="flex items-center justify-center gap-2 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl font-mono">
                                <Clock size={18} /> 00:00
                             </div>
                        </div>
                    </div>
                </Card>

                {/* 2. Squad Health */}
                <Card title="Estado de Squads" icon={Users}>
                     <div className="flex flex-col items-center justify-center h-full pb-6">
                        <div className="text-4xl font-bold text-emerald-400 mb-1">98%</div>
                        <div className="text-xs text-slate-500 font-medium">Sincronía Promedio</div>
                        <div className="flex gap-1 mt-4">
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className={`h - 1.5 w - 6 rounded - full ${ i < 5 ? 'bg-emerald-500/50' : 'bg-slate-700' } `} />
                            ))}
                        </div>
                     </div>
                </Card>

                {/* 3. Attention Radar */}
                <Card title="Radar de Atención" icon={BrainCircuit}>
                    <div className="relative h-full flex items-center justify-center pb-6">
                         <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <div className={`w - 24 h - 24 border rounded - full animate - ping ${
    attentionLevel === 'high' ? 'border-blue-500' :
        attentionLevel === 'medium' ? 'border-yellow-500' : 'border-red-500'
} `} />
                         </div>
                         <div className="text-center z-10">
                             <div className={`text - 2xl font - bold ${
    attentionLevel === 'high' ? 'text-white' :
        attentionLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
} `}>
                                {attentionLevel === 'high' ? 'Alta' : attentionLevel === 'medium' ? 'Media' : 'Baja'}
                             </div>
                             <div className="text-xs text-blue-300 mt-1">
                                {attentionLevel === 'high' ? 'Zona de Flujo' : 'Interrupciones detectadas'}
                             </div>
                         </div>
                    </div>
                </Card>

                {/* 4. Debate Trigger */}
                <Card title="Modo Debate" icon={Mic} className="border-red-500/20 hover:border-red-500/40">
                    <div className="flex flex-col h-full justify-center">
                        <button className="w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all group-hover:scale-[1.02]">
                             <Mic size={20} /> Iniciar Debate
                        </button>
                    </div>
                </Card>

                {/* 5. Guardian AI Status + TEAsisto */}
                <Card title="Guardian AI" icon={AlertTriangle}>
                    <div className="flex items-center gap-3 mb-4">
                         <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                         <span className="text-sm text-slate-300">Monitoreo Activo</span>
                    </div>
                    
                    {/* TEAsisto Indicator */}
                    <div className={`p - 3 rounded - xl border transition - all ${
    teasistoActive
        ? 'bg-purple-500/10 border-purple-500/30'
        : 'bg-slate-800/50 border-slate-700/50 opacity-50'
} `}>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className={teasistoActive ? 'text-purple-400' : 'text-slate-500'} />
                            <span className={`text - xs font - bold ${ teasistoActive ? 'text-purple-300' : 'text-slate-500' } `}>
                                TEAsisto
                            </span>
                        </div>
                        <div className={`text - [10px] font - medium ${ teasistoActive ? 'text-purple-200' : 'text-slate-600' } `}>
                            {teasistoActive ? 'Adaptación de Aula: ACTIVA' : 'Sin adaptaciones requeridas'}
                        </div>
                    </div>
                </Card>

                {/* 6. System Stats */}
                <Card title="Métricas" icon={BarChart3} span="md:col-span-2">
                    <div className="grid grid-cols-3 gap-4 h-full items-end pb-2">
                         <div className="bg-slate-800/50 rounded-xl p-3">
                             <div className="text-xs text-slate-500 mb-1">Participación</div>
                             <div className="text-lg font-bold text-white">85%</div>
                         </div>
                         <div className="bg-slate-800/50 rounded-xl p-3">
                             <div className="text-xs text-slate-500 mb-1">Objetivos</div>
                             <div className="text-lg font-bold text-white">4/5</div>
                         </div>
                         <div className="bg-slate-800/50 rounded-xl p-3">
                             <div className="text-xs text-slate-500 mb-1">AuCoins</div>
                             <div className="text-lg font-bold text-yellow-400">1.2k</div>
                         </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TeacherCommand;
