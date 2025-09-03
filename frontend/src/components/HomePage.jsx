import React from 'react';
import Header from './Header';
import Filters from './Filters';
import IncidentTable from './IncidentTable';
import Pagination from './Pagination';
import Footer from './Footer';

const HomePage = () => {
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
            <IncidentTable />
            <Pagination />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;