#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "=== 1/2 Building React Frontend SPA ==="
npm install
npx vite build

echo "=== 2/2 Installing Python Backend Dependencies ==="
pip install -r requirements.txt

echo "=== Build Completed Successfully ==="
