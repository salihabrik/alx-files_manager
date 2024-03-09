const Queue = require('bull');
const { ObjectId } = require('mongodb');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const dbClient = require('./utils/db');

const fileQueue = new Queue('fileQueue', 'redis://127.0.0.1:6379');
fileQueue.process(async (job, done) => {
  const { fileId } = job.data;
  const { userId } = job.data;

  if (!fileId) {
    done(Error('Missing fileId'));
  }

  if (!userId) {
    done(Error('Missing userId'));
  }

  const file = await dbClient.files.findOne({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });
  if (!file) {
    done(Error('File not found'));
  }

  const widths = [500, 250, 100];
  for (const width of widths) {
    try {
      const thumbnail = await imageThumbnail(file.localPath, { width });
      fs.writeFile(`${file.localPath}_${width}`, thumbnail, (err) => {
        if (err) console.log(err);
      });
    } catch (err) {
      console.error(err);
    }
  }
});

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');
userQueue.process(async (job, done) => {
  const { userId } = job.data;
  if (!userId) {
    done(Error('Missing userId'));
  }

  const user = await dbClient.users.findOne({ _id: ObjectId(userId) });
  if (!user) {
    done(Error('User not found'));
  }

  console.log(`Welcome ${user.email}!`);
});
