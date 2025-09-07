import React, { useState } from 'react';
import Chat from './Chat';

const IncidentDetails = ({ incident: initialIncident, onClose }) => {
  const [incident, setIncident] = useState(initialIncident);
  const [loading, setLoading] = useState(false);

  if (!incident) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddChatMessage = async (content) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/incidents/${incident.id}/chat`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const updatedIncident = await response.json();
        setIncident(updatedIncident);
      } else if (response.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      } else {
        alert('Failed to add message');
      }
    } catch (error) {
      console.error('Error adding chat message:', error);
      alert('Error adding message');
    } finally {
      setLoading(false);
    }
  };

  // Get current user email (you might need to implement this based on your auth system)
  const getCurrentUserEmail = () => {
    // This should come from your authentication context or state
    return 'current.user@example.com';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-[#111418]">Incident Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 p-4">
            <a className="text-[#617589] text-base font-medium leading-normal" href="#">Incidents</a>
            <span className="text-[#617589] text-base font-medium leading-normal">/</span>
            <span className="text-[#111418] text-base font-medium leading-normal truncate max-w-xs" title={incident.title}>{incident.title}</span>
          </div>

          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex flex-col gap-3">
              <h1 className="text-[#111418] tracking-light text-xl md:text-3xl lg:text-[32px] font-bold leading-tight">{incident.title}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  incident.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                  incident.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {incident.status.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  incident.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  incident.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {incident.priority}
                </span>
              </div>
              <p className="text-[#617589] text-sm font-normal leading-normal">
                ID: {incident.id} • Assigned to: {incident.assigned_to} • Reported by {incident.created_by} on {formatDate(incident.created_on)}
              </p>
            </div>
          </div>

          <h3 className="text-[#111418] text-base md:text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Details</h3>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                incident.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                incident.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                {incident.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Priority</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                incident.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                incident.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {incident.priority}
              </span>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Assigned To</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.assigned_to}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Created By</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.created_by}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Created Date</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{formatDate(incident.created_on)}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Updated By</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.updated_by}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Updated Date</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{formatDate(incident.updated_on)}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Incident ID</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.id}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Status</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.is_deleted ? 'Deleted' : 'Active'}</p>
            </div>
          </div>

          <h3 className="text-[#111418] text-base md:text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Description</h3>
          <div className="px-4 pb-3 pt-1">
            {incident.description ? (
              <p className="text-[#111418] text-base font-normal leading-relaxed whitespace-pre-wrap">
                {incident.description}
              </p>
            ) : (
              <p className="text-[#9ca3af] text-base font-normal leading-relaxed italic">
                No description provided.
              </p>
            )}
          </div>

          {/* Chat Section */}
          <div className="px-4 pb-4">
            <Chat
              messages={incident.chat || []}
              onAddMessage={handleAddChatMessage}
              currentUserEmail={getCurrentUserEmail()}
            />
          </div>

          <div className="flex px-4 py-3 justify-end">
            <button
              onClick={onClose}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1172d4] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;