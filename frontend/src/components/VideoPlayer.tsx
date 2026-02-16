import { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { API_BASE_URL } from '../services/api';
import './VideoPlayer.css';

interface VideoPlayerProps {
  src: string;
  onEnded?: () => void;
  autoPlay?: boolean;
}

const VideoPlayer = ({ src, onEnded, autoPlay = true }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const fullUrl = `${API_BASE_URL}${src}`;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hls.loadSource(fullUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(err => {
            console.log('Autoplay prevented:', err);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = fullUrl;
      if (autoPlay) {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay]);

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        controls
        onEnded={onEnded}
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
