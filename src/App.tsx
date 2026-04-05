/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLogin from './pages/AdminLogin';
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AlumniProfileForm from './pages/alumni/AlumniProfileForm';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAlumni from './pages/admin/ManageAlumni';
import ManageStudents from './pages/admin/ManageStudents';
import JobPortal from './pages/admin/JobPortal';
import AlumniDirectory from './pages/student/AlumniDirectory';
import JobBoard from './pages/student/JobBoard';
import JobUpdates from './pages/alumni/JobUpdates';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user || role !== allowedRole) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Alumni Routes */}
          <Route path="/alumni/*" element={
            <ProtectedRoute allowedRole="alumni">
              <Routes>
                <Route path="dashboard" element={<AlumniDashboard />} />
                <Route path="profile" element={<AlumniProfileForm />} />
                <Route path="jobs" element={<JobUpdates />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute allowedRole="student">
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="directory" element={<AlumniDirectory />} />
                <Route path="jobs" element={<JobBoard />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="alumni" element={<ManageAlumni />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="jobs" element={<JobPortal />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

