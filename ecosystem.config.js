const pm2App = (name, script = 'index.js') => ({
  name,
  instances: 1,
  script: `./dist/${script}`,
});

module.exports = {
  apps: [
    pm2App("skillpaddy.livestream"),
  ]
};
