const redis = require('redis');
const util = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.log(err.message));
    // this.client.on("connect", () =>
    //   console.log("Redis client is connected to the server on 127.0.0.1:6379")
    // );
    this.client.promisifiedGet = util
      .promisify(this.client.get)
      .bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.client.promisifiedGet(key);
  }

  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
