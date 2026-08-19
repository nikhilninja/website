#!/bin/bash
set -e

echo "========================================================"
echo "  SARANI WELLNESS & CCTV - DOCKER STARTUP (LINUX/MAC)   "
echo "========================================================"
echo ""

if ! command -v docker &> /dev/null; then
    echo "[ERROR] Docker is not installed or not in PATH."
    echo "Please install Docker and Docker Compose first."
    exit 1
fi

echo "Building and starting containers in background..."
docker compose up --build -d

echo ""
echo "========================================================"
echo "  CONTAINERS STARTED SUCCESSFULLY!"
echo "========================================================"
echo ""
echo "Website (LAN/Local): http://localhost or http://localhost:5173"
echo "Content API:        http://localhost:3001"
echo "MediaMTX WebRTC:    http://localhost:8889"
echo ""
echo "To view live container logs, run: docker compose logs -f"
