const { expect } = require('chai');
const request = require('request');

const url = 'http://localhost:5000';
describe('test AuthController', () => {
  it('/connect should return a token when user is authorized to log in', () => {
    request.get(`${url}/connect`, (err, res, body) => {
      if (err) {
        console.log(err);
      }
      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal(
        'application/json; charset=utf-8',
      );
      body = JSON.parse(body);
      expect(body.token).to.exist;
    });
  });

  it('/disconnect should return status 204 when user is logged out', () => {
    request.get(`${url}/disconnect`, (err, res, body) => {
      if (err) {
        console.log(err);
      }
      expect(res.statusCode).to.equal(204);
      expect(res.headers['content-type']).to.equal(
        'application/json; charset=utf-8',
      );
      body = JSON.parse(body);
      expect(body).to.not.exist;
    });
  });
});
