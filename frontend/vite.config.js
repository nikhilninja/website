import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/mediamtx-webrtc': {
        target: 'http://localhost:8889',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mediamtx-webrtc/, ''),
        ws: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.headers['location']) {
              if (proxyRes.headers['location'].startsWith('/') && !proxyRes.headers['location'].startsWith('/mediamtx-webrtc')) {
                proxyRes.headers['location'] = '/mediamtx-webrtc' + proxyRes.headers['location'];
              }
            }
          });
        },
      },
      '/mediamtx-hls': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mediamtx-hls/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.headers['location']) {
              if (proxyRes.headers['location'].startsWith('/') && !proxyRes.headers['location'].startsWith('/mediamtx-hls')) {
                proxyRes.headers['location'] = '/mediamtx-hls' + proxyRes.headers['location'];
              }
            }
          });
        },
      },
    },
  },
})

