import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { getVideos } from '../services/api';
import type { Video } from '../types/index.ts';
import './StreamPage.css';

const StreamPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await getVideos();
      setVideos(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoEnd = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleVideoSelect = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="stream-page">
        <div className="loading">Loading videos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stream-page">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchVideos}>Try Again</button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="stream-page">
        <div className="empty-state">
          <h2>No Videos Found</h2>
          <p>Upload some videos to start streaming</p>
          <Link to="/upload" className="upload-link">Go to Upload Page</Link>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentIndex];

  return (
    <div className="stream-page">
      <div className="stream-container">
        <div className="player-section">
          <div className="now-playing">
            <span className="label">Now Playing:</span>
            <span className="title">{currentVideo.title}</span>
            <span className="count">({currentIndex + 1} of {videos.length})</span>
          </div>
          
          <VideoPlayer
            key={currentVideo.id}
            src={currentVideo.streamUrl}
            onEnded={handleVideoEnd}
            autoPlay={true}
          />

          <div className="video-info">
            <p><strong>Original:</strong> {currentVideo.originalName}</p>
            {currentVideo.duration && (
              <p><strong>Duration:</strong> {currentVideo.duration.toFixed(1)}s</p>
            )}
          </div>
        </div>

        <div className="playlist-section">
          <h3>Playlist</h3>
          <div className="playlist">
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`playlist-item ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleVideoSelect(index)}
              >
                <div className="playlist-index">{index + 1}</div>
                <div className="playlist-info">
                  <span className="playlist-title">{video.title}</span>
                  <span className="playlist-name">{video.originalName}</span>
                </div>
                {index === currentIndex && <span className="playing-indicator">▶</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;
