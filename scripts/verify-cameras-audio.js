import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const camerasPath = path.join(ROOT_DIR, 'cameras.json');
if (!fs.existsSync(camerasPath)) {
  console.error('cameras.json not found at:', camerasPath);
  process.exit(1);
}

const cameras = JSON.parse(fs.readFileSync(camerasPath, 'utf8'));

console.log('\x1b[36m╔════════════════════════════════════════════════════════════════════════════╗\x1b[0m');
console.log('\x1b[36m║   SARANI DDAC - CCTV CAMERA AUDIO & PRIVACY COMPLIANCE AUDIT TOOL          ║\x1b[0m');
console.log('\x1b[36m╚════════════════════════════════════════════════════════════════════════════╝\x1b[0m\n');
console.log('Probing 7 camera feeds via ffprobe for audio tracks...\n');

let totalCameras = cameras.length;
let audioActiveCount = 0;
let videoOnlyCount = 0;
let offlineCount = 0;

for (const cam of cameras) {
  process.stdout.write(`• Checking ${cam.name.padEnd(12)} (${cam.source.split('@')[1] || cam.source})... `);

  try {
    const cmd = `ffprobe -v error -show_entries stream=index,codec_type,codec_name -of json -rtsp_transport tcp -i "${cam.source}"`;
    const stdout = execSync(cmd, { timeout: 8000, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const probe = JSON.parse(stdout);

    const streams = probe.streams || [];
    const videoStream = streams.find(s => s.codec_type === 'video');
    const audioStream = streams.find(s => s.codec_type === 'audio');

    if (audioStream) {
      audioActiveCount++;
      console.log(`\x1b[31m[AUDIO DETECTED]\x1b[0m Codec: ${audioStream.codec_name} | Video: ${videoStream?.codec_name || 'N/A'}`);
    } else if (videoStream) {
      videoOnlyCount++;
      console.log(`\x1b[32m[PASS: VIDEO ONLY]\x1b[0m Video: ${videoStream.codec_name} | \x1b[32mCompliant (No Audio)\x1b[0m`);
    } else {
      console.log(`\x1b[33m[NO STREAMS DETECTED]\x1b[0m`);
    }
  } catch (err) {
    offlineCount++;
    console.log(`\x1b[33m[OFFLINE / TIMEOUT]\x1b[0m`);
  }
}

console.log('\n\x1b[36m┌────────────────────────────────────────────────────────────┐\x1b[0m');
console.log(`│ Total Cameras:     ${totalCameras.toString().padEnd(40)}│`);
console.log(`│ Compliant (Silent): \x1b[32m${videoOnlyCount.toString().padEnd(39)}\x1b[0m\x1b[36m│\x1b[0m`);
console.log(`│ Audio Detected:    \x1b[31m${audioActiveCount.toString().padEnd(39)}\x1b[0m\x1b[36m│\x1b[0m`);
if (offlineCount > 0) {
  console.log(`│ Offline / Timeout: \x1b[33m${offlineCount.toString().padEnd(39)}\x1b[0m\x1b[36m│\x1b[0m`);
}
console.log('\x1b[36m└────────────────────────────────────────────────────────────┘\x1b[0m\n');

if (audioActiveCount > 0) {
  console.log('\x1b[33m⚠️  Action Required to complete Ministry Compliance:\x1b[0m');
  console.log('Open Dahua ConfigTool ("C:\\Program Files (x86)\\ConfigTool\\ConfigTool\\ConfigTool.exe")');
  console.log('Navigate to Device Config -> Video/Encode -> Audio -> Uncheck "Audio Enable" on Main & Sub streams.\n');
} else {
  console.log('\x1b[32m✔ All active cameras are 100% video-only and compliant with Ministry privacy guidelines!\x1b[0m\n');
}
