import axios from 'axios';
import { Video, UploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadVideos = async (formData: FormData): Promise<UploadResponse> => {
  const response = await api.post('/api/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getVideos = async (): Promise<Video[]> => {
  const response = await api.get('/api/videos');
  return response.data;
};

export { API_BASE_URL };
