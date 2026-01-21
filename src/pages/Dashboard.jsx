import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { API_BASE_URL } from "../config/api";

export default function Dashboard({ user }) {
    const [courses, setCourses] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        courseId: "",
        date: "",
        duration: "",
        studentsCount: "",
        notes: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load courses
            const coursesRes = await fetch(`${API_BASE_URL}/api/courses?schoolId=${user.school.id}`);
            const coursesData = await coursesRes.json();
            setCourses(coursesData);

            // Load sessions
            const sessionsRes = await fetch(`${API_BASE_URL}/api/sessions?teacherId=${user.id}`);
            const sessionsData = await sessionsRes.json();
            setSessions(sessionsData);

            // Load stats
            const statsRes = await fetch(`${API_BASE_URL}/api/stats?teacherId=${user.id}`);
            const statsData = await statsRes.json();
            setStats(statsData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch(`${API_BASE_URL}/api/sessions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    teacherId: user.id,
                    duration: parseInt(form.duration),
                    studentsCount: parseInt(form.studentsCount)
                })
            });

            setShowForm(false);
            setForm({ courseId: "", date: "", duration: "", studentsCount: "", notes: "" });
            loadData();
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Bienvenido, {user.name}</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card className="p-6">
                            <h3 className="text-sm text-gray-600 mb-2">Total Sesiones</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalSessions}</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-sm text-gray-600 mb-2">Total Minutos</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalMinutes}</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-sm text-gray-600 mb-2">Total Estudiantes</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-sm text-gray-600 mb-2">Promedio Minutos</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats.averageMinutes}</p>
                        </Card>
                    </div>
                )}

                {/* New Session Button */}
                <div className="mb-6">
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancelar" : "+ Nueva Sesión"}
                    </Button>
                </div>

                {/* Session Form */}
                {showForm && (
                    <Card className="mb-8 p-6">
                        <h2 className="text-xl font-semibold mb-4">Registrar Nueva Sesión</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Curso</Label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={form.courseId}
                                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar curso</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} - {c.grade}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label>Fecha</Label>
                                <Input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Duración (minutos)</Label>
                                <Input
                                    type="number"
                                    value={form.duration}
                                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Número de Estudiantes</Label>
                                <Input
                                    type="number"
                                    value={form.studentsCount}
                                    onChange={(e) => setForm({ ...form, studentsCount: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Notas (opcional)</Label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>
                            <Button type="submit">Guardar Sesión</Button>
                        </form>
                    </Card>
                )}

                {/* Recent Sessions */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Sesiones Recientes</h2>
                    {sessions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No hay sesiones registradas aún</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Fecha</th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Curso</th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Duración</th>
                                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Estudiantes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map(s => (
                                        <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-2 text-sm">{new Date(s.date).toLocaleDateString()}</td>
                                            <td className="py-3 px-2 text-sm">{s.course?.name || 'N/A'}</td>
                                            <td className="py-3 px-2 text-sm">{s.duration} min</td>
                                            <td className="py-3 px-2 text-sm">{s.studentsCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
