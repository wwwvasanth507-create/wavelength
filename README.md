# Wavelength — Premium Web Music Streaming & Admin Upload Platform

Wavelength is a high-performance, modern music streaming web application built with **React 19**, **TypeScript**, **Vite 7**, **Tailwind CSS v4**, and a **Python (FastAPI + SQLite)** backend.

---

## 🚀 Features
- 🎵 **Music Player**: Gapless loop playback, volume controls, queue management, lyrics display, audio visualizer, quality selector.
- 👑 **Admin Portal**: Manual audio & thumbnail file upload (MP3/WAV/PNG/JPG) or direct stream URL upload.
- 🔐 **Authentication**: User registration, User login, Admin privileges (`admin` / `admin123`).
- 💾 **Auto-Seeding Database**: Automatically seeds default song catalog & admin user on launch.
- 🐧 **Full Ubuntu 24.04 LTS Support**: Native Linux server deployment guide & 1-command setup script targeting `/opt/wave`.
- ☁️ **Free Cloud Deployment**: Configured via `render.yaml` for Render Free Instance.

---

## 🐧 Production Deployment on Ubuntu 24.04 LTS (`/opt/wave`)

Wavelength is fully configured to run natively on **Ubuntu 24.04 LTS (Noble Numbat)** in the directory **`/opt/wave`**.

### ⚡ 1-Command Automated Setup on Ubuntu Server
Run the automated deployment script on your Ubuntu 24.04 server as `root` or using `sudo`:

```bash
sudo bash deploy-ubuntu.sh
```

This single command will:
1. Install system packages (`python3`, `python3-venv`, `nodejs 20`, `npm`, `nginx`).
2. Copy files to `/opt/wave` and set up `/opt/wave/uploads` and `/opt/wave/venv`.
3. Build the React SPA frontend into `/opt/wave/dist`.
4. Setup and enable `wavelength.service` under Systemd (`systemctl status wavelength`).
5. Configure Nginx reverse proxy on port 80.

### 🔄 Updating Server Code (`git pull`)
To pull the latest code and re-deploy on Ubuntu 24.04:
```bash
cd /opt/wave && git pull && sudo bash deploy-ubuntu.sh
```

### 📚 Full Ubuntu Documentation
For detailed manual setup instructions, Nginx tuning, and SSL HTTPS setup with Let's Encrypt, see:
👉 **[UBUNTU_DEPLOYMENT.md](file:///c:/un/UBUNTU_DEPLOYMENT.md)**

---

## 📁 Ubuntu Server Config Files Included

- **[deploy-ubuntu.sh](file:///c:/un/deploy-ubuntu.sh)**: Automated setup script for Ubuntu 24.04.
- **[wavelength.service](file:///c:/un/wavelength.service)**: Systemd service unit file for background process management at `/opt/wave`.
- **[nginx.conf](file:///c:/un/nginx.conf)**: Nginx reverse proxy site configuration.
- **[build.sh](file:///c:/un/build.sh)**: Unified build script with Python `venv` support for Ubuntu 24.04 PEP 668 compliance.

---

## 🛠️ Local Development Quick Start

### 1. Install Dependencies & Build Frontend
```bash
npm install
npm run build
```

### 2. Start Python Backend & Serve Frontend SPA
```bash
# Optional: Setup Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Linux/macOS
# or: venv\Scripts\activate # On Windows

pip install -r requirements.txt
python server/main.py
```
Open **`http://localhost:6000`** in your web browser.

---

## ☁️ Deployment on Render ($0/mo Free Tier)

1. Push your code to your GitHub repository.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
3. Connect your GitHub repository. Render will automatically detect `render.yaml` and set up the Free Web Service.
4. Click **Apply**! Your app will be live on a free `https://...onrender.com` URL in 2-3 minutes.

---

## 🔑 Default Admin Account

- **Username**: `admin`
- **Password**: `admin123`
