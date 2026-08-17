import React, { useState, useEffect, useRef } from 'react';
import { generateTEAsistoSupportResponse } from '../../services/GeminiService';
import { Sparkles, Heart, MessageSquare, Volume2, ShieldCheck, Smile, RefreshCw, Send } from 'lucide-react';

export default function TEAsisto() {
  const [breathingText, setBreathingText] = useState('Get ready to breathe');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '¡Hola! Este es tu espacio seguro, libre de juicios y presiones. ¿Cómo te sientes en este momento?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Active Pet Companion & Advice Bubble State
  const [activePet, setActivePet] = useState(null);
  const [activeAdviceBubble, setActiveAdviceBubble] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Breathing guide effect
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      const steps = [
        { text: 'Inhala profundamente por tu nariz (4 seg)...', duration: 4000 },
        { text: 'Sostén el aire suavemente (4 seg)...', duration: 4000 },
        { text: 'Exhala despacio liberando toda tensión (4 seg)...', duration: 4000 }
      ];
      let currentStep = 0;
      
      setBreathingText(steps[0].text);
      interval = setInterval(() => {
        currentStep = (currentStep + 1) % steps.length;
        setBreathingText(steps[currentStep].text);
      }, 4000);
    } else {
      setBreathingText('Haz clic en "Iniciar Ejercicio" cuando desees calmar tu ritmo.');
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  // Calming Pet Companions Dataset with Interactive Advice & Tips
  const calmingAnimals = [
    { 
      id: 'bruno', 
      type: 'Cachorro', 
      name: 'Bruno', 
      emoji: '🐶',
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', 
      desc: 'Te envía un abrazo silencioso y cálido.',
      advice: '¿Sabías que tomar una pausa de 5 minutos ayuda a tu cerebro a procesar mejor la matemática? ¡Lo estás haciendo genial hoy! 🐾',
      tips: [
        '¡Guau! Toma un sorbo de agua fresca. ¡La hidratación mantiene tu mente enfocada! 💧',
        'No te agobies por un ejercicio difícil. ¡Desgránalo en 3 pasos pequeños! 🐾',
        '¡Bruno te envía un gran abrazo perruno! ¡Confía en tu capacidad! 🐶'
      ]
    },
    { 
      id: 'luna', 
      type: 'Gatita', 
      name: 'Luna', 
      emoji: '🐱',
      url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', 
      desc: 'Ronronea suavemente para acompañarte.',
      advice: 'Purrr... Inhala profundo. Enfócate en un pequeño paso a la vez. ¡Estoy aquí a tu lado! 🐱',
      tips: [
        'Purrr... Suelta tus hombros y desaprieta la mandíbula. Siente cómo regresa la calma. 🐾',
        'Luna dice: Los errores son solo la prueba de que estás aprendiendo algo nuevo. 🐱',
        'Las mentes tranquilas encuentran respuestas creativas. ¡Respira conmigo! 🌙'
      ]
    },
    { 
      id: 'simon', 
      type: 'Cachorro', 
      name: 'Simón', 
      emoji: '🐕',
      url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', 
      desc: 'Te asegura que todo estará bien hoy.',
      advice: '¡Movimiento de cola! Recuerda estirar la espalda y sonreír. ¡Yo creo en ti! 🐶',
      tips: [
        '¡Movimiento de cola! Eres mucho más inteligente y resiliente de lo que crees. 🐕',
        'Simón te recuerda: ¡Celebra las pequeñas victorias! Terminar una tarea es un gran logro. 🎉',
        '¡Sonríe! Eres parte de un gran equipo y nunca estás solo. 🐶'
      ]
    }
  ];

  // Handle Conversational AI Chat via Gemini
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isThinking) return;

    const userText = inputMessage.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsThinking(true);

    try {
      const aiReply = await generateTEAsistoSupportResponse({
        userMessage: userText,
        history: messages,
        activePet
      });
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      console.error("Error generating TEAsisto support reply:", err);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Te escucho atentamente. Todo lo que sientes es muy válido. Tómate tu tiempo; estamos aquí para acompañarte sin ninguna prisa.' 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  // Pet Interactive Action: Get Pet Advice Bubble & Add to Chat
  const handlePetAdvice = (pet) => {
    const randomTip = pet.tips[Math.floor(Math.random() * pet.tips.length)];
    setActiveAdviceBubble({ petName: pet.name, advice: randomTip, emoji: pet.emoji });
    
    // Add pet encouragement directly into the chat conversation
    setMessages(prev => [
      ...prev,
      { sender: 'ai', text: `${pet.emoji} ${pet.name} dice: "${randomTip}"` }
    ]);
  };

  return (
    <div className="bg-gradient-to-b from-[#0f1d21] via-[#162a30] to-[#0c1719] text-[#E0E8E9] font-sans p-4 sm:p-6 md:p-8 relative overflow-hidden rounded-3xl border border-[#23484f]/60 shadow-2xl">
      
      {/* 🌿 Background aesthetic glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#265963]/20 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center bg-[#183238]/80 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-[#2b5861]/60 shadow-lg font-mono">
          <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 bg-[#234c54] text-[#86efac] text-xs font-bold rounded-full tracking-wider uppercase">
            <span>🌿 YOUR SAFE & JUDGMENT-FREE SPACE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide font-sans">
            TEAsisto // Apoyo Emocional & Calma Pedagógica
          </h1>
          <p className="text-xs md:text-sm text-[#a4c2cb] mt-2 max-w-xl mx-auto leading-relaxed font-sans">
            Un espacio diseñado para cuando tu mente va muy rápido o necesitas expresarte sin presiones. Respira, descansa y tómate tu tiempo.
          </p>

          {activePet && (
            <div className="mt-3 inline-flex items-center gap-2 bg-[#224850] text-[#86efac] px-4 py-1.5 rounded-2xl border border-[#418391] text-xs font-bold">
              <span>{activePet.emoji} Acompañante activo: <strong>{activePet.name}</strong></span>
              <button 
                onClick={() => setActivePet(null)}
                className="ml-2 text-slate-400 hover:text-white underline cursor-pointer text-[10px]"
              >
                (quitar)
              </button>
            </div>
          )}
        </header>

        {/* 🐾 Furry Comfort Corner (Visual Therapy & Interactive Companions) */}
        <section className="bg-[#15292e]/90 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-[#254d54] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xs md:text-sm font-bold text-[#86efac] tracking-wider uppercase font-mono flex items-center gap-2">
                <span>🐾 Furry Comfort Corner (Terapia Visual & Consejos)</span>
              </h2>
              <p className="text-[11px] text-[#9bbac3]">Haz clic en cualquier mascota para recibir un consejo o seleccionarla como acompañante.</p>
            </div>
            <span className="text-[10px] bg-[#1d3d44] text-[#a4c2cb] px-3 py-1 rounded-full border border-[#2c5b65] font-mono shrink-0">
              Compañía en silencio
            </span>
          </div>

          {/* Advice Bubble Display */}
          {activeAdviceBubble && (
            <div className="mb-4 p-4 bg-[#1f3f47] border-2 border-[#5eead4]/60 rounded-2xl text-xs md:text-sm text-white font-sans flex items-start gap-3 shadow-[0_0_20px_rgba(94,234,212,0.2)] animate-fade-in">
              <span className="text-2xl">{activeAdviceBubble.emoji}</span>
              <div className="flex-1">
                <strong className="text-[#86efac] font-mono block text-xs">Consejo de {activeAdviceBubble.petName}:</strong>
                <p className="italic text-cyan-100 mt-0.5">"{activeAdviceBubble.advice}"</p>
              </div>
              <button 
                onClick={() => setActiveAdviceBubble(null)}
                className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {calmingAnimals.map((animal) => {
              const isSelected = activePet?.id === animal.id;

              return (
                <div 
                  key={animal.id} 
                  className={`bg-[#0f1f23] rounded-2xl p-4 border text-center transition-all duration-300 relative group flex flex-col justify-between ${
                    isSelected 
                      ? 'border-[#5eead4] shadow-[0_0_20px_rgba(94,234,212,0.3)] bg-[#183138]' 
                      : 'border-[#204047] hover:border-[#376b75]'
                  }`}
                >
                  <div>
                    <div className="overflow-hidden rounded-xl h-36 mb-3 relative">
                      <img 
                        src={animal.url} 
                        alt={animal.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-2 right-2 text-xl bg-black/60 p-1 rounded-full backdrop-blur-sm">
                        {animal.emoji}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm flex items-center justify-center gap-1">
                      <span>{animal.name}</span>
                      <span className="text-xs text-[#86efac] font-mono">({animal.type})</span>
                    </h3>
                    <p className="text-xs text-[#9ab8c1] mt-1 mb-3 font-sans leading-relaxed">{animal.desc}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#1b373d]">
                    <button
                      onClick={() => handlePetAdvice(animal)}
                      className="w-full py-1.5 px-3 bg-[#1d3d44] hover:bg-[#28535c] text-[#86efac] border border-[#346873] rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1 font-mono"
                    >
                      <span>💡 Consejo de {animal.name}</span>
                    </button>

                    <button
                      onClick={() => setActivePet(isSelected ? null : animal)}
                      className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                        isSelected 
                          ? 'bg-[#5eead4] text-slate-950 shadow-md' 
                          : 'bg-[#152a2f] hover:bg-[#1f3d45] text-white border border-[#2b545d]'
                      }`}
                    >
                      {isSelected ? '✓ Acompañante Activo' : '🐾 Seleccionar Acompañante'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 🌬️ Guided Breathing Circle */}
        <section className="bg-[#15292e]/90 backdrop-blur-md p-6 rounded-3xl border border-[#254d54] shadow-xl text-center font-mono">
          <h2 className="text-xs md:text-sm font-bold text-[#86efac] tracking-wider uppercase mb-1">
            🌬️ Pausa de Respiración Guiada
          </h2>
          <p className="text-xs text-[#a4c2cb] mb-4">Sigue el ritmo de la animación para reducir el estrés o la ansiedad escolar.</p>
          
          <div className="flex flex-col items-center justify-center my-4">
            <div className={`w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-[#5eead4] bg-[#1e4047]/60 flex items-center justify-center transition-all duration-[4000ms] shadow-[0_0_35px_rgba(94,234,212,0.35)] ${
              isBreathingActive ? 'scale-125 bg-[#25525c]/80 border-emerald-300 shadow-[0_0_50px_rgba(134,239,172,0.5)]' : 'scale-100'
            }`}>
              <span className="text-xs md:text-sm text-white font-bold px-4 text-center leading-relaxed">
                {breathingText}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className={`mt-4 px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer uppercase tracking-wider ${
              isBreathingActive 
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                : 'bg-[#234b53] hover:bg-[#2d5d67] text-[#e2f8fa] border border-[#3f7c89]'
            }`}
          >
            {isBreathingActive ? '⏸️ Pausar Respiración' : '▶️ Iniciar Ejercicio de Respiración'}
          </button>
        </section>

        {/* 💬 Conversational AI Chat via Gemini */}
        <section className="bg-[#15292e]/90 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-[#254d54] shadow-xl flex flex-col min-h-[420px]">
          <div className="mb-4 pb-3 border-b border-[#21434a] flex items-center justify-between">
            <div>
              <h2 className="text-xs md:text-sm font-bold text-[#86efac] tracking-wider uppercase font-mono flex items-center gap-2">
                <span>💬 Conversa con TEAsisto (IA de Apoyo Emocional)</span>
              </h2>
              <p className="text-[11px] text-[#a4c2cb] font-sans">Escribe libremente. Tus datos son 100% confidenciales y seguros.</p>
            </div>
            {activePet && (
              <span className="text-xs font-mono text-[#5eead4] bg-[#122428] px-3 py-1 rounded-full border border-[#234850]">
                {activePet.emoji} {activePet.name} participando
              </span>
            )}
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4 max-h-[320px] scrollbar-thin scrollbar-thumb-[#254d54]">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-2xl text-xs md:text-sm max-w-[88%] leading-relaxed font-sans shadow-md ${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-gradient-to-r from-[#214b53] to-[#2b5c66] text-white rounded-br-xs border border-[#3a7582]' 
                    : 'mr-auto bg-[#0d1c20] text-[#d8eaed] border border-[#204047] rounded-bl-xs'
                }`}
              >
                {msg.sender === 'ai' && (
                  <span className="block text-[10px] font-mono text-[#86efac] font-bold uppercase mb-1">
                    🌿 TEAsisto {activePet ? `& ${activePet.name}` : ''}:
                  </span>
                )}
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            ))}

            {isThinking && (
              <div className="mr-auto bg-[#0d1c20] text-[#86efac] border border-[#204047] p-3.5 rounded-2xl text-xs font-mono flex items-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-[#5eead4] animate-spin" />
                <span>TEAsisto {activePet ? `y ${activePet.name}` : ''} están escuchando y preparando una respuesta...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2 font-sans pt-2 border-t border-[#1e3c42]">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe aquí con total confianza (ej. Me siento un poco estresado por las evaluaciones...)"
              className="flex-1 bg-[#0b171a] border border-[#264e57] focus:border-[#5eead4] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-[#61868f] outline-none transition"
            />
            <button
              type="submit"
              disabled={isThinking || !inputMessage.trim()}
              className="bg-gradient-to-r from-[#25525c] to-[#2e6470] hover:from-[#2e6470] hover:to-[#387887] text-white px-5 rounded-xl text-xs font-bold border border-[#448390] transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 font-mono uppercase tracking-wider"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
