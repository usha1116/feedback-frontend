import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSuggestions = () => api.get('/suggestions');
export const createSuggestion = (data) => api.post('/suggestions', data);
export const upvoteSuggestion = (id) => api.post(`/suggestions/${id}/upvote`);
export const downvoteSuggestion = (id) => api.post(`/suggestions/${id}/downvote`);

export default api;

