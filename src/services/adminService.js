import api from './api';

export const adminService = {
  // User Management
  getAllUsers: async (params = {}) => {
    const response = await api.get('/auth/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/auth/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id, isActive) => {
    const response = await api.patch(`/auth/users/${id}/toggle`, { isActive });
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/auth/users/stats');
    return response.data;
  },

  // Job Management
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs/jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/jobs/${id}`);
    return response.data;
  },

  bulkCreateJobs: async (jobs) => {
    const response = await api.post('/jobs/jobs/bulk', { jobs });
    return response.data;
  },

  // Candidate Search
  searchCandidates: async (searchParams) => {
    const response = await api.get('/resume/candidates/search', { params: searchParams });
    return response.data;
  },

  getCandidateByEmail: async (email) => {
    const response = await api.get(`/resume/candidates/email/${email}`);
    return response.data;
  },

  getAllAnalyses: async (params = {}) => {
    const response = await api.get('/resume/analyses', { params });
    return response.data;
  },

  getAnalysisById: async (id) => {
    const response = await api.get(`/resume/analyses/${id}`);
    return response.data;
  },
};