@echo off
title SARANI.UK - All-in-One Website and CCTV Launcher
color 0A

echo ====================================================================
echo             SARANI.UK - STARTING ALL SERVICES AND TUNNEL
echo ====================================================================
echo.

cd /d "%~dp0"

:: 1. Clean up any previous lingering instances and stop Docker if running
docker compose down >nul 2>&1
taskkill /f /im mediamtx.exe >nul 2>&1
taskkill /f /im cloudflared.exe >nul 2>&1

:: 2. Launch browser to https://sarani.uk after 4 seconds in background
start /b cmd /c "timeout /t 4 /nobreak >nul & start https://sarani.uk"

:: 3. Start all services and Cloudflare Tunnel
node scripts\start.js

pause
