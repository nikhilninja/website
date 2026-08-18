n@echo off
title Cloudflare Tunnel - Sarani Website & CCTV
echo ===================================================
echo   Starting Cloudflare Public Tunnel for Sarani
echo ===================================================
cd /d "%~dp0"
node scripts\tunnel.js --quick
pause
