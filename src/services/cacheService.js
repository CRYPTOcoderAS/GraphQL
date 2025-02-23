class CacheService {
  constructor(redis) {
    this.redis = redis;
  }

  async get(key) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key, value, expireSeconds = 3600) {
    await this.redis.set(
      key,
      JSON.stringify(value),
      'EX',
      expireSeconds
    );
  }

  async del(key) {
    await this.redis.del(key);
  }

  generateKey(prefix, params) {
    return `${prefix}:${JSON.stringify(params)}`;
  }
}

module.exports = CacheService; 