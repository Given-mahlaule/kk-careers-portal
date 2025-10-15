import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { AdminService } from '../../services/adminService';
import {
  ArrowLeft,
  Download,
  Loader2,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await AdminService.getApplicationById(id);
      if (result.success) {
        setApplication(result.application);
        setStatus(result.application.status || 'pending');
        setNotes(result.application.notes || '');
      } else {
        setError(result.error || 'Failed to load application.');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSave = async () => {
    if (!application) return;
    setSaving(true);
    const result = await AdminService.updateApplicationStatus(application.id, status, notes);
    if (result.success) {
      setApplication(result.application);
    } else {
      setError(result.error || 'Failed to update application.');
    }
    setSaving(false);
  };

  const openDocument = (filePath, isPublicUrl = false) => {
    if (!filePath) return;
    const url = isPublicUrl ? filePath : AdminService.getFileUrl(filePath);
    if (url) window.open(url, '_blank', 'noopener');
  };

  const formatDate = (date) => {
    if (!date) return '—';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const StatusBadge = ({ value }) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500', text: 'text-white', label: 'Pending' },
      reviewing: { bg: 'bg-blue-500', text: 'text-white', label: 'Reviewing' },
      approved: { bg: 'bg-green-500', text: 'text-white', label: 'Approved' },
      rejected: { bg: 'bg-red-500', text: 'text-white', label: 'Rejected' }
    };
    const config = statusConfig[value] || { bg: 'bg-gray-500', text: 'text-white', label: value };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
          Loading application...
        </div>
      </AdminLayout>
    );
  }

  if (error || !application) {
    return (
      <AdminLayout>
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="flex items-start mb-6">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Unable to load application</h3>
              <p className="text-sm text-gray-600">{error || 'Application not found.'}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin/applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Unified Header + Content Container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-[1400px] mx-auto">
        {/* Header Section - Connected */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/applications')}
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applications
            </Button>
            <div className="text-xs text-gray-500 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Submitted {formatDate(application.created_at)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {application.first_name} {application.last_name}
                </h1>
                <div className="flex items-center space-x-2 text-gray-600 text-xs">
                  <span className="flex items-center"><Mail className="h-3.5 w-3.5 mr-1" />{application.email}</span>
                  <span>•</span>
                  <span className="flex items-center"><Phone className="h-3.5 w-3.5 mr-1" />{application.phone_number}</span>
                  <span>•</span>
                  <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" />{application.city}, {application.country}</span>
                </div>
              </div>
            </div>
            <StatusBadge value={application.status} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Application Details */}
          <div className="lg:col-span-2 p-6 divide-y divide-gray-200">
            {/* Documents Section */}
            <div className="pb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                Uploaded Documents
              </h3>
              <div className="space-y-3">
                {application.cv_file_url && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Curriculum Vitae</div>
                        <div className="font-medium text-sm text-gray-900">{application.cv_file_name || 'CV.pdf'}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => openDocument(application.cv_file_url, true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                )}
                {application.cover_letter_file_url && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Cover Letter</div>
                        <div className="font-medium text-sm text-gray-900">{application.cover_letter_file_name || 'Cover Letter.pdf'}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => openDocument(application.cover_letter_file_url, true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                )}

                {/* Legacy storage paths */}
                {['cv_path','passport_path','certificate_path'].map(key => (
                  application[key] ? (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Document</div>
                          <div className="font-semibold text-gray-900 capitalize">{key.replace('_path','').replace('_',' ')}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => openDocument(application[key])}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                  ) : null
                ))}
                {!application.cv_file_url && !application.cover_letter_file_url && !application.cv_path && !application.passport_path && !application.certificate_path && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Work Experience */}
            <div className="py-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-4 w-4 mr-2 text-purple-600" />
                Work Experience
              </h3>
              {Array.isArray(application.experiences) && application.experiences.length > 0 ? (
                <div className="space-y-3">
                  {application.experiences.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-blue-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{exp.jobTitle || 'Position'}</h4>
                          <div className="text-xs text-gray-600">{exp.companyName || 'Company'}</div>
                          {exp.location && (
                            <div className="text-xs text-gray-500 mt-1">{exp.location}</div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No work experience</p>
              )}
            </div>

            {/* Education */}
            <div className="py-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                Education
              </h3>
              {Array.isArray(application.educations) && application.educations.length > 0 ? (
                <div className="space-y-3">
                  {application.educations.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-indigo-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{edu.institutionName || 'Institution'}</h4>
                          <div className="text-xs text-gray-600 capitalize">
                            {edu.degree || edu.educationType || 'Qualification'}
                            {edu.grade && <span className="ml-2 text-indigo-600 font-medium">({edu.grade})</span>}
                          </div>
                          {edu.fieldOfStudy && (
                            <div className="text-xs text-gray-500 mt-1 capitalize">
                              {edu.fieldOfStudy} {edu.major && `(${edu.major})`}
                            </div>
                          )}
                        </div>
                        {(edu.startDate || edu.endDate) && (
                          <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {formatDate(edu.startDate)} {edu.endDate && `– ${formatDate(edu.endDate)}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No education data</p>
              )}
            </div>

            {/* Languages */}
            <div className="py-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="h-4 w-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Languages
              </h3>
              {Array.isArray(application.languages) && application.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {application.languages.map((lang, idx) => (
                    <div key={idx} className="bg-gray-100 px-3 py-2 rounded text-sm">
                      <span className="font-medium text-gray-900 capitalize">{lang.language || lang.name}</span>
                      {lang.proficiency && (
                        <span className="text-xs text-gray-600 ml-2">({lang.proficiency})</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No languages</p>
              )}
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="lg:col-span-1 border-l border-gray-200 p-6 bg-gray-50">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Edit3 className="h-4 w-4 mr-2 text-gray-400" />
                  Review Status
                </h3>
              
              <div className="space-y-4">
                {/* Status Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-3">Application Status</label>
                  <div className="space-y-2">
                    {[
                      { value: 'pending', label: 'Pending', color: 'yellow' },
                      { value: 'reviewing', label: 'Reviewing', color: 'blue' },
                      { value: 'approved', label: 'Approved', color: 'green' },
                      { value: 'rejected', label: 'Rejected', color: 'red' }
                    ].map(({ value, label, color }) => (
                      <label
                        key={value}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          status === value
                            ? color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                              color === 'blue' ? 'border-blue-500 bg-blue-50' :
                              color === 'green' ? 'border-green-500 bg-green-50' :
                              'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={value}
                          checked={status === value}
                          onChange={(e) => setStatus(e.target.value)}
                          className={`w-4 h-4 ${
                            color === 'yellow' ? 'text-yellow-600' :
                            color === 'blue' ? 'text-blue-600' :
                            color === 'green' ? 'text-green-600' :
                            'text-red-600'
                          }`}
                        />
                        <span className={`ml-3 text-sm font-medium ${
                          status === value
                            ? color === 'yellow' ? 'text-yellow-900' :
                              color === 'blue' ? 'text-blue-900' :
                              color === 'green' ? 'text-green-900' :
                              'text-red-900'
                            : 'text-gray-700'
                        }`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Internal Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                    placeholder="Add review notes, decisions, next steps..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Internal use only</p>
                </div>

                {/* Save Button */}
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      {error}
                    </p>
                  </div>
                )}
              </div>
            </div>

              {/* Application Metadata */}
              <div className="pt-6 border-t border-gray-300">
                <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Details</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-gray-500">Created</div>
                    <div className="font-medium text-gray-900">{formatDate(application.created_at)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Updated</div>
                    <div className="font-medium text-gray-900">
                      {application.updated_at ? formatDate(application.updated_at) : '—'}
                    </div>
                  </div>
                  {application.source && (
                    <div>
                      <div className="text-gray-500">Source</div>
                      <div className="font-medium text-gray-900 capitalize">{application.source.replace(/-/g, ' ')}</div>
                    </div>
                  )}
                  <div className="pt-2">
                    <div className="text-gray-500 mb-1">App ID</div>
                    <div className="font-mono text-[10px] text-gray-600 break-all bg-white p-2 rounded border border-gray-200">
                      {application.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
