import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const mediamtxExe = isWindows ? path.join(ROOT_DIR, 'mediamtx.exe') : path.join(ROOT_DIR, 'mediamtx');

const children = [];

function log(tag, msg, colorCode = '36') {
  console.log(`\x1b[${colorCode}m[${tag}]\x1b[0m ${msg}`);
}

function cleanup() {
  console.log('\n\x1b[33m✦ Shutting down all Sarani Rehab services...\x1b[0m');
  for (const child of children) {
    if (child && !child.killed) {
      try {
        if (isWindows && child.pid) {
          execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
        } else {
          child.kill('SIGINT');
        }
      } catch {
        // ignore shutdown error
      }
    }
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

console.log('\x1b[32m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[32m║   SARANI REHABILITATION & WELLNESS - ALL-IN-ONE LAUNCHER     ║\x1b[0m');
console.log('\x1b[32m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');

// 1. Launch MediaMTX in background
if (fs.existsSync(mediamtxExe)) {
  log('MediaMTX', 'Starting MediaMTX CCTV Relay in background on ports 8554 (RTSP), 8889 (WebRTC), 8888 (HLS)...', '35');
  const mtx = spawn(mediamtxExe, ['mediamtx.yml'], {
    cwd: ROOT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });

  mtx.stdout.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim()) log('MediaMTX', l.trim(), '35');
    });
  });

  mtx.stderr.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim()) log('MediaMTX:err', l.trim(), '31');
    });
  });

  mtx.on('error', err => log('MediaMTX:err', `Error running MediaMTX: ${err.message}`, '31'));
  children.push(mtx);
} else {
  log('MediaMTX:warn', `mediamtx binary not found at ${mediamtxExe}. Live streams will use fallback mode.`, '33');
}

// 2. Launch Content API
const contentApiDir = path.join(ROOT_DIR, 'content-api');
if (fs.existsSync(contentApiDir)) {
  log('Content API', 'Starting Sarani Content API on port 3001...', '34');
  const api = spawn(isWindows ? 'node.exe' : 'node', ['server.js'], {
    cwd: contentApiDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });

  api.stdout.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim()) log('Content API', l.trim(), '34');
    });
  });

  api.stderr.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim()) log('Content API:err', l.trim(), '31');
    });
  });

  api.on('error', err => log('Content API:err', `Error running Content API: ${err.message}`, '31'));
  children.push(api);
}

// 3. Launch Frontend (Vite)
const frontendDir = path.join(ROOT_DIR, 'frontend');
if (fs.existsSync(frontendDir)) {
  log('Frontend', 'Starting React Frontend (Vite) on port 5173...', '32');
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';
  const fe = spawn(npmCmd, ['run', 'dev'], {
    cwd: frontendDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });

  fe.stdout.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim()) log('Frontend', l.trim(), '32');
    });
  });

  fe.stderr.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim()) log('Frontend:err', l.trim(), '31');
    });
  });

  fe.on('error', err => log('Frontend:err', `Error running Frontend: ${err.message}`, '31'));
  children.push(fe);
}

// Summary Box
setTimeout(() => {
  console.log('\n\x1b[36m┌──────────────────────────────────────────────────────────────┐\x1b[0m');
  console.log('\x1b[36m│ ✦ Website:       \x1b[1mhttp://localhost:5173\x1b[0m\x1b[36m                       │\x1b[0m');
  console.log('\x1b[36m│ ✦ Live Feed:     \x1b[1mhttp://localhost:5173/live\x1b[0m\x1b[36m                  │\x1b[0m');
  console.log('\x1b[36m│ ✦ Admin Panel:   \x1b[1mhttp://localhost:5173/admin\x1b[0m\x1b[36m                 │\x1b[0m');
  console.log('\x1b[36m│ ✦ Content API:   \x1b[1mhttp://localhost:3001\x1b[0m\x1b[36m                       │\x1b[0m');
  console.log('\x1b[36m│ ✦ MediaMTX WebRTC:\x1b[1mhttp://localhost:8889\x1b[0m\x1b[36m                       │\x1b[0m');
  console.log('\x1b[36m│ ✦ MediaMTX RTSP: \x1b[1mrtsp://localhost:8554\x1b[0m\x1b[36m                       │\x1b[0m');
  console.log('\x1b[36m└──────────────────────────────────────────────────────────────┘\x1b[0m\n');
}, 1500);
