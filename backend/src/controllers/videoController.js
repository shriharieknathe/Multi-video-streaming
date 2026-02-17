const path = require('path');
const fs = require('fs');
const { getVideoDuration, convertToHLS } = require('../utils/ffmpeg');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const videosFilePath = path.join(dataDir, 'videos.json');
const MAX_DURATION = 10; 

// Initialize videos.json if it doesn't exist
if (!fs.existsSync(videosFilePath)) {
  fs.writeFileSync(videosFilePath, '[]');
}

// Helper to read videos from JSON file
const getVideosFromFile = () => {
  try {
    const data = fs.readFileSync(videosFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper to save videos to JSON file
const saveVideosToFile = (videos) => {
  fs.writeFileSync(videosFilePath, JSON.stringify(videos, null, 2));
};

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Upload videos controller
const uploadVideos = async (req, res) => {
  const uploadedFiles = req.files || [];
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    if (req.files.length < 2) {
      uploadedFiles.forEach(file => deleteFile(file.path));
      return res.status(400).json({
        success: false,
        message: 'Please upload at least 2 videos'
      });
    }

    const videos = getVideosFromFile();
    const uploadedVideos = [];
    const errors = [];

    for (const file of req.files) {
      const videoId = path.basename(file.filename, path.extname(file.filename));
      
      try {
        const duration = await getVideoDuration(file.path);
        
        if (duration > MAX_DURATION) {
          errors.push(`${file.originalname}: Video exceeds ${MAX_DURATION} seconds (${duration.toFixed(1)}s)`);
          deleteFile(file.path);
          continue;
        }

        await convertToHLS(file.path, videoId);

        const videoData = {
          id: videoId,
          title: `Video ${videos.length + uploadedVideos.length + 1}`,
          originalName: file.originalname,
          filename: file.filename,
          duration: duration,
          size: file.size,
          mimetype: file.mimetype,
          streamUrl: `/streams/${videoId}/index.m3u8`,
          createdAt: new Date().toISOString()
        };

        uploadedVideos.push(videoData);
        
      } catch (err) {
        console.error(`Error processing ${file.originalname}:`, err);
        errors.push(`${file.originalname}: Failed to process video`);
        deleteFile(file.path);
      }
    }

    if (uploadedVideos.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid videos were uploaded',
        errors
      });
    }

    // Save to file
    const allVideos = [...videos, ...uploadedVideos];
    saveVideosToFile(allVideos);

    res.status(201).json({
      success: true,
      message: `${uploadedVideos.length} video(s) uploaded and converted successfully`,
      videos: uploadedVideos,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    uploadedFiles.forEach(file => deleteFile(file.path));
    
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading videos',
      error: error.message
    });
  }
};

// Get all videos controller
const getAllVideos = async (req, res) => {
  try {
    const videos = getVideosFromFile();
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
};

module.exports = {
  uploadVideos,
  getAllVideos
};
