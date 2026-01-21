import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const HumanCoreRadar = ({ data }) => {
    // Default data structure if empty
    const chartData = data && data.length > 0 ? data : [
        { subject: 'Logic', A: 0, fullMark: 100 },
        { subject: 'Creativity', A: 0, fullMark: 100 },
        { subject: 'Resilience', A: 0, fullMark: 100 },
        { subject: 'Communication', A: 0, fullMark: 100 },
        { subject: 'Empathy', A: 0, fullMark: 100 },
        { subject: 'Ethics', A: 0, fullMark: 100 },
    ];

    return (
        <div className="w-full h-[400px] bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>

            <h3 className="text-slate-600 font-bold mb-2 z-10">Promedio Human Core (Clase)</h3>

            <ResponsiveContainer width="100%" height="85%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Class Average"
                        dataKey="A"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        fill="#6366f1"
                        fillOpacity={0.3}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HumanCoreRadar;
