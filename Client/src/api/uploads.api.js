import api from './axios';

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await api.put('/auth/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
