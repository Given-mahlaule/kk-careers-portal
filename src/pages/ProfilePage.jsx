import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import { User, Briefcase, Calendar, MapPin, LogOut, FileText, ChevronRight } from 'lucide-react'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfileAndApplications = async () => {
      try {
        setLoading(true)
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileError) throw profileError
        setProfile(profileData)
        
        // Fetch user's applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (applicationsError) throw applicationsError
        setApplications(applicationsData || [])
        
      } catch (err) {
        setError(err.message)
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchProfileAndApplications()
    }
  }, [user])

  const handleSignOut = async () => {
    const result = await signOut()
    if (result.success) {
      navigate('/')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewing':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏱️'
      case 'reviewing':
        return '👀'
      case 'approved':
        return '✅'
      case 'rejected':
        return '❌'
      default:
        return '📄'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header with Logo - Full Width Edge to Edge */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">KK Labour Services</h1>
                <p className="text-sm text-gray-500">Careers Portal</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="hidden sm:flex"
              >
                Home
              </Button>
              <Button
                onClick={() => navigate('/apply')}
              >
                <FileText className="w-4 h-4 mr-2" />
                New Application
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Container>
        <div className="max-w-6xl mx-auto py-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 mb-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-6 h-6" />
                  <span className="text-blue-100 text-sm font-medium">Welcome back</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <span className="opacity-75">📧</span>
                  {profile?.email}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {applications.length} {applications.length === 1 ? 'application' : 'applications'}
                </span>
              </div>
            </div>

            <div className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Start your journey with KK Labour Services by submitting your first application.
                  </p>
                  <Button onClick={() => navigate('/apply')} size="lg">
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Your First Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Application Icon */}
                          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-blue-600" />
                          </div>
                          
                          {/* Application Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-bold text-gray-900">
                                General Labour Position
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  application.status
                                )}`}
                              >
                                <span>{getStatusIcon(application.status)}</span>
                                <span className="capitalize">{application.status}</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{application.city}, {application.country}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>
                                  Submitted {new Date(application.created_at).toLocaleDateString('en-ZA', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>Application ID: {application.id.slice(0, 8).toUpperCase()}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{application.first_name} {application.last_name}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* View Details Arrow */}
                        <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {/* Additional Details */}
                      {application.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="bg-blue-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-gray-900">Admin Notes:</span> {application.notes}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Status Progress */}
                      {application.status === 'reviewing' && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span className="font-medium">Your application is currently under review</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Home
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => window.location.href = 'mailto:careers@kklabourservices.co.za'}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Need Help? Contact Us
            </button>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ProfilePage
