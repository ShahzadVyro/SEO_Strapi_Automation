const mongoose = require('mongoose');

// Reuse connection across serverless function invocations
let cached = global._mongoConn || (global._mongoConn = { conn: null, promise: null });

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('MONGODB_URI not set — running without database');
    return;
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then(m => {
      console.log('MongoDB connected');
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
  return cached.conn;
}

module.exports = connectDB;
