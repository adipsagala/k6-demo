const { createClient } = require('redis');

const client = createClient({
  url: 'redis://host.docker.internal:6379'
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect();

module.exports = client;
