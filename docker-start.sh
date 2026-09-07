#!/bin/bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "========================================================"
echo "  SARANI WELLNESS & CCTV - DOCKER STARTUP (UBUNTU/LINUX)"
echo "========================================================"
echo ""

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH."
    echo "Please install Docker and Docker Compose first:"
    echo "  sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2"
    exit 1
fi

# Ensure .env file exists
if [ ! -f .env ]; then
    echo "[INFO] .env not found. Creating from .env.example..."
    cp .env.example .env
fi

# Ensure storage directories exist
mkdir -p content-api/data content-api/uploads

# Auto-detect local IP address on LAN (e.g., 192.168.31.184 or 192.168.31.211)
LAN_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
if [ -n "$LAN_IP" ]; then
    echo "[INFO] Detected Host LAN IP: $LAN_IP"
    export WEBRTC_ADDITIONAL_HOSTS="$LAN_IP"
    # Keep .env in sync with the current machine IP
    if grep -q "^WEBRTC_ADDITIONAL_HOSTS=" .env 2>/dev/null; then
        sed -i "s/^WEBRTC_ADDITIONAL_HOSTS=.*/WEBRTC_ADDITIONAL_HOSTS=$LAN_IP/" .env
    else
        echo "WEBRTC_ADDITIONAL_HOSTS=$LAN_IP" >> .env
    fi
else
    LAN_IP="localhost"
fi

echo "Building and launching containers..."
docker compose up --build -d

echo ""
echo "========================================================"
echo "  SARANI SERVICES RUNNING SUCCESSFULLY!"
echo "========================================================"
echo ""
echo "✦ On this machine (Local):"
echo "  - Website:         http://localhost (or :5173)"
echo "  - Admin Panel:     http://localhost/admin"
echo "  - Live CCTV Feed:  http://localhost/live"
echo "  - Content API:     http://localhost:3001"
echo "  - MediaMTX WebRTC: http://localhost:8889"
echo ""
echo "✦ On any Phone / Laptop in Wi-Fi (LAN IP: $LAN_IP):"
echo "  - Website:         http://${LAN_IP}"
echo "  - Admin Panel:     http://${LAN_IP}/admin"
echo "  - Live CCTV Feed:  http://${LAN_IP}/live"
echo ""
echo "Commands:"
echo "  - Stream live logs: docker compose logs -f"
echo "  - Stop all:         docker compose down"
echo ""

