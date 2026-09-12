import React, { useState, useEffect, useMemo } from 'react';
import { 
    Radio, Sparkles, HeartHandshake, Eye, PhoneOff, 
    RefreshCw, ChevronDown, ChevronUp, ShieldCheck, Zap
} from 'lucide-react';

const LORE_TIPS_DATASET = [
    {
        id: 'tip-1',
        category: 'CONEXIÓN HUMANA',
        icon: HeartHandshake,
        badgeColor: 'emerald',
        text: 'Transmisión entrante: La IA calcula, pero tu escuadrón siente. Reúnete con ellos en el recreo.',
        reflection: 'Los algoritmos procesan patrones numéricos, pero el andamiaje afectivo, la risa compartida y la empatía son facultades irreemplazables de nuestra humanidad.'
    },
    {
        id: 'tip-2',
        category: 'DESCANSO VISUAL',
        icon: Eye,
        badgeColor: 'cyan',
        text: 'Tus ojos necesitan descansar del neón. Habla con el compañero a tu lado hoy.',
        reflection: 'La fatiga de luz azul reduce la capacidad de atención profunda. Mirar a los ojos a tus pares y enfocar al horizonte restaura tu equilibrio cognitivo.'
    },
    {
        id: 'tip-3',
        category: 'DESCONEXIÓN DIGITAL',
        icon: PhoneOff,
        badgeColor: 'amber',
        text: 'La verdadera inteligencia humana nace en la comunidad. Mantén tu teléfono bloqueado.',
        reflection: 'Cada notificación innecesaria fragmenta tu memoria operativa. El autocontrol y el silencio digital son las mayores fortalezas de la Resistencia.'
    },
    {
        id: 'tip-4',
        category: 'RESISTENCIA COGNITIVA',
        icon: Zap,
        badgeColor: 'purple',
        text: 'Aethel Corp busca tu atención en bucle infinito. Rompe el algoritmo: observa tu entorno real y respira profundo.',
        reflection: 'El diseño de recompensas digitales busca capturar tu dopamina. Pausar conscientemente te devuelve la soberanía absoluta sobre tu tiempo y mente.'
    },
    {
        id: 'tip-5',
        category: 'SINERGIA DE ESCUADRÓN',
        icon: ShieldCheck,
        badgeColor: 'emerald',
        text: 'El vínculo entre compañeros no se entrena con parámetros: se forja resolviendo problemas cara a cara.',
        reflection: 'Aprender debatiendo con un par o explicando un concepto difícil a un compañero fija el conocimiento mucho más profundo que un resumen sintético.'
    }
];

