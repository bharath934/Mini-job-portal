import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import EmployerDashboard from './components/dashboard/EmployerDashboard';
import SeekerDashboard from './components/dashboard/SeekerDashboard';
import EmployerProfile from './components/profile/EmployerProfile';
import SeekerProfile from './components/profile/SeekerProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs"
            element={
              <ProtectedRoute requiredRole="employer">
                <Layout>
                  <EmployerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <ProtectedRoute requiredRole="employer">
                <Layout>
                  <EmployerProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/profile"
            element={
              <ProtectedRoute requiredRole="seeker">
                <Layout>
                  <SeekerProfile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/seeker/jobs"
            element={
              <ProtectedRoute requiredRole="seeker">
                <Layout>
                  <SeekerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;