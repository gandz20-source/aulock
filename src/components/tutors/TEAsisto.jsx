import React, { useState, useEffect } from 'react';

export default function TEAsisto() {
  const [breathingText, setBreathingText] = useState('Prepárate para respirar');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hola. Este es un espacio seguro para ti. No hay juicios ni presiones. ¿Cómo te sientes en este momento?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Efecto para la guía de respiración relajante
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      const steps = [
        { text: 'Inhala profundamente por la nariz...', duration: 4000 },
        { text: 'Sostén el aire con suavidad...', duration: 4000 },
        { text: 'Exhala lento y suelta toda la tensión...', duration: 4000 }
      ];
      let currentStep = 0;
      
      setBreathingText(steps[0].text);
      interval = setInterval(() => {
        currentStep = (currentStep + 1) % steps.length;
        setBreathingText(steps[currentStep].text);
      }, 4000);
    } else {
      setBreathingText('Presiona "Iniciar Respiración" cuando desees calmar tu ritmo.');
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    // Respuesta empática y socrática de TEAsisto
    setTimeout(() => {
      let aiReply = "Te escucho y es totalmente válido sentirte así. No tienes que demostrarle nada a nadie en este momento. Respira hondo, aquí estamos a tu propio ritmo.";
      if (userText.toLowerCase().includes('ansiedad') || userText.toLowerCase().includes('mal') || userText.toLowerCase().includes('estres')) {
        aiReply = "Lamento mucho que sientas esa carga ahora mismo. ¿Te gustaría mirar un momento a nuestros amigos peludos de abajo o hacer un ciclo corto de respiración juntos?";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 1000);
  };

  // Galería de perritos y gatitos amigables (Imágenes reales y tiernas)
  const calmingAnimals = [
    { type: 'Perrito', name: 'Bruno', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', desc: 'Te manda un saludo y un abrazo silencioso.' },
    { type: 'Gatito', name: 'Luna', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', desc: 'Ronronea suavemente para acompañarte.' },
    { type: 'Perrito', name: 'Simón', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', desc: 'Dice que todo va a estar bien hoy.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#132226] via-[#1a3036] to-[#0e1b1e] text-[#E0E8E9] font-sans p-4 md:p-8 relative overflow-hidden rounded-3xl">
      
      {/* 🌿 Fondo con paisaje calmante difuminado */}
      <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Cabecera TEAsisto */}
        <header className="text-center bg-[#1d383d]/60 backdrop-blur-md p-6 rounded-3xl border border-[#305f66]/50 shadow-lg">
          <div className="inline-block mb-2 px-3.5 py-1 bg-[#264e54] text-[#86efac] text-xs font-medium rounded-full tracking-wider">
            🌿 TU ESPACIO SEGURO Y SIN JUICIOS
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            TEAsisto // Calma y Apoyo Emocional
          </h1>
          <p className="text-sm text-[#a4c2cb] mt-2 max-w-xl mx-auto leading-relaxed">
            Un lugar diseñado para cuando la mente va muy rápido o necesitas hablar sin que nadie te cuestione. Respira, descansa y tómate tu tiempo.
          </p>
        </header>

        {/* 🐾 Sección de Amigos Peludos (Perritos y Gatitos Saludando) */}
        <section className="bg-[#182e33]/80 backdrop-blur-md p-6 rounded-3xl border border-[#2b5259] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#86efac] tracking-wider uppercase">
              🐾 Rincón de Apoyo Peludo (Terapia Visual)
            </h2>
            <span className="text-xs text-[#a4c2cb]">Ellos te acompañan en silencio</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {calmingAnimals.map((animal, idx) => (
              <div key={idx} className="bg-[#122428] rounded-2xl p-3 border border-[#24454c] text-center hover:border-[#417b85] transition group">
                <div className="overflow-hidden rounded-xl h-36 mb-3">
                  <img 
                    src={animal.url} 
                    alt={animal.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h3 className="font-bold text-white text-sm">{animal.name} el {animal.type}</h3>
                <p className="text-xs text-[#9ab8c1] mt-1">{animal.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🌬️ Círculo de Respiración Guiada */}
        <section className="bg-[#182e33]/80 backdrop-blur-md p-6 rounded-3xl border border-[#2b5259] shadow-xl text-center">
          <h2 className="text-sm font-semibold text-[#86efac] tracking-wider uppercase mb-2">
            🌬️ Pausa para Respirar
          </h2>
          <p className="text-xs text-[#a4c2cb] mb-6">Sigue el ritmo de la animación para bajar la ansiedad o el estrés.</p>
          
          <div className="flex flex-col items-center justify-center my-4">
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#5eead4] bg-[#224850]/50 flex items-center justify-center transition-transform duration-[4000ms] shadow-[0_0_30px_rgba(94,234,212,0.3)] ${
              isBreathingActive ? 'scale-125 bg-[#2a5b66]/70' : 'scale-100'
            }`}>
              <span className="text-xs text-white font-medium px-4 text-center leading-tight">
                {breathingText}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsBreathingActive(!isBreathingActive)}
            className="mt-6 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#26535c] hover:bg-[#2f6672] text-[#e2f8fa] border border-[#448390] transition shadow-md cursor-pointer"
          >
            {isBreathingActive ? 'Pausar Respiración' : '▶ Iniciar Ejercicio de Respiración'}
          </button>
        </section>

        {/* 💬 Chat Seguro y Sin Juicios */}
        <section className="bg-[#182e33]/80 backdrop-blur-md p-6 rounded-3xl border border-[#2b5259] shadow-xl flex flex-col h-[400px]">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-[#86efac] tracking-wider uppercase">
              💬 Cuéntale a TEAsisto lo que sientes
            </h2>
            <p className="text-xs text-[#a4c2cb]">Escribe libremente. Nadie te juzgará y tus datos son completamente seguros.</p>
          </div>

          {/* Historial de Mensajes */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scrollbar-thin scrollbar-thumb-[#2b5259]">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-3.5 rounded-2xl text-xs md:text-sm max-w-[85%] leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-[#2b5259] text-white rounded-br-xs' 
                    : 'mr-auto bg-[#122428] text-[#d3e4e6] border border-[#24454c] rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Caja de Texto */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe aquí con confianza (ej. Me siento abrumado...)"
              className="flex-1 bg-[#122428] border border-[#2b5259] focus:border-[#5eead4] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-[#688a92] outline-none transition"
            />
            <button
              type="submit"
              className="bg-[#26535c] hover:bg-[#2f6672] text-white px-5 rounded-xl text-xs font-semibold border border-[#448390] transition cursor-pointer"
            >
              Enviar
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
