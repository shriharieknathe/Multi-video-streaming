const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadVideos, getAllVideos } = require('../controllers/videoController');

// POST /api/videos/upload - Upload multiple videos
router.post('/upload', upload.array('videos', 10), uploadVideos);

// GET /api/videos - Get all videos
router.get('/', getAllVideos);

module.exports = router;
