import React from 'react';
import { useIncidentContext } from '../contexts/IncidentContext';

const IncidentFilters = () => {
  const { statusFilter, setStatusFilter, sortBy, setSortBy } = useIncidentContext();

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg border border-[#dbe0e6]">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#111418]">Filter by Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-[#dbe0e6] rounded-lg bg-white text-[#111418] text-sm focus:outline-none focus:ring-2 focus:ring-[#1172d4] focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#111418]">Sort by Date</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-[#dbe0e6] rounded-lg bg-white text-[#111418] text-sm focus:outline-none focus:ring-2 focus:ring-[#1172d4] focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IncidentFilters;