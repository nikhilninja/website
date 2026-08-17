import { useState, useEffect, useRef } from 'react';
import { fetchCollection, checkMediaMtxStatus } from '../lib/api';
import './Live.css';

const LIVE_PASSWORD = import.meta.env.VITE_LIVE_PASSWORD || 'sarani2025';

const fallbackStreams = [
  { id: 1, name: 'Camera 01 - Main Entrance', stream_path: 'camera_01', category: 'outdoor', is_active: true, resolution: '1080p 30fps' },
  { id: 2, name: 'Camera 02 - Garden & Courtyard', stream_path: 'camera_2', category: 'outdoor', is_active: true, resolution: '1080p 30fps' },
  { id: 3, name: 'Camera 03 - Therapy Wing', stream_path: 'camera_3', category: 'clinical', is_active: true, resolution: '1080p 30fps' },
  { id: 4, name: 'Camera 04 - Recreation & Lounge', stream_path: 'camera_4', category: 'indoor', is_active: true, resolution: '1080p 30fps' },
  { id: 5, name: 'Camera 05 - Dining & Wellness', stream_path: 'camera_5', category: 'indoor', is_active: true, resolution: '1080p 30fps' },
];

function CCTVOverlay({ cameraName, streamPath, resolution = '1080p 30fps' }) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toISOString().replace('T', ' ').substring(0, 19) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live__cctv-hud">
      <div className="live__hud-top">
        <div className="live__stream-badge">
          <span className="live__dot"></span> LIVE
        </div>
        <div className="live__hud-rec">
          <span className="live__rec-dot"></span> REC
        </div>
        <div className="live__hud-time">{timeString}</div>
      </div>
      <div className="live__hud-bottom">
        <span className="live__hud-cam">{cameraName.toUpperCase()}</span>
        <span className="live__hud-meta">CH: {streamPath} | {resolution}</span>
      </div>
    </div>
  );
}

