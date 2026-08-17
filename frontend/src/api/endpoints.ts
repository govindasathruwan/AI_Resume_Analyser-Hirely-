import api from './axios';

export const authAPI = {
  register: (data: { name: string; email: string; password: string; job_title?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getProfile: () => api.get('/auth/profile'),

  updateProfile: (data: { name: string; job_title?: string; bio?: string }) =>
    api.put('/auth/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

export const resumeAPI = {
  upload: (formData: FormData) =>
    api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),

  getAll: () => api.get('/resumes'),

  getById: (id: number) => api.get(`/resumes/${id}`),

  delete: (id: number) => api.delete(`/resumes/${id}`),

  download: (id: number) => api.get(`/resumes/${id}/download`, { responseType: 'blob' }),
};

export const analysisAPI = {
  create: (data: { resume_id: number; job_description?: string; job_title?: string; strictness?: string }) =>
    api.post('/analyses', data),

  analyze: (data: { resumeId: number; jobDescription?: string; jobTitle?: string; strictness?: string }) =>
    api.post('/analyses', {
      resume_id: data.resumeId,
      job_description: data.jobDescription,
      job_title: data.jobTitle,
      strictness: data.strictness,
    }),

  getAll: () => api.get('/analyses'),

  getById: (id: number) => api.get(`/analyses/${id}`),

  delete: (id: number) => api.delete(`/analyses/${id}`),

  getStats: () => api.get('/analyses/stats/overview'),

  getPublicStats: () => api.get('/analyses/public-stats'),

  generateCoverLetter: (data: { resume_id: number; job_description: string }) =>
    api.post('/analyses/cover-letter', data),
};

export const reportAPI = {
  downloadPdf: (id: number) =>
    api.get(`/analyses/${id}/pdf`, { responseType: 'blob' }),
};
