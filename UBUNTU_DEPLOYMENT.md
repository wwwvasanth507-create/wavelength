# 🐧 Ubuntu 24.04 LTS Production Deployment Guide

This guide provides complete instructions to deploy and host **Wavelength Music Streaming & Admin Platform** on **Ubuntu 24.04 LTS (Noble Numbat)** under the standard path **`/opt/wave`**.

---

## 📐 Architecture & Deployment Specifications

| Component | Specification | Deployment Path |
| :--- | :--- | :--- |
| **Operating System** | Ubuntu 24.04 LTS (Noble Numbat) | `/` |
| **App Directory** | Standard Linux Application Directory | `/opt/wave` |
| **Frontend** | React 19 + Vite 7 SPA (Built Static Assets) | `/opt/wave/dist` |
| **Backend** | Python 3.12 + FastAPI + Uvicorn | `/opt/wave/server` |
| **Python Virtualenv** | Python 3 Virtual Environment (PEP 668 compliant) | `/opt/wave/venv` |
| **Database** | SQLite Auto-Seeded DB | `/opt/wave/wavelength.db` |
| **Uploads Storage** | Audio & Cover Art Media Files | `/opt/wave/uploads/` |
| **Process Manager** | Systemd Service Daemon | `/etc/systemd/system/wavelength.service` |
| **Reverse Proxy** | Nginx HTTP Server (Port 80/443 -> Port 5000) | `/etc/nginx/sites-available/wavelength` |

---

## ⚡ Option 1: Automated 1-Command Deployment

Run the included automated deployment script as `root` or with `sudo` on your Ubuntu 24.04 server:

```bash
sudo bash deploy-ubuntu.sh
```

### What this script does automatically:
1. Installs system packages: `python3`, `python3-pip`, `python3-venv`, `nodejs`, `npm`, `nginx`, `git`.
2. Copies application files to `/opt/wave`.
3. Creates a Python virtual environment at `/opt/wave/venv`.
4. Installs Python packages from `requirements.txt`.
5. Compiles React 19 frontend assets into `/opt/wave/dist`.
6. Registers and enables systemd service `wavelength.service` on port 5000.
7. Configures and enables Nginx reverse proxy on port 80.
8. Configures permissions (`chown -R www-data:www-data /opt/wave`).

---

## 🛠️ Option 2: Manual Step-by-Step Installation

If you prefer to configure your server manually step-by-step:

### 1. Update System & Install Core Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential python3 python3-pip python3-venv nginx

# Install Node.js 20 LTS (Recommended for Vite 7 / React 19)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Create Directory & Clone Project to `/opt/wave`
```bash
sudo mkdir -p /opt/wave
sudo chown -R $USER:$USER /opt/wave
cd /opt/wave

# Clone your repository into /opt/wave
git clone https://github.com/wwwvasanth507-create/wavelength.git .
```

### 3. Setup Python Virtual Environment (PEP 668 Compliance)
Ubuntu 24.04 enforces PEP 668 (externally managed environment). A virtual environment is required:
```bash
cd /opt/wave
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt
```

### 4. Build Frontend SPA
```bash
cd /opt/wave
npm install
npm run build
```

### 5. Create Systemd Service (`/etc/systemd/system/wavelength.service`)
Create the systemd configuration file:
```bash
sudo nano /etc/systemd/system/wavelength.service
```

Paste the following configuration:
```ini
[Unit]
Description=Wavelength Music Streaming FastAPI Service
After=network.target network-online.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/wave
ExecStart=/opt/wave/venv/bin/uvicorn server.main:app --host 0.0.0.0 --port 5000 --workers 2
Restart=always
RestartSec=5s
Environment="PORT=5000"
Environment="JWT_SECRET=wavelength_ubuntu_24_04_secure_key"
Environment="DATABASE_PATH=/opt/wave/wavelength.db"
Environment="UPLOADS_PATH=/opt/wave/uploads"

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable wavelength
sudo systemctl start wavelength
sudo systemctl status wavelength
```

### 6. Configure Nginx Reverse Proxy
Create the Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/wavelength
```

Paste the following:
```nginx
server {
    listen 80;
    server_name _; # Or your domain (e.g. music.yourdomain.com)

    client_max_body_size 100M;

    location /uploads/ {
        alias /opt/wave/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and restart Nginx:
```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/wavelength /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Set Permissions
```bash
sudo chown -R www-data:www-data /opt/wave
sudo chmod -R 755 /opt/wave
```

---

## 🔒 Optional: Free HTTPS SSL Setup with Certbot

To secure your server with free Let's Encrypt SSL on Ubuntu 24.04:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🔄 Updating Application Code on Ubuntu (`/opt/wave`)

To update your live deployment with the latest code from GitHub:

```bash
cd /opt/wave
git pull origin main
sudo bash deploy-ubuntu.sh
```

---

## 📊 Management & Maintenance Commands

| Action | Command |
| :--- | :--- |
| **Pull Latest Code** | `cd /opt/wave && git pull` |
| **Check Service Status** | `sudo systemctl status wavelength` |
| **Restart Application** | `sudo systemctl restart wavelength` |
| **Stop Application** | `sudo systemctl stop wavelength` |
| **View Real-Time Logs** | `sudo journalctl -u wavelength -f` |
| **Reload Nginx Config** | `sudo systemctl reload nginx` |
| **Check Database File** | `ls -lh /opt/wave/wavelength.db` |
| **Check Audio Uploads** | `ls -lh /opt/wave/uploads/audio` |

---

## 🔑 Default Credentials

- **Admin Account**: Username: `admin` | Password: `admin123`
- Auto-seeded on initial server launch.
