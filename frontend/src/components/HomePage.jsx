import React, { useEffect } from 'react';
import Header from './Header';
import IncidentTable from './IncidentTable';
import IncidentFilters from './IncidentFilters';
import Pagination from './Pagination';
import Footer from './Footer';
import { IncidentProvider, useIncidentContext } from '../contexts/IncidentContext';

const HomePageContent = () => {
  const { fetchIncidents, error, pagination, handlePageChange } = useIncidentContext();

  useEffect(() => {
    fetchIncidents();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-4 md:px-8 lg:px-16 xl:px-24 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-2xl md:text-3xl lg:text-[32px] font-bold leading-tight">All Incidents</p>
            </div>
          
            <IncidentFilters />
            {error && (
              <div className="px-4 py-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">Error loading incidents: {error}</p>
              </div>
            )}
            <IncidentTable />
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

const HomePage = () => {

  return (
    <IncidentProvider>
      <HomePageContent />
    </IncidentProvider>
  );
};

export default HomePage;