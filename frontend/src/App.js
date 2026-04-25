import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import PracticeSession from './pages/PracticeSession';
import Landing from './pages/Landing';

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111124',
            color: '#f1f1f8',
            border: '1px solid rgba(99,102,241,0.3)',
            fontFamily: "'DM Sans', sans-serif",
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#05050a' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#05050a' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="practice" element={<PracticeSession />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="mock" element={<MockInterview />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
        </Route>
      </Routes>
    </Router>
  );
}
