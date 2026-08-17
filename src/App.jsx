import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { LiveClassroomProvider } from './context/LiveClassroomContext';
import { FocusModeProvider } from './context/FocusModeProvider';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import QRLogin from './pages/QRLogin';
import StudentWorkspace from './pages/StudentWorkspace';
import TeacherDashboard from './pages/TeacherDashboard';
import AICampus from './pages/AICampus';
import ChatInterface from './pages/ChatInterface';
import Store from './pages/Store';
import Squads from './pages/Squads';
import DebateArena from './pages/DebateArena';
import LiveClass from './pages/LiveClass';
import MyEvolution from './pages/MyEvolution';
import SubjectDetail from './pages/SubjectDetail';
import NexusHub from './modules/nexus/NexusHub';
import VibeStudio from './modules/lab/VibeStudio';
import PortalSelector from './pages/PortalSelector';
import SchoolAdminDashboard from './pages/SchoolAdminDashboard';
import Colegio360MasterDashboard from './pages/Colegio360MasterDashboard';
import AuLockCoreIntelligence from './pages/AuLockCoreIntelligence';
import AcademicPassport from './pages/AcademicPassport';
import AfterIAPortal from './components/afteria/AfterIAPortal';
import LayoutSwitcher from './components/LayoutSwitcher';
import DebugBanner from './components/DebugBanner';

function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <LiveClassroomProvider>
          <FocusModeProvider>
            <DebugBanner />
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/portal" element={<PortalSelector />} />
              <Route path="/login" element={<Login />} />
              <Route path="/access" element={<QRLogin />} />
              <Route path="/qr-login" element={<QRLogin />} />

              {/* --- Direct Access Routes --- */}
              <Route path="/academic-passport" element={<AcademicPassport />} />
              <Route path="/core-intelligence" element={<AuLockCoreIntelligence />} />
              <Route path="/school-dashboard" element={<AuLockCoreIntelligence />} />
              <Route path="/school-admin" element={<AuLockCoreIntelligence />} />
              <Route path="/colegio-360-master" element={<AuLockCoreIntelligence />} />
              <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
              <Route path="/student-dashboard" element={<StudentWorkspace />} />
              <Route path="/after-ia" element={<AfterIAPortal />} />
              <Route path="/debate" element={<DebateArena />} />
              <Route path="/squads" element={<Squads />} />

              {/* --- Protected App Routes --- */}
              <Route path="/app" element={<LayoutSwitcher />}>
                <Route index element={<LayoutSwitcher />} />
                <Route path="tutor" element={<AICampus />} />
                <Route path="pre-u" element={<StudentWorkspace />} />
                <Route path="school" element={<AuLockCoreIntelligence />} />
                <Route path="student-dashboard" element={<StudentWorkspace />} />
                <Route path="ai-campus" element={<AICampus />} />
                <Route path="ai-chat/:assistantId" element={<ChatInterface />} />
                <Route path="store" element={<Store />} />
                <Route path="squads" element={<Squads />} />
                <Route path="evolution" element={<MyEvolution />} />
                <Route path="teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="academic-passport" element={<AcademicPassport />} />
                <Route path="core-intelligence" element={<AuLockCoreIntelligence />} />
                <Route path="school-dashboard" element={<AuLockCoreIntelligence />} />
                <Route path="subject/:id" element={<SubjectDetail />} />
                <Route path="debate" element={<DebateArena />} />
                <Route path="live-class" element={<LiveClass />} />
              </Route>

              {/* Nexus Routes */}
              <Route path="/nexus" element={<NexusHub />} />
              <Route path="/nexus/lab" element={<VibeStudio />} />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </FocusModeProvider>
        </LiveClassroomProvider>
      </UIProvider>
    </AuthProvider>
  );
}

export default App;
