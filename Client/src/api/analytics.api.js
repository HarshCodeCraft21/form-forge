import api from './axios';

export const getFormAnalytics = async (formId) => {
  const res = await api.get('/responses', { params: { formId } });
  return res.data;
};
