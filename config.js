function getConfig(environment = process.env) {
  return {
    port: Number.parseInt(environment.PORT || '3000', 10),
    redisHost: environment.REDIS_HOST || 'db-service',
    redisPort: Number.parseInt(environment.REDIS_PORT || '6379', 10)
  };
}

module.exports = { getConfig };
