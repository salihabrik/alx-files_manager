const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

/**
 * Defines /status and /stats route handlers.
 */
class AppController {
  static getStatus(_, res) {
    if (redisClient.isAlive() && dbClient.isAlive()) {
      res.json({ redis: true, db: true });
    }
  }

  static async getStats(_, res) {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();
    res.json({ users: nbUsers, files: nbFiles });
  }
}

module.exports = AppController;
