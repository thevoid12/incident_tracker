import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Pagination from './Pagination';

const AuditTrail = () => {
  const [auditEntries, setAuditEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

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
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">Audit Trail</p>
            </div>

            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-lg border border-[#dbe0e6] bg-white">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-4 py-3 text-left text-[#111418] w-[200px] text-sm font-medium leading-normal">
                        User Action
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[300px] text-sm font-medium leading-normal">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[200px] text-sm font-medium leading-normal">Email</th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[150px] text-sm font-medium leading-normal">
                        Created On
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[150px] text-sm font-medium leading-normal">
                        Created By
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditEntries.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-[#617589]">
                          No audit entries found
                        </td>
                      </tr>
                    ) : (
                      auditEntries.map((entry) => (
                        <tr key={entry.id} className="border-t border-t-[#dbe0e6]">
                          <td className="h-[72px] px-4 py-2 text-[#111418] text-sm font-normal leading-normal">
                            {entry.user_action.replace(/_/g, ' ')}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                            {entry.description || '-'}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                            {entry.email}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
                            {formatDate(entry.created_on)}
                          </td>
                          <td className="h-[72px] px-4 py-2 text-[#617589] text-sm font-normal leading-normal">
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

            <div className="text-sm text-[#617589] mt-2 px-4">
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