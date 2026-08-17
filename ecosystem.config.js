module.exports = {
  apps: [
    {
      name: 'sarani-mediamtx',
      script: './mediamtx.exe',
      args: 'mediamtx.yml',
      cwd: './',
      autorestart: true,
      watch: false,
    },
    {
      name: 'sarani-content-api',
      script: 'node',
      args: 'server.js',
      cwd: './content-api',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'sarani-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './frontend',
      autorestart: true,
      env: {
        PORT: 5173,
      },
    },
  ],
};
