import { useState, useRef } from 'react';
import { uploadVideos } from '../services/api';
import './VideoUploader.css';

interface UploadState {
  loading: boolean;
  progress: number;
  error: string | null;
  success: string | null;
}

const VideoUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    loading: false,
    progress: 0,
    error: null,
    success: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (fileArray: File[]): string | null => {
    // Validate file types
    const invalidFiles = fileArray.filter(file => !file.type.includes('video/mp4'));
    if (invalidFiles.length > 0) {
      return `Invalid file type: ${invalidFiles.map(f => f.name).join(', ')}. Only MP4 allowed.`;
    }

    // Validate file sizes (20MB max)
    const oversizedFiles = fileArray.filter(file => file.size > 20 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      return `File too large: ${oversizedFiles.map(f => f.name).join(', ')}. Max 20MB each.`;
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const error = validateFiles(fileArray);
    
    if (error) {
      setUploadState(prev => ({ ...prev, error, success: null }));
      return;
    }

    setFiles(prev => [...prev, ...fileArray]);
    setUploadState(prev => ({ ...prev, error: null, success: null }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    const fileArray = Array.from(droppedFiles);
    const error = validateFiles(fileArray);
    
    if (error) {
      setUploadState(prev => ({ ...prev, error, success: null }));
      return;
    }

    setFiles(prev => [...prev, ...fileArray]);
    setUploadState(prev => ({ ...prev, error: null, success: null }));
  };

  const handleUpload = async () => {
    if (files.length < 2) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select at least 2 videos',
        success: null
      }));
      return;
    }

    setUploadState({ loading: true, progress: 0, error: null, success: null });

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('videos', file));

      const response = await uploadVideos(formData, (progress) => {
        setUploadState(prev => ({ ...prev, progress }));
      });
      
      let message = response.message || 'Videos uploaded successfully!';
      if (response.errors && response.errors.length > 0) {
        message += ` (${response.errors.length} rejected)`;
      }

      setUploadState({
        loading: false,
        progress: 100,
        error: null,
        success: message
      });
      
      // Clear files after successful upload
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setUploadState({
        loading: false,
        progress: 0,
        error: error.response?.data?.message || 'Failed to upload videos',
        success: null
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="video-uploader">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
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
          <div className="upload-icon">🎬</div>
          <p>Click to select videos or drag and drop</p>
          <span className="upload-hint">MP4 only • Max 10 seconds • Max 20MB each</span>
        </label>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h3>Selected Files ({files.length})</h3>
            <button className="clear-all-btn" onClick={clearAll} disabled={uploadState.loading}>
              Clear All
            </button>
          </div>
          <div className="file-list-items">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="file-item">
                <div className="file-icon">🎥</div>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeFile(index)}
                  disabled={uploadState.loading}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="file-list-footer">
            <span>Total: {formatFileSize(totalSize)}</span>
          </div>
        </div>
      )}

      {uploadState.loading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
          <span className="progress-text">
            {uploadState.progress < 100 ? `Uploading... ${uploadState.progress}%` : 'Processing videos...'}
          </span>
        </div>
      )}

      {uploadState.error && (
        <div className="message error">
          <span className="message-icon">⚠️</span>
          {uploadState.error}
        </div>
      )}

      {uploadState.success && (
        <div className="message success">
          <span className="message-icon">✅</span>
          {uploadState.success}
        </div>
      )}

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={files.length < 2 || uploadState.loading}
      >
        {uploadState.loading ? (
          <>
            <span className="spinner"></span>
            Uploading...
          </>
        ) : (
          `Upload ${files.length} Video${files.length !== 1 ? 's' : ''}`
        )}
      </button>

      {files.length > 0 && files.length < 2 && (
        <p className="warning">⚠️ Please select at least 2 videos</p>
      )}
    </div>
  );
};

export default VideoUploader;
