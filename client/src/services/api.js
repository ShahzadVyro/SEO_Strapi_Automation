import axios from 'axios';

// In production (Vercel) the API is on the same origin — no baseURL needed.
// In local dev, point to the Express server via VITE_API_URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export const getRelations = () => api.get('/api/strapi/relations').then(r => r.data);
export const getClusterPages = (page = 1) => api.get('/api/strapi/cluster-pages', { params: { page } }).then(r => r.data);

export const uploadMedia = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/api/strapi/upload', form).then(r => r.data);
};

export const publishCluster = (template, fields, publishedBy) =>
  api.post('/api/strapi/publish', { template, fields, publishedBy }).then(r => r.data);

export const getDrafts = (filters = {}) => api.get('/api/drafts', { params: filters }).then(r => r.data);
export const getDraft = (id) => api.get(`/api/drafts/${id}`).then(r => r.data);
export const createDraft = (data) => api.post('/api/drafts', data).then(r => r.data);
export const updateDraft = (id, data) => api.put(`/api/drafts/${id}`, data).then(r => r.data);
export const deleteDraft = (id) => api.delete(`/api/drafts/${id}`).then(r => r.data);
export const getPublishLog = (page = 1) => api.get('/api/drafts/publish-log', { params: { page } }).then(r => r.data);
