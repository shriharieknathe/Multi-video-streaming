const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadVideos, getAllVideos } = require('../controllers/videoController');

// POST /api/videos/upload - Upload multiple videos
router.post('/upload', upload.array('videos', 10), asyncHandler(uploadVideos));

// GET /api/videos - Get all videos
router.get('/', asyncHandler(getAllVideos));

module.exports = router;
