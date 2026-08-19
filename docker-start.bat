@echo off
echo ========================================================
echo   SARANI WELLNESS & CCTV - DOCKER STARTUP
echo ========================================================
echo.
echo Checking Docker...
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not installed or not running.
    echo Please install Docker Desktop and start it first:
    echo https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Building and starting containers in background...
docker compose up --build -d

echo.
echo ========================================================
echo   CONTAINERS STARTED SUCCESSFULLY!
echo ========================================================
echo.
echo Website (LAN/Local): http://localhost or http://localhost:5173
echo Content API:        http://localhost:3001
echo MediaMTX WebRTC:    http://localhost:8889
echo.
echo To view real-time logs, run:
echo   docker compose logs -f
echo.
pause
