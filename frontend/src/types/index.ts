export interface Video {
  id: string;
  title: string;
  originalName: string;
  streamUrl: string;
  createdAt: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  videos?: Video[];
}
