import React, { useState, useEffect } from 'react';
import { UPLOAD_CONFIG } from '../constants';

const UploadIncidentsModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/incidents/config', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const configData = await response.json();
        setConfig(configData);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError('');

    if (file) {
      // Check file type
      const isValidType = UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(file.type) ||
                         UPLOAD_CONFIG.ALLOWED_EXTENSIONS.some(ext => file.name.endsWith(ext));

      if (!isValidType) {
        setError('Please select a CSV or Excel file');
        setSelectedFile(null);
        return;
      }

      // Check file size
      if (config && file.size > config.upload_max_size_mb * 1024 * 1024) {
        setError(`File size must be less than ${config.upload_max_size_mb}MB`);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/incidents/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        let message = `Successfully uploaded ${result.uploaded_count} incidents`;
        if (result.errors && result.errors.length > 0) {
          message += `\n\nErrors encountered:\n${result.errors.join('\n')}`;
        }
        alert(message);
        onClose();
        if (onUpload) onUpload();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Incidents</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV or Excel file
          </label>
          <input
            type="file"
            accept={UPLOAD_CONFIG.ALLOWED_EXTENSIONS.join(',')}
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {config && (
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: {formatFileSize(config.upload_max_size_mb * 1024 * 1024)}
            </p>
          )}
        </div>

        {selectedFile && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm">
              <strong>Selected file:</strong> {selectedFile.name}
            </p>
            <p className="text-sm">
              <strong>Size:</strong> {formatFileSize(selectedFile.size)}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadIncidentsModal;