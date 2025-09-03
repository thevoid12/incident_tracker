import React from 'react';

const IncidentDetails = ({ incident, onClose }) => {
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
            <span className="text-[#111418] text-base font-medium leading-normal">ID:{incident.id}</span>
          </div>

          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex flex-col gap-3">
              <p className="text-[#111418] tracking-light text-xl md:text-3xl lg:text-[32px] font-bold leading-tight">{incident.id}</p>
              <p className="text-[#617589] text-sm font-normal leading-normal">
                Reported by {incident.created_by} on {formatDate(incident.created_on)}
              </p>
            </div>
          </div>

          <h3 className="text-[#111418] text-base md:text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Details</h3>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Status</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.status}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Priority</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.priority}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Created By</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.created_by}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Created Date</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{formatDate(incident.created_on)}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pr-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Updated By</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{incident.updated_by}</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-solid border-t-[#dbe0e6] py-4 pl-2">
              <p className="text-[#617589] text-sm font-normal leading-normal">Updated Date</p>
              <p className="text-[#111418] text-sm font-normal leading-normal">{formatDate(incident.updated_on)}</p>
            </div>
          </div>

          <h3 className="text-[#111418] text-base md:text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Description</h3>
          <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
            {incident.description || 'No description provided.'}
          </p>

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