// Procedural high-tech simulated CCTV canvas for cameras waiting for physical RTSP hardware
function SimulatedFeed({ streamName, streamPath }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let frame = 0;

    const render = () => {
      frame++;
      const w = canvas.width = canvas.clientWidth || 480;
      const h = canvas.height = canvas.clientHeight || 270;

      // Dark background gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#0c1613');
      grad.addColorStop(1, '#050c0a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Grid mesh
      ctx.strokeStyle = 'rgba(26, 107, 90, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Moving scanline
      const scanY = (frame * 1.5) % h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'rgba(212, 175, 55, 0)');
      scanGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.12)');
      scanGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, w, 40);

      // Subtle noise particles
      for (let i = 0; i < 25; i++) {
        const px = Math.random() * w;
        const py = Math.random() * h;
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.random() * 0.25})`;
        ctx.fillRect(px, py, 1.5, 1.5);
      }

      // Center camera icon & status
      ctx.fillStyle = 'rgba(212, 175, 55, 0.85)';
      ctx.font = 'bold 13px Inter, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`SARANI REHAB CCTV • CAM: ${streamPath.toUpperCase()}`, w / 2, h / 2 - 12);

      ctx.fillStyle = '#6cb299';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('MediaMTX WebRTC Stream Relay Connected', w / 2, h / 2 + 12);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText('Awaiting live RTSP encoder feed / Active monitoring standby', w / 2, h / 2 + 30);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [streamPath]);

  return <canvas ref={canvasRef} className="live__canvas-feed" />;
}

export default function Live() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [streams, setStreams] = useState(fallbackStreams);
  const [selectedStream, setSelectedStream] = useState(null);
  const [serverStatus, setServerStatus] = useState({ online: false, checking: true });
  const [activeTab, setActiveTab] = useState('all');
  const [gridCols, setGridCols] = useState(3);
  const [simulatedPreview, setSimulatedPreview] = useState(false);
  const [streamingProtocol, setStreamingProtocol] = useState('webrtc'); // 'webrtc' | 'hls'

  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const MEDIAMTX_HOST = import.meta.env.VITE_MEDIAMTX_HOST || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
  const MEDIAMTX_WEBRTC_PORT = import.meta.env.VITE_MEDIAMTX_WEBRTC_PORT || '8889';
  const MEDIAMTX_HLS_PORT = import.meta.env.VITE_MEDIAMTX_HLS_PORT || '8888';

  const getStreamUrl = (streamPath, proto = streamingProtocol) => {
    if (proto === 'hls') {
      if (import.meta.env.VITE_MEDIAMTX_HLS_URL) {
        return `${import.meta.env.VITE_MEDIAMTX_HLS_URL}/${streamPath}`;
      }
      return `${isHttps ? 'https' : 'http'}://${MEDIAMTX_HOST}:${MEDIAMTX_HLS_PORT}/${streamPath}`;
    }
    if (import.meta.env.VITE_MEDIAMTX_WEBRTC_URL) {
      return `${import.meta.env.VITE_MEDIAMTX_WEBRTC_URL}/${streamPath}`;
    }
    return `${isHttps ? 'https' : 'http'}://${MEDIAMTX_HOST}:${MEDIAMTX_WEBRTC_PORT}/${streamPath}`;
  };

  useEffect(() => {
    const saved = sessionStorage.getItem('sarani_live_auth');
    if (saved === 'true') setAuthenticated(true);
  }, []);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await checkMediaMtxStatus();
        if (res?.online) {
          setServerStatus({ online: true, checking: false, details: res });
          return;
        }
      } catch {
        // continue to direct ping
      }

      try {
        const port = streamingProtocol === 'hls' ? MEDIAMTX_HLS_PORT : MEDIAMTX_WEBRTC_PORT;
        await fetch(`${isHttps ? 'https' : 'http'}://${MEDIAMTX_HOST}:${port}/`, { mode: 'no-cors' });
        setServerStatus({ online: true, checking: false });
      } catch {
        setServerStatus({ online: false, checking: false });
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [MEDIAMTX_HOST, MEDIAMTX_WEBRTC_PORT, MEDIAMTX_HLS_PORT, isHttps, streamingProtocol]);

  useEffect(() => {
    if (!authenticated) return;
    async function load() {
      try {
        const data = await fetchCollection('streams');
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          const active = data.data.filter(s => s.is_active !== false);
          if (active.length > 0) setStreams(active);
        }
      } catch {
        // use fallback streams
      }
    }
    load();
  }, [authenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password.trim() === LIVE_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem('sarani_live_auth', 'true');
      setError('');
    } else {
      setError('Incorrect security password. Please contact the administration desk.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('sarani_live_auth');
    setAuthenticated(false);
    setSelectedStream(null);
  };

  const filteredStreams = streams.filter(s => {
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  if (!authenticated) {
    return (
      <div className="live-page" id="live-page">
        <section className="page-hero">
          <div className="page-hero__bg"></div>
          <div className="container">
            <span className="page-hero__badge">🔒 Security Gate</span>
            <h1>CCTV <span className="text-accent">Live Monitoring</span></h1>
            <p>Confidential 24/7 internal surveillance & wellness facility broadcast for authorized personnel and verified guardians.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="live__login">
              <div className="live__login-card glass-card">
                <div className="live__lock-icon">🛡️</div>
                <h3>Authorized Access Required</h3>
                <p>Please enter the security verification code provided by Sarani Administration.</p>
                <form onSubmit={handleLogin}>
                  <div className="contact__field">
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter security access password"
                      autoFocus
                    />
                  </div>
                  {error && <p className="live__error">{error}</p>}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Unlock CCTV Monitoring Feed
                  </button>
                  <p className="live__pass-hint">
                    Default access password: <code>sarani2025</code>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="live-page" id="live-page">
      <section className="page-hero">
        <div className="page-hero__bg"></div>
        <div className="container">
          <div className="live__hero-head">
            <div>
              <span className="page-hero__badge">Live Feeds</span>
              <h1>Surveillance & <span className="text-accent">Campus CCTV</span></h1>
              <p>Ultra-low latency real-time WebRTC camera streams from across the Sarani Rehabilitation Campus.</p>
            </div>
            <div className="live__server-badge">
              <div className={`live__status-indicator ${serverStatus.online ? 'live__status--online' : 'live__status--standby'}`}>
                <span className="live__status-dot"></span>
                <span>{serverStatus.online ? 'MediaMTX Relay: ACTIVE (Port 8889)' : 'MediaMTX Server: INITIALIZING'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          {/* Controls bar */}
          <div className="live__controls-bar glass-card">
            <div className="live__filter-tabs">
              <button
                className={`live__tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Cameras ({streams.length})
              </button>
              <button
                className={`live__tab-btn ${activeTab === 'outdoor' ? 'active' : ''}`}
                onClick={() => setActiveTab('outdoor')}
              >
                Outdoor & Grounds
              </button>
              <button
                className={`live__tab-btn ${activeTab === 'clinical' ? 'active' : ''}`}
                onClick={() => setActiveTab('clinical')}
              >
                Therapy & Clinical
              </button>
              <button
                className={`live__tab-btn ${activeTab === 'indoor' ? 'active' : ''}`}
                onClick={() => setActiveTab('indoor')}
              >
                Indoor Amenities
              </button>
            </div>

            <div className="live__view-controls">
              <button
                className={`btn-icon ${streamingProtocol === 'hls' ? 'active' : ''}`}
                onClick={() => setStreamingProtocol(streamingProtocol === 'webrtc' ? 'hls' : 'webrtc')}
                title="Switch streaming protocol (WebRTC for LAN, HLS for Cloudflare Tunnel / Mobile)"
              >
                {streamingProtocol === 'webrtc' ? '⚡ Proto: WebRTC' : '🌐 Proto: HLS (Tunnel)'}
              </button>

              <button
                className={`btn-icon ${simulatedPreview ? 'active' : ''}`}
                onClick={() => setSimulatedPreview(!simulatedPreview)}
                title="Toggle Feed Mode (Live Relay / Procedural Standby HUD)"
              >
                {simulatedPreview ? '📺 Mode: Standby' : '📹 Mode: Live Relay'}
              </button>

              <div className="live__grid-toggles">
                <button
                  className={`btn-grid ${gridCols === 2 ? 'active' : ''}`}
                  onClick={() => setGridCols(2)}
                  title="2 Columns"
                >
                  2×2
                </button>
                <button
                  className={`btn-grid ${gridCols === 3 ? 'active' : ''}`}
                  onClick={() => setGridCols(3)}
                  title="3 Columns"
                >
                  3×2
                </button>
              </div>

              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                🔒 Lock Feed
              </button>
            </div>
          </div>

          {/* Enlarged Focus View */}
          {selectedStream && (
            <div className="live__enlarged glass-card">
              <div className="live__enlarged-header">
                <div className="live__enlarged-title">
                  <span className="live__dot"></span>
                  <h3>{selectedStream.name}</h3>
                  <span className="live__stream-path">Stream: /{selectedStream.stream_path} ({streamingProtocol.toUpperCase()})</span>
                </div>
                <div className="live__enlarged-actions">
                  <a
                    href={getStreamUrl(selectedStream.stream_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Open Standalone Player ↗
                  </a>
                  <button onClick={() => setSelectedStream(null)} className="live__close-btn">
                    ✕ Close View
                  </button>
                </div>
              </div>
              <div className="live__enlarged-video">
                <CCTVOverlay
                  cameraName={selectedStream.name}
                  streamPath={selectedStream.stream_path}
                  resolution={selectedStream.resolution}
                />
                {simulatedPreview ? (
                  <SimulatedFeed
                    streamName={selectedStream.name}
                    streamPath={selectedStream.stream_path}
                  />
                ) : (
                  <iframe
                    src={getStreamUrl(selectedStream.stream_path)}
                    title={selectedStream.name}
                    allow="autoplay; fullscreen"
                    className="live__iframe"
                  />
                )}
              </div>
            </div>
          )}

          {/* Camera Feeds Grid */}
          <div className={`live__grid live__grid--${gridCols}cols`}>
            {filteredStreams.map(stream => {
              const isSelected = selectedStream?.id === stream.id;
              const streamUrl = getStreamUrl(stream.stream_path);

              return (
                <div
                  key={stream.id}
                  className={`live__stream-card ${isSelected ? 'live__stream-card--selected' : ''}`}
                  onClick={() => setSelectedStream(isSelected ? null : stream)}
                >
                  <div className="live__stream-video">
                    <CCTVOverlay
                      cameraName={stream.name}
                      streamPath={stream.stream_path}
                      resolution={stream.resolution}
                    />
                    {simulatedPreview ? (
                      <SimulatedFeed
                        streamName={stream.name}
                        streamPath={stream.stream_path}
                      />
                    ) : (
                      <iframe
                        src={streamUrl}
                        title={stream.name}
                        allow="autoplay; fullscreen"
                        className="live__iframe"
                      />
                    )}
                    <div className="live__stream-hover-overlay">
                      <span>🔍 Click to Focus / Enlarge</span>
                    </div>
                  </div>
                  <div className="live__stream-info">
                    <div>
                      <h4>{stream.name}</h4>
                      <span className="live__stream-path">rtsp://...:{stream.stream_path}</span>
                    </div>
                    <span className="live__expand-icon">⤢</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monitoring Footer Info */}
          <div className="live__footer glass-card">
            <div className="live__footer-info">
              <h4>📡 MediaMTX CCTV Architecture</h4>
              <p>
                Streams are relayed via <strong>MediaMTX (WebRTC low-latency relay on port 8889)</strong> directly to the browser.
                RTSP sources are configurable inside <a href="/admin" className="text-accent">/admin</a> or in <code>mediamtx.yml</code>.
              </p>
            </div>
            <div className="live__footer-actions">
              <a href="/admin" className="btn btn-outline btn-sm">
                ⚙ Configure Stream Sources
              </a>
              <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
                🔄 Refresh Feeds
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
