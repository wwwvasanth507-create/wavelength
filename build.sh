#!/usr/bin/env bash
# ==============================================================================
# Wavelength Music Streaming Platform - Build Script
# Target Installation Directory: /opt/wave (Ubuntu 24.04 LTS Noble Numbat)
# ==============================================================================
set -o errexit

APP_DIR="${APP_DIR:-/opt/wave}"

echo "=== 1/2 Building React Frontend SPA in ${APP_DIR} ==="
npm install
npx vite build

echo "=== 2/2 Installing Python Backend Dependencies ==="
# Check for Python virtual environment (Required for Ubuntu 24.04 PEP 668 compliance)
if [ -d "${APP_DIR}/venv" ]; then
  echo "🐍 Installing dependencies into Python venv at ${APP_DIR}/venv..."
  "${APP_DIR}/venv/bin/pip" install -r requirements.txt
elif [ -d "venv" ]; then
  echo "🐍 Installing dependencies into local venv..."
  ./venv/bin/pip install -r requirements.txt
else
  pip install -r requirements.txt
fi

echo "=== Build Completed Successfully for /opt/wave ==="

