import { axiosInstance } from 'config';

export const ProfileApis = {
  updateProfile: (data: FormData) =>
    axiosInstance.post('update', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
