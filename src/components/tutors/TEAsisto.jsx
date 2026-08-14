import React, { useState, useEffect } from 'react';

export default function TEAsisto() {
  const [breathingText, setBreathingText] = useState('Get ready to breathe');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello. This is a safe space for you. No judgment, no pressure. How are you feeling right now?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Breathing guide effect
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      const steps = [
        { text: 'Inhale deeply through your nose...', duration: 4000 },
        { text: 'Hold your breath gently...', duration: 4000 },
        { text: 'Exhale slowly and release all tension...', duration: 4000 }
      ];
      let currentStep = 0;
      
      setBreathingText(steps[0].text);
      interval = setInterval(() => {
        currentStep = (currentStep + 1) % steps.length;
        setBreathingText(steps[currentStep].text);
      }, 4000);
    } else {
      setBreathingText('Press "Start Breathing" whenever you wish to calm your pace.');
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    // Socratic empathetic reply from TEAsisto
    setTimeout(() => {
      let aiReply = "I hear you, and it is completely valid to feel this way. You don't have to prove anything to anyone right now. Take a deep breath; we are here at your own pace.";
      if (userText.toLowerCase().includes('anxiety') || userText.toLowerCase().includes('bad') || userText.toLowerCase().includes('stress')) {
        aiReply = "I am so sorry you are feeling that burden right now. Would you like to look at our furry friends below for a moment or do a short breathing cycle together?";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 1000);
  };

  // Calming pet gallery
  const calmingAnimals = [
    { type: 'Puppy', name: 'Bruno', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', desc: 'Sends you a warm silent hug.' },
    { type: 'Kitten', name: 'Luna', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', desc: 'Purrs softly to keep you company.' },
    { type: 'Puppy', name: 'Simón', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', desc: 'Says everything is going to be okay today.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#132226] via-[#1a3036] to-[#0e1b1e] text-[#E0E8E9] font-sans p-4 md:p-8 relative overflow-hidden rounded-3xl">
      
      {/* 🌿 Calming background overlay */}
      <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center bg-[#1d383d]/60 backdrop-blur-md p-6 rounded-3xl border border-[#305f66]/50 shadow-lg">
          <div className="inline-block mb-2 px-3.5 py-1 bg-[#264e54] text-[#86efac] text-xs font-medium rounded-full tracking-wider">
            🌿 YOUR SAFE & JUDGMENT-FREE SPACE
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            TEAsisto // Calming & Emotional Support
          </h1>
          <p className="text-sm text-[#a4c2cb] mt-2 max-w-xl mx-auto leading-relaxed">
            A space designed for when your mind moves too fast or when you need to talk without pressure. Breathe, rest, and take your time.
          </p>
        </header>

        {/* 🐾 Furry Friends Visual Support */}
        <section className="bg-[#182e33]/80 backdrop-blur-md p-6 rounded-3xl border border-[#2b5259] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#86efac] tracking-wider uppercase">
              🐾 Furry Comfort Corner (Visual Therapy)
            </h2>
            <span className="text-xs text-[#a4c2cb]">They keep you silent company</span>
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
                <h3 className="font-bold text-white text-sm">{animal.name} the {animal.type}</h3>
                <p className="text-xs text-[#9ab8c1] mt-1">{animal.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🌬️ Guided Breathing Circle */}
        <section className="bg-[#182e33]/80 backdrop-blur-md p-6 rounded-3xl border border-[#2b5259] shadow-xl text-center">
          <h2 className="text-sm font-semibold text-[#86efac] tracking-wider uppercase mb-2">
            🌬️ Pause to Breathe
          </h2>
          <p className="text-xs text-[#a4c2cb] mb-6">Follow the animation rhythm to lower anxiety or stress.</p>
          
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
            {isBreathingActive ? 'Pause Breathing' : '▶ Start Breathing Exercise'}
          </button>
        </section>

        {/* 💬 Judgment-Free Chat */}
        <section className="bg-[#182e33]/80 backdrop-blur-md p-6 rounded-3xl border border-[#2b5259] shadow-xl flex flex-col h-[400px]">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-[#86efac] tracking-wider uppercase">
              💬 Tell TEAsisto what you feel
            </h2>
            <p className="text-xs text-[#a4c2cb]">Write freely. No one will judge you, and your data is completely secure.</p>
          </div>

          {/* Message History */}
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

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Write here with confidence (e.g. I feel overwhelmed...)"
              className="flex-1 bg-[#122428] border border-[#2b5259] focus:border-[#5eead4] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-[#688a92] outline-none transition"
            />
            <button
              type="submit"
              className="bg-[#26535c] hover:bg-[#2f6672] text-white px-5 rounded-xl text-xs font-semibold border border-[#448390] transition cursor-pointer"
            >
              Send
            </button>
          </form>
        </section>

      </div>
    </div>
  );
}
