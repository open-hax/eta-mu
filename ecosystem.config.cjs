module.exports = {
  apps: [
    {
      name: 'rheos',
      cwd: 'packages/Rheos',
      script: 'dist/server.js',
      interpreter: 'node',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      },
      max_restarts: 5,
      restart_delay: 2000,
      autorestart: true,
      watch: false
    }
  ]
};
