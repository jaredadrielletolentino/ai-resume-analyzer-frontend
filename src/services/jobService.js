import api from './api';

export const jobService = {
  createJob: async (jobData) => {
    const response = await api.post('/jobs/jobs', jobData);
    return response.data;
  },

  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs/jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/jobs/${id}`);
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

  matchResumeWithJobs: async (resumeId, jobIds = null) => {
    const response = await api.post('/jobs/match', { resumeId, jobIds });
    return response.data;
  },

  getMatchesForResume: async (resumeId, limit = 10, minScore = 0) => {
    const response = await api.get(`/jobs/resume/${resumeId}/matches?limit=${limit}&minScore=${minScore}`);
    return response.data;
  },

  updateMatchStatus: async (matchId, status) => {
    const response = await api.patch(`/jobs/matches/${matchId}/status`, { status });
    return response.data;
  },
};