const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${this.host}:${this.port}/`;
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    (async () => this.client.connect())();

    this.db = this.client.db(this.database);
    this.users = this.db.collection('users');
    this.files = this.db.collection('files');
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbFiles() {
    return this.files.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
