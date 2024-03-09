const { expect } = require('chai');
const redisClient = require('../../utils/redis');

describe('test redisClient', () => {
  it('redisClient should connect to redis server', () => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('redisClient should have correct properties', () => {
    expect(redisClient).to.have.property('isAlive').that.is.a('function');
    expect(redisClient).to.have.property('get').that.is.a('function');
    expect(redisClient).to.have.property('set').that.is.a('function');
    expect(redisClient).to.have.property('del').that.is.a('function');
  });

  it('redisClient should set and get a value to and from redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    await redisClient.set(key, value, 24 * 60 * 60);
    const result = await redisClient.get(key);
    expect(result).to.equal(value);
  });

  it('redisClient should delete a value from redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    await redisClient.set(key, value);

    await redisClient.del(key);

    const result = await redisClient.get(key);
    expect(result).to.be.null;
  });
});
