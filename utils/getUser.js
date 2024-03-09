const { ObjectId } = require('mongodb');
const dbClient = require('./db');
const redisClient = require('./redis');

/**
 * Get the user document from db by token
 * @param {String} token token of the user to get
 */
const getUser = async (token) => {
  try {
    const key = `auth_${token}`;
    // get user id by token from redis
    const userId = await redisClient.get(key);
    if (!userId) {
      return null;
    }

    const user = await dbClient.users.findOne({ _id: ObjectId(userId) });

    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = getUser;
