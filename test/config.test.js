const test = require('node:test');
const assert = require('node:assert/strict');
const { getConfig } = require('../config');

test('reads application settings from environment variables', () => {
  assert.deepEqual(
    getConfig({
      PORT: '8080',
      REDIS_HOST: 'redis',
      REDIS_PORT: '6380'
    }),
    {
      port: 8080,
      redisHost: 'redis',
      redisPort: 6380
    }
  );
});

test('uses container-friendly defaults', () => {
  assert.deepEqual(getConfig({}), {
    port: 3000,
    redisHost: 'db-service',
    redisPort: 6379
  });
});
