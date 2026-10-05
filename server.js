const http = require('node:http');
const os = require('node:os');
const { createClient } = require('redis');
const { getConfig } = require('./config');

const { port, redisHost, redisPort } = getConfig();

const redisClient = createClient({
  socket: {
    host: redisHost,
    port: redisPort
  }
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error.message);
});

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' || request.url !== '/') {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  try {
    const visits = await redisClient.incr('hits');
    const containerId = os.hostname();

    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`Bonjour ! Cette page a été vue ${visits} fois. Je suis le conteneur ${containerId}`);
  } catch (error) {
    console.error('Unable to increment visit counter:', error.message);
    response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Le service de compteur est temporairement indisponible.');
  }
});

async function start() {
  await redisClient.connect();
  server.listen(port, '0.0.0.0', () => {
    console.log(`Visit-counter listening on port ${port}; Redis host: ${redisHost}`);
  });
}

start().catch((error) => {
  console.error('Unable to start the application:', error.message);
  process.exitCode = 1;
});

async function shutdown() {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
  server.close(() => process.exit(0));
}

process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
