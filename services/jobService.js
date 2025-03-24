import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const jobService = {
  getAllJobs: async () => {
    const response = await axios.get(`${API_URL}/jobs/all`);
    return response.data;
  },

  getJobById: async (id) => {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await axios.post(`${API_URL}/jobs`, jobData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await axios.put(`${API_URL}/jobs/${id}`, jobData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
    return response.data;
  },

  deleteJob: async (id) => {
    await axios.delete(`${API_URL}/jobs/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });
  },
};
