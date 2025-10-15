import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/ui/Card';
import { AdminService } from '../../services/adminService';
import { Loader2, BarChart3 } from 'lucide-react';

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await AdminService.getDashboardStats();
      if (result.success) {
        setStats(result.stats);
      } else {
        setError(result.error || 'Failed to load statistics');
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AdminLayout>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          Loading statistics...
        </div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </Card>
            <Card className="p-6">
            <p className="text-sm text-gray-500">Reviewing</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.reviewing}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-500">Last 7 Days</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.recent}</p>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
