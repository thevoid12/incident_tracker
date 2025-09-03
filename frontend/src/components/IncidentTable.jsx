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
    <div className="px-4 py-3 @container">
      <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
        <table className="flex-1">
          <thead>
            <tr className="bg-white">
              <th className="table-column-120 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                Incident ID
              </th>
              <th className="table-column-240 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">Subject</th>
              <th className="table-column-360 px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">Status</th>
              <th className="table-column-480 px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">Priority</th>
              <th className="table-column-600 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                Created Date
              </th>
              <th className="table-column-720 px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
               Created By 
              </th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <tr key={incident.id} className="border-t border-t-[#dbe0e6]">
                <td className="table-column-120 h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">{incident.id}</td>
                <td className="table-column-240 h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                  {incident.subject}
                </td>
                <td className="table-column-360 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-full"
                  >
                    <span className="truncate">{incident.status}</span>
                  </button>
                </td>
                <td className="table-column-480 h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-medium leading-normal w-full"
                  >
                    <span className="truncate">{incident.priority}</span>
                  </button>
                </td>
                <td className="table-column-600 h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                  {incident.createdDate}
                </td>
                <td className="table-column-720 h-[72px] px-4 py-2 w-[400px] text-[#617589] text-sm font-normal leading-normal">
                  {incident.assignedTo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        @container(max-width:120px){.table-column-120{display: none;}}
        @container(max-width:240px){.table-column-240{display: none;}}
        @container(max-width:360px){.table-column-360{display: none;}}
        @container(max-width:480px){.table-column-480{display: none;}}
        @container(max-width:600px){.table-column-600{display: none;}}
        @container(max-width:720px){.table-column-720{display: none;}}
      `}</style>
    </div>
  );
};

export default IncidentTable;