const sha1 = require('sha1');
const Queue = require('bull');
const dbClient = require('../utils/db');
const getUser = require('../utils/getUser');

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      const user = await dbClient.users.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'Already exist' });
      }
    } catch (err) {
      console.log(err);
      return null;
    }

    const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');
    try {
      const result = await dbClient.users.insertOne({
        email,
        password: sha1(password),
      });
      userQueue.add({ userId: result.insertedId });
      return res.status(201).json({ id: result.insertedId, email });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const user = await getUser(token);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ id: user._id, email: user.email });
  }
}

module.exports = UsersController;
