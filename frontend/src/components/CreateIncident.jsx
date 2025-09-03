import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const CreateIncident = () => {
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get('id'); // Get incident ID from query params
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Open',
    priority: 'Medium'
  });

  // Check if we're in edit mode
  useEffect(() => {
    if (incidentId) {
      setIsEditing(true);
      fetchIncidentData(incidentId);
    }
  }, [incidentId]);

  const fetchIncidentData = async (incidentId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const incident = await response.json();
        setFormData({
          title: incident.title || '',
          description: incident.description || '',
          status: incident.status || 'Open',
          priority: incident.priority || 'Medium'
        });
      } else {
        alert('Failed to load incident data');
      }
    } catch (error) {
      console.error('Error fetching incident:', error);
      alert('Error loading incident data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{fontFamily: 'Inter, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <div className="px-4 md:px-8 lg:px-16 xl:px-24 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-2xl md:text-3xl lg:text-[32px] font-bold leading-tight">
                {isEditing ? 'Edit Incident' : 'Add New Incident'}
              </p>
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#111418]"></div>
                <p className="mt-2 text-[#617589]">Loading incident data...</p>
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const method = isEditing ? 'PUT' : 'POST';
                const url = isEditing ? `/api/incidents/${incidentId}` : '/api/incidents';

                try {
                  const response = await fetch(url, {
                    method: method,
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData).toString(),
                  });

                  if (response.ok) {
                    // For successful updates, the backend redirects to /home
                    // For successful creates, we also redirect to /home
                    if (response.redirected) {
                      window.location.href = response.url;
                    } else {
                      alert(isEditing ? 'Incident updated successfully!' : 'Incident created successfully!');
                      window.location.href = '/home';
                    }
                  } else {
                    alert(isEditing ? 'Failed to update incident' : 'Failed to create incident');
                  }
                } catch (error) {
                  console.error('Error:', error);
                  alert('An error occurred');
                }
              }}
              className="space-y-6"
            >
              {/* Title Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">Title *</p>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter Title"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                    required
                  />
                </label>
              </div>

              {/* Description Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">Description *</p>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the incident"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] min-h-36 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                    required
                  />
                </label>
              </div>

              {/* Status Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">Status *</p>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                    style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(97,117,137)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")', backgroundPosition: 'right 15px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px'}}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </label>
              </div>

              {/* Priority Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#111418] text-base font-medium leading-normal pb-2">Priority *</p>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#617589] p-[15px] text-base font-normal leading-normal"
                    style={{backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(97,117,137)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e")', backgroundPosition: 'right 15px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px'}}
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex px-4 py-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#1172d4] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0d5bb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="truncate">{isEditing ? 'Save Changes' : 'Submit'}</span>
                </button>
              </div>
            </form>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIncident;