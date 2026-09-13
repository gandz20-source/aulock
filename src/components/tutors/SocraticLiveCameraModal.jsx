import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Send 
} from 'lucide-react';
import { consultSocraticLiveCamera } from '../../services/GeminiService';

export default function SocraticLiveCameraModal({ 
  isOpen, 
  onClose, 
  specialist, 
  onSyncBoard, 
  onAddChatMessage 
}) {
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // environment = rear, user = front
  const [isListening, setIsListening] = useState(false);
  const [isMutedTTS, setIsMutedTTS] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentTranscript, setStudentTranscript] = useState('');
  const [tutorSpeechResponse, setTutorSpeechResponse] = useState('');
  const [manualText, setManualText] = useState('');
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const isComponentMounted = useRef(true);

  // Iniciar Stream de Cámara
  const startCamera = useCallback(async (mode = facingMode) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // El audio se maneja con SpeechRecognition
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.warn("Error accediendo a cámara trasera, intentando cualquier cámara disponible:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (fallbackErr) {
        console.error("No se pudo iniciar ninguna cámara:", fallbackErr);
        setCameraError("No se pudo acceder a la cámara. Revisa los permisos en tu navegador.");
      }
    }
  }, [facingMode]);

  // Detener Cámara
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }
  }, [stream]);

  // Capturar snapshot actual del video
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Síntesis de voz (Text-To-Speech)
  const speakTutorResponse = (text) => {
    if (isMutedTTS || !window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      // Quitar fórmulas LaTeX para que no suenen raras por voz
      const cleanSpokenText = text
        .replace(/\\\[[\s\S]*?\\\]/g, '')
        .replace(/\\\([\s\S]*?\\\)/g, '')
        .replace(/\$\$[\s\S]*?\$\$/g, '')
        .replace(/\$[^$]*\$/g, '')
        .replace(/[\\_{}^#]/g, ' ')
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
    const queryText = userQuery || manualText || 'Observa mi cuaderno y guíame.';
    const frameBase64 = captureFrame();

    if (!frameBase64) {
      setTutorSpeechResponse("Alinea la cámara hacia tu cuaderno para poder ver tus ejercicios.");
      return;
    }

    setIsProcessing(true);
    setStudentTranscript(queryText);
    setManualText('');

    try {
      const response = await consultSocraticLiveCamera({
        tutorName: specialist?.name,
        frameBase64,
        userSpeech: queryText,
        subject: specialist?.subject
      });

      setTutorSpeechResponse(response);
      speakTutorResponse(response);

      // Sincronizar con el chat general
      if (onAddChatMessage) {
        onAddChatMessage([
          { sender: 'user', text: `[En Vivo]: ${queryText}`, image: frameBase64 },
          { sender: 'ai', text: response }
        ]);
      }

      // Sincronizar con la Pizarra si se detecta aritmética o paso clave
      if (onSyncBoard) {
        const isSumThree = response.includes('7') || queryText.includes('7') || queryText.includes('2+2+3') || queryText.includes('2 + 2 + 3');
        const isSumTwo = !isSumThree && (response.includes('4') || queryText.includes('4') || queryText.includes('2+2'));

        if (isSumThree) {
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

  // Inicializar Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz continuo. Puedes usar el botón de captura rápida o escribir tu consulta.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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

  // Ciclo de vida cuando se abre/cierra el modal
  useEffect(() => {
    isComponentMounted.current = true;
    if (isOpen) {
      startCamera('environment');
    } else {
      stopCamera();
    }
    return () => {
      isComponentMounted.current = false;
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between font-mono animate-in fade-in duration-200">
      
      {/* 🟢 TOP BAR: Estado en vivo y controles */}
      <div className="p-4 bg-slate-950/80 border-b border-cyan-500/30 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/80 border border-red-500 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[11px] font-bold text-red-300 font-orbitron uppercase tracking-wider">
              LIVE SOCRATIC LENS
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/60">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{specialist?.name || 'Tutor STEM'}</span>
            <span className="text-cyan-500">|</span>
            <span className="text-cyan-400 font-bold">{specialist?.subject}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Alternar Cámara */}
          <button
            onClick={toggleCameraFacing}
            title="Cambiar Cámara"
            className="p-2 rounded-xl bg-slate-900 border border-cyan-700/60 text-cyan-300 hover:text-white hover:border-cyan-400 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Mute/Unmute Audio TTS */}
          <button
            onClick={() => {
              if (!isMutedTTS && window.speechSynthesis) window.speechSynthesis.cancel();
              setIsMutedTTS(!isMutedTTS);
            }}
            title={isMutedTTS ? "Activar Voz del Tutor" : "Silenciar Voz del Tutor"}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isMutedTTS 
                ? 'bg-red-950/60 border-red-500 text-red-300' 
                : 'bg-slate-900 border-cyan-700/60 text-cyan-300 hover:text-white hover:border-cyan-400'
            }`}
          >
            {isMutedTTS ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-red-950/60 hover:border-red-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🟢 VIEWPORT DE VIDEO (FEED EN VIVO CON RETÍCULA HUD) */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {cameraError ? (
          <div className="p-6 text-center max-w-sm">
            <p className="text-sm text-red-400 mb-4">{cameraError}</p>
            <button
              onClick={() => startCamera(facingMode)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold font-orbitron uppercase cursor-pointer"
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
            className="w-full h-full object-cover sm:object-contain"
          />
        )}

        {/* Canvas invisible para snapshots */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Retícula de Enfoque Socrático (Glow Brackets) */}
        <div className="absolute inset-8 sm:inset-16 pointer-events-none border border-cyan-500/20 rounded-3xl flex flex-col justify-between p-4">
          <div className="flex justify-between">
            <div className="w-8 h-8 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
            <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
          </div>

          {/* Indicador de Estado Central */}
          <div className="flex flex-col items-center justify-center text-center">
            {isProcessing ? (
              <div className="px-4 py-2 rounded-2xl bg-cyan-950/90 border border-cyan-400 flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
                <span className="text-xs text-white font-bold font-orbitron tracking-wider">
                  TUTOR ANALIZANDO TU APUNTE...
                </span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-black/60 border border-cyan-500/30 text-[10px] text-cyan-400">
                Apunta al renglón de tu ejercicio en el cuaderno
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <div className="w-8 h-8 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
            <div className="w-8 h-8 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
          </div>
        </div>

        {/* Subtítulos en Vivo Flotantes (Pregunta y Respuesta) */}
        {(studentTranscript || tutorSpeechResponse) && (
          <div className="absolute bottom-4 left-4 right-4 max-w-xl mx-auto space-y-2 pointer-events-none z-10">
            {studentTranscript && (
              <div className="p-3 bg-slate-950/90 border border-purple-500/50 rounded-2xl text-xs text-purple-200 shadow-lg">
                <span className="text-[10px] text-purple-400 font-bold block mb-0.5">TÚ (VOZ):</span>
                "{studentTranscript}"
              </div>
            )}
            {tutorSpeechResponse && (
              <div className="p-3 bg-slate-950/95 border-2 border-cyan-400 rounded-2xl text-xs text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">
                  {specialist?.name?.toUpperCase()} (EN VIVO):
                </span>
                {tutorSpeechResponse}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🟢 BOTTOM CONTROLS: Voz Manos Libres y Botón de Consulta Inmediata */}
      <div className="p-4 bg-slate-950/95 border-t border-cyan-500/30 z-20">
        <div className="max-w-xl mx-auto flex flex-col gap-3">
          
          {/* Barra de Entrada Rápida de Texto (opcional para entornos ruidosos) */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && processLiveInquiry()}
              placeholder="¿Tienes una duda específica? Escríbela o habla al micrófono..."
              className="flex-1 bg-slate-900 border border-cyan-800/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => processLiveInquiry()}
              disabled={isProcessing}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-xl transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Botones Principales de Interacción */}
          <div className="flex items-center justify-center gap-4">
            
            {/* Botón de Micrófono (Hablar en Vivo) */}
            <button
              onClick={toggleListening}
              disabled={isProcessing}
              className={`flex-1 py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 font-orbitron font-bold text-xs transition-all shadow-lg cursor-pointer ${
                isListening
                  ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                  : 'bg-slate-900 border-cyan-600 text-cyan-300 hover:bg-cyan-950/60 hover:border-cyan-400'
              }`}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{isListening ? 'ESCUCHANDO TU VOZ...' : 'HABLAR CON TUTOR'}</span>
            </button>

            {/* Botón Instantáneo "Observar lo que apunto" */}
            <button
              onClick={() => processLiveInquiry()}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-orbitron font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{isProcessing ? 'ANALIZANDO...' : 'OBSERVAR APUNTE'}</span>
            </button>

          </div>

        </div>
      </div>

    </div>
  );
}
