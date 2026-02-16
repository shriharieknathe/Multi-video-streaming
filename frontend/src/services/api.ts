import axios from 'axios';
import { Video, UploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const uploadVideos = async (files: FileList): Promise<UploadResponse> => {
  const formData = new FormData();
  
  Array.from(files).forEach((file) => {
    formData.append('videos', file);
  });

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
