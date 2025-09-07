import React, { createContext, useContext, useState, useEffect } from 'react';
import { PAGINATION } from '../constants';

const IncidentContext = createContext();

export const useIncidentContext = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidentContext must be used within an IncidentProvider');
  }
  return context;
};

export const IncidentProvider = ({ children }) => {
  const [allIncidents, setAllIncidents] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGINATION.INCIDENT_DEFAULT_LIMIT,
    totalCount: 0,
    totalPages: 0
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Open', 'In Progress', 'Resolved'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest'

  // Fetch all incidents for client-side filtering/sorting
  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all incidents without pagination for client-side filtering
      const response = await fetch(`/api/incidents?limit=${PAGINATION.MAX_LIMIT}`, { // Maximum allowed by backend
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Response data:', data);

      // Check if response is ok
      if (response.ok) {
        // Check if we have the expected data structure
        if (data && data.incidents && Array.isArray(data.incidents)) {
          const fetchedIncidents = data.incidents;
          setAllIncidents(fetchedIncidents);
          setIncidents(fetchedIncidents);
          setPagination(prev => ({
            ...prev,
            totalCount: data.total_count || fetchedIncidents.length,
            totalPages: data.total_pages || Math.ceil(fetchedIncidents.length / prev.pageSize)
          }));
        } else {
          console.log('Unexpected response format:', data);
          setError('Failed to fetch incidents - unexpected response format');
        }
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        // Redirect to login after a short delay to show the error
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        console.log('Response not ok:', response.status, response.statusText);
        console.log('Response data:', data);
        setError('Failed to fetch incidents');
      }
    } catch (err) {
      setError('Error fetching incidents');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch paginated incidents (for when no filters are applied)
  const fetchIncidentsPaginated = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * pagination.pageSize;
      const response = await fetch(`/api/incidents?limit=${pagination.pageSize}&offset=${offset}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Response data:', data);

      // Check if response is ok
      if (response.ok) {
        // Check if we have the expected data structure
        if (data && data.incidents && Array.isArray(data.incidents)) {
          const fetchedIncidents = data.incidents;
          setAllIncidents(fetchedIncidents);
          setIncidents(fetchedIncidents);
          setPagination({
            page: data.page || page,
            pageSize: data.page_size || pagination.pageSize,
            totalCount: data.total_count || 0,
            totalPages: data.total_pages || 0
          });
        } else {
          console.log('Unexpected response format:', data);
          if (data.detail) {
            console.log('Validation errors:', data.detail);
          }
          setError('Failed to fetch incidents - unexpected response format');
        }
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        // Redirect to login after a short delay to show the error
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        console.log('Response not ok:', response.status, response.statusText);
        console.log('Response data:', data);
        setError('Failed to fetch incidents');
      }
    } catch (err) {
      setError('Error fetching incidents');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allIncidents];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(incident => incident.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_on);
      const dateB = new Date(b.created_on);

      if (sortBy === 'newest') {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    // Update pagination info for filtered results
    const totalFilteredCount = filtered.length;
    const totalFilteredPages = Math.ceil(totalFilteredCount / pagination.pageSize);

    setPagination(prev => ({
      ...prev,
      totalCount: totalFilteredCount,
      totalPages: totalFilteredPages,
      page: prev.page > totalFilteredPages ? 1 : prev.page // Reset to page 1 if current page exceeds total pages
    }));

    // Apply client-side pagination
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedFiltered = filtered.slice(startIndex, endIndex);

    setFilteredIncidents(paginatedFiltered);
    setIncidents(filtered); // Keep full filtered list for pagination
  }, [allIncidents, statusFilter, sortBy, pagination.page, pagination.pageSize]);

  // Initial data fetch - get all incidents for client-side filtering
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Handle page change - always use client-side pagination since we fetch all data upfront
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Refresh incidents - fetch all data again
  const refreshIncidents = () => {
    fetchIncidents();
  };

  const value = {
    incidents: filteredIncidents,
    allIncidents: incidents,
    loading,
    error,
    pagination,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    fetchIncidents,
    refreshIncidents,
    handlePageChange,
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
};