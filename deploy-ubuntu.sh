#!/usr/bin/env bash
# ==============================================================================
# Wavelength Music Streaming & Admin Platform
# Automated Production Setup & Deployment Script for Ubuntu 24.04 LTS
# Target Installation Directory: /opt/wave
# ==============================================================================

set -e # Exit immediately if a command exits with a non-zero status

APP_DIR="/opt/wave"
REPO_URL="https://github.com/wwwvasanth507-create/wavelength.git"
SERVICE_NAME="wavelength"
PORT=7000

echo "======================================================================"
echo "  🚀 Starting Wavelength Deployment on Ubuntu 24.04 LTS"
echo "  Target Path: ${APP_DIR}"
echo "  Repository: ${REPO_URL}"
echo "======================================================================"

# 1. Check Root Privileges
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Please run this deployment script with sudo or as root."
  echo "   Usage: sudo bash deploy-ubuntu.sh"
  exit 1
fi

# 2. Update System Packages & Install Core Dependencies
echo "📦 [1/6] Updating APT repositories & installing system dependencies..."
apt-get update -y
apt-get install -y \
  curl \
  git \
  build-essential \
  python3 \
  python3-pip \
  python3-venv \
  nginx

# Install Node.js (v20 LTS recommended for Vite 7 / React 19) if not present or < 18
if ! command -v node >/dev/null 2>&1; then
  echo "📥 Installing Node.js 20.x LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "✅ Node.js $(node -v) is already installed."
fi

# 3. Create /opt/wave Directory Structure
echo "📂 [2/6] Setting up application directory at ${APP_DIR}..."
mkdir -p "${APP_DIR}"
mkdir -p "${APP_DIR}/uploads/audio"
mkdir -p "${APP_DIR}/uploads/covers"

# If script is executed inside repository source dir, copy files into /opt/wave
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ "${SCRIPT_DIR}" != "${APP_DIR}" ]; then
  echo "📋 Copying source code from ${SCRIPT_DIR} to ${APP_DIR}..."
  rsync -av --exclude='node_modules' --exclude='venv' --exclude='dist' --exclude='.git' "${SCRIPT_DIR}/" "${APP_DIR}/"
fi

cd "${APP_DIR}"

if [ ! -d ".git" ]; then
  echo "📥 Initializing git repository from ${REPO_URL}..."
  git clone "${REPO_URL}" . || echo "⚠️ Warning: git clone failed, continuing with copied files."
else
  echo "🔄 Pulling latest code changes from ${REPO_URL}..."
  git pull origin main || git pull || echo "⚠️ Warning: git pull failed, proceeding with existing files."
fi


echo "🐍 [3/6] Configuring Python 3 Virtual Environment at ${APP_DIR}/venv..."
if [ ! -d "${APP_DIR}/venv" ]; then
  python3 -m venv "${APP_DIR}/venv"
fi

# Upgrade pip & install Python dependencies inside venv
"${APP_DIR}/venv/bin/pip" install --upgrade pip
"${APP_DIR}/venv/bin/pip" install -r "${APP_DIR}/requirements.txt"

# 5. Build React 19 + Vite Frontend SPA
echo "⚡ [4/6] Building React Frontend SPA in ${APP_DIR}..."
npm install
npm run build

# 6. Install & Configure Systemd Service
echo "⚙️ [5/6] Setting up systemd service (${SERVICE_NAME}.service)..."
cat << 'EOF' > /etc/systemd/system/wavelength.service
[Unit]
Description=Wavelength Music Streaming & Admin Platform FastAPI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/wave
ExecStart=/opt/wave/venv/bin/uvicorn server.main:app --host 0.0.0.0 --port 7000 --workers 2
Restart=always
RestartSec=3
Environment=PORT=7000
Environment=JWT_SECRET=wavelength_ubuntu_24_04_secure_key_change_me
Environment=DATABASE_PATH=/opt/wave/wavelength.db
Environment=UPLOADS_PATH=/opt/wave/uploads

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable wavelength
systemctl restart wavelength

# 7. Configure Nginx Reverse Proxy
echo "🌐 [6/6] Configuring Nginx reverse proxy..."
cat << 'EOF' > /etc/nginx/sites-available/wavelength
server {
    listen 80;
    server_name _;

    client_max_body_size 100M;

    # Backend API & Uploads reverse proxy to Uvicorn port 7000
    location / {
        proxy_pass http://127.0.0.1:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable Nginx site configuration
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm -f /etc/nginx/sites-enabled/default
fi
ln -sf /etc/nginx/sites-available/wavelength /etc/nginx/sites-enabled/wavelength

nginx -t
systemctl restart nginx

# 8. Set File Ownership & Permissions
chown -R www-data:www-data "${APP_DIR}"
chmod -R 755 "${APP_DIR}"

echo "======================================================================"
echo "  🎉 Wavelength deployment completed successfully on Ubuntu 24.04 LTS!"
echo "  📍 Installation Directory: /opt/wave"
echo "  ⚙️ Systemd Service: systemctl status wavelength"
echo "  🌐 Access application at: http://$(curl -s checkip.amazonaws.com || echo 'YOUR_SERVER_IP')"
echo "======================================================================"
