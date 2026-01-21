import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ASSISTANTS, sendMessageToAI } from '../services/OpenAIService';
import { ArrowLeft, Send, ImageIcon, X, Loader } from 'lucide-react';
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

    // Initial greeting
    useEffect(() => {
        if (!assistant) {
            navigate('/ai-campus');
            return;
        }
        if (messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: `¡Hola! Soy ${assistant.name}, tu ${assistant.role}. ¿En qué puedo ayudarte hoy?`
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
        const file = e.target.files[0];
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
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !selectedImage) || loading) return;

        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await sendMessageToAI(
                assistantId,
                updatedMessages,
                profile?.id,
                selectedImage
            );

            // Integrate Gemini V2 Service (Process JSON/Stats/Alerts)
            // Note: Currently 'sendMessageToAI' returns a formatted message object { role, content }
            // If the AI returns a JSON string in 'content', we need to parse it.
            // Assumption: The backend/AI prompt is ensuring a valid JSON structure if this service is active.

            // Temporary Logic: Attempt to parse if it looks like JSON, or pass as is if the service handles it.
            // For now, let's assume 'response.content' might be the JSON string.

            let finalContent = response.content;

            try {
                // Heuristic: Check if response starts with {
                if (response.content.trim().startsWith('{')) {
                    const jsonResponse = JSON.parse(response.content);
                    // Process via service
                    finalContent = await processGeminiResponse(jsonResponse, profile?.id, dispatch);
                }
            } catch (e) {
                console.warn("AI response was not JSON, processing as plain text.", e);
            }

            setMessages(prev => [...prev, { ...response, content: finalContent }]);
            setSelectedImage(null); // Clear image after sending
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!assistant) return null;

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <div className="flex items-center p-4 bg-white shadow-sm z-10">
                <button
                    onClick={() => navigate('/ai-campus')}
                    className="mr-3 p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-3">
                    {assistant.avatar}
                </div>
                <div>
                    <h1 className="font-bold text-slate-800">{assistant.name}</h1>
                    <p className="text-xs text-slate-500">{assistant.role}</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                }`}
                        >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            {/* Note: If we stored image history, we'd confirm it here, but state only has text for now? 
                                Actually we passed image to API but didn't push it to local state specifically as a separate item, 
                                just text content. For MVP this is fine. */}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="max-w-3xl mx-auto">
                    {/* Image Preview */}
                    {selectedImage && (
                        <div className="mb-2 relative inline-block">
                            <img src={selectedImage} alt="Preview" className="h-20 rounded-lg border border-slate-200 shadow-sm" />
                            <button
                                onClick={removeImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Adjuntar imagen"
                        >
                            <ImageIcon className="w-6 h-6" />
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={selectedImage ? "Añade un comentario..." : "Escribe tu mensaje..."}
                            className="flex-1 p-3 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />

                        <button
                            type="submit"
                            disabled={(!input.trim() && !selectedImage) || loading}
                            className={`p-3 rounded-full transition-all ${(!input.trim() && !selectedImage) || loading
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
