import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import StreamPage from './pages/StreamPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-brand">Video Streaming</div>
        <div className="nav-links">
          <Link to="/upload">Upload</Link>
          <Link to="/stream">Stream</Link>
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/stream" element={<StreamPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
