const uuidv4 = require('uuid').v4;
const sha1 = require('sha1');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization || '';
    const b64Auth = authHeader.split(' ')[1];

    if (!b64Auth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decodedAuth = Buffer.from(b64Auth, 'base64').toString('utf-8');
    if (!decodedAuth || !decodedAuth.includes(':')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const [email, password] = decodedAuth.split(':');
    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const user = await dbClient.users.findOne({
        email,
        password: sha1(password),
      });

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = uuidv4();
      const key = `auth_${token}`;
      redisClient.set(key, user._id.toString(), 24 * 60 * 60);
      return res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  static getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    redisClient.get(key).then((userId) => {
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      redisClient.del(key);
      res.status(204).json();
    });
  }
}

module.exports = AuthController;
