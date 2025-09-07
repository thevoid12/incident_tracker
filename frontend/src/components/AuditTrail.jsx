import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Pagination from './Pagination';
import { PAGINATION } from '../constants';

const AuditTrail = () => {
  const [auditEntries, setAuditEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = PAGINATION.AUDIT_TRAIL_DEFAULT_LIMIT;

  const fetchAuditEntries = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * pageSize;
      const response = await fetch(`/api/audittrail?limit=${pageSize}&offset=${offset}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit entries');
      }

      const data = await response.json();
      setAuditEntries(data.entries || []);
      setTotalCount(data.total_count || 0);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching audit entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditEntries(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && auditEntries.length === 0) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading audit trail...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600">Error: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <Header />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-8 lg:px-16 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-xl md:text-2xl lg:text-[32px] font-bold leading-tight">Audit Trail</p>
            </div>

            <div className="px-4 py-3">
              <div className="overflow-x-auto rounded-lg border border-[#dbe0e6] bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-2 md:px-4 py-3 text-left text-[#111418] text-xs md:text-sm font-medium leading-normal min-w-[120px] md:min-w-[200px]">
                        User Action
                      </th>
                      <th className="px-2 md:px-4 py-3 text-left text-[#111418] text-xs md:text-sm font-medium leading-normal min-w-[200px] md:min-w-[300px]">
                        Description
                      </th>
                      <th className="px-2 md:px-4 py-3 text-left text-[#111418] text-xs md:text-sm font-medium leading-normal min-w-[150px] md:min-w-[200px]">Email</th>
                      <th className="px-2 md:px-4 py-3 text-left text-[#111418] text-xs md:text-sm font-medium leading-normal min-w-[120px] md:min-w-[150px]">
                        Created On
                      </th>
                      <th className="px-2 md:px-4 py-3 text-left text-[#111418] text-xs md:text-sm font-medium leading-normal min-w-[120px] md:min-w-[150px]">
                        Created By
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditEntries.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-[#617589] text-sm">
                          No audit entries found
                        </td>
                      </tr>
                    ) : (
                      auditEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-2 md:px-4 py-4 text-[#111418] text-xs md:text-sm font-normal leading-normal break-words">
                            {entry.user_action.replace(/_/g, ' ')}
                          </td>
                          <td className="px-2 md:px-4 py-4 text-[#617589] text-xs md:text-sm font-normal leading-normal break-words max-w-xs">
                            <div className="truncate md:whitespace-normal" title={entry.description || '-'}>
                              {entry.description || '-'}
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-4 text-[#617589] text-xs md:text-sm font-normal leading-normal break-words">
                            {entry.email}
                          </td>
                          <td className="px-2 md:px-4 py-4 text-[#617589] text-xs md:text-sm font-normal leading-normal whitespace-nowrap">
                            {formatDate(entry.created_on)}
                          </td>
                          <td className="px-2 md:px-4 py-4 text-[#617589] text-xs md:text-sm font-normal leading-normal break-words">
                            {entry.created_by}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalCount > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            <div className="text-xs md:text-sm text-[#617589] mt-2 px-4 text-center md:text-left">
              Showing {auditEntries.length} of {totalCount} entries
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuditTrail;