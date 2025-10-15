import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import ApplicationPage from './pages/ApplicationPage';
import SuccessPage from './pages/SuccessPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import AdminStats from './pages/admin/AdminStats';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/application" element={<ApplicationPage />} />
          <Route path="/success" element={<SuccessPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute>
              <AdminApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications/:id" element={
            <ProtectedRoute>
              <AdminApplicationDetail />
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute>
              <AdminStats />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
