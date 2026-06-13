import api from './axios';

export const getResponses = async (params = {}) => {
  const res = await api.get('/responses', { params });
  return res.data;
};

export const deleteResponse = async (id) => {
  const res = await api.delete(`/responses/${id}`);
  return res.data;
};
