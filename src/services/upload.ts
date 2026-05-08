import { apiClient } from '../app/axios';
import type { ApiResponse, UploadResult } from '../types';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post<ApiResponse<UploadResult>>('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};
