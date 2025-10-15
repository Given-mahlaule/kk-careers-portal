import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, loading, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to appropriate login page based on route
      const loginPath = requireAdmin ? '/admin/login' : '/login'
      navigate(loginPath, { 
        state: { from: location },
        replace: true 
      })
    }
  }, [isAuthenticated, loading, navigate, location, requireAdmin])
  
  // Check if admin access is required
  useEffect(() => {
    if (!loading && isAuthenticated && requireAdmin) {
      const isAdmin = user?.user_metadata?.role === 'admin'
      
      // Debug logging
      console.log('ProtectedRoute - Admin Check:', {
        requireAdmin,
        userMetadata: user?.user_metadata,
        role: user?.user_metadata?.role,
        isAdmin,
        currentPath: location.pathname
      })
      
      if (!isAdmin) {
        console.warn('Access denied: User does not have admin role. Redirecting to admin login.')
        // Redirect non-admin users to admin login page (not profile)
        navigate('/admin/login', { 
          replace: true,
          state: { 
            error: 'Please sign in with an admin account to access this page.',
            from: location 
          }
        })
      }
    }
  }, [isAuthenticated, loading, user, requireAdmin, navigate, location])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuthenticated) {
    return null
  }

  // Render the protected component
  return children
}