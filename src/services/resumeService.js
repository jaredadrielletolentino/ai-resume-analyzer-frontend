import api from './api';

export const resumeService = {
  analyzeResume: async (file, jobDescription) => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);
    
    const response = await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllAnalyses: async (page = 1, limit = 10) => {
    const response = await api.get(`/resume/analyses?page=${page}&limit=${limit}`);
    return response.data;
  },

  getAnalysisById: async (id) => {
    const response = await api.get(`/resume/analyses/${id}`);
    return response.data;
  },

  searchCandidates: async (params) => {
    const response = await api.get('/resume/candidates/search', { params });
    return response.data;
  },

  getCandidateByEmail: async (email) => {
    const response = await api.get(`/resume/candidates/email/${email}`);
    return response.data;
  },
};