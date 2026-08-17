# Sarani Rehabilitation & Wellness Website

A complete, self-hosted web application built with **React (Vite)**, **Strapi v5 (Headless CMS)**, **MediaMTX (CCTV Streaming)**, and **Cloudflare Tunnel (Self-Hosting & HTTPS)**.

---

## Project Architecture

```
e:\ANTIGRAVITY\website\
├── backend/            ← Strapi v5 CMS (Admin Dashboard & REST API)
│   ├── src/api/        ← Content schemas & controllers
│   └── database/       ← SQLite database (data.db)
├── frontend/           ← React + Vite Web Application
│   ├── src/
│   │   ├── components/ ← Navbar (glassmorphism), Footer
│   │   ├── pages/      ← Home, About, Services, Facilities, Blog, Gallery, FAQ, Contact, Live
│   │   └── lib/        ← Strapi API client & media helper
├── mediamtx.yml        ← CCTV RTSP-to-WebRTC relay config
├── ecosystem.config.js ← PM2 process manager config
└── README.md           ← Complete setup & deployment guide
```

---

## 1. Quick Start (Development Mode)

### Step A: Start Strapi Backend
Open a terminal window and run:
```bash
cd e:\ANTIGRAVITY\website\backend
npm run develop
```
- Admin Dashboard: `http://localhost:1337/admin`
- On first launch, create your Super Admin account (email & password).

### Step B: Start React Frontend
Open a second terminal window and run:
```bash
cd e:\ANTIGRAVITY\website\frontend
npm run dev
```
- Website Access: `http://localhost:5173`

---

## 2. Strapi Content Management Guide

The React frontend comes with fallback content so it works out-of-the-box. When you add content inside the Strapi Admin Panel (`http://localhost:1337/admin`), the website automatically fetches and displays your live database content.

### Setting Public Permissions in Strapi
To allow your React website to fetch content without API tokens:
1. Log in to `http://localhost:1337/admin`.
2. Navigate to **Settings** → **Roles** (under *Users & Permissions plugin*).
3. Click on **Public**.
4. Scroll to your Content Types and check **find** and **findOne** for:
   - `services`, `blog-posts`, `testimonials`, `gallery-images`, `faqs`, `cctv-streams`
5. Check **create** for `contact-submissions`.
6. Click **Save**.

### Creating Content Types in Content-Type Builder
1. Go to **Content-Type Builder** in the Strapi sidebar.
2. Click **Create new collection type**:
   - **Service**: `title` (Text), `description` (Rich Text), `icon_emoji` (Text), `order` (Number).
   - **Blog Post**: `title` (Text), `slug` (UID), `excerpt` (Text), `content` (Rich Text), `author` (Text), `category` (Text), `published_at` (Date).
   - **Testimonial**: `author_name` (Text), `role` (Text), `quote` (Text), `rating` (Number).
   - **Gallery Image**: `title` (Text), `category` (Text), `order` (Number), `media` (Media).
   - **FAQ**: `question` (Text), `answer` (Text), `category` (Text), `order` (Number).
   - **CCTV Stream**: `name` (Text), `stream_url` (Text - e.g., `entrance`), `is_active` (Boolean), `order` (Number).

---

## 3. Password-Protected CCTV Live Streaming Setup

The **Live Feed** page (`/live`) displays live camera feeds and is protected with a password gate.

### Access Credentials:
- Default Password: `sarani2025`
- Configurable in `frontend/src/pages/Live.jsx` or via environment variable `VITE_LIVE_PASSWORD`.

### Running MediaMTX:
1. Download MediaMTX for Windows from [github.com/bluenviron/mediamtx](https://github.com/bluenviron/mediamtx/releases).
2. Place `mediamtx.exe` in `e:\ANTIGRAVITY\website\`.
3. Edit `mediamtx.yml` to set your camera RTSP URLs:
   ```yaml
   paths:
     entrance:
       source: rtsp://admin:password@192.168.1.101:554/h264/ch1/main/av_stream
   ```
4. Run `mediamtx.exe`.
5. The streams are relayed via WebRTC on port `8889` for near-zero latency video playback in the browser.

---

## 4. Remote Access Anywhere via Cloudflare Tunnel (HTTPS)

You can access your website and live CCTV cameras securely from anywhere in the world without port forwarding or static IP requirements.

### Option A: Instant Free Quick Tunnel (Zero Setup)
To generate a secure, temporary public HTTPS URL immediately without any account:

```powershell
npm run tunnel:quick
# or double click start-tunnel.bat
```
This outputs a public link such as:
`https://your-session.trycloudflare.com` → Open `/live` from any phone or PC on the internet!

---

### Option B: Custom Domain Tunnel (`www.saranirehab.com`)

To bind the website and live streams to your personal domain:

#### Step 1: Login to Cloudflare
```powershell
npm run tunnel:login
# or: .\cloudflared.exe tunnel login
```

#### Step 2: Create Named Tunnel
```powershell
.\cloudflared.exe tunnel create sarani-website
```
Copy the generated Tunnel UUID (e.g. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

#### Step 3: Configure Multi-Service Ingress
Edit `cloudflared.config.yml` in the project root:
```yaml
tunnel: <YOUR-TUNNEL-ID>
credentials-file: C:\Users\subha\.cloudflared\<YOUR-TUNNEL-ID>.json

ingress:
  - hostname: www.saranirehab.com
    service: http://localhost:5173
  - hostname: api.saranirehab.com
    service: http://localhost:3001
  - hostname: cctv.saranirehab.com
    service: http://localhost:8889
  - hostname: hls.saranirehab.com
    service: http://localhost:8888
  - service: http_status:404
```

#### Step 4: Route DNS & Start Tunnel
```powershell
.\cloudflared.exe tunnel route dns sarani-website www.saranirehab.com
.\cloudflared.exe tunnel route dns sarani-website api.saranirehab.com
.\cloudflared.exe tunnel route dns sarani-website cctv.saranirehab.com
.\cloudflared.exe tunnel route dns sarani-website hls.saranirehab.com

npm run tunnel
```

Your website and live feeds are now accessible globally over HTTPS with automated SSL/TLS protection!

---

## 5. 24/7 Production Setup (PM2)

To keep both Strapi and React running in the background automatically:

```powershell
npm install -g pm2
cd e:\ANTIGRAVITY\website
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Design System & Branding Summary

- **Brand Name**: SARANI Rehabilitation & Wellness (Centre for Excellence)
- **Primary Color**: Deep Sarani Teal (`#1a6b5a` / `#0a1f1a`)
- **Accent Color**: Luxury Gold (`#d4af37`)
- **Typography**: Playfair Display (Headings), Inter (Body), Cormorant Garamond (Subheadings)
- **Aesthetic**: Glassmorphism dark mode with gold accents and smooth micro-animations.
