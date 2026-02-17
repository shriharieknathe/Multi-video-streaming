import axios from 'axios';
import type { Video, UploadResponse } from '../types/index.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadVideos = async (
  formData: FormData, 
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  const response = await api.post('/api/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
};

export const getVideos = async (): Promise<Video[]> => {
  const response = await api.get('/api/videos');
  return response.data;
};

export { API_BASE_URL };
