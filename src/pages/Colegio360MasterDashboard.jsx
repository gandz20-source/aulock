import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Colegio360MasterDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('DIRECTORY');
  const [alertTarget, setAlertTarget] = useState('Lucas Fernández (Senior High A)');
  const [alertCategory, setAlertCategory] = useState('Counseling Citation');
  const [alertMessage, setAlertMessage] = useState('');
  const [sentStatus, setSentStatus] = useState(false);
  const [selectedStudentDossier, setSelectedStudentDossier] = useState(null);

  // Supabase structured backend data
  const courseMetrics = [
    { course: 'Freshman A (1° A)', students: 50, attendance: '94%', attention: '88%', stress: '12%', strongSubject: 'Arts & Languages (6.2)', aiAlerts: 'Normal' },
    { course: 'Sophomore B (2° B)', students: 50, attendance: '96%', attention: '84%', stress: '22%', strongSubject: 'History & Biology (6.0)', aiAlerts: '2 Preventive' },
    { course: 'Junior A (3° A)', students: 50, attendance: '97%', attention: '93%', stress: '14%', strongSubject: 'Mathematics & STEM (6.1)', aiAlerts: '2 Preventive' },
    { course: 'Senior A (4° A)', students: 50, attendance: '98%', attention: '92%', stress: '16%', strongSubject: 'Math & Languages (6.3)', aiAlerts: '1 Preventive' },
  ];

  const studentDirectory = [
    { name: 'Juan Carlos Pérez', rut: 'ID: 21.442.910-K', course: 'Senior A', gpa: '6.4 (97%)', trend: '↑', aptitude: 'Mathematics & Logic', aiState: 'Optimal', apoderado: 'Carlos Pérez', fono: '+56 9 8765 4321', email: 'c.perez@sanagustin.cl' },
    { name: 'Sofía Martínez', rut: 'ID: 21.902.148-8', course: 'Senior A', gpa: '6.2 (87%)', trend: '→', aptitude: 'History & Languages', aiState: '2 Alerts', apoderado: 'Elena Martínez', fono: '+56 9 1234 5678', email: 'e.martinez@sanagustin.cl' },
    { name: 'Mateo Rojas', rut: 'ID: 21.551.992-1', course: 'Senior A', gpa: '6.1 (97%)', trend: '↑', aptitude: 'Biology & Sciences', aiState: 'Normal', apoderado: 'Roberto Rojas', fono: '+56 9 5555 4444', email: 'r.rojas@sanagustin.cl' },
    { name: 'Lucas Fernández', rut: 'ID: 21.332.119-4', course: 'Senior A', gpa: '5.8 (78%)', trend: '↓', aptitude: 'Physics & Tech', aiState: 'Citation', apoderado: 'Marta Fernández', fono: '+56 9 9988 7766', email: 'm.fernandez@sanagustin.cl' },
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
      sender: 'School Direction 360°'
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
      "Course,Students,Attendance,Attention,Stress,StrongSubject,AIState\n" +
      courseMetrics.map(e => `${e.course},${e.students},${e.attendance},${e.attention},${e.stress},${e.strongSubject},${e.aiAlerts}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "colegio360_audit_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-mono p-4 md:p-6 relative selection:bg-magenta-900 overflow-x-hidden">
      
      {/* INSTITUTIONAL HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 mb-6 border-b-2 border-cyan-500/40 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#38EBCB]"></span>
            <h1 className="text-base md:text-lg font-orbitron text-white tracking-widest font-extrabold uppercase">
              COLEGIO 360° // INSTITUTIONAL COMMAND CENTER
            </h1>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1">
            Unified real-time monitoring of enrollment, academic performance, and emotional climate.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => navigate('/core-intelligence')}
            className="px-3 py-2 bg-cyan-950 border-2 border-cyan-400 text-cyan-300 text-xs font-orbitron font-bold rounded-xl hover:bg-cyan-900 transition shadow-[0_0_10px_rgba(56,235,203,0.3)] uppercase"
          >
            🌀 360° Core
          </button>

          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-orbitron font-bold rounded-xl hover:bg-cyan-900 transition shadow-[0_0_10px_rgba(56,235,203,0.3)] uppercase"
          >
            📥 EXPORT AUDITABLE REPORT
          </button>
        </div>
      </header>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl relative overflow-hidden">
          <p className="text-[10px] font-orbitron text-cyan-400 mb-1">// ENROLLMENT & SECTIONS</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">200</span>
            <span className="text-xs text-cyan-400">Active Students</span>
          </div>
          <p className="text-[10px] text-cyan-300 mt-2">4 Networked Sections</p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl">
          <p className="text-[10px] font-orbitron text-cyan-400 mb-1">// GENERAL GPA AVERAGE</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">5.92</span>
            <span className="text-xs text-cyan-500">/ 7.0</span>
          </div>
          <p className="text-[10px] text-green-400 mt-2">↑ +0.18 vs Previous Semester</p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-magenta-500/40 shadow-xl">
          <p className="text-[10px] font-orbitron text-magenta-300 mb-1">// EMOTIONAL HEALTH & STRESS</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">84.5%</span>
            <span className="text-xs text-magenta-400">Stable</span>
          </div>
          <p className="text-[10px] text-cyan-300 mt-2">Network Stress Avg: 16% (Optimal)</p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl">
          <p className="text-[10px] font-orbitron text-cyan-400 mb-1">// RETENTION & ATTENDANCE</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-orbitron text-white">96.8%</span>
            <span className="text-xs text-green-400">Excellent</span>
          </div>
          <p className="text-[10px] text-cyan-300 mt-2">Dropout Risk: 0.0%</p>
        </div>

      </div>

      {/* BEHAVIOR AND CLIMATE MAP BY COURSE */}
      <div className="p-5 rounded-2xl bg-gray-950/80 border-2 border-cyan-500/40 shadow-xl mb-6">
        <h2 className="text-xs font-orbitron text-cyan-300 mb-3 font-bold">// BEHAVIOR, ATTENTION & EMOTIONAL CLIMATE MAP BY COURSE</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-900 text-cyan-400 font-orbitron text-[10px]">
                <th className="p-3">COURSE</th>
                <th className="p-3">STUDENTS</th>
                <th className="p-3">ATTENDANCE</th>
                <th className="p-3">ATTENTION %</th>
                <th className="p-3">STRESS LEVEL</th>
                <th className="p-3">TOP SUBJECT</th>
                <th className="p-3">AI GUARDIAN STATUS</th>
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
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700">
                      {row.aiAlerts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
