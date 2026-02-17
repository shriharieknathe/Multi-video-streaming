// Video metadata from API
export interface Video {
  id: string;
  title: string;
  originalName: string;
  streamUrl: string;
  duration?: number;
  size?: number;
  createdAt: string;
}

// Upload API response
export interface UploadResponse {
  success: boolean;
  message: string;
  videos?: Video[];
  errors?: string[];
}
