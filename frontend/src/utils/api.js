import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.response?.data?.error || err.message;
    return Promise.reject(new Error(msg));
  }
);

export const interviewAPI = {
  getJobRoles: () => api.get('/interview/job-roles'),
  generateQuestions: (data) => api.post('/interview/generate-questions', data),
  evaluateAnswer: (data) => api.post('/interview/evaluate-answer', data),
  startMockInterview: (data) => api.post('/interview/mock-interview', data),
  getFeedback: (data) => api.post('/interview/feedback', data),
};

export const resumeAPI = {
  analyzeResume: (data) => api.post('/resume/analyze', data),
  improveResume: (data) => api.post('/resume/improve', data),
  tailorResume: (data) => api.post('/resume/tailor', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  saveSession: (data) => api.post('/dashboard/session', data),
  getSessions: () => api.get('/dashboard/sessions'),
};

export default api;
