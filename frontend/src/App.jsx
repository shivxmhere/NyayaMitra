import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CaseDetail from './pages/CaseDetail';
import BailWizard from './pages/BailWizard';
import LawyerFinder from './pages/LawyerFinder';
import AskNyaya from './pages/AskNyaya';
import Hearings from './pages/Hearings';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-accent-saffron border-t-transparent rounded-full" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/case/:id" element={<ProtectedRoute><AppLayout><CaseDetail /></AppLayout></ProtectedRoute>} />
      <Route path="/bail/:caseId" element={<ProtectedRoute><AppLayout><BailWizard /></AppLayout></ProtectedRoute>} />
      <Route path="/lawyers" element={<ProtectedRoute><AppLayout><LawyerFinder /></AppLayout></ProtectedRoute>} />
      <Route path="/ask" element={<ProtectedRoute><AppLayout><AskNyaya /></AppLayout></ProtectedRoute>} />
      <Route path="/hearings" element={<ProtectedRoute><AppLayout><Hearings /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1200', color: '#f8f4ee', border: '1px solid rgba(255,153,51,0.2)' },
          success: { iconTheme: { primary: '#138808', secondary: '#f8f4ee' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#f8f4ee' } },
        }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
