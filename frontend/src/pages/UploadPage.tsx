import { Link } from 'react-router-dom';
import VideoUploader from '../components/VideoUploader';
import './UploadPage.css';

const UploadPage = () => {
  return (
    <div className="upload-page">
      <div className="page-header">
        <h1>Upload Videos</h1>
        <p>Upload multiple short videos (max 10 seconds each) for streaming</p>
      </div>
      
      <VideoUploader />
      
      <div className="page-footer">
        <p>After uploading, view your videos on the <Link to="/stream">Stream Page</Link></p>
      </div>
    </div>
  );
};

export default UploadPage;
