import React, { useState } from 'react';
import IncidentDetails from './IncidentDetails';
import { useIncidentContext } from '../contexts/IncidentContext';

const IncidentTable = () => {
  const { incidents, loading, error, refreshIncidents, pagination } = useIncidentContext();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Handle delete incident
  const handleDelete = async (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        const response = await fetch(`/api/incidents/${incidentId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Incident deleted successfully');
          refreshIncidents(); // Refresh incidents using context
        } else {
          alert('Failed to delete incident');
        }
      } catch (error) {
        console.error('Error deleting incident:', error);
        alert('Error deleting incident');
      }
    }
  };

  // Handle expand incident details
  const handleExpand = async (incidentId) => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const incident = await response.json();
        setSelectedIncident(incident);
        setShowDetails(true);
      } else {
        alert('Failed to fetch incident details');
      }
    } catch (error) {
      console.error('Error fetching incident details:', error);
      alert('Error fetching incident details');
    }
  };

  // Handle close details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedIncident(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="px-4 py-3">
        <div className="text-center py-8">
          <p className="text-[#617589]">Loading incidents...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="px-4 py-3">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={refreshIncidents}
            className="mt-4 px-4 py-2 bg-[#1172d4] text-white rounded-lg hover:bg-[#0d5bb5] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!incidents || incidents.length === 0) {
    return (
      <div className="px-4 py-3">
        <div className="text-center py-8">
          <p className="text-[#617589]">No incidents found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      {/* Desktop Table View */}
      <div className="hidden lg:flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
        <table className="flex-1">
          <thead>
            <tr className="bg-white">
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal w-32">
                #
              </th>
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal">Subject</th>
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal w-32">Status</th>
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal w-32">Priority</th>
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal w-32">
                Created Date
              </th>
               <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal w-24">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => {
              const sequentialNumber = (pagination.page - 1) * pagination.pageSize + index + 1;
              return (
                <tr key={incident.id} className="border-t border-t-[#dbe0e6]">
                  <td className="h-[72px] px-4 py-2 text-[#111418] text-sm font-normal leading-normal">{sequentialNumber}</td>
                  <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                    {incident.title}
                  </td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                    <button
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal"
                    >
                      <span className="truncate">{incident.status}</span>
                    </button>
                  </td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                    <button
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal"
                    >
                      <span className="truncate">{incident.priority}</span>
                    </button>
                  </td>
                  <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                    {formatDate(incident.created_on)}
                  </td>
                  <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                    {incident.created_by}
                  </td>
                  <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExpand(incident.id)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f0f2f4] hover:bg-[#e5e7eb] transition-colors"
                        title="View details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M213.66,154.34l-80-80a8,8,0,0,1-11.32,0l-80,80A8,8,0,0,1,53.66,165.66L128,91.31l74.34,74.35a8,8,0,0,1,11.32-11.32Z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => window.location.href = `/edit?id=${incident.id}`}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f0f2f4] hover:bg-[#e5e7eb] transition-colors"
                        title="Edit incident"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.32,64l24-24L216,84.68Z"></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(incident.id)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#fee2e2] hover:bg-[#fecaca] transition-colors text-[#dc2626]"
                        title="Delete incident"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {incidents.map((incident, index) => {
          const sequentialNumber = (pagination.page - 1) * pagination.pageSize + index + 1;
          return (
            <div key={incident.id} className="bg-white border border-[#dbe0e6] rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-[#111418] font-semibold text-lg">#{sequentialNumber}</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[#f0f2f4] text-[#111418] text-sm font-medium rounded-lg">
                  {incident.status}
                </button>
                <button className="px-3 py-1 bg-[#f0f2f4] text-[#111418] text-sm font-medium rounded-lg">
                  {incident.priority}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[#617589] text-sm">
                <span className="font-medium text-[#111418]">Subject:</span> {incident.title}
              </p>
              <p className="text-[#617589] text-sm">
                <span className="font-medium text-[#111418]">Created:</span> {formatDate(incident.created_on)}
              </p>
              <p className="text-[#617589] text-sm">
                <span className="font-medium text-[#111418]">Assigned to:</span> {incident.created_by}
              </p>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleExpand(incident.id)}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#f0f2f4] hover:bg-[#e5e7eb] transition-colors text-sm font-medium"
                title="View details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="mr-1">
                  <path d="M213.66,154.34l-80-80a8,8,0,0,1-11.32,0l-80,80A8,8,0,0,1,53.66,165.66L128,91.31l74.34,74.35a8,8,0,0,1,11.32-11.32Z"></path>
                </svg>
                View
              </button>
              <button
                onClick={() => window.location.href = `/edit?id=${incident.id}`}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#f0f2f4] hover:bg-[#e5e7eb] transition-colors text-sm font-medium"
                title="Edit incident"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="mr-1">
                  <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.32,64l24-24L216,84.68Z"></path>
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleDelete(incident.id)}
                className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#fee2e2] hover:bg-[#fecaca] transition-colors text-[#dc2626] text-sm font-medium"
                title="Delete incident"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="mr-1">
                  <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                </svg>
                Delete
              </button>
            </div>
          </div>
         );
       })}
     </div>

     {/* Incident Details Modal */}
     {showDetails && (
       <IncidentDetails
         incident={selectedIncident}
         onClose={handleCloseDetails}
       />
     )}
   </div>
 );
};

export default IncidentTable;