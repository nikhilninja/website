# Sarani Rehabilitation & Wellness Website

A complete, self-hosted web application built with **React (Vite)**, **Custom Content API (Express & JSON DB)**, **MediaMTX (CCTV Streaming)**, and **Cloudflare Tunnel (Self-Hosting & HTTPS)**.

---

## Project Architecture

```
e:\ANTIGRAVITY\website\
├── content-api/        ← Lightweight Content API & CMS Backend (Port 3001)
│   ├── data/           ← JSON Content storage (about, blog, services, streams, etc.)
│   └── uploads/        ← Uploaded media and images
├── frontend/           ← React + Vite Web Application (Port 5173)
│   ├── src/
│   │   ├── components/ ← Navbar (glassmorphism), Footer
│   │   ├── pages/      ← Home, About, Services, Facilities, Blog, Gallery, FAQ, Contact, Live, Admin
│   │   └── lib/        ← API client & media helper
├── cameras.json        ← Camera source definitions
├── mediamtx.yml        ← CCTV RTSP-to-WebRTC relay config
├── ecosystem.config.js ← PM2 process manager config
├── start-tunnel.bat    ← Quick Cloudflare HTTPS tunnel launcher
└── README.md           ← Complete setup & deployment guide
```

---

## 1. Quick Start (All-in-One Launcher)

Launch all services (MediaMTX + Content API + Vite React Frontend) with a single command:

```bash
npm start
```

### Access Points:
- ✦ **Website**: `http://localhost:5173`
- ✦ **Live Feed (CCTV)**: `http://localhost:5173/live` (Password: `sarani2025`)
- ✦ **Admin Panel**: `http://localhost:5173/admin` (Password: `sarani2025`)
- ✦ **Content API**: `http://localhost:3001`
- ✦ **MediaMTX WebRTC**: `http://localhost:8889`
- ✦ **MediaMTX RTSP**: `rtsp://localhost:8554`

---

## 2. Custom Admin Panel

Manage all website content directly inside the React web application at `/admin`:

- **Pages**: Edit Home and About page text, hero headlines, badges, and stats.
- **Collections**: Create, edit, and delete Services, Facilities, Blog Posts, FAQs, Testimonials, and Gallery photos.
- **CCTV Streams**: Manage active camera stream titles, categories, and stream paths.
- **Media Uploads**: Directly upload images to the server.

---

## 3. Password-Protected CCTV Live Streaming Setup

The **Live Feed** page (`/live`) displays live camera feeds and is protected with a password gate.

### Access Credentials:
- Default Password: `sarani2025`
- Configurable in `frontend/src/pages/Live.jsx` or via environment variable `VITE_LIVE_PASSWORD`.

### Adding / Modifying Cameras:
Edit `mediamtx.yml` under `paths:` with your camera RTSP addresses:
```yaml
paths:
  camera_01:
    source: "rtsp://admin:password@192.168.31.33:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif"
    rtspTransport: automatic
    sourceOnDemand: no
    record: no
```

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
```

#### Step 2: Create Named Tunnel
```powershell
.\cloudflared.exe tunnel create sarani-website
```
Copy the generated Tunnel UUID.

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

---

## 5. Docker Deployment (Run on Any Computer on the Wi-Fi Network)

To run the entire system (Frontend + Content API + MediaMTX) on **any computer/laptop/server** connected to the same Wi-Fi router as the IP cameras:

### 1. Requirements:
- Install **Docker Desktop** (Windows/Mac) or **Docker Engine + Docker Compose** (Linux/Ubuntu/Raspberry Pi).

### 2. Start all containers:
```bash
# Windows: Double click docker-start.bat, or run:
npm run docker:up

# Linux / Mac:
chmod +x docker-start.sh && ./docker-start.sh
```

### 3. Access on any Phone, Laptop, or Tablet in the Wi-Fi:
Find the host computer's Local IP address (`ipconfig` on Windows or `ip a` on Linux):
- **Website & CCTV Monitoring**: `http://<HOST_IP>` or `http://<HOST_IP>:5173`
- **Admin Panel**: `http://<HOST_IP>/admin` (Password: `sarani2025`)
- **Live CCTV Gate**: `http://<HOST_IP>/live` (Password: `sarani2025`)

### 4. Useful Docker Commands:
```bash
# View live logs
npm run docker:logs
# or: docker compose logs -f

# Stop containers
npm run docker:down
# or: docker compose down
```

---

## 6. 24/7 Production Setup (PM2 - Non-Docker Alternative)

To keep all services running in the background automatically:

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
