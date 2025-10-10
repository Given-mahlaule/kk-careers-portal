import { Upload, FileText, X } from 'lucide-react';
import { useState } from 'react';

export default function DocumentUpload({ data, onUpdate, errors }) {
  const [dragOver, setDragOver] = useState({ cv: false, cover: false });

  const handleFileUpload = (type, file) => {
    if (file) {
      // In a real application, you would upload to a server
      // For now, we'll store the file info
      onUpdate({
        [type]: {
          file: file,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }
      });
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver({ ...dragOver, [type]: false });
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type.startsWith('application/vnd') || file.type === 'text/plain')) {
      handleFileUpload(type, file);
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    handleFileUpload(type, file);
  };

  const removeFile = (type) => {
    onUpdate({ [type]: null });
  };

  const FileUploadArea = ({ type, label, required = false }) => {
    const fileData = data[type];
    const isDragOver = dragOver[type];
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {fileData ? (
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{fileData.name}</p>
                  <p className="text-xs text-gray-500">
                    {(fileData.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(type)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : errors?.[type]
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={(e) => handleDrop(e, type)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver({ ...dragOver, [type]: true });
            }}
            onDragLeave={() => setDragOver({ ...dragOver, [type]: false })}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-blue-600' : 'text-gray-400'}`} />
            <p className="text-sm font-medium text-gray-900 mb-2">
              Drag and drop your file here, or{' '}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleFileSelect(e, type)}
                />
              </label>
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
            </p>
          </div>
        )}
        
        {errors?.[type] && (
          <p className="text-sm text-red-600">{errors[type]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Document Upload</h2>
        <p className="text-sm text-gray-600">
          Please upload your CV and cover letter. These documents will help us better understand your qualifications and experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FileUploadArea 
          type="cv" 
          label="Curriculum Vitae (CV)" 
          required 
        />
        
        <FileUploadArea 
          type="coverLetter" 
          label="Cover Letter" 
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for your documents:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure your CV is up-to-date and includes all relevant experience</li>
          <li>• Your cover letter should be tailored to the position you're applying for</li>
          <li>• Use clear, professional formatting and fonts</li>
          <li>• Include your contact information on both documents</li>
          <li>• Keep files under 10MB for faster processing</li>
        </ul>
      </div>
    </div>
  );
}