import { useState, useEffect } from 'react';
import { Timer, CheckCircle, XCircle, Trophy } from 'lucide-react';

const TriviaCard = ({ question, onAnswer, feedback }) => {
    const [timeLeft, setTimeLeft] = useState(question.timer_seconds || 30);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (timeLeft > 0 && !feedback) {
            const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, feedback]);

    const handleOptionClick = (option) => {
        if (selectedOption || feedback) return; // Prevent changing answer
        setSelectedOption(option);
        onAnswer(option);
    };

    // Calculate progress percentage for timer bar
    const progress = (timeLeft / (question.timer_seconds || 30)) * 100;

    // Determine color based on time left
    const timerColor = timeLeft < 5 ? 'bg-red-500' : timeLeft < 10 ? 'bg-orange-500' : 'bg-blue-500';

    return (
        <div className="w-full max-w-md mx-auto perspective-1000">
            <div className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 transform ${feedback ? 'scale-105' : 'hover:scale-102'}`}>

                {/* Timer Bar */}
                <div className="h-2 w-full bg-slate-100">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear ${timerColor}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
                            {question.type === 'true_false' ? 'Verdadero / Falso' : 'Trivia'}
                        </span>
                        <div className="flex items-center text-slate-500 font-mono font-bold">
                            <Timer className="w-4 h-4 mr-1" />
                            <span>{timeLeft}s</span>
                        </div>
                    </div>

                    {/* Question */}
                    <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">
                        {question.text}
                    </h2>

                    {/* Options */}
                    <div className="space-y-3">
                        {question.options.map((option, index) => {
                            let buttonStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-300";

                            if (selectedOption === option) {
                                buttonStyle = "bg-blue-600 border-blue-600 text-white shadow-lg transform scale-102";
                            }

                            if (feedback) {
                                if (option === question.correct_answer) {
                                    buttonStyle = "bg-emerald-500 border-emerald-500 text-white shadow-lg";
                                } else if (selectedOption === option && option !== question.correct_answer) {
                                    buttonStyle = "bg-red-500 border-red-500 text-white opacity-50";
                                } else {
                                    buttonStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                                }
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={!!selectedOption || timeLeft === 0}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-semibold transition-all duration-200 flex items-center justify-between group ${buttonStyle}`}
                                >
                                    <span>{option}</span>
                                    {feedback && option === question.correct_answer && (
                                        <CheckCircle className="w-5 h-5 text-white animate-bounce" />
                                    )}
                                    {feedback && selectedOption === option && option !== question.correct_answer && (
                                        <XCircle className="w-5 h-5 text-white" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback Overlay */}
                    {feedback && (
                        <div className="mt-6 text-center animate-fade-in">
                            {feedback === 'correct' ? (
                                <div className="flex flex-col items-center text-emerald-600">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                                        <Trophy className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <p className="font-bold text-lg">¡Correcto! +10 AuCoins</p>
                                </div>
                            ) : (
                                <div className="text-red-500 font-medium">
                                    ¡Incorrecto! Inténtalo a la próxima.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TriviaCard;
