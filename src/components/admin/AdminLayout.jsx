import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import Button from '../ui/Button'
import { 
  LogOut, 
  Users, 
  BarChart3, 
  Settings,
  FileText,
  Home
} from 'lucide-react'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      navigate('/admin/login')
    }
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
      current: window.location.pathname === '/admin/dashboard'
    },
    {
      name: 'Applications',
      href: '/admin/applications',
      icon: FileText,
      current: window.location.pathname.startsWith('/admin/applications')
    },
    {
      name: 'Statistics',
      href: '/admin/stats',
      icon: BarChart3,
      current: window.location.pathname === '/admin/stats'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  KK Labour Services
                </h1>
                <p className="text-sm text-gray-500">Admin Portal</p>
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.email}</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 flex-1">
        {/* Sidebar - Fixed */}
        <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-sm overflow-y-auto">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.href)}
                      className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        item.current
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${
                        item.current ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      {item.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="mt-8 px-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Info</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Active Session</span>
                  <span className="text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Login</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 ml-64 overflow-y-auto" style={{height: 'calc(100vh - 4rem)'}}>
          {/* Page Content */}
          <main className="px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}