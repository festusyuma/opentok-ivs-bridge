module.exports = {
  apps: [
    {
      name: 'livestream-demo-api',
      instances: 1,
      script: './dist/index.js',
    },
  ]
}