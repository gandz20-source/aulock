import React, { useState, useEffect } from 'react';

export default function LiveClassroomStudentHUD() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [understandingLevel, setUnderstandingLevel] = useState(null);

  // Live question loaded from localStorage broadcast or fallback
  const [activeQuestion, setActiveQuestion] = useState(() => {
    const saved = localStorage.getItem('aulock_active_question');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          question: parsed.question || parsed.text || '¿Cuál es el resultado de resolver la ecuación de segundo grado $x^2 - 5x + 6 = 0$?',
          options: parsed.options || ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
          timeLimit: parsed.timeLimit || parsed.timer_seconds || 45
        };
      } catch (e) {
        console.error(e);
      }
    }
    return {
      question: '¿Cuál es el resultado de resolver la ecuación de segundo grado $x^2 - 5x + 6 = 0$?',
      options: ['A) x = 2 y x = 3', 'B) x = -2 y x = -3', 'C) x = 1 y x = 6', 'D) x = 0 y x = 5'],
      timeLimit: 45
    };
  });

  // Listen for real-time question broadcasts from Teacher Dashboard (storage & custom event)
  useEffect(() => {
    const handleStorageChange = (e) => {
      let savedData = null;

      if (e && e.detail && e.detail.data) {
        savedData = e.detail.data;
      } else {
        const saved = localStorage.getItem('aulock_active_question');
        if (saved) {
          try {
            savedData = JSON.parse(saved);
          } catch (err) {
            console.error(err);
          }
        }
      }

      if (savedData) {
        setActiveQuestion({
          question: savedData.question || savedData.text || 'What is the correct syntax for declaring a variable in Ryo-Script?',
          options: savedData.options && savedData.options.length > 0 ? savedData.options : ['A) let x = 10', 'B) var x = 10', 'C) const x: 10', 'D) define x = 10'],
          timeLimit: savedData.timeLimit || savedData.timer_seconds || 45
        });
        setTimeLeft(savedData.timeLimit || savedData.timer_seconds || 45);
        setSelectedOption(null);
        setHasSubmitted(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('aulock_question_event', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('aulock_question_event', handleStorageChange);
    };
  }, []);

  // Classwide Timer broadcasted by Teacher
  const [classTimer, setClassTimer] = useState(() => {
    const saved = localStorage.getItem('aulock_class_timer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return { remainingSeconds: 600, initialSeconds: 600, isRunning: false };
  });

  useEffect(() => {
    const handleTimerSync = (e) => {
      let data = null;
      if (e && e.detail) {
        data = e.detail;
      } else {
        const saved = localStorage.getItem('aulock_class_timer');
        if (saved) {
          try { data = JSON.parse(saved); } catch (err) {}
        }
      }
      if (data) setClassTimer(data);
    };

    window.addEventListener('storage', handleTimerSync);
    window.addEventListener('aulock_timer_event', handleTimerSync);
    return () => {
      window.removeEventListener('storage', handleTimerSync);
      window.removeEventListener('aulock_timer_event', handleTimerSync);
    };
  }, []);

  // Class timer local countdown
  useEffect(() => {
    let interval = null;
    if (classTimer.isRunning && classTimer.remainingSeconds > 0) {
      interval = setInterval(() => {
        setClassTimer(prev => ({
          ...prev,
          remainingSeconds: Math.max(0, prev.remainingSeconds - 1)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [classTimer.isRunning, classTimer.remainingSeconds]);

  // Countdown timer simulation for active live question
  useEffect(() => {
    if (timeLeft > 0 && !hasSubmitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, hasSubmitted]);

  const handleAnswerSubmit = (optionId, optionText = '') => {
    setSelectedOption(optionId);
    setHasSubmitted(true);

    const newResponse = {
      id: 'resp-' + Date.now(),
      studentName: 'Juan Carlos Pérez',
      course: 'Senior High A',
      optionId,
      optionText,
      timestamp: new Date().toISOString()
    };

    // Retrieve and update existing responses array in localStorage
    const saved = localStorage.getItem('aulock_student_live_responses');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(newResponse);
    localStorage.setItem('aulock_student_live_responses', JSON.stringify(list));

    // Dispatch real-time events for Teacher Dashboard
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aulock_student_response_event', { detail: newResponse }));
  };

  const handleUnderstandingFeedback = (level) => {
    setUnderstandingLevel(level);
    const payload = {
      studentName: 'Juan Carlos Pérez',
      level,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('aulock_student_understanding', JSON.stringify(payload));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('aulock_understanding_event', { detail: payload }));
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-emerald-900 rounded-3xl">
      
      {/* 🟢 ACTIVE MODULE HEADER */}
      <div className="p-3.5 mb-4 bg-gray-950 border-2 border-emerald-500/60 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
          <h1 className="text-sm md:text-base font-orbitron font-extrabold text-emerald-300 tracking-widest uppercase">
            LIVE CLASSROOM // ACTIVE SESSION WITH PROF. MARÍA GONZÁLEZ
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg shrink-0">
          <span className="text-xs text-emerald-400 font-bold">⏱️ QUESTION TIMER:</span>
          <span className="text-sm font-bold text-white font-orbitron">{timeLeft}s</span>
        </div>
      </div>

      {/* ⏱️ SYNCHRONIZED CLASS TIMER BANNER */}
      {classTimer && classTimer.isRunning && (
        <div className="p-4 mb-6 bg-slate-950/95 border-2 border-cyan-400 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fade-in font-mono">
          <div className="flex items-center gap-3">
            <span className="text-xl animate-bounce">⏱️</span>
            <div>
              <span className="text-[10px] text-cyan-300 font-bold font-orbitron uppercase block">LIVE TEACHER CLASSROOM TIMER IN PROGRESS</span>
              <h3 className="text-sm font-bold text-white">Prof. María González launched live class session countdown</h3>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-cyan-500">
            <span className="text-2xl font-black font-orbitron text-amber-300">
              {String(Math.floor(classTimer.remainingSeconds / 60)).padStart(2, '0')}:{String(classTimer.remainingSeconds % 60).padStart(2, '0')}
            </span>
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded border border-emerald-600 animate-pulse">● LIVE SYNCED</span>
          </div>
        </div>
      )}

      {/* 🟢 LIVE QUESTION ZONE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Question & Options */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gray-950/90 border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-orbitron font-bold px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
              TYPE: MULTIPLE CHOICE
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">VALUE: 100 PS</span>
          </div>

          <h2 className="text-base md:text-lg font-bold text-white mb-6 font-sans border-l-4 border-emerald-400 pl-4 leading-relaxed">
            {activeQuestion.question}
          </h2>

          {/* Terminal Style Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {activeQuestion.options.map((optText, idx) => {
              const letterId = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'
              const isSelected = selectedOption === letterId || selectedOption === optText;

              return (
                <button
                  key={idx}
                  disabled={hasSubmitted}
                  onClick={() => handleAnswerSubmit(letterId, optText)}
                  className={`p-4 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-gray-900/80 border-cyan-900/60 text-cyan-200 hover:border-emerald-500 hover:bg-gray-900'
                  }`}
                >
                  <span className="font-medium">{optText}</span>
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                    isSelected ? 'border-emerald-400 bg-emerald-500 text-black font-bold' : 'border-cyan-700'
                  }`}>
                    {letterId}
                  </span>
                </button>
              );
            })}
          </div>

          {hasSubmitted && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500 rounded-xl text-center space-y-1 animate-fade-in">
              <p className="text-emerald-400 font-bold font-orbitron text-xs uppercase tracking-wider">✓ RESPONSE RECORDED IN CORE!</p>
              <p className="text-[11px] text-cyan-300">Waiting for teacher synchronization for the next phase.</p>
            </div>
          )}
        </div>

        {/* Student Sidebar */}
        <div className="space-y-6">
          
          {/* Live Emotional Comprehension Widget */}
          <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl space-y-3">
            <h3 className="text-xs font-orbitron font-bold text-cyan-300">// COMPREHENSION PULSE</h3>
            <p className="text-[11px] text-cyan-400/80">How do you rate your current learning pace in this class?</p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleUnderstandingFeedback('CLEAR')}
                className={`p-2.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                  understandingLevel === 'CLEAR'
                    ? 'bg-green-900 border-green-400 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                    : 'bg-green-950/50 border-green-700 text-green-300 hover:bg-green-900'
                }`}
              >
                🟢 CLEAR
              </button>

              <button 
                onClick={() => handleUnderstandingFeedback('TOO FAST')}
                className={`p-2.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                  understandingLevel === 'TOO FAST'
                    ? 'bg-yellow-900 border-yellow-400 text-white shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                    : 'bg-yellow-950/50 border-yellow-700 text-yellow-300 hover:bg-yellow-900'
                }`}
              >
                🟡 TOO FAST
              </button>

              <button 
                onClick={() => handleUnderstandingFeedback('CONFUSED')}
                className={`p-2.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                  understandingLevel === 'CONFUSED'
                    ? 'bg-red-900 border-red-400 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'bg-red-950/50 border-red-700 text-red-300 hover:bg-red-900'
                }`}
              >
                🔴 CONFUSED
              </button>
            </div>
            {understandingLevel && (
              <p className="text-[10px] text-emerald-400 font-bold text-center pt-1">
                ✓ Pulse "{understandingLevel}" sent to Teacher Dashboard.
              </p>
            )}
          </div>

          {/* Weekly Badge */}
          <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-magenta-500/40 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-magenta-950 border border-magenta-500 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(217,70,239,0.3)] shrink-0">
              🎖️
            </div>
            <div>
              <span className="text-[10px] font-orbitron text-magenta-300 font-bold">// ACTIVE BADGE</span>
              <h4 className="text-xs font-bold text-white">Active Listening Master</h4>
              <p className="text-[10px] text-cyan-400">Respectful turn-taking in plenary discussions.</p>
            </div>
          </div>

        </div>

      </div>

      {/* 🟢 BOTTOM SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Civic Reflection Capsule */}
        <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-orbitron text-cyan-400 font-bold">// CIVIC REFLECTION CAPSULE • 2026</span>
              <span className="text-[10px] text-green-400 font-bold">ACTIVE MEMORY</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2 font-orbitron">Civic Education & Respect</h3>
            <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
              Daily dialogue and empathetic interaction build resilient, inclusive school communities.
            </p>
          </div>
        </div>

        {/* School Coexistence Protocol */}
        <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-magenta-500/40 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-orbitron text-magenta-300 font-bold">// SCHOOL COEXISTENCE & RESPECT</span>
              <span className="text-[10px] text-magenta-400 font-bold">EMPATHY PROTOCOL</span>
            </div>
            <p className="text-xs text-magenta-100 italic leading-relaxed font-sans">
              "Respect and active listening toward your classmates' ideas enrich learning and strengthen our entire community."
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-magenta-900/40 flex justify-between items-center text-[10px] text-cyan-400 font-bold">
            <span>CLIMATE INDEX: 85% OPTIMAL</span>
            <span className="text-green-400">● CONNECTED</span>
          </div>
        </div>

      </div>

    </div>
  );
}
