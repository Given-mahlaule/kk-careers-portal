import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import ApplicationPage from './pages/ApplicationPage';
import SuccessPage from './pages/SuccessPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';

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
          <Route path="/apply" element={<ApplicationPage />} />
          <Route path="/success" element={<SuccessPage />} />
          
          {/* User Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/applications/:id" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminApplicationDetail />
            </ProtectedRoute>
          } />
          <Route path="/admin/stats" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminStats />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
