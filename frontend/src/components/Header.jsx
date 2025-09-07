import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UploadIncidentsModal from './UploadIncidentsModal';

const Header = () => {
  const navigate = useNavigate();

  const handleCreateIncident = () => {
    navigate('/new');
  };

  const handleDownloadTemplate = async () => {
    try {
      // Fetch incident config from backend
      const response = await fetch('/api/incidents/config', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const config = await response.json();
        const headers = config.fields.join(',');
        const sampleData = [
          'Sample Incident Title',
          'This is a sample description',
          'Open',
          'Medium',
          'user@example.com'
        ].join(',');
        const csvContent = headers + '\n' + sampleData + '\n';
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'incident_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Failed to download template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Error downloading template');
    }
  };

  const [showUploadModal, setShowUploadModal] = React.useState(false);

  const handleLogout = async () => {
    try {
      // Call backend logout route to clear cookies and redirect
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        redirect: 'follow', // Follow the redirect response
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If redirect was followed, we should be at /login now
      // But if not, manually navigate
      if (response.redirected) {
        window.location.href = response.url;
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback navigation if backend call fails
      navigate('/login');
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-4 md:px-10 py-3">
      <Link to="/home" className="flex items-center gap-4 text-[#111418] cursor-pointer hover:opacity-80 transition-opacity">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">IncTra</h2>
      </Link>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link to="/home" className="text-[#111418] text-sm font-medium leading-normal hover:text-[#1172d4] transition-colors">Incidents</Link>
          <Link to="/audittrail" className="text-[#111418] text-sm font-medium leading-normal hover:text-[#1172d4] transition-colors">Audit Trail</Link>
        </div>
        <button
          onClick={handleDownloadTemplate}
           className="text-[#111418] text-sm font-medium leading-normal hover:text-[#1172d4] transition-colors"
        >
          <span className="truncate">Download Template</span>
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
                   className="text-[#111418] text-sm font-medium leading-normal hover:text-[#1172d4] transition-colors">

          <span className="truncate">Upload Incidents</span>
        </button>
        <button
          onClick={handleCreateIncident}
           className="text-[#111418] text-sm font-medium leading-normal hover:text-[#1172d4] transition-colors"
        >
          <span className="truncate">Create Incident</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e5e7eb] transition-colors"
        >
          <span className="truncate">Logout</span>
        </button>
      </div>

      <UploadIncidentsModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={() => {
          // Refresh incidents list or navigate to home
          window.location.href = '/home';
        }}
      />
    </header>
  );
};

export default Header;