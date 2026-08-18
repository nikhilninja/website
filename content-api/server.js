import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sarani2025';

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── File Helpers ───────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');

function sanitizeFilename(name) {
  if (typeof name !== 'string') return 'invalid';
  return name.replace(/[^a-zA-Z0-9_-]/g, '');
}

function readJSON(filename) {
  try {
    const clean = sanitizeFilename(filename);
    const filepath = path.join(DATA_DIR, `${clean}.json`);
    if (!fs.existsSync(filepath)) return null;
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${filename}.json:`, err);
    return null;
  }
}

function writeJSON(filename, data) {
  try {
    const clean = sanitizeFilename(filename);
    const filepath = path.join(DATA_DIR, `${clean}.json`);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}.json:`, err);
    return false;
  }
}

// ── Image Upload ───────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

// ── Auth ───────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'admin-session' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

// ── Page Content (single-type) ─────────────────────────────
// GET /api/content/:page  → read page content (home, about)
app.get('/api/content/:page', (req, res) => {
  const data = readJSON(req.params.page);
  if (data === null) return res.status(404).json({ error: 'Page not found' });
  res.json({ data });
});

// PUT /api/content/:page  → update page content
app.put('/api/content/:page', (req, res) => {
  const { page } = req.params;
  writeJSON(page, req.body);
  res.json({ success: true, data: req.body });
});

// ── Collections (services, testimonials, blog-posts, faqs, gallery, facilities, streams, contact-submissions) ──
// GET /api/collections/:name
app.get('/api/collections/:name', (req, res) => {
  const data = readJSON(req.params.name);
  if (data === null) return res.status(404).json({ error: 'Collection not found' });
  res.json({ data });
});

// POST /api/collections/:name  → add item
app.post('/api/collections/:name', (req, res) => {
  const collection = readJSON(req.params.name);
  if (!Array.isArray(collection)) return res.status(400).json({ error: 'Not a collection' });

  const newItem = {
    id: collection.length > 0 ? Math.max(...collection.map(i => i.id)) + 1 : 1,
    ...req.body,
  };
  collection.push(newItem);
  writeJSON(req.params.name, collection);
  res.json({ success: true, data: newItem });
});

// PUT /api/collections/:name/:id  → update item
app.put('/api/collections/:name/:id', (req, res) => {
  const collection = readJSON(req.params.name);
  if (!Array.isArray(collection)) return res.status(400).json({ error: 'Not a collection' });

  const id = parseInt(req.params.id);
  const index = collection.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });

  collection[index] = { ...collection[index], ...req.body, id };
  writeJSON(req.params.name, collection);
  res.json({ success: true, data: collection[index] });
});

// DELETE /api/collections/:name/:id  → delete item
app.delete('/api/collections/:name/:id', (req, res) => {
  const collection = readJSON(req.params.name);
  if (!Array.isArray(collection)) return res.status(400).json({ error: 'Not a collection' });

  const id = parseInt(req.params.id);
  const filtered = collection.filter(i => i.id !== id);
  if (filtered.length === collection.length) return res.status(404).json({ error: 'Item not found' });

  writeJSON(req.params.name, filtered);
  res.json({ success: true });
});

// ── Image Upload ───────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

// ── Contact Form ───────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const submissions = readJSON('contact-submissions') || [];
  const newSubmission = {
    id: submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1,
    ...req.body,
    submitted_at: new Date().toISOString(),
    read: false,
  };
  submissions.push(newSubmission);
  writeJSON('contact-submissions', submissions);
  res.json({ success: true, data: newSubmission });
});

// PUT /api/contact/:id  → update contact submission (e.g. mark as read)
app.put('/api/contact/:id', (req, res) => {
  const submissions = readJSON('contact-submissions') || [];
  const id = parseInt(req.params.id);
  const index = submissions.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Submission not found' });

  submissions[index] = { ...submissions[index], ...req.body, id };
  writeJSON('contact-submissions', submissions);
  res.json({ success: true, data: submissions[index] });
});

// DELETE /api/contact/:id  → delete contact submission
app.delete('/api/contact/:id', (req, res) => {
  const submissions = readJSON('contact-submissions') || [];
  const id = parseInt(req.params.id);
  const filtered = submissions.filter(s => s.id !== id);
  if (filtered.length === submissions.length) return res.status(404).json({ error: 'Submission not found' });

  writeJSON('contact-submissions', filtered);
  res.json({ success: true });
});

// ── MediaMTX Status Check ─────────────────────────────────
app.get('/api/mediamtx/status', (req, res) => {
  const host = process.env.MEDIAMTX_HOST || '127.0.0.1';
  const port = parseInt(process.env.MEDIAMTX_WEBRTC_PORT || '8889', 10);
  let responded = false;

  const sendResponse = (data) => {
    if (responded) return;
    responded = true;
    res.json(data);
  };

  const request = http.get({ host, port, path: '/', timeout: 2000 }, (response) => {
    sendResponse({
      online: true,
      statusCode: response.statusCode,
      host,
      webrtcPort: port,
      rtspPort: 8554,
      hlsPort: 8888,
    });
  });

  request.on('error', (err) => {
    sendResponse({
      online: false,
      error: err.message,
      host,
      webrtcPort: port,
      rtspPort: 8554,
      hlsPort: 8888,
    });
  });

  request.on('timeout', () => {
    request.destroy();
    sendResponse({
      online: false,
      error: 'Connection timed out',
      host,
      webrtcPort: port,
    });
  });
});

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ✦ Sarani Content API running at http://localhost:${PORT}`);
  console.log(`  ✦ Admin password: ${ADMIN_PASSWORD}`);
  console.log(`  ✦ Data directory: ${DATA_DIR}\n`);
});
