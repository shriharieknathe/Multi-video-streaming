# Multi-Video Streaming Platform

A full-stack application for uploading and streaming multiple short videos using HLS (HTTP Live Streaming).

## Features

- Upload multiple MP4 videos (2-10 videos, max 10 sec each)
- Automatic HLS conversion for chunk-based streaming
- Sequential video playback
- Drag and drop upload support

## Tech Stack

**Frontend:** React, Vite, TypeScript, hls.js  
**Backend:** Node.js, Express, Multer, fluent-ffmpeg

## Prerequisites

- Node.js 18+
- FFmpeg installed and in PATH

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

## API Endpoints

- `POST /api/videos/upload` - Upload videos
- `GET /api/videos` - Get all videos
- `GET /streams/:videoId/index.m3u8` - Stream video (HLS)
