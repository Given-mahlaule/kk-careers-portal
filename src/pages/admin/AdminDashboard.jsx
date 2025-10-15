import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { AdminService } from '../../services/adminService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
    recent: 0
  })
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    
    try {
      // Load stats and recent applications in parallel
      const [statsResult, appsResult] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getApplications({ limit: 10 })
      ])

      if (statsResult.success) {
        setStats(statsResult.stats)
      }

      if (appsResult.success) {
        setApplications(appsResult.applications)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    }

    setLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.recent}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
              <Button 
                onClick={() => navigate('/admin/applications')}
                variant="outline"
                size="sm"
              >
                View All
              </Button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {applications.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No applications found</p>
                <p className="text-sm text-gray-400 mt-2">
                  Applications will appear here once submitted
                </p>
              </div>
            ) : (
              applications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {application.first_name} {application.last_name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {application.email}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {application.phone_number}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {application.city}, {application.country}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(application.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {application.cv_file_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(application.cv_file_url, '_blank')}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              CV
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => navigate(`/admin/applications/${application.id}`)}
                            className="text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Applications</h3>
            <p className="text-sm text-gray-600 mb-4">
              View and manage all job applications
            </p>
            <Button 
              onClick={() => navigate('/admin/applications')}
              className="w-full"
            >
              View Applications
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pending Review</h3>
            <p className="text-sm text-gray-600 mb-4">
              {stats.pending} applications need your attention
            </p>
            <Button 
              onClick={() => navigate('/admin/applications?status=pending')}
              variant="outline"
              className="w-full"
            >
              Review Pending
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download applications data for reporting
            </p>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => alert('Export feature coming soon!')}
            >
              Export CSV
            </Button>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}