import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import StreamPage from './pages/StreamPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-brand">Video Streaming</div>
        <div className="nav-links">
          <NavLink to="/upload" className={({ isActive }) => isActive ? 'active' : ''}>
            Upload
          </NavLink>
          <NavLink to="/stream" className={({ isActive }) => isActive ? 'active' : ''}>
            Stream
          </NavLink>
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
