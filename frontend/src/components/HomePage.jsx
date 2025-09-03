import React, { useState, useEffect } from 'react';
import Header from './Header';
import Filters from './Filters';
import IncidentTable from './IncidentTable';
import Pagination from './Pagination';
import Footer from './Footer';

const HomePage = () => {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0
  });

  const fetchIncidents = async (page = 1) => {
    try {
      setError(null);

      // Calculate offset based on page (0-based)
      const offset = (page - 1) * pagination.pageSize;

      // Fetch incidents with pagination
      const response = await fetch(`/api/incidents?limit=${pagination.pageSize}&offset=${offset}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIncidents(data.incidents || []);
      setPagination({
        page: data.page || page,
        pageSize: data.page_size || pagination.pageSize,
        totalCount: data.total_count || 0,
        totalPages: data.total_pages || 0
      });
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError(err.message);
    } 
  };

  useEffect(() => {
    fetchIncidents(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchIncidents(newPage);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-4 md:px-8 lg:px-16 xl:px-24 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-2xl md:text-3xl lg:text-[32px] font-bold leading-tight">All Incidents</p>
            </div>
            <Filters />
            {error && (
              <div className="px-4 py-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">Error loading incidents: {error}</p>
              </div>
            )}
            <IncidentTable
              incidents={incidents}
              currentPage={pagination.page}
              pageSize={pagination.pageSize}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;