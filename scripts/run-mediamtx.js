import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';
const mediamtxExe = isWindows ? path.join(ROOT_DIR, 'mediamtx.exe') : path.join(ROOT_DIR, 'mediamtx');

if (!fs.existsSync(mediamtxExe)) {
  console.error(`MediaMTX binary not found at ${mediamtxExe}`);
  process.exit(1);
}

console.log('✦ Starting MediaMTX Standalone...');
const mtx = spawn(mediamtxExe, ['mediamtx.yml'], {
  cwd: ROOT_DIR,
  stdio: 'inherit',
});

mtx.on('exit', (code) => {
  console.log(`MediaMTX exited with code ${code}`);
  process.exit(code || 0);
});
