import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const mediamtxExe = isWindows ? path.join(ROOT_DIR, 'mediamtx.exe') : path.join(ROOT_DIR, 'mediamtx');
const cloudflaredExe = isWindows ? path.join(ROOT_DIR, 'cloudflared.exe') : 'cloudflared';

// Helper to read .env
function getEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

const env = getEnv();
const children = [];

function log(tag, msg, colorCode = '36') {
  console.log(`\x1b[${colorCode}m[${tag}]\x1b[0m ${msg}`);
}

function cleanup() {
  console.log('\n\x1b[33m✦ Shutting down all Sarani Rehab services & Tunnel...\x1b[0m');
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
console.log('\x1b[32m║   SARANI.UK - ALL-IN-ONE SYSTEM & TUNNEL CONTROLLER          ║\x1b[0m');
console.log('\x1b[32m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');

// 1. Launch MediaMTX in background
if (fs.existsSync(mediamtxExe)) {
  log('MediaMTX', 'Starting CCTV Relay (RTSP 8554, WebRTC 8889, HLS 8888)...', '35');
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
  log('MediaMTX:warn', `mediamtx binary not found at ${mediamtxExe}.`, '33');
}

// 2. Launch Content API
const contentApiDir = path.join(ROOT_DIR, 'content-api');
if (fs.existsSync(contentApiDir)) {
  log('Content API', 'Starting Backend API on port 3001...', '34');
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

// 4. Launch Cloudflare Tunnel
const tunnelToken = env.CLOUDFLARE_TUNNEL_TOKEN;
if (tunnelToken && fs.existsSync(cloudflaredExe)) {
  log('Cloudflare', 'Starting Cloudflare Secure Tunnel for sarani.uk...', '36');
  const tunnel = spawn(cloudflaredExe, ['tunnel', '--no-autoupdate', '--protocol', 'http2', 'run', '--token', tunnelToken], {
    cwd: ROOT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });

  tunnel.stdout.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim()) log('Cloudflare', l.trim(), '36');
    });
  });

  tunnel.stderr.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l.trim() && (l.includes('INF') || l.includes('WRN') || l.includes('ERR'))) {
        log('Cloudflare', l.trim(), '36');
      }
    });
  });

  tunnel.on('error', err => log('Cloudflare:err', `Tunnel error: ${err.message}`, '31'));
  children.push(tunnel);
}

// Summary Box
setTimeout(() => {
  console.log('\n\x1b[32m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[32m║               ✦ ALL SERVICES ARE ONLINE ✦                    ║\x1b[0m');
  console.log('\x1b[32m╚══════════════════════════════════════════════════════════════╝\x1b[0m');
  console.log('\x1b[36m┌──────────────────────────────────────────────────────────────┐\x1b[0m');
  if (tunnelToken) {
    console.log('\x1b[36m│ 🌐 \x1b[1m\x1b[33mGLOBAL PUBLIC (Worldwide HTTPS):\x1b[0m\x1b[36m                          │\x1b[0m');
    console.log('\x1b[36m│    ✦ Main Website:  \x1b[1mhttps://sarani.uk\x1b[0m\x1b[36m                        │\x1b[0m');
    console.log('\x1b[36m│    ✦ Alternative:   \x1b[1mhttps://www.sarani.uk\x1b[0m\x1b[36m                    │\x1b[0m');
    console.log('\x1b[36m│    ✦ Live CCTV:     \x1b[1mhttps://sarani.uk/live\x1b[0m\x1b[36m                   │\x1b[0m');
    console.log('\x1b[36m│    ✦ Admin Panel:   \x1b[1mhttps://sarani.uk/admin\x1b[0m\x1b[36m                  │\x1b[0m');
    console.log('\x1b[36m├──────────────────────────────────────────────────────────────┤\x1b[0m');
  }
  console.log('\x1b[36m│ 💻 \x1b[1mLOCAL ACCESS:\x1b[0m\x1b[36m                                             │\x1b[0m');
  console.log('\x1b[36m│    ✦ Local Website: \x1b[1mhttp://localhost:5173\x1b[0m\x1b[36m                    │\x1b[0m');
  console.log('\x1b[36m│    ✦ Content API:   \x1b[1mhttp://localhost:3001\x1b[0m\x1b[36m                    │\x1b[0m');
  console.log('\x1b[36m│    ✦ MediaMTX RTSP: \x1b[1mrtsp://localhost:8554\x1b[0m\x1b[36m                    │\x1b[0m');
  console.log('\x1b[36m└──────────────────────────────────────────────────────────────┘\x1b[0m\n');
  console.log('\x1b[90mPress Ctrl+C anytime to stop all services.\x1b[0m\n');
}, 2000);
