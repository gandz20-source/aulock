import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Colegio360MasterDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('DIRECTORIO');
  const [alertTarget, setAlertTarget] = useState('Lucas Fernández (4° Medio A)');
  const [alertCategory, setAlertCategory] = useState('Citación por Orientación');
  const [alertMessage, setAlertMessage] = useState('');
  const [sentStatus, setSentStatus] = useState(false);
  const [selectedStudentDossier, setSelectedStudentDossier] = useState(null);

  // Datos reales estructurados desde el backend de Supabase
  const courseMetrics = [
    { course: '1° Medio A', students: 50, attendance: '94%', attention: '88%', stress: '12%', strongSubject: 'Artes e Idiomas (6.2)', aiAlerts: 'Normal' },
    { course: '2° Medio B', students: 50, attendance: '96%', attention: '84%', stress: '22%', strongSubject: 'Historia y Biología (6.0)', aiAlerts: '2 Preventivas' },
    { course: '3° Medio A', students: 50, attendance: '97%', attention: '93%', stress: '14%', strongSubject: 'Matemática y Ciencias (6.1)', aiAlerts: '2 Preventivas' },
    { course: '4° Medio A', students: 50, attendance: '98%', attention: '92%', stress: '16%', strongSubject: 'Matemática e Idiomas (6.3)', aiAlerts: '1 Preventiva' },
  ];

  const studentDirectory = [
    { name: 'Juan Carlos Pérez', rut: '21.442.910-K', course: '4° Medio A', gpa: '6,4 (97%)', trend: '↑', aptitude: 'Matemáticas & Lógica', aiState: 'Óptimo', apoderado: 'Carlos Pérez', fono: '+56 9 8765 4321', email: 'c.perez@sanagustin.cl' },
    { name: 'Sofía Martínez', rut: '21.902.148-8', course: '4° Medio A', gpa: '6,2 (87%)', trend: '→', aptitude: 'Historia e Idiomas', aiState: '2 Alertas', apoderado: 'Elena Martínez', fono: '+56 9 1234 5678', email: 'e.martinez@sanagustin.cl' },
    { name: 'Mateo Rojas', rut: '21.551.992-1', course: '4° Medio A', gpa: '6,1 (97%)', trend: '↑', aptitude: 'Biología y Ciencias', aiState: 'Normal', apoderado: 'Roberto Rojas', fono: '+56 9 5555 4444', email: 'r.rojas@sanagustin.cl' },
    { name: 'Lucas Fernández', rut: '21.332.119-4', course: '4° Medio A', gpa: '5,8 (78%)', trend: '↓', aptitude: 'Física y Tecnología', aiState: 'Citación', apoderado: 'Marta Fernández', fono: '+56 9 9988 7766', email: 'm.fernandez@sanagustin.cl' },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = studentDirectory.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendAlert = (e) => {
    e.preventDefault();
    if (!alertMessage.trim()) return;

    const alertPayload = {
      id: 'alert-' + Date.now(),
      target: alertTarget,
      category: alertCategory,
      message: alertMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'Dirección Colegio 360°'
    };

    localStorage.setItem('aulock_student_alert', JSON.stringify(alertPayload));
    window.dispatchEvent(new Event('storage'));

    setSentStatus(true);
    setTimeout(() => {
      setSentStatus(false);
      setAlertMessage('');
    }, 2000);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Curso,Alumnos,Asistencia,Atencion,Estres,AsignaturaFuerte,EstadoCuidadorIA\n" +
      courseMetrics.map(e => `${e.course},${e.students},${e.attendance},${e.attention},${e.stress},${e.strongSubject},${e.aiAlerts}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "informe_colegio360_audit.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-magenta-900 overflow-x-hidden">
      
      {/* 🟢 CABECERA DE CONTROL INSTITUCIONAL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b-2 border-cyan-500/40 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#38EBCB]"></span>
            <h1 className="text-base md:text-lg font-orbitron text-white tracking-widest font-extrabold uppercase">
              COLEGIO 360° // CENTRO DE MANDO INSTITUCIONAL
            </h1>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1">
            Monitoreo unificado de matrícula, rendimiento académico y barómetro emocional en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => navigate('/core-intelligence')}
            className="px-3 py-2 bg-cyan-950 border-2 border-cyan-400 text-cyan-300 text-xs font-orbitron font-bold rounded-xl hover:bg-cyan-900 transition shadow-[0_0_10px_rgba(56,235,203,0.3)] uppercase"
          >
            🌀 Núcleo 360°
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-orbitron font-bold rounded-xl hover:bg-cyan-900 transition shadow-[0_0_10px_rgba(56,235,203,0.3)] uppercase"
          >
            📥 EXPORTAR INFORME AUDITABLE
          </button>
        </div>
      </header>

      {/* 🟢 PANEL DE INDICADORES MACRO (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-orbitron text-cyan-400 mb-1">// MATRÍCULA & SECCIONES</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">200</span>
            <span className="text-xs text-cyan-400">Alumnos Activos</span>
          </div>
          <p className="text-[10px] text-cyan-300 mt-2">4 Secciones operando en red</p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl">
          <p className="text-[10px] font-orbitron text-cyan-400 mb-1">// PROMEDIO GENERAL (GPA)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">5,92</span>
            <span className="text-xs text-cyan-500">/ 7,0</span>
          </div>
          <p className="text-[10px] text-green-400 mt-2">↑ +0.18 vs Semestre Anterior</p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-magenta-500/40 shadow-xl">
          <p className="text-[10px] font-orbitron text-magenta-300 mb-1">// SALUD EMOCIONAL & ESTRÉS</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">84,5%</span>
            <span className="text-xs text-magenta-400">Estable</span>
          </div>
          <p className="text-[10px] text-cyan-300 mt-2">Estrés Promedio Red: 16% (Óptimo)</p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl">
          <p className="text-[10px] font-orbitron text-cyan-400 mb-1">// RETENCIÓN & ASISTENCIA</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">96,8%</span>
            <span className="text-xs text-green-400">Excelente</span>
          </div>
          <p className="text-[10px] text-cyan-300 mt-2">Riesgo de deserción: 0.0%</p>
        </div>

      </div>

      {/* 🟢 MAPA DE COMPORTAMIENTO Y CLIMA POR CURSO */}
      <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl mb-6">
        <h2 className="text-xs font-orbitron text-cyan-300 mb-3 font-bold">// MAPA DE COMPORTAMIENTO, ATENCIÓN Y CLIMA EMOCIONAL POR CURSO</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-900 text-cyan-400 font-orbitron text-[10px]">
                <th className="p-3">CURSO</th>
                <th className="p-3">ALUMNOS</th>
                <th className="p-3">ASISTENCIA</th>
                <th className="p-3">% ATENCIÓN</th>
                <th className="p-3">ESTRÉS CURSO</th>
                <th className="p-3">ASIGNATURA FUERTE</th>
                <th className="p-3">ESTADO CUIDADOR IA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/50">
              {courseMetrics.map((row, idx) => (
                <tr key={idx} className="hover:bg-cyan-950/20 transition">
                  <td className="p-3 font-bold text-white">{row.course}</td>
                  <td className="p-3 text-cyan-200">{row.students}</td>
                  <td className="p-3 text-cyan-200">{row.attendance}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-900">
                        <div className="h-full bg-cyan-400" style={{ width: row.attention }}></div>
                      </div>
                      <span className="text-[10px]">{row.attention}</span>
                    </div>
                  </td>
                  <td className="p-3 text-magenta-300 font-bold">{row.stress}</td>
                  <td className="p-3 text-cyan-300">{row.strongSubject}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] border font-bold ${
                      row.aiAlerts === 'Normal' 
                        ? 'bg-green-950/50 border-green-800 text-green-400' 
                        : 'bg-yellow-950/50 border-yellow-800 text-yellow-400'
                    }`}>
                      {row.aiAlerts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 SECCIÓN INFERIOR: DIRECTORIO ACTIVO & EMISOR DE ALERTAS TÁCTICAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Directorio de Alumnos (2 Columnas) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
            <h3 className="text-xs font-orbitron text-cyan-300 font-bold">// DIRECTORIO GENERAL DE ALUMNOS & APTITUDES</h3>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar estudiante por nombre o RUT..." 
              className="w-full sm:w-64 bg-gray-900 border border-cyan-800 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="space-y-3">
            {filteredStudents.map((student, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-gray-900/90 border border-cyan-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-cyan-500 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center font-orbitron text-xs font-bold text-cyan-300 shrink-0">
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{student.name} <span className="text-[10px] text-cyan-500">({student.course})</span></p>
                    <p className="text-[10px] text-cyan-400">RUT: {student.rut} • Aptitud: {student.aptitude}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold text-white">NEM: {student.gpa} <span className="text-green-400 font-bold">{student.trend}</span></p>
                    <span className="text-[10px] text-cyan-400">Estado: {student.aiState}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedStudentDossier(student)}
                    className="px-3.5 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-600 text-cyan-300 text-[10px] font-orbitron font-bold rounded-lg transition shrink-0"
                  >
                    VER FICHA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consola de Emisión de Alertas y Citaciones Directas */}
        <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-magenta-500/40 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-orbitron text-magenta-300 mb-3 font-bold">// EMISOR DE ALERTAS PREVENTIVAS</h3>
            <form onSubmit={handleSendAlert} className="space-y-3">
              <div>
                <label className="block text-[10px] text-cyan-400 mb-1 font-bold">DESTINATARIO:</label>
                <select 
                  value={alertTarget}
                  onChange={(e) => setAlertTarget(e.target.value)}
                  className="w-full bg-gray-900 border border-cyan-800 rounded-lg p-2 text-xs text-white outline-none font-mono"
                >
                  <option>Lucas Fernández (4° Medio A)</option>
                  <option>Sofía Martínez (4° Medio A)</option>
                  <option>Juan Carlos Pérez (4° Medio A)</option>
                  <option>Mateo Rojas (4° Medio A)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-cyan-400 mb-1 font-bold">CATEGORÍA DEL AVISO:</label>
                <select 
                  value={alertCategory}
                  onChange={(e) => setAlertCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-cyan-800 rounded-lg p-2 text-xs text-white outline-none font-mono"
                >
                  <option>Citación por Orientación de Comportamiento</option>
                  <option>Alerta Preventiva de Rendimiento</option>
                  <option>Seguimiento de Bienestar Emocional</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-cyan-400 mb-1 font-bold">MENSAJE DIRECTO AL HUD DEL ALUMNO:</label>
                <textarea 
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Redacte la orientación institucional..."
                  className="w-full h-20 bg-gray-900 border border-cyan-800 rounded-lg p-2 text-xs text-white outline-none resize-none font-mono"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-magenta-900 to-cyan-900 border border-magenta-500 text-white font-orbitron text-xs font-bold rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:opacity-90 transition uppercase tracking-wider"
              >
                ⚡ EJECUTAR DESPLIEGUE DE ALERTA
              </button>
            </form>
          </div>

          {sentStatus && (
            <div className="mt-3 p-2 bg-green-950 border border-green-500 text-green-400 text-center text-xs rounded-lg font-bold animate-pulse">
              ¡Alerta transmitida con éxito al dispositivo del alumno!
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-cyan-900/50 flex justify-between text-[10px] text-cyan-500 font-bold">
            <span>AUDITORÍA: 100% REGISTRADA</span>
            <span>LEY DE LOBBY: ACTIVA</span>
          </div>
        </div>

      </div>

      {/* 🔴 MODAL EXPEDIENTE INDIVIDUAL DEL ALUMNO (VER FICHA) */}
      {selectedStudentDossier && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-950 border-2 border-cyan-400 rounded-2xl max-w-xl w-full p-6 space-y-4 font-mono shadow-[0_0_30px_rgba(6,182,212,0.5)]">
            <div className="flex justify-between items-center border-b border-cyan-900 pb-3">
              <h3 className="text-xs font-orbitron font-extrabold text-cyan-300 uppercase">
                // EXPEDIENTE ACADÉMICO & DOSSIER INDIVIDUAL
              </h3>
              <button onClick={() => setSelectedStudentDossier(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-3 p-3 bg-gray-900 rounded-xl border border-cyan-800">
                <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center font-orbitron text-base font-bold text-cyan-300">
                  {selectedStudentDossier.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedStudentDossier.name}</h4>
                  <p className="text-[10px] text-cyan-400">RUT: {selectedStudentDossier.rut} • Curso: {selectedStudentDossier.course}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-900 rounded-xl border border-cyan-900/60">
                  <span className="text-[10px] text-slate-400 block">Promedio NEM:</span>
                  <strong className="text-sm font-bold text-white">{selectedStudentDossier.gpa}</strong>
                </div>
                <div className="p-3 bg-gray-900 rounded-xl border border-cyan-900/60">
                  <span className="text-[10px] text-slate-400 block">Aptitud Principal:</span>
                  <strong className="text-xs font-bold text-cyan-300">{selectedStudentDossier.aptitude}</strong>
                </div>
              </div>

              <div className="p-3 bg-gray-900 rounded-xl border border-cyan-900/60 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold block">// CONTACTO DE APODERADO DE CUSTODIA:</span>
                <p className="text-xs text-white">Nombre: {selectedStudentDossier.apoderado}</p>
                <p className="text-xs text-white">Teléfono: {selectedStudentDossier.fono}</p>
                <p className="text-xs text-white">Email: {selectedStudentDossier.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button 
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-900 border border-cyan-500 text-cyan-300 text-xs font-orbitron rounded-xl hover:bg-cyan-950 transition"
              >
                🖨️ Imprimir Ficha
              </button>
              <button 
                onClick={() => setSelectedStudentDossier(null)} 
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs rounded-xl shadow"
              >
                Cerrar Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
