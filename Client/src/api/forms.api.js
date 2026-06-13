import api from './axios';

export const getForms = async () => {
  const res = await api.get('/forms');
  return res.data;
};

export const getFormById = async (id) => {
  const res = await api.get(`/forms/${id}`);
  return res.data;
};

export const createForm = async (form) => {
  const res = await api.post('/forms', form);
  return res.data;
};

export const updateForm = async (id, updatedForm) => {
  const res = await api.put(`/forms/${id}`, updatedForm);
  return res.data;
};

export const deleteForm = async (id) => {
  const res = await api.delete(`/forms/${id}`);
  return res.data;
};

export const publishForm = async (id, config = {}) => {
  const res = await api.patch(`/forms/${id}/publish`, config);
  return res.data;
};

export const unpublishForm = async (id) => {
  const res = await api.patch(`/forms/${id}/unpublish`);
  return res.data;
};

export const shareFormInfo = async (id) => {
  const res = await api.get(`/forms/${id}/share`);
  return res.data;
};

export const generateQRCode = async (id, format = '') => {
  const res = await api.get(`/forms/${id}/qrcode`, { params: { format } });
  return res.data;
};
