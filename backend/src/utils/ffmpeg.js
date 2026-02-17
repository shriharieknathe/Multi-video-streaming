const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Get video duration using ffprobe
const getVideoDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(metadata.format.duration);
    });
  });
};

// Convert video to HLS format for streaming
const convertToHLS = (inputPath, videoId) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.join(__dirname, '../../streams', videoId);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'index.m3u8');

    ffmpeg(inputPath)
      .outputOptions([
        '-c:v copy',         // copy video codec (fast)
        '-c:a copy',         // copy audio codec (fast)
        '-start_number 0',
        '-hls_time 2',       // 2 second segments
        '-hls_list_size 0',  // keep all segments in playlist
        '-f hls'
      ])
      .output(outputPath)
      .on('start', (cmd) => {
        console.log('FFmpeg started:', cmd);
      })
      .on('progress', (progress) => {
        console.log(`Processing: ${progress.percent?.toFixed(1)}% done`);
      })
      .on('end', () => {
        console.log(`HLS conversion completed for ${videoId}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .run();
  });
};

module.exports = {
  getVideoDuration,
  convertToHLS
};
