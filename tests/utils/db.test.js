const { expect } = require('chai');
const dbClient = require('../../utils/db');

describe('test DBClient', () => {
  it('should return the number of users in the database', async () => {
    const nbUsers = await dbClient.nbUsers();
    expect(nbUsers).to.be.a('number');
    expect(nbUsers).to.be.at.least(0);
  });

  it('should return the number of files in the database', async () => {
    const nbFiles = await dbClient.nbFiles();
    expect(nbFiles).to.be.a('number');
    expect(nbFiles).to.be.at.least(0);
  });
});
