import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import CompanySheets from './pages/CompanySheets';
import MockInterview from './pages/MockInterview';
import StudyPlanner from './pages/StudyPlanner';
import Notes from './pages/Notes';
import Revision from './pages/Revision';
import { OAFeedback } from './pages/OAFeedback';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#090D16] text-blue-500 font-bold gap-3">
        <span className="text-4xl animate-bounce-soft">⚒️</span>
        <span className="text-sm tracking-widest uppercase animate-pulse">Loading InterviewForge...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#060A10]/40">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/problems" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Problems />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/sheets" element={
                <ProtectedRoute>
                  <MainLayout>
                    <CompanySheets />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/oa-feedback" element={
                <ProtectedRoute>
                  <MainLayout>
                    <OAFeedback />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/study-planner" element={
                <ProtectedRoute>
                  <MainLayout>
                    <StudyPlanner />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/mock-interview" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MockInterview />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/notes" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notes />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/revision" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Revision />
                  </MainLayout>
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Analytics />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
