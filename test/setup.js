const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

module.exports = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });

    global.__MONGOSERVER__ = mongoServer;
  } catch (err) {
    const localUri = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/blog-api-test';
    console.warn('MongoMemoryServer failed to start, falling back to local MongoDB at', localUri);
    try {
      await mongoose.connect(localUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
    } catch (connectErr) {
      console.error('Failed to connect to local MongoDB at', localUri, 'error:', connectErr && connectErr.message ? connectErr.message : connectErr);
      throw connectErr;
    }
  }
};
