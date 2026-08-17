import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const cloudflaredExe = isWindows ? path.join(ROOT_DIR, 'cloudflared.exe') : 'cloudflared';

if (!fs.existsSync(cloudflaredExe) && isWindows) {
  console.error(`\x1b[31m✦ cloudflared.exe not found at ${cloudflaredExe}\x1b[0m`);
  process.exit(1);
}

const args = process.argv.slice(2);
const isQuick = args.includes('--quick') || args.length === 0;
const isLogin = args.includes('--login');
const isCreate = args.includes('--create');

console.log('\x1b[36m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[36m║     SARANI REHABILITATION - CLOUDFLARE TUNNEL MANAGER        ║\x1b[0m');
console.log('\x1b[36m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');

if (isLogin) {
  console.log('✦ Opening browser for Cloudflare account login...');
  const proc = spawn(cloudflaredExe, ['tunnel', 'login'], { cwd: ROOT_DIR, stdio: 'inherit' });
  proc.on('exit', code => process.exit(code || 0));
} else if (isCreate) {
  const tunnelName = args[args.indexOf('--create') + 1] || 'sarani-website';
  console.log(`✦ Creating Cloudflare Tunnel: ${tunnelName}...`);
  const proc = spawn(cloudflaredExe, ['tunnel', 'create', tunnelName], { cwd: ROOT_DIR, stdio: 'inherit' });
  proc.on('exit', code => process.exit(code || 0));
} else if (isQuick) {
  console.log('\x1b[32m✦ Starting Quick Tunnel (Public HTTPS URL for testing anywhere)...\x1b[0m\n');
  console.log('Local target: http://localhost:5173');
  console.log('Tunneling will connect your local server to Cloudflare global network...\n');

  const proc = spawn(cloudflaredExe, ['tunnel', '--url', 'http://localhost:5173'], {
    cwd: ROOT_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  proc.stdout.on('data', data => {
    const text = data.toString();
    console.log(text.trim());
  });

  proc.stderr.on('data', data => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match) {
      console.log('\n\x1b[32m╔════════════════════════════════════════════════════════════════════════╗\x1b[0m');
      console.log(`\x1b[32m║  ✦ PUBLIC LIVE URL: \x1b[1m\x1b[33m${match[0]}\x1b[0m\x1b[32m  ║\x1b[0m`);
      console.log(`\x1b[32m║  ✦ CCTV LIVE FEED:  \x1b[1m\x1b[33m${match[0]}/live\x1b[0m\x1b[32m               ║\x1b[0m`);
      console.log('\x1b[32m╚════════════════════════════════════════════════════════════════════════╝\x1b[0m\n');
    } else {
      // print progress
      if (text.includes('INF') || text.includes('ERR')) {
        const lines = text.trim().split('\n');
        lines.forEach(l => {
          if (!l.includes('precheck')) console.log(`\x1b[90m${l.trim()}\x1b[0m`);
        });
      }
    }
  });

  process.on('SIGINT', () => {
    console.log('\nStopping Cloudflare Tunnel...');
    proc.kill('SIGINT');
    process.exit(0);
  });
} else {
  // Named tunnel run
  const configPath = path.join(ROOT_DIR, 'cloudflared.config.yml');
  const tunnelName = args[0] || 'sarani-website';
  console.log(`✦ Starting Named Tunnel: ${tunnelName}...`);
  const cmdArgs = fs.existsSync(configPath)
    ? ['tunnel', '--config', configPath, 'run', tunnelName]
    : ['tunnel', 'run', tunnelName];

  const proc = spawn(cloudflaredExe, cmdArgs, { cwd: ROOT_DIR, stdio: 'inherit' });
  proc.on('exit', code => process.exit(code || 0));
}
