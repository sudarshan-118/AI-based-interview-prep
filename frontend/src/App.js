import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import PracticeSession from './pages/PracticeSession';
import Landing from './pages/Landing';
import Login from './pages/Login';
import api from './utils/api';

// Interceptor component to dynamically add the Clerk JWT token to all API requests
function AxiosAuthInterceptor({ children }) {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error setting axios Authorization token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return children;
}

// Protected route component that checks if user is logged in
function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-base)' }}>
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <AxiosAuthInterceptor>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(21, 23, 42, 0.95)',
              color: '#f0f2ff',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.88rem',
              fontWeight: 500,
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#0d0e1a' },
              style: { borderColor: 'rgba(16, 185, 129, 0.25)' },
            },
            error: {
              iconTheme: { primary: '#fb7185', secondary: '#0d0e1a' },
              style: { borderColor: 'rgba(244, 63, 94, 0.25)' },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="practice" element={<PracticeSession />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="mock" element={<MockInterview />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
          </Route>
        </Routes>
      </AxiosAuthInterceptor>
    </Router>
  );
}
