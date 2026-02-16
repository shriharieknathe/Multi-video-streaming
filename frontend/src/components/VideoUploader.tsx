import { useState, useRef } from 'react';
import { uploadVideos } from '../services/api';
import './VideoUploader.css';

interface UploadState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const VideoUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    loading: false,
    error: null,
    success: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    
    // Validate file types
    const invalidFiles = fileArray.filter(file => !file.type.includes('video/mp4'));
    if (invalidFiles.length > 0) {
      setUploadState({
        loading: false,
        error: 'Only MP4 video files are allowed',
        success: null
      });
      return;
    }

    // Validate file sizes (20MB max)
    const oversizedFiles = fileArray.filter(file => file.size > 20 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setUploadState({
        loading: false,
        error: 'Each file must be less than 20MB',
        success: null
      });
      return;
    }

    setFiles(fileArray);
    setUploadState({ loading: false, error: null, success: null });
  };

  const handleUpload = async () => {
    if (files.length < 2) {
      setUploadState({
        loading: false,
        error: 'Please select at least 2 videos',
        success: null
      });
      return;
    }

    setUploadState({ loading: true, error: null, success: null });

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('videos', file));

      const response = await uploadVideos(formData);
      
      setUploadState({
        loading: false,
        error: null,
        success: response.message || 'Videos uploaded successfully!'
      });
      
      // Clear files after successful upload
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setUploadState({
        loading: false,
        error: error.response?.data?.message || 'Failed to upload videos',
        success: null
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="video-uploader">
      <div className="upload-area">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/mp4"
          multiple
          id="video-input"
          className="file-input"
        />
        <label htmlFor="video-input" className="upload-label">
          <div className="upload-icon">📁</div>
          <p>Click to select videos or drag and drop</p>
          <span className="upload-hint">MP4 only, max 10 seconds, max 20MB each</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files ({files.length})</h3>
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <button 
                className="remove-btn"
                onClick={() => removeFile(index)}
                disabled={uploadState.loading}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadState.error && (
        <div className="message error">{uploadState.error}</div>
      )}

      {uploadState.success && (
        <div className="message success">{uploadState.success}</div>
      )}

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={files.length < 2 || uploadState.loading}
      >
        {uploadState.loading ? 'Uploading...' : `Upload ${files.length} Video(s)`}
      </button>

      {files.length > 0 && files.length < 2 && (
        <p className="warning">Please select at least 2 videos</p>
      )}
    </div>
  );
};

export default VideoUploader;
