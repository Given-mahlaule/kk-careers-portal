import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { AdminService } from '../../services/adminService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  Eye, 
  Download, 
  Search, 
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ChevronDown
} from 'lucide-react';

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = [...applications];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.first_name?.toLowerCase().includes(search) ||
        app.last_name?.toLowerCase().includes(search) ||
        app.email?.toLowerCase().includes(search) ||
        app.phone_number?.includes(search)
      );
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const result = await AdminService.getApplications({ limit: 100 });
      if (result.success) {
        setApplications(result.applications || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/admin/applications/${applicationId}`);
  };

  const exportToCSV = () => {
    // Simple CSV export
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Status', 'Date'];
    const rows = filteredApplications.map(app => [
      `${app.first_name} ${app.last_name}`,
      app.email,
      app.phone_number,
      `${app.city}, ${app.country}`,
      app.status,
      formatDate(app.created_at)
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Applications</h2>
            <p className="mt-1 text-sm text-gray-600">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </Card>

        {/* Applications List */}
        <Card>
          <div className="divide-y divide-gray-200">
            {filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Applications will appear here once submitted'}
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Name and Status */}
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="text-base font-semibold text-gray-900">
                          {application.first_name} {application.last_name}
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {application.email}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {application.phone_number}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {application.city}, {application.country}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Applied {formatDate(application.created_at)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-4 flex-shrink-0">
                      <Button
                        onClick={() => handleViewApplication(application.id)}
                        size="sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
