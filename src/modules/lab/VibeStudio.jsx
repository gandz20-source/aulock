import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Zap, Maximize2, RotateCcw, Code } from 'lucide-react';
import texts from '../../locales/es.json';

// --- Components ---

const Message = ({ role, content }) => {
    const isUser = role === 'user';
    return (
        <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] rounded-2xl p-4 ${isUser
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700 shadow-md'
                }`}>
                <div className="flex gap-3">
                    {!isUser && (
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                            <Cpu size={18} />
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono">{content}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VibeStudio = () => {
    const t = texts.lab;

    // State
    const [messages, setMessages] = useState([
        { role: 'assistant', content: t.ada.intro }
    ]);
    const [input, setInput] = useState('');
    const [xp, setXp] = useState(0);
    const [previewCode, setPreviewCode] = useState('');

    // Create a default "empty state" HTML for the preview
    const defaultPreview = `
    <html>
      <body style="background-color: #0f172a; color: #94a3b8; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
        <div style="text-align: center;">
          <h2 style="color: #4ade80; margin-bottom: 1rem;">${t.preview.title}</h2>
          <p>${t.preview.placeholder}</p>
        </div>
      </body>
    </html>
  `;

    // --- Logic ---
    const handleSend = () => {
        if (!input.trim()) return;

        // 1. Add User Message
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');

        // 2. Simulate Ada Response & Code Generation (Mock Logic)
        setTimeout(() => {
            // Simple mock logic: If user says "button", generate a neon button
            let responseContent = "Entendido. Aquí tienes un diseño inicial.";
            let codeToRender = "";

            if (input.toLowerCase().includes('boton') || input.toLowerCase().includes('button')) {
                responseContent = "¡Claro! He creado un botón neon interactivo usando CSS moderno. Mira el panel derecho.";
                codeToRender = `
          <button style="
            background: #10b981;
            color: #0f172a;
            border: none;
            padding: 1rem 2rem;
            font-size: 1.2rem;
            font-weight: bold;
            border-radius: 99px;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            AuLock Vibe ✨
          </button>
        `;
            } else if (input.toLowerCase().includes('tarjeta') || input.toLowerCase().includes('card')) {
                responseContent = "Aquí tienes una tarjeta estilo 'Glassmorphism' para tu interfaz.";
                codeToRender = `
            <div style="
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              padding: 2rem;
              border-radius: 1.5rem;
              color: white;
              width: 300px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            ">
              <h3 style="margin-top: 0; color: #4ade80;">Glass Card</h3>
              <p style="color: #cbd5e1; line-height: 1.6;">Este es un componente moderno perfecto para dashboards oscuros.</p>
            </div>
          `;
            } else {
                responseContent = "Estoy lista para codear. Pídeme un 'botón neon' o una 'tarjeta de cristal' para empezar.";
            }

            setMessages(prev => [...prev, { role: 'assistant', content: responseContent }]);

            if (codeToRender) {
                setPreviewCode(codeToRender);
                setXp(prev => prev + 50); // Gamification
            }

        }, 1000);
    };

    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden text-slate-200 font-sans">

            {/* LEFT COLUMN: CHAT INTERFACE */}
            <div className="w-1/3 flex flex-col border-r border-slate-800 bg-[#0f172a] relative z-20">

                {/* Chat Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-slate-900 shadow-lg shadow-green-900/50">
                            <Cpu size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-lg tracking-tight">{t.ada.name}</h2>
                            <p className="text-xs text-green-400 font-mono uppercase tracking-wider">{t.ada.role}</p>
                        </div>
                    </div>

                    {/* XP Counter Gamification */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                        <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">{xp} {t.xp_label}</span>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {messages.map((msg, i) => (
                        <Message key={i} role={msg.role} content={msg.content} />
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-900 border-t border-slate-800">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Describe tu idea..."
                            className="w-full bg-slate-800 text-white placeholder-slate-500 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500/50 border border-slate-700 transition-all font-mono text-sm"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: PREVIEW CANVAS */}
            <div className="flex-1 bg-[#0b1120] relative flex flex-col">

                {/* Toolbar */}
                <div className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                        <Code size={16} />
                        <span>Canvas de Previsualización</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-800 rounded text-slate-400 transition-colors" title="Reload">
                            <RotateCcw size={18} />
                        </button>
                        <button className="p-2 hover:bg-slate-800 rounded text-slate-400 transition-colors" title="Maximize">
                            <Maximize2 size={18} />
                        </button>
                    </div>
                </div>

                {/* The "Device" Screen */}
                <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-[#0b1120] to-[#0b1120]">
                    <div className="w-full max-w-md h-[80%] bg-white rounded-[2.5rem] border-8 border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-slate-700">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>

                        {/* Screen Content */}
                        <div className="w-full h-full bg-[#0f172a] text-white overflow-hidden relative">
                            {/* Render HTML directy inside a container that centers content */}
                            <div
                                className="w-full h-full flex items-center justify-center p-4 bg-[#0f172a]"
                                dangerouslySetInnerHTML={{ __html: previewCode || defaultPreview }}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VibeStudio;
