import { useNavigate } from 'react-router-dom';
import { ASSISTANTS } from '../services/OpenAIService';
import { ArrowLeft } from 'lucide-react';

const AICampus = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="mr-4 p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">AI Campus</h1>
                        <p className="text-slate-500">Tus asistentes virtuales especializados</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(ASSISTANTS).map(([key, assistant]) => (
                        <button
                            key={key}
                            onClick={() => navigate(`/ai-chat/${key}`)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 text-left group"
                        >
                            {assistant.avatar && assistant.avatar.startsWith('data:') ? (
                                <img 
                                    src={assistant.avatar} 
                                    alt={assistant.name} 
                                    className="w-14 h-14 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md border border-slate-200" 
                                />
                            ) : (
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {assistant.avatar || assistant.icon || '📐'}
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{assistant.name}</h3>
                            <p className="text-sm text-blue-600 font-medium mb-2">{assistant.role}</p>
                            <p className="text-sm text-slate-500 line-clamp-2">
                                {key === 'newton' && 'Resuelve ecuaciones, números, cálculo y física.'}
                                {key === 'curie' && 'Explicación de química, moléculas y reacciones.'}
                                {key === 'shakespeare' && 'Práctica de lenguaje, literatura e inglés.'}
                                {key === 'teapoyo' && 'Apoyo directo, literal y estructurado.'}
                                {key === 'guardian' && 'Orientación académica y bienestar escolar.'}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AICampus;
