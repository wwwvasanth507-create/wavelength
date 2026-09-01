# Wavelength — Premium Web Music Streaming & Admin Upload Platform

Wavelength is a high-performance, modern music streaming web application built with **React 19**, **TypeScript**, **Vite 7**, **Tailwind CSS v4**, and a **Python (FastAPI + SQLite)** backend.

## Features
- 🎵 **Music Player**: Gapless loop playback, volume controls, queue management, lyrics display, audio visualizer, quality selector.
- 👑 **Admin Portal**: Manual audio & thumbnail file upload (MP3/WAV/PNG/JPG) or direct stream URL upload.
- 🔐 **Authentication**: User registration, User login, Admin privileges (`admin` / `admin123`).
- 💾 **Persistent SQLite Database**: Zero data loss on server restart.
- ☁️ **Render 24/7 Deployment**: Ready to deploy with persistent disk volume mount support (`render.yaml`).

## Deployment on Render
1. Push code to GitHub repository (`https://github.com/wwwvasanth507-create/wavelength.git`).
2. Create a new **Web Service** on [Render.com](https://render.com) using `render.yaml`.
3. Add a **Disk Mount** to `/var/data` on Render for 24/7 database & media persistence.
