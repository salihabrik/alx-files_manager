const { expect } = require('chai');
const request = require('request');

const url = 'http://localhost:5000';
describe('test AppController', () => {
  it('/status should return status with redis and db alive', () => {
    request.get(`${url}/status`, (err, res, body) => {
      if (err) {
        console.log(err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal(
        'application/json; charset=utf-8',
      );
      body = JSON.parse(body);
      expect(body.redis).to.be.true;
      expect(body.db).to.be.true;
    });
  });

  it('/stats should return stats of nbUsers and nbFiles', () => {
    request.get(`${url}/stats`, (err, res, body) => {
      if (err) {
        console.log(err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal(
        'application/json; charset=utf-8',
      );
      body = JSON.parse(body);
      expect(body.nbUsers).to.exist;
      expect(body.nbFiles).to.exist;
    });
  });
});

