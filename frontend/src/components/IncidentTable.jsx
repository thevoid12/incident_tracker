import React from 'react';

const IncidentTable = () => {
  const incidents = [
    {
      id: 'INC001',
      subject: 'Network Connectivity Issue',
      status: 'Open',
      priority: 'High',
      createdDate: '2024-01-15',
      assignedTo: 'Unassigned'
    },
    {
      id: 'INC002',
      subject: 'Software Bug in Application X',
      status: 'In Progress',
      priority: 'Medium',
      createdDate: '2024-01-16',
      assignedTo: 'Alex Harper'
    },
    {
      id: 'INC003',
      subject: 'Printer Malfunction',
      status: 'Resolved',
      priority: 'Low',
      createdDate: '2024-01-17',
      assignedTo: 'Jordan Carter'
    },
    {
      id: 'INC004',
      subject: 'Email Server Down',
      status: 'Open',
      priority: 'High',
      createdDate: '2024-01-18',
      assignedTo: 'Unassigned'
    },
    {
      id: 'INC005',
      subject: 'Database Performance Issue',
      status: 'In Progress',
      priority: 'Medium',
      createdDate: '2024-01-19',
      assignedTo: 'Taylor Bennett'
    },
    {
      id: 'INC006',
      subject: 'Security Breach Alert',
      status: 'Resolved',
      priority: 'High',
      createdDate: '2024-01-20',
      assignedTo: 'Casey Evans'
    },
    {
      id: 'INC007',
      subject: 'Hardware Failure on Server Y',
      status: 'Open',
      priority: 'High',
      createdDate: '2024-01-21',
      assignedTo: 'Unassigned'
    },
    {
      id: 'INC008',
      subject: 'User Access Request',
      status: 'In Progress',
      priority: 'Low',
      createdDate: '2024-01-22',
      assignedTo: 'Riley Foster'
    },
    {
      id: 'INC009',
      subject: 'Data Loss Incident',
      status: 'Resolved',
      priority: 'High',
      createdDate: '2024-01-23',
      assignedTo: 'Morgan Reed'
    },
    {
      id: 'INC010',
      subject: 'Application Z Crashing',
      status: 'Open',
      priority: 'Medium',
      createdDate: '2024-01-24',
      assignedTo: 'Unassigned'
    }
  ];

  return (
    <div className="px-4 py-3">
      {/* Desktop Table View */}
      <div className="hidden lg:flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
        <table className="flex-1">
          <thead>
            <tr className="bg-white">
              <th className="px-4 py-3 text-left text-[#111418] text-sm font-medium leading-normal w-32">
                Incident ID
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
            {incidents.map((incident, index) => (
              <tr key={incident.id} className="border-t border-t-[#dbe0e6]">
                <td className="h-[72px] px-4 py-2 text-[#111418] text-sm font-normal leading-normal">{incident.id}</td>
                <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                  {incident.subject}
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
                  {incident.createdDate}
                </td>
                <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                  {incident.assignedTo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-white border border-[#dbe0e6] rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-[#111418] font-semibold text-lg">{incident.id}</h3>
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
                <span className="font-medium text-[#111418]">Subject:</span> {incident.subject}
              </p>
              <p className="text-[#617589] text-sm">
                <span className="font-medium text-[#111418]">Created:</span> {incident.createdDate}
              </p>
              <p className="text-[#617589] text-sm">
                <span className="font-medium text-[#111418]">Assigned to:</span> {incident.assignedTo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTable;