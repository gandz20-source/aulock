import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ASSISTANTS, sendMessageToAI } from '../services/OpenAIService';
import { analyzeExerciseImageWithGemini } from '../services/GeminiService';
import MathRenderer from '../components/common/MathRenderer';
import { ArrowLeft, Send, ImageIcon, X, Loader, Camera, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { processGeminiResponse } from '../services/GeminiIntegrationService';
import { useUI } from '../context/UIContext';

const ChatInterface = () => {
    const { assistantId } = useParams();
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { dispatch } = useUI();

    // Safety check for invalid assistantId
    const assistant = ASSISTANTS[assistantId];

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // Initial greeting
    useEffect(() => {
        if (!assistant) {
            navigate('/ai-campus');
            return;
        }
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: `¡Hola! Soy ${assistant.name}, tu ${assistant.role}. Puedes escribirme tus dudas o usar **📷 Escanear Cuaderno** para que analice tus ejercicios paso a paso.`
            }]);
        }
    }, [assistant, assistantId, navigate]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || loading) return;

        const imageToSend = selectedImage;
        const promptToSend = input.trim();

        const userMessage = { 
            role: 'user', 
            content: promptToSend || (imageToSend ? 'Analiza el ejercicio de mi cuaderno.' : ''),
            image: imageToSend
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        setInput('');
        setSelectedImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (cameraInputRef.current) cameraInputRef.current.value = '';
        setLoading(true);

        try {
            let finalContent = '';

            // 1. Multimodal Vision Call if image is attached
            if (imageToSend) {
                finalContent = await analyzeExerciseImageWithGemini({
                    tutorId: assistantId,
                    tutorName: assistant.name,
                    imageBase64: imageToSend,
                    mimeType: 'image/jpeg',
                    promptText: promptToSend || 'Analiza el ejercicio escrito a mano en mi cuaderno, detecta el error en el paso a paso y guíame socráticamente usando formato LaTeX.'
                });
                setMessages(prev => [...prev, { role: 'assistant', content: finalContent }]);
            } else {
                // 2. Standard Text Call with Context Injection
                const response = await sendMessageToAI(
                    assistantId,
                    updatedMessages,
                    profile?.id,
                    null
                );

                finalContent = response.content;

                try {
                    if (typeof response.content === 'string' && response.content.trim().startsWith('{')) {
                        const jsonResponse = JSON.parse(response.content);
                        finalContent = await processGeminiResponse(jsonResponse, profile?.id, dispatch);
                    }
                } catch (e) {
                    console.warn("AI response was not JSON, processing as plain text.", e);
                }

                setMessages(prev => [...prev, { ...response, content: finalContent }]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Lo siento, tuve un problema al procesar tu consulta. Por favor intenta de nuevo.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!assistant) return null;

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-slate-900/95 border-b border-slate-800 shadow-md z-10">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/ai-campus')}
                        className="mr-3 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                        title="Volver al AI Campus"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-2xl mr-3 shadow">
                        {assistant.avatar && assistant.avatar.startsWith('data:') ? (
                            <img src={assistant.avatar} alt={assistant.name} className="w-8 h-8 rounded-full" />
                        ) : (
                            assistant.avatar || assistant.icon || '📐'
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-bold text-white font-orbitron text-sm md:text-base">{assistant.name}</h1>
                            <span className="text-[10px] bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-mono px-2 py-0.5 rounded-full">
                                ● Socrático STEM
                            </span>
                        </div>
                        <p className="text-xs text-cyan-400/80 font-mono">{assistant.role}</p>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 rounded-lg">
                        LaTeX Habilitado $$...$$
                    </span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[88%] md:max-w-[80%] rounded-2xl px-4 py-3.5 shadow-lg ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none border border-blue-400/30'
                                : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                                }`}
                        >
                            {/* Attached Image Thumbnail */}
                            {msg.image && (
                                <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 max-w-sm shadow-md">
                                    <img src={msg.image} alt="Cuaderno Escaneado" className="w-full h-auto max-h-56 object-cover" />
                                    <div className="bg-slate-950/80 px-2.5 py-1 text-[11px] text-cyan-300 font-mono flex items-center gap-1.5 border-t border-white/10">
                                        <Camera className="w-3.5 h-3.5" />
                                        <span>📷 Cuaderno Escaneado (Lente Socrático)</span>
                                    </div>
                                </div>
                            )}

                            {/* Beautiful Math Rendering for LaTeX and Text */}
                            <MathRenderer 
                                content={msg.content} 
                                className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-200'}`}
                            />
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            <span className="text-xs font-mono text-cyan-300 ml-2">Analizando desarrollo y expresiones LaTeX...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/95 border-t border-slate-800">
                <div className="max-w-4xl mx-auto space-y-2">
                    {/* Image Preview with Socratic Lens badge */}
                    {selectedImage && (
                        <div className="p-3 bg-slate-950 border border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-xl border border-emerald-400/80 shadow" />
                                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full text-[9px] font-bold">✓</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 text-xs font-orbitron font-bold text-emerald-300">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>LENTE SOCRÁTICO // CUADERNO LISTO</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                        El tutor analizará la ecuación escrita a mano e identificará el paso exacto a corregir.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-xl transition-colors"
                                title="Descartar imagen"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        {/* Hidden Native Camera Input (Capture Environment) */}
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            ref={cameraInputRef}
                            onChange={handleImageSelect}
                        />

                        {/* Hidden Gallery Input */}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                        />

                        {/* Prominent Socratic Lens Camera Button */}
                        <button
                            type="button"
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3.5 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-2xl shadow-lg hover:shadow-cyan-500/20 font-bold text-xs font-mono transition-all transform active:scale-95 shrink-0 border border-emerald-400/30"
                            title="Escanear cuaderno con cámara (The Socratic Lens)"
                        >
                            <Camera className="w-4 h-4 text-emerald-100 animate-pulse" />
                            <span className="hidden sm:inline font-bold">📷 Escanear Cuaderno</span>
                            <span className="sm:hidden font-bold">📷 Escanear</span>
                        </button>

                        {/* Gallery Attach Icon */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors"
                            title="Subir imagen desde archivo"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={selectedImage ? "Añade una pregunta sobre tu foto..." : "Escribe tu duda o ecuación..."}
                            className="flex-1 p-3 bg-slate-950 text-white placeholder-slate-500 border border-slate-800 rounded-2xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm font-mono"
                        />

                        <button
                            type="submit"
                            disabled={(!input.trim() && !selectedImage) || loading}
                            className={`p-3 rounded-2xl transition-all ${(!input.trim() && !selectedImage) || loading
                                ? 'bg-slate-800 text-slate-600 border border-slate-800 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40'
                                }`}
                            title="Enviar al Tutor Socrático"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
