import api from './axios';

export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (name, email, password) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};

export const updateProfile = async (formData) => {
  const res = await api.put('/auth/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
