// Configuration constants for the frontend
// These should match the backend config.json values

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  AUDIT_TRAIL_DEFAULT_LIMIT: 10,
  INCIDENT_DEFAULT_LIMIT: 5
};

export const API_BASE_URL = '/api';

// File upload configuration
export const UPLOAD_CONFIG = {
  ALLOWED_FILE_TYPES: [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx', '.xls']
};

// User roles for registration
export const USER_ROLES = ['Admin', 'User'];