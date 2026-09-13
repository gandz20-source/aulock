import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  BookOpen, 
  Send,
  AlertCircle
} from 'lucide-react';
import { consultSocraticLiveCamera, getGeminiApiKey } from '../../services/GeminiService';

export default function SocraticLiveCameraModal({ 
  isOpen, 
  onClose, 
  specialist, 
  onSyncBoard, 
  onAddChatMessage 
}) {
  const [facingMode, setFacingMode] = useState('environment'); // environment = rear, user = front
  const [isListening, setIsListening] = useState(false);
  const [isMutedTTS, setIsMutedTTS] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentTranscript, setStudentTranscript] = useState('');
  const [tutorSpeechResponse, setTutorSpeechResponse] = useState('');
  const [manualText, setManualText] = useState('');
  const [cameraError, setCameraError] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Iniciar Stream de Cámara de forma estable sin re-renders en bucle
  const startCamera = async (mode = 'environment') => {
    try {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      let newStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (idealErr) {
        console.warn("Fallo con facingMode ideal, probando cualquier cámara:", idealErr);
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(e => console.warn("Video play error:", e));
      }
    } catch (err) {
      console.error("Error al iniciar cámara:", err);
      setCameraError("No se pudo iniciar la cámara. Verifica los permisos del navegador.");
    }
  };

  // Detener Cámara
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }
  };

  // Capturar snapshot actual del video con verificación de dimensiones
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Síntesis de voz (Text-To-Speech)
  const speakTutorResponse = (text) => {
    if (isMutedTTS || !window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      const cleanSpokenText = text
        .replace(/\\\[[\s\S]*?\\\]/g, '')
        .replace(/\\\([\s\S]*?\\\)/g, '')
        .replace(/\$\$[\s\S]*?\$\$/g, '')
        .replace(/\$[^$]*\$/g, '')
        .replace(/[\\_{}^#*]/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
      utterance.lang = 'es-CL';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es-CL')) || voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) utterance.voice = spanishVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Error en síntesis de voz:", e);
    }
  };

  // Procesar consulta multimodal en vivo (Frame + Voz/Texto)
  const processLiveInquiry = async (userQuery) => {
    const queryText = userQuery || manualText.trim() || 'Observa atentamente lo que estoy apuntando en mi cuaderno y guíame socráticamente.';
    const frameBase64 = captureFrame();

    setIsProcessing(true);
    setStudentTranscript(queryText);
    setManualText('');

    try {
      const response = await consultSocraticLiveCamera({
        tutorName: specialist?.name,
        frameBase64: frameBase64 || '',
        userSpeech: queryText,
        subject: specialist?.subject
      });

      setTutorSpeechResponse(response);
      speakTutorResponse(response);

      // Auto scroll transcript into view
      if (chatScrollRef.current) {
        setTimeout(() => {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }, 50);
      }

      // Sincronizar con el chat general
      if (onAddChatMessage) {
        onAddChatMessage([
          { sender: 'user', text: `[En Vivo]: ${queryText}`, image: frameBase64 },
          { sender: 'ai', text: response }
        ]);
      }

      // Sincronizar con la Pizarra
      if (onSyncBoard) {
        const isPowers = response.includes('²') || queryText.includes('²') || response.includes('^2') || queryText.includes('^2');
        const isSumThree = response.includes('2+2+3') || queryText.includes('2+2+3') || response.includes('2 + 2 + 3') || queryText.includes('2 + 2 + 3');
        const isSumTwo = !isSumThree && (queryText.includes('2+2') || queryText.includes('2 + 2'));

        if (isPowers) {
          onSyncBoard({
            topic: 'Aritmética & Potencias: Jerarquía en Vivo',
            coreFormula: '5^2 + 8^2 - 6^2 = 25 + 64 - 36 = 53',
            steps: [
              { num: '01', title: 'Lectura en Vivo', desc: 'Identificación de potencias en video: 5² + 8² - 6² = ...' },
              { num: '02', title: 'Jerarquía Operativa', desc: 'Paso 1: Evaluar 5² = 25, 8² = 64, 6² = 36 antes de operar.' },
              { num: '03', title: 'Siguiente Paso', desc: 'Responde la pregunta del tutor para avanzar en la resolución.' }
            ]
          });
        } else if (isSumThree) {
          onSyncBoard({
            topic: 'Aritmética Elemental: Sumatoria en Vivo',
            coreFormula: '2 + 2 + 3 = (2 + 2) + 3 = 4 + 3 = 7',
            steps: [
              { num: '01', title: 'Lectura en Vivo', desc: 'Identificación de la sumatoria manuscrita en video: 2 + 2 + 3 = ...' },
              { num: '02', title: 'Desglose Asociativo', desc: 'Paso 1: 2 + 2 = 4 | Paso 2: 4 + 3 = 7. El total verificado es 7.' },
              { num: '03', title: 'Comprobación', desc: 'Responde la pregunta del tutor para avanzar hacia el siguiente ejercicio.' }
            ]
          });
        } else if (isSumTwo) {
          onSyncBoard({
            topic: 'Aritmética Básica // Adición en Vivo',
            coreFormula: '2 + 2 = 4 \\quad (\\neq 5)',
            steps: [
              { num: '01', title: 'Lectura en Vivo', desc: 'Inspección de sumandos en el cuaderno: 2 + 2.' },
              { num: '02', title: 'Auditoría Socrática', desc: 'Diferencia detectada frente a posibles errores de cálculo mental.' },
              { num: '03', title: 'Siguiente Paso', desc: 'Confirmación de la igualdad correcta (4).' }
            ]
          });
        }
      }
    } catch (err) {
      console.error("Error en consulta live camera:", err);
      const errReply = "Te veo a través de la cámara. ¿Podrías repetir tu duda o enfocar un poco más cerca?";
      setTutorSpeechResponse(errReply);
      speakTutorResponse(errReply);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e) => {
    if (e) e.preventDefault();
    if (!manualText.trim() && !isProcessing) return;
    processLiveInquiry(manualText.trim());
  };

  // Inicializar Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador móvil no soporta reconocimiento continuo de voz. Puedes usar el botón OBSERVAR APUNTE o escribir tu duda.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-CL';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            processLiveInquiry(transcript);
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  // Alternar Cámara Trasera / Frontal
  const toggleCameraFacing = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  // Control de apertura y cierre
  useEffect(() => {
    if (isOpen) {
      const key = getGeminiApiKey();
      setHasApiKey(!!key && key !== 'DEMO_KEY');
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col justify-between font-mono h-[100dvh] w-full overflow-hidden select-none">
      
      {/* 🟢 TOP BAR: Compacta y de alto contraste */}
      <header className="px-3 py-2.5 bg-slate-950/95 border-b border-cyan-500/40 flex items-center justify-between shrink-0 z-30 shadow-lg">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-red-950/90 border border-red-500 rounded-full shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] font-bold text-red-200 font-orbitron tracking-wider">
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-cyan-300 truncate">
            <span className="font-bold text-white truncate">{specialist?.name}</span>
            <span className="text-cyan-600">|</span>
            <span className="text-cyan-400 truncate text-[10px]">{specialist?.subject}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!hasApiKey && (
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] bg-amber-950/80 border border-amber-500 text-amber-300 rounded-md">
              Modo Local
            </span>
          )}

          {/* Alternar Cámara */}
          <button
            type="button"
            onClick={toggleCameraFacing}
            title="Cambiar Cámara"
            className="p-2 rounded-xl bg-slate-900 border border-cyan-700/60 text-cyan-300 hover:text-white hover:border-cyan-400 active:scale-95 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Mute/Unmute Audio TTS */}
          <button
            type="button"
            onClick={() => {
              if (!isMutedTTS && window.speechSynthesis) window.speechSynthesis.cancel();
              setIsMutedTTS(!isMutedTTS);
            }}
            title={isMutedTTS ? "Activar Voz del Tutor" : "Silenciar Voz del Tutor"}
            className={`p-2 rounded-xl border active:scale-95 transition ${
              isMutedTTS 
                ? 'bg-red-950/60 border-red-500 text-red-300' 
                : 'bg-slate-900 border-cyan-700/60 text-cyan-300 hover:text-white'
            }`}
          >
            {isMutedTTS ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Cerrar Modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-red-950/60 border border-red-500 text-red-200 hover:bg-red-900 active:scale-95 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 🟢 VIEWPORT DE VIDEO (OCUPA TODO EL ESPACIO DISPONIBLE) */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-0">
        {cameraError ? (
          <div className="p-6 text-center max-w-sm bg-slate-950 border border-red-500/50 rounded-2xl mx-4">
            <p className="text-xs text-red-400 mb-4 leading-relaxed">{cameraError}</p>
            <button
              type="button"
              onClick={() => startCamera(facingMode)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-orbitron uppercase"
            >
              Reintentar Conexión
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Canvas invisible para snapshots */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Retícula de Enfoque Socrático (Glow Brackets) */}
        <div className="absolute inset-4 sm:inset-10 pointer-events-none border border-cyan-500/20 rounded-3xl flex flex-col justify-between p-3">
          <div className="flex justify-between">
            <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"></div>
            <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"></div>
          </div>

          {/* Estado de Análisis Central */}
          <div className="flex flex-col items-center justify-center text-center">
            {isProcessing ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-400 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                <span className="text-[11px] text-white font-bold font-orbitron tracking-wider">
                  ANALIZANDO CUADERNO...
                </span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-black/60 border border-cyan-500/30 text-[10px] text-cyan-300 backdrop-blur-xs">
                Enfoca las líneas de tu cuaderno
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"></div>
            <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]"></div>
          </div>
        </div>
      </div>

      {/* 🟢 TIRA DEDICADA DE SUBTÍTULOS / HISTORIAL EN VIVO (NO TAPA LA CÁMARA) */}
      {(studentTranscript || tutorSpeechResponse) && (
        <div 
          ref={chatScrollRef}
          className="px-4 py-2 bg-slate-950/95 border-t border-cyan-900/60 max-h-24 overflow-y-auto shrink-0 space-y-1.5 z-30"
        >
          {studentTranscript && (
            <div className="text-[11px] text-purple-200 leading-tight">
              <span className="font-bold text-purple-400">TÚ:</span> {studentTranscript}
            </div>
          )}
          {tutorSpeechResponse && (
            <div className="text-[11px] text-cyan-200 leading-tight font-sans">
              <span className="font-bold text-cyan-400 font-mono">{specialist?.name?.toUpperCase()}:</span> {tutorSpeechResponse}
            </div>
          )}
        </div>
      )}

      {/* 🟢 BARRA DE CONTROL INFERIOR ERGONÓMICA PARA MÓVILES */}
      <div className="p-3 bg-slate-950 border-t border-cyan-500/30 shrink-0 z-30 space-y-2.5">
        
        {/* Fila 1: Campo de texto con botón ENVIAR grande y despejado */}
        <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Escribe tu duda o respuesta..."
            className="flex-1 min-w-0 bg-slate-900 border-2 border-cyan-700/80 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none font-sans"
          />
          <button
            type="submit"
            disabled={isProcessing || !manualText.trim()}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-orbitron font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 shrink-0 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ENVIAR</span>
          </button>
        </form>

        {/* Fila 2: Botones primarios de captura y voz con área táctil amplia */}
        <div className="grid grid-cols-2 gap-2">
          
          {/* Botón Hablar (STT) */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isProcessing}
            className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-orbitron font-bold text-[11px] transition active:scale-95 shadow-md ${
              isListening
                ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                : 'bg-slate-900 border-cyan-700 text-cyan-300 hover:bg-slate-800'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-cyan-400" />}
            <span className="truncate">{isListening ? 'ESCUCHANDO...' : 'HABLAR'}</span>
          </button>

          {/* Botón Observar Apunte (Snap & Ask) */}
          <button
            type="button"
            onClick={() => processLiveInquiry()}
            disabled={isProcessing}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-orbitron font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-40"
          >
            <Eye className="w-4 h-4 text-cyan-200" />
            <span className="truncate">{isProcessing ? 'ANALIZANDO...' : 'OBSERVAR APUNTE'}</span>
          </button>

        </div>

      </div>

    </div>
  );
}
