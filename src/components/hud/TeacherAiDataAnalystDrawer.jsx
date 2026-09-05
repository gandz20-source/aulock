import React, { useState, useEffect, useRef } from 'react';
import { 
    BrainCircuit, Sparkles, Send, X, Download, FileText, 
    RefreshCw, ChevronRight, CheckCircle2, AlertTriangle, 
    Database, Activity, Table, Maximize2, Minimize2, Users, Flame
} from 'lucide-react';
import { askDataAnalystAI } from '../../services/TeacherDataAnalystService';
import { exportReportToCSV, exportReportToPDF } from '../../utils/reportExportUtils';

export default function TeacherAiDataAnalystDrawer({
    isOpen,
    onClose,
    activeCourse = '4° Medio A',
    teacherName = 'Prof. Carlos Rivas'
}) {
    const [inputQuery, setInputQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpandedFull, setIsExpandedFull] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial conversation history with helpful welcome message
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('aulock_teacher_ai_analyst_chat');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return [
            {
                id: 'welcome-msg',
                sender: 'ai',
                text: `👋 **Bienvenido, ${teacherName}.** Soy el **Analista de Datos Docentes de AuLock**.\n\nEstoy conectado directamente a la base de datos de telemetría de **Supabase** para auditar rendimiento académico, caídas de foco y estadísticas de **${activeCourse}** sin alucinaciones ni conjeturas.\n\nPuedes preguntarme por métricas puntuales o solicitar reportes oficiales listos para exportar.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                toolExecuted: null,
                structuredData: null
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('aulock_teacher_ai_analyst_chat', JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (queryText) => {
        const q = (queryText || inputQuery).trim();
        if (!q || isLoading) return;

        const userMsg = {
            id: 'user-' + Date.now(),
            sender: 'user',
            text: q,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputQuery('');
        setIsLoading(true);

        try {
            const aiResponse = await askDataAnalystAI({
                query: q,
                conversationHistory: messages.slice(-6),
                teacherName,
                activeCourse
            });

            const aiMsg = {
                id: 'ai-' + Date.now(),
                sender: 'ai',
                text: aiResponse.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                toolExecuted: aiResponse.toolExecuted,
                toolArgs: aiResponse.toolArgs,
                structuredData: aiResponse.structuredData
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: 'ai-err-' + Date.now(),
                sender: 'ai',
                text: '❌ Hubo un inconveniente al consultar la telemetría en Supabase. Por favor intenta de nuevo.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 1-Click Export Handlers
    const handleDownloadCSV = (msg) => {
        const data = msg.structuredData;
        let headers = [];
        let rows = [];
        let title = 'Reporte_Telemetria';

        if (data?.top_students) {
            title = `Top_Estudiantes_${data.query_subject || 'General'}`;
            headers = ['Nombre', 'Curso', 'Asignatura', 'Nota_Asignatura', 'GPA_General', 'Atencion_Continua', 'Rol_en_Squad', 'Fortalezas'];
            rows = data.top_students.map(s => [
                s.name, s.course, s.subject, s.score, s.gpa, s.attention, s.role, s.strengths
            ]);
        } else if (data?.students) {
            title = `Alertas_Foco_${data.course_audited || 'Curso'}`;
            headers = ['Nombre', 'Curso', 'Retencion_Foco', 'Salidas_Pestana', 'Estado', 'Registro_Incidente', 'Brecha_Conceptual'];
            rows = data.students.map(s => [
                s.name, s.course, s.attention, s.tabExits, s.status, s.incidentLog, s.weaknesses
            ]);
        } else if (data?.course) {
            title = `Estadisticas_${data.course}`;
            headers = ['Metrica', 'Valor_Registrado'];
            rows = [
                ['Curso Auditado', data.course],
                ['Estudiantes Matriculados', data.enrolled_students],
                ['Promedio GPA General', data.average_gpa],
                ['Tasa de Atencion Continua', data.average_attention_rate],
                ['Total Salidas de Pantalla', data.total_tab_exits_detected],
                ['Principal Brecha', data.top_concept_failure]
            ];
        } else {
            // General text fallback
            title = 'Reporte_Analista_AuLock';
            headers = ['Resumen', 'Detalle'];
            rows = [['Consulta Realizada', msg.text.slice(0, 100)], ['Fecha', new Date().toISOString()]];
        }

        exportReportToCSV({ title, headers, rows });
    };

    const handleDownloadPDF = (msg) => {
        const data = msg.structuredData;
        let headers = [];
        let rows = [];
        let title = 'INFORME ANALÍTICO DE RENDIMIENTO Y TELEMETRÍA';

        if (data?.top_students) {
            title = `NÓMINA DE RENDIMIENTO DESTACADO // ${data.query_subject || 'CIENCIAS'}`;
            headers = ['Estudiante', 'Curso', 'Nota Área', 'GPA', 'Atención', 'Rol Squad'];
            rows = data.top_students.map(s => [
                s.name, s.course, `${s.score} / 7.0`, s.gpa, s.attention, s.role
            ]);
        } else if (data?.students) {
            title = 'AUDITORÍA DE FOCO Y SALIDAS DE PANTALLA EN SALA';
            headers = ['Estudiante', 'Curso', 'Foco', 'Salidas', 'Diagnóstico / Incidente'];
            rows = data.students.map(s => [
                s.name, s.course, s.attention, `${s.tabExits} salidas`, s.incidentLog
            ]);
        } else if (data?.course) {
            title = `ESTADÍSTICAS CONSOLIDADAS DEL CURSO ${data.course}`;
            headers = ['Dimensión / Indicador', 'Resultado Registrado en Telemetría'];
            rows = [
                ['Alumnos Matriculados', `${data.enrolled_students} estudiantes`],
                ['Promedio General (GPA)', `${data.average_gpa} / 7.0`],
                ['Tasa de Atención Continua', data.average_attention_rate],
                ['Salidas de Pantalla Totales', `${data.total_tab_exits_detected} eventos`],
                ['Brecha Conceptual Detectada', data.top_concept_failure]
            ];
        } else {
            headers = ['Sección', 'Contenido'];
            rows = [['Diagnóstico', msg.text]];
        }

        exportReportToPDF({
            title,
            subtitle: 'Auditoría Oficial SLEP Andalién Sur • Sistema AuLock',
            teacherName,
            course: activeCourse,
            headers,
            rows,
            summaryNotes: msg.text
        });
    };

    // Quick prompt triggers
    const QUICK_PROMPTS = [
        { label: '🏆 Top Alumnos en Ciencias', query: `¿Quiénes son los estudiantes con mejor rendimiento en Ciencias en ${activeCourse}?` },
        { label: '⚠️ Caídas de Foco & Salidas', query: `¿Qué alumnos presentan caídas de foco y salidas de pestaña en ${activeCourse}?` },
        { label: '📊 Estadísticas Consolidadas', query: `Dame las estadísticas y promedio general del curso ${activeCourse}` },
        { label: '📄 Reporte para Nivelación', query: `Genera un reporte analítico de los alumnos que necesitan nivelación en ${activeCourse}` }
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-mono">
            
            {/* HUD Floating Drawer Panel */}
            <div className={`relative h-full flex flex-col bg-slate-950/95 backdrop-blur-2xl border-l-2 border-cyan-400 shadow-[0_0_60px_rgba(6,182,212,0.35)] transition-all duration-300 ${
                isExpandedFull ? 'w-full md:w-[90vw]' : 'w-full sm:w-[580px] md:w-[660px]'
            }`}>
                
                {/* 1. Header Bar */}
                <header className="p-4 md:p-5 border-b border-cyan-900/60 bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <BrainCircuit className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-wider uppercase">
                                    ANALISTA DE DATOS DOCENTES IA
                                </h3>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700 uppercase">
                                    GEMINI 1.5 PRO
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-cyan-300/80 font-sans mt-0.5">
                                <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                    Supabase DB Conectado
                                </span>
                                <span>•</span>
                                <span>{activeCourse}</span>
                                <span>•</span>
                                <span>{teacherName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setIsExpandedFull(!isExpandedFull)}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title={isExpandedFull ? "Vista Normal" : "Maximizar Pantalla"}
                        >
                            {isExpandedFull ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm("¿Deseas reiniciar el historial de consultas?")) {
                                    localStorage.removeItem('aulock_teacher_ai_analyst_chat');
                                    window.location.reload();
                                }
                            }}
                            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Limpiar Conversación"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-rose-950/80 border border-rose-600/60 hover:bg-rose-900 text-rose-300 hover:text-white transition cursor-pointer"
                            title="Cerrar Panel Lateral"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* 2. Quick Prompts Toolbar */}
                <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Consultas Rápidas:</span>
                    {QUICK_PROMPTS.map((p, idx) => (
                        <button
                            key={idx}
                            disabled={isLoading}
                            onClick={() => handleSendMessage(p.query)}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500 text-[10px] text-slate-200 hover:text-cyan-300 transition shrink-0 cursor-pointer font-sans"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {/* 3. Messages Chat Flow */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-sans text-xs">
                    {messages.map((msg) => {
                        const isUser = msg.sender === 'user';

                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                            >
                                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 font-mono">
                                    <span>{isUser ? '👨‍🏫 Docente' : '🤖 Analista AuLock (Data-Driven)'}</span>
                                    <span>•</span>
                                    <span>{msg.timestamp}</span>
                                </div>

                                {/* Message Bubble */}
                                <div className={`p-4 rounded-2xl max-w-[92%] md:max-w-[85%] leading-relaxed shadow-lg ${
                                    isUser
                                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-tr-none font-mono text-xs'
                                        : 'bg-slate-900/90 border border-cyan-500/40 text-slate-200 rounded-tl-none space-y-3'
                                }`}>
                                    
                                    {/* Tool Call Notification Indicator */}
                                    {!isUser && msg.toolExecuted && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-950/80 border border-cyan-500/50 rounded-xl text-[10px] font-mono text-cyan-300">
                                            <Database className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                            <span>
                                                <strong>Tool Ejecutada en Supabase:</strong> {msg.toolExecuted}({JSON.stringify(msg.toolArgs || {})})
                                            </span>
                                        </div>
                                    )}

                                    {/* Text Body */}
                                    <div className="whitespace-pre-line font-sans">
                                        {msg.text}
                                    </div>

                                    {/* Data Table Preview if structuredData exists */}
                                    {!isUser && msg.structuredData?.top_students && (
                                        <div className="mt-3 overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/90">
                                            <table className="w-full text-left text-[11px] font-mono">
                                                <thead className="bg-slate-900 text-cyan-300 border-b border-slate-800">
                                                    <tr>
                                                        <th className="p-2">Estudiante</th>
                                                        <th className="p-2">Nota Área</th>
                                                        <th className="p-2">GPA</th>
                                                        <th className="p-2">Atención</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-900">
                                                    {msg.structuredData.top_students.map((st, i) => (
                                                        <tr key={i} className="hover:bg-slate-900/50">
                                                            <td className="p-2 font-bold text-white">{st.name}</td>
                                                            <td className="p-2 text-emerald-400 font-bold">{st.score}</td>
                                                            <td className="p-2 text-amber-300">{st.gpa}</td>
                                                            <td className="p-2 text-cyan-300">{st.attention}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* ACTIONABLE AI CHAT BUBBLE BUTTONS (SMART UI: 1-CLICK EXPORT) */}
                                    {!isUser && (msg.structuredData || msg.text.includes('•') || msg.text.includes('1.')) && (
                                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                                            <button
                                                onClick={() => handleDownloadCSV(msg)}
                                                className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 font-orbitron font-bold text-[10px] rounded-xl uppercase tracking-wider transition cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>📥 Descargar Reporte (CSV)</span>
                                            </button>

                                            <button
                                                onClick={() => handleDownloadPDF(msg)}
                                                className="px-3 py-1.5 bg-purple-950 hover:bg-purple-900 border border-purple-500/80 text-purple-300 font-orbitron font-bold text-[10px] rounded-xl uppercase tracking-wider transition cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                                <span>📄 Exportar a PDF</span>
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div className="flex items-start space-y-1 animate-pulse">
                            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/50 text-cyan-300 rounded-tl-none flex items-center gap-3">
                                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                                <span className="font-mono text-xs">
                                    Consultando base de datos Supabase & formulando respuesta sin alucinaciones...
                                </span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* 4. Bottom Rich Input Area */}
                <footer className="p-4 border-t border-cyan-900/60 bg-slate-900/95 shrink-0">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="flex items-end gap-2"
                    >
                        <div className="flex-1 relative">
                            <textarea
                                value={inputQuery}
                                onChange={(e) => setInputQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                rows={2}
                                placeholder="Escribe tu consulta analítica (ej. ¿Quién es el mejor en Ciencias en 4° Medio?)..."
                                className="w-full bg-slate-950 border-2 border-cyan-500/60 focus:border-cyan-400 rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-none font-sans resize-none transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!inputQuery.trim() || isLoading}
                            className={`p-3.5 rounded-2xl font-orbitron font-bold transition flex items-center justify-center shrink-0 cursor-pointer shadow-lg ${
                                inputQuery.trim() && !isLoading
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2 px-1">
                        <span>💡 Presiona Enter para enviar • Shift + Enter para salto de línea</span>
                        <span>Motor: Google GenAI + Supabase</span>
                    </div>
                </footer>

            </div>
        </div>
    );
}
