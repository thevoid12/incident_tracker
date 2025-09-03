import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Always show pagination controls, even with one page

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111418] rounded-full hover:bg-[#f0f2f4]"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111418] rounded-full">
            ...
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`text-sm leading-normal flex size-10 items-center justify-center text-[#111418] rounded-full ${
            i === currentPage
              ? 'font-bold bg-[#f0f2f4]'
              : 'font-normal hover:bg-[#f0f2f4]'
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111418] rounded-full">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="text-sm font-normal leading-normal flex size-10 items-center justify-center text-[#111418] rounded-full hover:bg-[#f0f2f4]"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center p-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`flex size-10 items-center justify-center ${
          currentPage <= 1 ? 'text-[#9ca3af] cursor-not-allowed' : 'text-[#111418] hover:bg-[#f0f2f4] rounded-full'
        }`}
      >
        <div className="text-current">
          <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
          </svg>
        </div>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`flex size-10 items-center justify-center ${
          currentPage >= totalPages ? 'text-[#9ca3af] cursor-not-allowed' : 'text-[#111418] hover:bg-[#f0f2f4] rounded-full'
        }`}
      >
        <div className="text-current">
          <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default Pagination;