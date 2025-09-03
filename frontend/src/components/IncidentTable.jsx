import React from 'react';

const IncidentTable = ({ incidents = [] , currentPage = 1, pageSize = 5 }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

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
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => {
              const sequentialNumber = (currentPage - 1) * pageSize + index + 1;
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {incidents.map((incident, index) => {
          const sequentialNumber = (currentPage - 1) * pageSize + index + 1;
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
          </div>
         );
       })}
      </div>
    </div>
  );
};

export default IncidentTable;