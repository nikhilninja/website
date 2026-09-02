import { spawn, execSync } from 'child_process';
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
const args = process.argv.slice(2);

const isLogin = args.includes('--login');
const isCreate = args.includes('--create');
const isRoute = args.includes('--route');
const isQuick = args.includes('--quick');
const tokenArgIdx = args.indexOf('--token');
const tokenFromArg = tokenArgIdx !== -1 ? args[tokenArgIdx + 1] : null;
const token = tokenFromArg || env.CLOUDFLARE_TUNNEL_TOKEN;

console.log('\x1b[36m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[36m║     SARANI.UK - CLOUDFLARE TUNNEL & REMOTE ACCESS MANAGER    ║\x1b[0m');
console.log('\x1b[36m╚══════════════════════════════════════════════════════════════╝\x1b[0m\n');

if (isLogin) {
  console.log('\x1b[33m✦ Step 1: Opening your browser to authorize sarani.uk on Cloudflare...\x1b[0m');
  console.log('Select your domain "sarani.uk" in the browser window.\n');
  const proc = spawn(cloudflaredExe, ['tunnel', 'login'], { cwd: ROOT_DIR, stdio: 'inherit' });
  proc.on('exit', code => process.exit(code || 0));

} else if (isCreate) {
  const tunnelName = args[args.indexOf('--create') + 1] || 'sarani-tunnel';
  console.log(`\x1b[33m✦ Step 2: Creating Named Cloudflare Tunnel: "${tunnelName}"...\x1b[0m\n`);
  const proc = spawn(cloudflaredExe, ['tunnel', 'create', tunnelName], { cwd: ROOT_DIR, stdio: 'inherit' });
  proc.on('exit', code => {
    if (code === 0) {
      console.log('\n\x1b[32m✔ Tunnel created successfully!\x1b[0m');
      console.log('Next steps:');
      console.log(' 1. Copy the Tunnel UUID shown above and paste it into cloudflared.config.yml');
      console.log(' 2. Run: npm run tunnel:route to bind DNS records for sarani.uk');
      console.log(' 3. Run: npm run tunnel to start the tunnel\n');
    }
    process.exit(code || 0);
  });

} else if (isRoute) {
  const tunnelName = args[args.indexOf('--route') + 1] || 'sarani-tunnel';
  const hostnames = ['sarani.uk', 'www.sarani.uk', 'api.sarani.uk', 'cctv.sarani.uk', 'hls.sarani.uk'];
  console.log(`\x1b[33m✦ Routing DNS records for tunnel "${tunnelName}" to sarani.uk hostnames...\x1b[0m\n`);
  for (const host of hostnames) {
    try {
      console.log(`  Routing ${host} -> ${tunnelName}...`);
      execSync(`"${cloudflaredExe}" tunnel route dns ${tunnelName} ${host}`, { cwd: ROOT_DIR, stdio: 'inherit' });
    } catch (e) {
      console.log(`  \x1b[90mNote: ${host} route might already exist or need dashboard check.\x1b[0m`);
    }
  }
  console.log('\n\x1b[32m✔ DNS Routing complete!\x1b[0m Run \x1b[1mnpm run tunnel\x1b[0m to start.\n');

} else if (token && !isQuick) {
  console.log('\x1b[32m✦ Starting Cloudflare Tunnel using Zero Trust Token...\x1b[0m\n');
  console.log(`Tunnel Token: ${token.substring(0, 15)}...`);
  console.log('Connecting to Cloudflare Edge Network...\n');

  const proc = spawn(cloudflaredExe, ['tunnel', '--no-autoupdate', '--protocol', 'http2', 'run', '--token', token], {
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });

  proc.on('exit', code => process.exit(code || 0));

} else if (!isQuick) {
  // Check if cloudflared.config.yml has a configured UUID
  const configPath = path.join(ROOT_DIR, 'cloudflared.config.yml');
  let hasValidConfig = false;
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    if (content.includes('tunnel:') && !content.includes('<YOUR-TUNNEL-ID>')) {
      hasValidConfig = true;
    }
  }

  if (hasValidConfig) {
    console.log('\x1b[32m✦ Starting Named Tunnel for sarani.uk from cloudflared.config.yml...\x1b[0m\n');
    const proc = spawn(cloudflaredExe, ['tunnel', '--config', configPath, 'run'], {
      cwd: ROOT_DIR,
      stdio: 'inherit'
    });
    proc.on('exit', code => process.exit(code || 0));
  } else {
    // Fall back to quick tunnel and print instructions
    console.log('\x1b[33m✦ Notice: sarani.uk named tunnel is not configured yet.\x1b[0m');
    console.log('To set up your permanent sarani.uk tunnel:');
    console.log('  Option 1 (Zero Trust Token): Paste your token into .env (CLOUDFLARE_TUNNEL_TOKEN=...)');
    console.log('  Option 2 (CLI Login): Run `npm run tunnel:login` then `npm run tunnel:create`\n');
    console.log('\x1b[32m✦ Starting Quick Temporary Tunnel for testing in the meantime...\x1b[0m\n');
    runQuickTunnel();
  }
} else {
  runQuickTunnel();
}

function runQuickTunnel() {
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
}
