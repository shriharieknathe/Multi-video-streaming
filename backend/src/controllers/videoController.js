const path = require('path');
const fs = require('fs');

const videosFilePath = path.join(__dirname, '../../data/videos.json');

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

// Upload videos controller
const uploadVideos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    if (req.files.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least 2 videos'
      });
    }

    const videos = getVideosFromFile();
    const uploadedVideos = [];

    for (const file of req.files) {
      const videoId = path.basename(file.filename, path.extname(file.filename));
      
      const videoData = {
        id: videoId,
        title: `Video ${videos.length + uploadedVideos.length + 1}`,
        originalName: file.originalname,
        filename: file.filename,
        filepath: file.path,
        size: file.size,
        mimetype: file.mimetype,
        streamUrl: `/streams/${videoId}/index.m3u8`,
        createdAt: new Date().toISOString()
      };

      uploadedVideos.push(videoData);
    }

    // Save to file
    const allVideos = [...videos, ...uploadedVideos];
    saveVideosToFile(allVideos);

    res.status(201).json({
      success: true,
      message: `${uploadedVideos.length} videos uploaded successfully`,
      videos: uploadedVideos
    });

  } catch (error) {
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
