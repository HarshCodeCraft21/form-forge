import api from './axios';

export const getPublicForm = async (slugOrId) => {
  const res = await api.get(`/public/forms/${slugOrId}`);
  return res.data;
};

export const submitPublicResponse = async (slugOrId, payload) => {
  const res = await api.post(`/public/forms/${slugOrId}/submit`, payload);
  return res.data;
};