export default function AfterAILoreBanner({ studentName = 'Cadete', className = '' }) {
    // 1. Time-based dynamic greeting logic
    const [timeGreeting, setTimeGreeting] = useState({
        period: 'morning',
        greeting: 'Buenos días',
        subtext: 'Frecuencia Matutina Segura // 142.8 MHz',
        color: 'cyan'
    });

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) {
                setTimeGreeting({
                    period: 'morning',
                    greeting: 'Buenos días',
                    subtext: 'Alba en la Resistencia // Canal Seguro 142.8 MHz',
                    color: 'emerald'
                });
            } else if (hour >= 12 && hour < 19) {
                setTimeGreeting({
                    period: 'afternoon',
                    greeting: 'Buenas tardes',
                    subtext: 'Cénit de Foco & Aprendizaje // Canal Seguro 142.8 MHz',
                    color: 'cyan'
                });
            } else {
                setTimeGreeting({
                    period: 'evening',
                    greeting: 'Buenas noches',
                    subtext: 'Vigilia de Desconexión // Canal Seguro 142.8 MHz',
                    color: 'purple'
                });
            }
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000 * 15); // check every 15 min
        return () => clearInterval(interval);
    }, []);

    // 2. Lore tip rotation logic (random on mount, rotates periodically or on button click)
    const [currentTipIndex, setCurrentTipIndex] = useState(() => {
        const savedIndex = localStorage.getItem('aulock_afteria_tip_idx');
        if (savedIndex !== null) {
            const next = (parseInt(savedIndex, 10) + 1) % LORE_TIPS_DATASET.length;
            localStorage.setItem('aulock_afteria_tip_idx', next.toString());
            return next;
        }
        const initial = Math.floor(Math.random() * LORE_TIPS_DATASET.length);
        localStorage.setItem('aulock_afteria_tip_idx', initial.toString());
        return initial;
    });

    const [isRotating, setIsRotating] = useState(false);
    const [showReflection, setShowReflection] = useState(false);
    const [imageError, setImageError] = useState(false);

    const activeTip = LORE_TIPS_DATASET[currentTipIndex] || LORE_TIPS_DATASET[0];

    // 3. Typewriter effect for transmission text
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setIsTyping(true);
        setDisplayedText('');
        const fullText = activeTip.text;
        let charIndex = 0;

        const typingSpeed = 22; // ms per character for smooth sci-fi teletype
        const timer = setInterval(() => {
            if (charIndex < fullText.length) {
                setDisplayedText(fullText.substring(0, charIndex + 1));
                charIndex++;
            } else {
                setIsTyping(false);
                clearInterval(timer);
            }
        }, typingSpeed);

        return () => clearInterval(timer);
    }, [currentTipIndex]);

    // Handle manual next tip
    const handleNextTip = () => {
        setIsRotating(true);
        const nextIndex = (currentTipIndex + 1) % LORE_TIPS_DATASET.length;
        setCurrentTipIndex(nextIndex);
        localStorage.setItem('aulock_afteria_tip_idx', nextIndex.toString());
        setTimeout(() => setIsRotating(false), 400);
    };

    // Clean student first name for intimate greeting
    const studentFirstName = useMemo(() => {
        if (!studentName) return 'Cadete';
        const parts = studentName.trim().split(' ');
        return parts[0] || 'Cadete';
    }, [studentName]);

    const TipIcon = activeTip.icon;

    return (
        <div className={`relative p-5 md:p-6 rounded-3xl bg-slate-950/95 border-2 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] transition-all duration-300 font-mono text-emerald-100 ${className}`}>
            
            {/* Tech HUD Corner Accents */}
            <div className="absolute top-0 left-6 w-8 h-1 bg-emerald-400 rounded-full" />
            <div className="absolute top-0 right-6 w-8 h-1 bg-emerald-400 rounded-full" />
            <div className="absolute bottom-0 left-6 w-8 h-1 bg-cyan-400 rounded-full" />
            <div className="absolute bottom-0 right-6 w-8 h-1 bg-cyan-400 rounded-full" />

            {/* HEADER: AFTER IA TRANSMISSION TAG */}
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center">
                        <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span className="absolute w-2 h-2 rounded-full bg-emerald-400/50 animate-ping" />
                    </div>
                    <h3 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-widest uppercase">
                        AFTER IA // TRANSMISIÓN DE BIENESTAR
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-orbitron font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/50">
                        NEXO RESISTENCIA
                    </span>
                    <button
                        type="button"
                        onClick={handleNextTip}
                        title="Sintonizar otra frecuencia"
                        className="p-1 rounded-lg text-emerald-400/70 hover:text-emerald-300 hover:bg-emerald-900/40 transition cursor-pointer"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT: AVATAR SECTION (LEFT) & TRANSMISSION CONSOLE (RIGHT) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-5">
                
                {/* 1. AVATAR SECTION (LEFT): Character Greeting with Subtle Glowing Border */}
                <div className="flex-shrink-0 flex flex-col items-center group">
                    <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-emerald-400/90 shadow-[0_0_20px_rgba(52,211,153,0.45)] group-hover:shadow-[0_0_28px_rgba(34,211,238,0.6)] group-hover:border-cyan-400 transition-all duration-300 bg-slate-900 p-0.5">
                            {!imageError ? (
                                <img 
                                    src="/after-ia-guide.png" 
                                    alt="Guía de la Resistencia AFTER IA"
                                    onError={() => setImageError(true)}
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-950 via-slate-950 to-cyan-950 text-emerald-300 p-1">
                                    <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                                    <span className="text-[8px] font-orbitron font-bold text-center mt-1">AFTER IA</span>
                                </div>
                            )}
                        </div>
                        {/* Status Beacon Dot */}
                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center">
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                            <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping opacity-75 pointer-events-none" />
                        </div>
                    </div>
                    <span className="text-[9px] font-orbitron font-black text-emerald-400/90 uppercase tracking-widest mt-2">
                        RIU // GUÍA
                    </span>
                </div>

                {/* 2. TRANSMISSION CONSOLE (RIGHT): Personalized Greeting & Typewriter Lore Tip */}
                <div className="flex-grow space-y-2 w-full min-w-0">
                    
                    {/* Personalized Greeting Header */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs md:text-sm font-orbitron font-black text-white tracking-wide">
                            {timeGreeting.greeting}, <span className="text-emerald-300 underline decoration-emerald-500/60 decoration-2">{studentFirstName}</span>.
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400/80">
                            • {activeTip.category}
                        </span>
                    </div>

                    {/* Subtext frequency indicator */}
                    <div className="text-[10px] text-emerald-400/70 font-mono tracking-tight flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{timeGreeting.subtext}</span>
                    </div>

                    {/* Typewriter Digital Transmission Console */}
                    <div className="p-3 bg-slate-900/90 rounded-2xl border border-emerald-500/40 shadow-inner relative overflow-hidden">
                        {/* Scanline overlay effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent pointer-events-none" />
                        
                        <p className="text-xs md:text-sm text-emerald-100/95 font-mono leading-relaxed italic select-none">
                            "{displayedText}
                            {isTyping && (
                                <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-1 animate-pulse align-middle" />
                            )}
                            "
                        </p>
                    </div>

                    {/* Action: Reflection Capsule Accordion Toggle */}
                    <div className="pt-1">
                        <button 
                            type="button"
                            onClick={() => setShowReflection(!showReflection)}
                            className="text-[11px] text-cyan-300 hover:text-white underline underline-offset-4 decoration-dotted font-mono flex items-center gap-1 cursor-pointer transition"
                        >
                            <TipIcon className="w-3 h-3 text-cyan-400" />
                            <span>{showReflection ? 'Ocultar bitácora de reflexión ▲' : '✨ Ver bitácora de reflexión humana ▼'}</span>
                        </button>

                        {showReflection && (
                            <div className="mt-2.5 p-3.5 bg-slate-900/95 rounded-2xl border border-cyan-500/50 text-xs text-cyan-200/90 font-sans shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center gap-1.5 text-cyan-300 font-orbitron font-bold text-[10px] uppercase mb-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Directriz de Bienestar Digital & Comunidad:</span>
                                </div>
                                <p className="leading-relaxed">
                                    {activeTip.reflection}
                                </p>
                            </div>
                        )}
                    </div>

                </div>

            </div>

        </div>
    );
}
