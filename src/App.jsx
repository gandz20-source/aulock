import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LiveClassroomProvider } from './context/LiveClassroomContext';
import { UIProvider } from './context/UIContext';
import ProtectedRoute from './components/ProtectedRoute'; // Keep using for role-specific protection
import ProtectedLayout from './layouts/ProtectedLayout'; // New layout for /app
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import QRLogin from './pages/QRLogin';
import StudentWorkspace from './pages/StudentWorkspace';
import TeacherDashboard from './pages/TeacherDashboard';
import AICampus from './pages/AICampus';
import ChatInterface from './pages/ChatInterface';
import Store from './pages/Store';
import Admin from './pages/Admin';
import Squads from './pages/Squads';
import DebateArena from './pages/DebateArena';
import LiveClass from './pages/LiveClass';
import MyEvolution from './pages/MyEvolution';
import SubjectDetail from './pages/SubjectDetail';
import NexusHub from './modules/nexus/NexusHub';
import VibeStudio from './modules/lab/VibeStudio';
import PortalSelector from './pages/PortalSelector';
import LayoutSwitcher from './components/LayoutSwitcher';
import DebugBanner from './components/DebugBanner';


const AdminDashboard = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">
        <span className="gradient-text">Panel de Administración</span>
      </h1>
      <p className="text-slate-600">Bienvenido al panel de administración. Próximamente más funciones.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <DebugBanner />
        <LiveClassroomProvider>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/portal" element={<PortalSelector />} />

            <Route path="/login" element={<Login />} />
            <Route path="/access" element={<QRLogin />} />
            <Route path="/qr-login" element={<QRLogin />} />

            {/* --- Protected App Routes --- */}
            <Route path="/app" element={<ProtectedLayout />}>

              {/* The Index uses the LayoutSwitcher */}
              <Route index element={<LayoutSwitcher />} />

              {/* Stub / Placeholder Routes */}
              <Route path="tutor" element={<div className="p-10 text-center font-bold text-slate-500">🚧 Módulo Tutoría Pro (En Construcción)</div>} />
              <Route path="pre-u" element={<div className="p-10 text-center font-bold text-slate-500">🚧 Módulo Pre-Universitario (En Construcción)</div>} />
              <Route path="school" element={<Navigate to="/app/student-dashboard" replace />} />

              {/* Student Routes */}
              <Route
                path="student-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['alumno']}>
                    <StudentWorkspace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ai-campus"
                element={
                  <ProtectedRoute allowedRoles={['alumno']}>
                    <AICampus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ai-chat/:assistantId"
                element={
                  <ProtectedRoute allowedRoles={['alumno']}>
                    <ChatInterface />
                  </ProtectedRoute>
                }
              />
              <Route
                path="store"
                element={
                  <ProtectedRoute allowedRoles={['alumno']}>
                    <Store />
                  </ProtectedRoute>
                }
              />
              <Route
                path="squads"
                element={
                  <ProtectedRoute allowedRoles={['alumno']}>
                    <Squads />
                  </ProtectedRoute>
                }
              />
              <Route
                path="evolution"
                element={
                  <ProtectedRoute allowedRoles={['alumno']}>
                    <MyEvolution />
                  </ProtectedRoute>
                }
              />

              {/* Teacher Routes */}
              <Route
                path="teacher-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['profesor']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Shared / Common Routes */}
              <Route
                path="subject/:id"
                element={
                  <ProtectedRoute allowedRoles={['alumno', 'profesor', 'superadmin']}>
                    <SubjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="debate"
                element={
                  <ProtectedRoute allowedRoles={['alumno', 'profesor', 'superadmin']}>
                    <DebateArena />
                  </ProtectedRoute>
                }
              />
              <Route
                path="live-class"
                element={
                  <ProtectedRoute allowedRoles={['alumno', 'profesor', 'superadmin']}>
                    <LiveClass />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Nexus Routes (Hub & Lab) */}
            <Route
              path="/nexus"
              element={
                <ProtectedRoute allowedRoles={['alumno', 'profesor', 'superadmin']}>
                  <NexusHub />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nexus/lab"
              element={
                <ProtectedRoute allowedRoles={['alumno', 'profesor', 'superadmin']}>
                  <VibeStudio />
                </ProtectedRoute>
              }
            />

            {/* Legacy/Direct access redirects */}
            <Route path="/student-dashboard" element={<Navigate to="/app/student-dashboard" replace />} />
            <Route path="/teacher-dashboard" element={<Navigate to="/app/teacher-dashboard" replace />} />
            <Route path="/admin-dashboard" element={<Navigate to="/app/admin-dashboard" replace />} />


            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LiveClassroomProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
