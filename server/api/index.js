const connectDB = require('../src/config/db');
const app = require('../src/app');

// Connect to MongoDB once per cold start, then reuse
let dbConnected = false;

module.exports = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  return app(req, res);
};
